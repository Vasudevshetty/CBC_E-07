from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from langchain_groq import ChatGroq
import os
from utils.bot import initialize_retriver, initialize_rag_chain, get_model
from utils.database import insert_application_logs, get_chat_history
from typing import Optional
import uuid
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

llm = ChatGroq(model= "llama-3.3-70b", api_key=groq_api_key2)
os.environ["HF_TOKEN"] = os.getenv("HF_TOKEN")
model,embeddings = get_model()



@api.get("/")
def read_root():
    return {"Hello": "World"}

@api.post("/chat")
def personnle_assistant(session_id: Optional[str] = None, user_query: str = "", subject: str = "Data Communication", sem: int = 4):
    _, retriever = initialize_retriver(model, embeddings, subject, sem)
    rag_chain = initialize_rag_chain(model, retriever)
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


    

@api.post("/revision")
def revision_assistant():
    return {"message": "This is a revision assistant API"}

@api.post("/carreer")
def carreer_path():
    return {"message": "This is a career path assistant API"}