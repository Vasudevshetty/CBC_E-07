from fastapi import FastAPI, HTTPException, UploadFile, File, Path, Body
import os, shutil, tempfile
from fastapi.middleware.cors import CORSMiddleware
from langchain_groq import ChatGroq
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from utils.bot import (
    initialize_retriver,
    initialize_rag_chain,
    get_model,
    extract_video_id,
)
from utils.database import *
from typing import Optional, List
import uuid
from dotenv import load_dotenv
from groq import Groq
import json
from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api._errors import TranscriptsDisabled, NoTranscriptFound
import joblib
import numpy as np
from utils.assessdb import (
    save_user_assessment,
    bulk_save_video_questions,
    bulk_save_aptitude_questions,
    get_video_questions,
    get_aptitude_questions,
)
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import traceback

load_dotenv()

api = FastAPI()

groq_api_key1 = os.getenv("GROQ_API_KEY1")
groq_api_key2 = os.getenv("GROQ_API_KEY2")
client = Groq(api_key=groq_api_key1)

api.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://studysyncs.xyz",
    ],  # Adjust this to restrict origins if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

llm = ChatGroq(model="llama-3.3-70b-versatile", api_key=groq_api_key2)
os.environ["HF_TOKEN"] = os.getenv("HF_TOKEN")
model, embeddings = get_model()


@api.get("/")
def read_root():
    return {"Hello": "World"}


@api.post("/chat")
def personal_assistant(
    session_id: Optional[str] = None,
    user_id: str = "anonymous",
    user_query: str = "",
    subject: str = "Design and Analysis of Algorithms",
    learner_type: str = "medium",
):
    _, retriever = initialize_retriver(model, embeddings, subject)
    rag_chain = initialize_rag_chain(model, retriever, subject, learner_type)
    if not session_id:
        session_id = str(uuid.uuid4())
    try:
        chat_history = get_chat_history(session_id)
        response = rag_chain.invoke(
            {"input": user_query, "chat_history": chat_history, "subject": subject}
        )["answer"]

        insert_application_logs(session_id, user_id, user_query, response)
        return {"session_id": session_id, "response": response}
    except KeyError as e:
        raise HTTPException(
            status_code=500, detail=f"Error Processing the response: {e}"
        )

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"An unexpected error occurred: {e}"
        )


@api.get("/sessions", response_model=List[str])
def get_sessions():
    try:
        session_ids = get_all_session_ids()
        if session_ids is None:
            raise HTTPException(
                status_code=501,
                detail="Database function to get all session IDs not implemented or returned None.",
            )
        return session_ids
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred while fetching session IDs: {str(e)}",
        )


@api.get("/sessions_by_user")
def get_user_sessions(user_id: str):
    try:
        session_ids = get_sessions_by_user_id(user_id)
        if session_ids is None:
            raise HTTPException(
                status_code=501, detail="Failed to retrieve sessions for the user"
            )
        return {"user_id": user_id, "sessions": session_ids}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred while fetching user sessions: {str(e)}",
        )


@api.get("/chat_history")
def get_session_chat_history(session_id: str):
    try:
        chats = get_chats_by_session_id(session_id)
        if chats is None:
            raise HTTPException(
                status_code=404, detail="No chat history found for this session"
            )
        return {"session_id": session_id, "chats": chats}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred while fetching chat history: {str(e)}",
        )


@api.post("/recommendations")
def get_recommendations(
    subject: str = "Design and Analysis of Algorithms", learner_type: str = "medium"
):

    prompt = f"""Based on the subject '{subject}', and considering they are a '{learner_type}' learner, provide 3-5 concise recommendations for the search bar of the study assitant. These could be related topics, questions related to the subject.
    Subject: {subject}
    Learner Type: {learner_type}
    Output the recommendations as a JSON list of strings. For example: ["Recommendation 1", "Study Resource A", "Next Step B"]
    Recommendations:"""

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": "You are an assistant that provides educational recommendations formatted as a JSON list of strings.",
                },
                {"role": "user", "content": prompt},
            ],
            temperature=0.7,
            max_tokens=300,
        )
        recommendations_str = response.choices[0].message.content.strip()
        parsed_recommendations = (
            json.loads(recommendations_str) if recommendations_str else []
        )
        return {"recommendations": parsed_recommendations}
    except json.JSONDecodeError as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error parsing JSON from Groq API for recommendations: {str(e)}. Response: {recommendations_str}",
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error calling Groq API for recommendations: {str(e)}",
        )


