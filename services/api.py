from fastapi import FastAPI 
import uvicorn

api = FastAPI()

@api.get("/")
def read_root():
    return {"Hello": "World"}