from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from langchain_groq import ChatGroq
from langchain.chains import RetrievalQA
from langchain.vectorstores import Chroma
import os
import json
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

@api.get("/")
def read_root():
    return {"Hello": "World"}

@api.post("/chat")
def personal_assistant(query:str):
  try:
        # init LLM
        llm = ChatGroq(
            groq_api_key=groq_api_key1,
            model_name="llama-3.3-70b-versatile",
            streaming=False
        )

        embeddings = OpenAIEmbeddings()
        vectordb = Chroma(persist_directory="path/to/chroma", embedding_function=embeddings)
        retriever = vectordb.as_retriever(search_kwargs={"k": 5})

        # build and run RAG chain
        rag = RetrievalQA.from_chain_type(
            llm=llm,
            chain_type="stuff",
            retriever=retriever,
        )
        answer = rag.run(query)

        # optional summary & title
        summary = llm.invoke(f"Summarize this in one sentence: {answer}").content
        title = llm.invoke(f"Give a 5–8 word title for this: {answer}").content

        return {
            "user_query": query,
            "answer": answer,
            "summary": summary,
            "title": title
        }
    except Exception as e:
        import traceback
        raise HTTPException(status_code=500, detail=f"{e}\n{traceback.format_exc()}")

@api.post("/revision")
def revision_assistant():
    return {"message": "This is a revision assistant API"}

@api.post("/carreer")
def carreer_path():
    return {"message": "This is a career path assistant API"}

# new RAG‐based chat handler
def chat_db( query: str):
    """
    Replaces SQL‐agent with a simple RAG chain over a Chroma vectorstore.
    """
    try:
        # init LLM
        llm = ChatGroq(
            groq_api_key=groq_api_key1,
            model_name="llama-3.3-70b-versatile",
            streaming=False
        )

        # embeddings + vectorstore
        embeddings = OpenAIEmbeddings()
        vectordb = Chroma(persist_directory="path/to/chroma", embedding_function=embeddings)
        retriever = vectordb.as_retriever(search_kwargs={"k": 5})

        # build and run RAG chain
        rag = RetrievalQA.from_chain_type(
            llm=llm,
            chain_type="stuff",
            retriever=retriever,
        )
        answer = rag.run(query)

        # optional summary & title
        summary = llm.invoke(f"Summarize this in one sentence: {answer}").content
        title = llm.invoke(f"Give a 5–8 word title for this: {answer}").content

        return {
            "user_query": query,
            "answer": answer,
            "summary": summary,
            "title": title
        }
    except Exception as e:
        import traceback
        raise HTTPException(status_code=500, detail=f"{e}\n{traceback.format_exc()}")