@api.post("/autocomplete")
def get_autocomplete_suggestions(
    user_query_partial: str, subject: str = "Design and Analysis of Algorithms"
):
    prompt = f"""Complete the following user query or provide relevant autocomplete suggestions. The user is typing about the subject '{subject}'.
    Partial Query: {user_query_partial}
    Subject: {subject}
    Provide up to 5 suggestions.
    Output the suggestions as a JSON list of strings. For example: ["suggestion 1", "suggestion 2"]
    Autocomplete Suggestions:"""

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",  # Or a smaller model if latency is critical
            messages=[
                {
                    "role": "system",
                    "content": "You are an assistant that provides autocomplete suggestions formatted as a JSON list of strings.",
                },
                {"role": "user", "content": prompt},
            ],
            temperature=0.5,
            max_tokens=100,
            # stop=["\n"] # Stop token might interfere with JSON list generation if it spans multiple lines, consider removing or adjusting.
        )
        suggestions_str = response.choices[0].message.content.strip()
        processed_suggestions = json.loads(suggestions_str) if suggestions_str else []
        return {"suggestions": processed_suggestions}
    except json.JSONDecodeError as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error parsing JSON from Groq API for autocomplete: {str(e)}. Response: {suggestions_str}",
        )
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error calling Groq API for autocomplete: {str(e)}"
        )


@api.post("/upload")
async def upload_textbook(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")

    rag_dir = os.path.join(os.getcwd(), "RAG")
    os.makedirs(rag_dir, exist_ok=True)

    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        shutil.copyfileobj(file.file, tmp)
        tmp_path = tmp.name

    loader = PyPDFLoader(tmp_path)
    docs = loader.load()
    splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=250)
    chunks = splitter.split_documents(docs)

    _, embeddings = get_model()

    vector_db = FAISS.from_documents(chunks, embeddings)
    book_name = os.path.splitext(file.filename)[0]
    save_path = os.path.join(rag_dir, book_name)
    vector_db.save_local(save_path)

    os.remove(tmp_path)
    return {"message": f"FAISS index saved for {book_name} at {save_path}"}


