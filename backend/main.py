from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="AI Interview Coach")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

OLLAMA_URL = "http://localhost:11434/api/generate"

class InterviewSetup(BaseModel):
    job_role: str
    company_level: str
    experience: str
    interview_type: str

class ChatRequest(BaseModel):
    message: str
    history: list = []

@app.post("/start-interview")
async def start_interview(setup: InterviewSetup):
    prompt = f"""You are a professional technical interviewer.
Job: {setup.job_role}
Level: {setup.company_level}
Experience: {setup.experience}
Focus: {setup.interview_type}

Start the interview naturally. Introduce yourself and ask the first relevant question."""

    try:
        response = requests.post(OLLAMA_URL, json={
            "model": os.getenv("MODEL", "llama3.2"),
            "prompt": prompt,
            "stream": False,
            "temperature": 0.7
        })
        return {"reply": response.json()["response"], "history": []}
    except:
        return {"reply": "Error connecting to Ollama. Make sure Ollama is running.", "history": []}

@app.post("/chat")
async def chat(request: ChatRequest):
    history_str = "\n".join([f"Interviewer: {h.get('q','')}\nCandidate: {h.get('a','')}" for h in request.history[-5:]])
    
    prompt = f"""You are conducting a job interview.
Previous conversation:
{history_str}

Candidate's answer: {request.message}

Give short, constructive feedback and ask the next good question."""

    try:
        response = requests.post(OLLAMA_URL, json={
            "model": os.getenv("MODEL", "llama3.2"),
            "prompt": prompt,
            "stream": False,
            "temperature": 0.75
        })
        return {"reply": response.json()["response"]}
    except:
        return {"reply": "Ollama connection error."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)