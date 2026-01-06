from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    firebase_credentials_path: str = "./firebase/serviceAccountKey.json"
    gemini_api_key: str
    frontend_url: str = "http://localhost:3000"
    
    class Config:
        env_file = ".env"
        case_sensitive = False

@lru_cache()
def get_settings():
    return Settings()
