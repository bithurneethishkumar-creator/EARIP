import os
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "EARIP — Enterprise AI Retail Intelligence Platform"
    VERSION: str = "2.0.0"
    API_V1_STR: str = "/api"
    
    # Supabase credentials (optional for local fallback mode, required for Supabase live mode)
    SUPABASE_URL: Optional[str] = os.getenv("SUPABASE_URL", "")
    SUPABASE_KEY: Optional[str] = os.getenv("SUPABASE_KEY", "")
    SUPABASE_DB_URL: Optional[str] = os.getenv("SUPABASE_DB_URL", "")
    
    # AI / LLM Integration (Groq ultra-fast Llama-3.3-70b inference)
    GROQ_API_KEY: Optional[str] = os.getenv("GROQ_API_KEY", "")
    GEMINI_API_KEY: Optional[str] = os.getenv("GEMINI_API_KEY", "")
    OPENAI_API_KEY: Optional[str] = os.getenv("OPENAI_API_KEY", "")
    
    # Data Paths
    DATASET_PATH: str = os.getenv("DATASET_PATH", "data/online_retail_II.xlsx")
    ANALYTICS_CACHE_PATH: str = os.getenv("ANALYTICS_CACHE_PATH", "data/processed_analytics.json")
    SQLITE_DB_PATH: str = os.getenv("SQLITE_DB_PATH", "data/earip.db")

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
