import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PORT: int = 8000
    HOST: str = "0.0.0.0"
    DEBUG: bool = True
    GEMINI_API_KEY: str = ""
    CACHE_TYPE: str = "memory"
    CACHE_EXPIRE_SECONDS: int = 3600

    # Look for .env in current directory, backend directory, or root
    model_config = SettingsConfigDict(
        env_file=(
            ".env",
            "backend/.env",
            os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), ".env")
        ),
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
