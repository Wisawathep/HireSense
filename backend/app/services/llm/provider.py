import os
from pathlib import Path
from dotenv import load_dotenv
from fastapi import HTTPException
from langchain_google_genai import ChatGoogleGenerativeAI

ENV_PATH = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=ENV_PATH)

def get_llm():
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        raise HTTPException(
            status_code=503,
            detail="Missing GOOGLE_API_KEY"
        )
    
    return ChatGoogleGenerativeAI(
        model="gemini-2.5-flash",
        temperature=0
    )