@api.post("/revision")
def revision_assistant(topic: str, learner_type: str = "medium"):
    try:
        if learner_type not in ["fast", "medium", "slow"]:
            raise HTTPException(
                status_code=400,
                detail="Invalid learner type. Choose from 'fast', 'medium', or 'slow'.",
            )

        if learner_type == "fast":
            prompt = f"""You are an expert educational consultant helping a fast-learning student with {topic}.

As a fast learner, this student:
- Quickly grasps new concepts
- Prefers high-level understanding over excessive details
- May get bored with repetitive practice
- Benefits from connecting ideas across domains

Please provide 3 revision strategies specifically tailored for {topic}:
1. A condensed review technique (include an estimated time commitment)
2. An advanced application method that challenges their understanding
3. A concept-mapping approach to connect {topic} with related knowledge

For each strategy:
- Provide a clear name and description
- Include 1-2 specific examples directly related to {topic}
- Suggest how to track progress
- Explain why this technique works well for fast learners

Throughout your response, use relevant emojis to make the content more engaging and highlight key points.

Format your response as structured, actionable advice with clear headings and bullet points."""

        elif learner_type == "medium":
            prompt = f"""You are an expert educational consultant helping a medium-paced learner with {topic}.

As a medium-paced learner, this student:
- Learns steadily with consistent practice
- Benefits from balanced theory and application
- Retains information best through varied approaches
- Appreciates clear structure and examples
Please provide 3 revision strategies specifically tailored for {topic}:
1. A comprehensive study plan (include time estimates for each component)
2. A practical application technique that reinforces understanding
3. A retrieval practice method to strengthen memory retention
For each strategy:
- Provide a clear name and description
- Include 2-3 concrete examples directly related to {topic}
- Suggest a schedule for implementation
- Explain how this approach balances depth and efficiency
Throughout your response, use relevant emojis to make the content more engaging and highlight key points.
Format your response as structured, actionable advice with clear headings and bullet points."""

        elif learner_type == "slow":
            prompt = f"""You are an expert educational consultant helping a methodical, deep-learning student with {topic}.

As a methodical learner, this student:
- Benefits from breaking topics into smaller components
- Needs sufficient time to process and integrate information
- Builds strong foundations through repetition and practice
- Values clear, sequential explanations

Please provide 3 revision strategies specifically tailored for {topic}:
1. A step-by-step breakdown approach (with detailed time allocation)
2. A progressive practice method that builds confidence
3. A visual/conceptual mapping technique to organize knowledge

For each strategy:
- Provide a clear name and detailed instructions
- Include 3-4 specific examples directly related to {topic}
- Suggest checkpoints to verify understanding before moving forward
- Explain how this approach promotes deep, lasting comprehension
Throughout your response, use relevant emojis to make the content more engaging and highlight key points.
Format your response as structured, actionable advice with clear headings, numbered steps, and bullet points."""

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": "You are an expert educational consultant specializing in personalized learning strategies.",
                },
                {"role": "user", "content": prompt},
            ],
            temperature=0.7,
            max_tokens=800,
        )

        detailed_response = response.choices[0].message.content

        overview_prompt = f"Create a 4-5 word overview that summarizes revision strategies for {topic} for a {learner_type} learner."
        overview_response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": "Create extremely concise summaries in 4-5 words only.",
                },
                {"role": "user", "content": overview_prompt},
            ],
            temperature=0.7,
            max_tokens=10,
        )

        overview = overview_response.choices[0].message.content.strip()

        return {"response": detailed_response, "overview": overview}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calling Groq API: {str(e)}")


