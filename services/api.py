from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

api = FastAPI()



api.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173","https://studysyncs.xyz"],  # Adjust this to restrict origins if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@api.get("/")
def read_root():
    return {"Hello": "World"}
