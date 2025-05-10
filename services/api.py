from fastapi import FastAPI,HTTPException
from fastapi.middleware.cors import CORSMiddleware
from langchain_groq import ChatGroq
import os
from dotenv import load_dotenv
load_dotenv()

api = FastAPI()

groq_api_key1 = os.getenv("GROQ_API_KEY1")
groq_api_key2 = os.getenv("GROQ_API_kEY2")

api.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173","https://studysyncs.xyz"],  # Adjust this to restrict origins if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

chat_llm = ChatGroq(model= "llama-3.3-70b-versatile", api_key=groq_api_key1)
llm = ChatGroq(model= "llama-3.3-70b", api_key=groq_api_key2)

@api.get("/")
def read_root():
    return {"Hello": "World"}

@api.post("/chat")
def personal_assistant():
    return {"message": "This is a personal assistant API"}

@api.post("/revision")
def revision_assistant():
    return {"message": "This is a revision assistant API"}

@api.post("/carreer")
def carreer_path():
    return {"message": "This is a career path assistant API"}