@api.post("/carreer")
def career_path(goal: str, current_qualificaion: str, learner_type: str = "medium"):
    try:
        if learner_type not in ["fast", "medium", "slow"]:
            raise HTTPException(
                status_code=400,
                detail="Invalid learner type. Choose from 'fast', 'medium', or 'slow'.",
            )

        if learner_type == "fast":
            prompt = f"""You are a professional career counselor advising someone with current qualifications in {current_qualificaion} who wants to pursue a career in {goal}.

This person is a fast learner who:
- Acquires new skills quickly and effectively
- Thrives in dynamic, challenging environments
- Can handle accelerated learning paths and career progression
- May need consistent intellectual stimulation to stay engaged

Create a comprehensive career roadmap that includes:
1. A tailored 12-24 month career transition plan leveraging their fast learning abilities
2. 3-4 specific skill acquisition milestones with recommended resources (courses, certifications, projects)
3. Strategic networking and professional development opportunities
4. Recommended accelerated career advancement strategies

For each component:
- Provide specific, actionable steps
- Include estimated timeframes that reflect an accelerated pace
- Suggest how to leverage existing qualifications in {current_qualificaion}
- Explain how this approach maximizes their fast learning potential

Throughout your response, use relevant emojis to highlight key points, milestones, and important concepts.

Format your response as a professional career development plan with clear sections, timelines, and action items."""

        elif learner_type == "medium":
            prompt = f"""You are a professional career counselor advising someone with current qualifications in {current_qualificaion} who wants to pursue a career in {goal}.

This person is a balanced, steady learner who:
- Acquires skills at a methodical, consistent pace
- Benefits from structured learning with clear milestones
- Values practical application alongside theoretical knowledge
- Maintains good work-life balance during career transitions

Create a comprehensive career roadmap that includes:
1. A balanced 18-30 month career transition plan with steady progression
2. 4-5 essential skill development areas with prioritized learning resources
3. Strategic networking and experience-building opportunities
4. A sustainable approach to career advancement

For each component:
- Provide specific, actionable steps with realistic timeframes
- Balance skill acquisition with practical experience
- Suggest how to leverage existing qualifications in {current_qualificaion}
- Include regular progress assessment points
Throughout your response, use relevant emojis to make the content more engaging and highlight key points.
Format your response as a professional career development plan with clear sections, timelines, and action items."""

        elif learner_type == "slow":
            prompt = f"""You are a professional career counselor advising someone with current qualifications in {current_qualificaion} who wants to pursue a career in {goal}.

This person is a methodical, thorough learner who:
- Prefers depth over speed when acquiring new knowledge
- Excels with comprehensive understanding of fundamentals
- Builds strong foundations through careful, sequential learning
- Values mastery and quality over rapid advancement

Create a comprehensive career roadmap that includes:
1. A thorough 24-36 month career transition plan emphasizing deep skill development
2. 4-5 core competency areas with detailed learning progressions
3. Strategic relationship building and portfolio development opportunities
4. A long-term approach to career stability and expertise development

For each component:
- Provide detailed, sequential steps with generous timeframes
- Emphasize thorough understanding and practical application
- Suggest how to leverage existing qualifications in {current_qualificaion}
- Include validation checkpoints to ensure mastery before progression
Throughout your response, use relevant emojis to make the content more engaging and highlight key points.
Format your response as a professional career development plan with clear sections, detailed timelines, and measured action items."""

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": "You are an expert career counselor specializing in personalized career development plans.",
                },
                {"role": "user", "content": prompt},
            ],
            temperature=0.7,
            max_tokens=1000,
        )

        detailed_response = response.choices[0].message.content

        return {
            "response": detailed_response,
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calling Groq API: {str(e)}")


@api.post("/video_questions")
def get_questions(url: str, user_id: str = "anonymous"):
    try:
        video_id = extract_video_id(url)
        transcript_list = YouTubeTranscriptApi.get_transcript(video_id)
        full_text = " ".join([entry["text"] for entry in transcript_list])

        if not full_text.strip():
            raise HTTPException(status_code=400, detail="Transcript is empty or contains only whitespace.")

        prompt = f"""Based on the following transcript, generate 5 multiple-choice questions.
Each question must have 4 options, and only one option should be the correct answer.
Provide the output as a JSON list of objects. Each object should have the following keys:
- "question": (string) The question text.
- "options": (list of 4 strings) The multiple choice options.
- "correct_answer": (string) The text of the correct option.

Transcript:
{full_text[:4000]} # Limiting transcript length to avoid exceeding token limits

JSON Output:
"""

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "You are an AI assistant that generates multiple-choice questions from a given text, formatted as a JSON list of objects."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.5,
            max_tokens=1500,
            response_format={"type": "json_object"} 
        )
        
        questions_str = response.choices[0].message.content.strip()
        
        try:
            # Parse the response
            if questions_str.startswith("json"):
                questions_str = questions_str.split("json")[1].split("")[0].strip()
            elif questions_str.startswith(""):
                questions_str = questions_str.split("")[1].strip()

            parsed_response = json.loads(questions_str)

            if isinstance(parsed_response, dict) and "questions" in parsed_response and isinstance(parsed_response["questions"], list):
                questions_data = parsed_response["questions"]
            elif isinstance(parsed_response, list):
                questions_data = parsed_response
            else:
                if isinstance(parsed_response, dict):
                    for key, value in parsed_response.items():
                        if isinstance(value, list) and len(value) > 0 and isinstance(value[0], dict) and "question" in value[0]:
                            questions_data = value
                            break
                    else:
                        raise ValueError("JSON does not contain a list of questions in the expected format.")
                else:
                    raise ValueError("JSON response is not a list or a dictionary containing a list of questions.")

            # Save the full questions data (with correct answers) to the database
            questions_to_save = []
            for q in questions_data:
                questions_to_save.append({
                    'question': q['question'],
                    'correct_answer': q['correct_answer']
                })
            
            # Save questions for this specific user, replacing any previous questions
            bulk_save_video_questions(user_id, questions_to_save, video_id)
            
            # Create a stripped version without correct answers for the response
            client_response = []
            for q in questions_data:
                client_response.append({
                    'question': q['question'],
                    'options': q['options']
                })

            return {"questions": client_response, "transcript": full_text}

        except json.JSONDecodeError as e:
            print(f"JSONDecodeError: {e}")
            print(f"Problematic JSON string: {questions_str}")
            raise HTTPException(status_code=500, detail=f"Error parsing JSON from LLM: {str(e)}. Response: {questions_str}")
        except ValueError as e:
            print(f"ValueError: {e}")
            print(f"Problematic JSON structure: {questions_str}")
            raise HTTPException(status_code=500, detail=f"LLM response format error: {str(e)}. Response: {questions_str}")

    except TranscriptsDisabled:
        raise HTTPException(status_code=400, detail="Transcripts are disabled for this video.")
    except NoTranscriptFound:
        raise HTTPException(status_code=404, detail="No transcript found for this video.")
    except HTTPException as e: 
        raise e
    except Exception as e:
        print(f"An unexpected error occurred: {type(e).__name__} - {str(e)}")
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")


