from fastapi import FastAPI, HTTPException, UploadFile, File
import os, shutil, tempfile
from fastapi.middleware.cors import CORSMiddleware
from langchain_groq import ChatGroq
from langchain.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from utils.bot import initialize_retriver, initialize_rag_chain, get_model
from utils.database import insert_application_logs, get_chat_history
from typing import Optional
import uuid
from dotenv import load_dotenv
from groq import Groq


load_dotenv()

api = FastAPI()

groq_api_key1 = os.getenv("GROQ_API_KEY1")
groq_api_key2 = os.getenv("GROQ_API_kEY2")
client = Groq(api_key=groq_api_key1)

api.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173","https://studysyncs.xyz"],  # Adjust this to restrict origins if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

llm = ChatGroq(model= "llama-3.3-70b-versatile", api_key=groq_api_key2)
os.environ["HF_TOKEN"] = os.getenv("HF_TOKEN")
model,embeddings = get_model()

@api.get("/")
def read_root():
    return {"Hello": "World"}

@api.post("/chat")
def personal_assistant(session_id: Optional[str] = None, user_query: str = "", subject: str = "Design and Analysis of Algorithms", learner_type: str = "medium"):
    _, retriever = initialize_retriver(model, embeddings, subject)
    rag_chain = initialize_rag_chain(model, retriever, subject, learner_type)
    if not session_id:
        session_id = str(uuid.uuid4())
    try:
        chat_history = get_chat_history(session_id)
        response = rag_chain.invoke({
        "input": user_query, "chat_history": chat_history, "subject":subject})['answer']

        insert_application_logs(session_id, user_query, response)
        return {"session_id": session_id, "response": response}
    except KeyError as e:
        raise HTTPException(status_code=500, detail =f"Error Processing th eresponse :{e}")
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occured: {e}")
    

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
            raise HTTPException(status_code=400, detail="Invalid learner type. Choose from 'fast', 'medium', or 'slow'.")
        
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

Format your response as structured, actionable advice with clear headings and bullet points."""

        elif learner_type == 'medium':
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

Format your response as structured, actionable advice with clear headings, numbered steps, and bullet points."""
        
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "You are an expert educational consultant specializing in personalized learning strategies."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=800
        )
        
        detailed_response = response.choices[0].message.content
        
        overview_prompt = f"Create a 4-5 word overview that summarizes revision strategies for {topic} for a {learner_type} learner."
        overview_response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "Create extremely concise summaries in 4-5 words only."},
                {"role": "user", "content": overview_prompt}
            ],
            temperature=0.7,
            max_tokens=10
        )
        
        overview = overview_response.choices[0].message.content.strip()
        
        return {
            "response": detailed_response,
            "overview": overview
        }
    
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calling Groq API: {str(e)}")

@api.post("/carreer")
def carreer_path():
    return {"message": "This is a career path assistant API"}