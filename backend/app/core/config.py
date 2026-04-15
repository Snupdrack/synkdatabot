from pydantic_settings import BaseSettings
from typing import List
import os

class Settings(BaseSettings):
    # Groq API
    groq_api_key: str = ""

    # ChromaDB
    chroma_persist_dir: str = "./chroma_data"

    # Server
    host: str = "0.0.0.0"
    port: int = 8000

    # CORS
    allowed_origins: List[str] = ["*"]

    # LLM Config
    llm_model: str = "llama3-70b-8192"
    llm_temperature: float = 0.7
    llm_max_tokens: int = 1024

    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()