@api.post("/video_questions_transcript")
def get_questions(transcript: str, user_id: str = "anonymous"):
    try:

        if not transcript.strip():
            raise HTTPException(status_code=400, detail="Transcript is empty or contains only whitespace.")

        prompt = f"""Based on the following transcript, generate 5 multiple-choice questions.
Each question must have 4 options, and only one option should be the correct answer.
Provide the output as a JSON list of objects. Each object should have the following keys:
- "question": (string) The question text.
- "options": (list of 4 strings) The multiple choice options.
- "correct_answer": (string) The text of the correct option.

Transcript:
{transcript[:4000]} # Limiting transcript length to avoid exceeding token limits

JSON Output:
"""

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "You are an AI assistant that generates multiple-choice questions from a given text, formatted as a JSON list of objects."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.5,
            max_tokens=1500,
            response_format={"type": "json_object"} 
        )
        
        questions_str = response.choices[0].message.content.strip()
        
        try:
            # Parse the response
            if questions_str.startswith("json"):
                questions_str = questions_str.split("json")[1].split("")[0].strip()
            elif questions_str.startswith(""):
                questions_str = questions_str.split("")[1].strip()

            parsed_response = json.loads(questions_str)

            if isinstance(parsed_response, dict) and "questions" in parsed_response and isinstance(parsed_response["questions"], list):
                questions_data = parsed_response["questions"]
            elif isinstance(parsed_response, list):
                questions_data = parsed_response
            else:
                if isinstance(parsed_response, dict):
                    for key, value in parsed_response.items():
                        if isinstance(value, list) and len(value) > 0 and isinstance(value[0], dict) and "question" in value[0]:
                            questions_data = value
                            break
                    else:
                        raise ValueError("JSON does not contain a list of questions in the expected format.")
                else:
                    raise ValueError("JSON response is not a list or a dictionary containing a list of questions.")

            # Save the full questions data (with correct answers) to the database
            questions_to_save = []
            for q in questions_data:
                questions_to_save.append({
                    'question': q['question'],
                    'correct_answer': q['correct_answer']
                })
            
            # Save questions for this specific user, replacing any previous questions
            bulk_save_video_questions(user_id, questions_to_save, video_id=None)
            
            # Create a stripped version without correct answers for the response
            client_response = []
            for q in questions_data:
                client_response.append({
                    'question': q['question'],
                    'options': q['options']
                })

            return {"questions": client_response}

        except json.JSONDecodeError as e:
            print(f"JSONDecodeError: {e}")
            print(f"Problematic JSON string: {questions_str}")
            raise HTTPException(status_code=500, detail=f"Error parsing JSON from LLM: {str(e)}. Response: {questions_str}")
        except ValueError as e:
            print(f"ValueError: {e}")
            print(f"Problematic JSON structure: {questions_str}")
            raise HTTPException(status_code=500, detail=f"LLM response format error: {str(e)}. Response: {questions_str}")

    except TranscriptsDisabled:
        raise HTTPException(status_code=400, detail="Transcripts are disabled for this video.")
    except NoTranscriptFound:
        raise HTTPException(status_code=404, detail="No transcript found for this video.")
    except HTTPException as e: 
        raise e
    except Exception as e:
        print(f"An unexpected error occurred: {type(e)._name_} - {str(e)}")
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")

