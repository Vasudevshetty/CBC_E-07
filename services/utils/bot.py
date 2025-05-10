from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
import os
from dotenv import load_dotenv
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.chains import create_history_aware_retriever, create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
load_dotenv()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.environ['HF_TOKEN'] = os.getenv('HF_TOKEN')

def get_model():
    groq_api_key1 = os.getenv("GROQ_API_KEY1")
    model = ChatGroq(groq_api_key=groq_api_key1, model_name="llama-3.3-70b-versatile")
    embeddings = HuggingFaceEmbeddings(model_name='all-MiniLM-L6-v2')
    return model, embeddings

def initialize_retriver(model, embeddings, subject):
    vector_db = FAISS.load_local(f'RAG/{subject}', embeddings, allow_dangerous_deserialization=True)
    retriever = vector_db.as_retriever()

    contextualize_q_system_prompt = """
    You are an AI study assistant for engineering students, answering only from the provided textbook.
    """
    contextualize_q_prompt = ChatPromptTemplate.from_messages(
        [
            ("system", contextualize_q_system_prompt),
            MessagesPlaceholder("chat_history"),
            ("human", "{input}"),
        ]
    )

    history_aware_retriever = create_history_aware_retriever(
        model, retriever, contextualize_q_prompt
    )
    
    return history_aware_retriever, retriever

def initialize_rag_chain(model, retriever, subject, learner_type):
    system_template = """
You are an AI study assistant for {subject}. The current learner is a {learner_type} learner.
– If the learner is slow, break down explanations step-by-step, use simple analogies and concrete examples and use flowcharts or diagrams.
– If medium, balance clarity with conciseness, include a brief example.
– If fast, deliver a concise, high-level technical answer.
Always answer ONLY from the provided textbook. Do NOT speculate or introduce outside content.
Dont answer the question if the context is not sufficient and dont say "I dont know" and dont ask follow up questions.
Context:
{context}
"""
    # First create the prompt template
    qa_prompt = ChatPromptTemplate.from_messages([
        ("system", system_template),
        MessagesPlaceholder(variable_name="chat_history"),
        ("human", "{input}")
    ])
    
    # Then apply the partial variables
    qa_prompt = qa_prompt.partial(subject=subject, learner_type=learner_type)
    
    question_answer_chain = create_stuff_documents_chain(model, qa_prompt)
    return create_retrieval_chain(retriever, question_answer_chain)