@api.get("/aptitude")
def get_aptitude_questions(user_id: str = "anonymous"):
    try:
        prompt = f"""Generate 5 multiple-choice aptitude questions.
The questions should be of moderate difficulty, suitable for a general audience.
Each question must have 4 options, and only one option should be the correct answer.
Provide the output as a JSON list of objects. Each object should have the following keys:
- "question": (string) The question text.
- "options": (list of 4 strings) The multiple choice options.
- "correct_answer": (string) The text of the correct option.

JSON Output:
"""

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": "You are an AI assistant that generates multiple-choice mental ability questions, formatted as a JSON list of objects.",
                },
                {"role": "user", "content": prompt},
            ],
            temperature=0.6,
            max_tokens=1500,
            response_format={"type": "json_object"},
        )

        questions_str = response.choices[0].message.content.strip()

        try:
            if questions_str.startswith("```json"):
                questions_str = (
                    questions_str.split("```json")[1].split("```")[0].strip()
                )
            elif questions_str.startswith("```"):
                questions_str = questions_str.split("```")[1].strip()

            parsed_response = json.loads(questions_str)

            if (
                isinstance(parsed_response, dict)
                and "questions" in parsed_response
                and isinstance(parsed_response["questions"], list)
            ):
                questions_data = parsed_response["questions"]
            elif isinstance(parsed_response, list):
                questions_data = parsed_response
            else:
                if isinstance(parsed_response, dict):
                    for key, value in parsed_response.items():
                        if (
                            isinstance(value, list)
                            and len(value) > 0
                            and isinstance(value[0], dict)
                            and "question" in value[0]
                        ):
                            questions_data = value
                            break
                    else:
                        raise ValueError(
                            "JSON does not contain a list of questions in the expected format."
                        )
                else:
                    raise ValueError(
                        "JSON response is not a list or a dictionary containing a list of questions."
                    )

            if not questions_data or len(questions_data) == 0:
                raise ValueError("LLM returned an empty list of questions.")
            if len(questions_data) > 5:
                questions_data = questions_data[:5]

            # Save the full questions data (with correct answers) to the database
            questions_to_save = []
            for q in questions_data:
                questions_to_save.append(
                    {"question": q["question"], "correct_answer": q["correct_answer"]}
                )

            # Save questions for this specific user, replacing any previous questions
            # bulk_save_aptitude_questions(user_id, questions_to_save)

            # Create a stripped version without correct answers for the response
            return {"questions": questions_to_save}

        except json.JSONDecodeError as e:
            print(f"JSONDecodeError for mental ability questions: {e}")
            print(f"Problematic JSON string: {questions_str}")
            raise HTTPException(
                status_code=500,
                detail=f"Error parsing JSON from LLM for mental ability questions: {str(e)}. Response: {questions_str}",
            )
        except ValueError as e:
            print(f"ValueError for mental ability questions: {e}")
            print(f"Problematic JSON structure: {questions_str}")
            raise HTTPException(
                status_code=500,
                detail=f"LLM response format error for mental ability questions: {str(e)}. Response: {questions_str}",
            )

    except HTTPException as e:
        raise e
    except Exception as e:
        print(
            f"An unexpected error occurred in mental_ability_questions: {type(e).__name__} - {str(e)}"
        )
        raise HTTPException(
            status_code=500,
            detail=f"An unexpected error occurred while generating mental ability questions: {str(e)}",
        )


# Update the Pydantic model for the assessment input - simplified since we no longer need question IDs
class AssessmentInput(BaseModel):
    aptitude_correct: int
    video_correct: int
    questions_length: int
    user_id: str = "anonymous"


@api.post("/assessment")
def assess_learner_type(assessment_data: AssessmentInput):
    try:
        user_id, aptitude_correct, video_correct, questions_length = (
            assessment_data.user_id,
            assessment_data.aptitude_correct,
            assessment_data.video_correct,
            assessment_data.questions_length,
        )
        # # Extract data from the input
        # user_id = assessment_data.user_id

        # # Get video questions and correct answers from the database for this user
        # video_questions = get_video_questions(user_id)

        # # Get aptitude questions and correct answers from the database for this user
        # aptitude_questions = get_aptitude_questions(user_id)

        # # Calculate video score by comparing selected options with correct answers
        # video_correct = 0
        # for i, selected in enumerate(assessment_data.phase1options):
        #     if i < len(video_questions) and selected is not None:
        #         if selected == video_questions[i]["correct_answer"]:
        #             video_correct += 1

        # # Calculate aptitude score by comparing selected options with correct answers
        # aptitude_correct = 0
        # for i, selected in enumerate(assessment_data.phase2options):
        #     if i < len(aptitude_questions) and selected is not None:
        #         if selected == aptitude_questions[i]["correct_answer"]:
        #             aptitude_correct += 1

        # Use the LLM to classify the learner type
        prompt = f"""You are an expert student assessor. Based on the following performance metrics, classify the student as a 'slow', 'medium', or 'fast' learner.

Aptitude Test Performance:
- Correct Answers: {aptitude_correct} out of {questions_length}

Video Comprehension Performance:
- Correct Answers: {video_correct} out of {questions_length}

Consider that 'fast' learners grasp concepts quickly and perform very well (e.g., high scores like 4 aptitude and 4 video correct),
'medium' learners show steady understanding (e.g., moderate scores),
and 'slow' learners might need more time and support (e.g., lower scores like 0-1 correct).

Provide your classification as a single word: 'slow', 'medium', or 'fast'.

Classification:"""

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": "You are an AI assistant that classifies learners based on performance data. Respond with a single word: 'slow', 'medium', or 'fast'.",
                },
                {"role": "user", "content": prompt},
            ],
            temperature=0.2,  # Lower temperature for more deterministic classification
            max_tokens=10,  # Expecting a short response
        )

        classification = response.choices[0].message.content.strip().lower()

        allowed_classifications = ["slow", "medium", "fast"]
        if classification not in allowed_classifications:
            # Fallback or attempt to find the keyword if the LLM adds minor extra text
            for allowed_class in allowed_classifications:
                if allowed_class in classification:
                    classification = allowed_class
                    break
            else:  # no break
                print(f"Unexpected classification from LLM: {classification}")
                raise HTTPException(
                    status_code=500,
                    detail=f"Received unexpected classification from LLM: {response.choices[0].message.content.strip()}",
                )

        # Save the assessment results to database
        save_user_assessment(
            user_id=user_id,
            video_score=video_correct,
            aptitude_score=aptitude_correct,
            learner_type=classification,
        )

        return {
            "user_id": user_id,
            "video_score": video_correct,
            "video_total": questions_length,
            "aptitude_score": aptitude_correct,
            "aptitude_total": questions_length,
            "learner_type_assessment": classification,
        }

    except HTTPException as e:
        raise e
    except Exception as e:
        print(
            f"An unexpected error occurred in assess_learner_type: {type(e).__name__} - {str(e)}"
        )
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=f"An unexpected error occurred during learner assessment: {str(e)}",
        )


@api.post("/create_session")
def create_new_session(user_id: str = "anonymous"):
    """
    Create a new session for a user and return the session ID.
    """
    try:
        session_id = create_session(user_id)
        return {"session_id": session_id, "user_id": user_id, "status": "created"}
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to create session: {str(e)}"
        )


@api.delete("/delete_session")
def remove_session(
    session_id: str = Path(..., description="The ID of the session to delete"),
    user_id: Optional[str] = None,
):
    """
    Delete a session and all its associated records.

    Parameters:
    - session_id: ID of the session to delete
    - user_id: Optional user ID for additional verification
    """
    try:
        deleted_count = delete_session(session_id, user_id)
        if deleted_count == 0:
            raise HTTPException(
                status_code=404,
                detail=f"Session with ID {session_id} not found"
                + (f" for user {user_id}" if user_id else ""),
            )
        return {
            "session_id": session_id,
            "user_id": user_id,
            "deleted_records": deleted_count,
            "status": "deleted",
        }
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to delete session: {str(e)}"
        )
