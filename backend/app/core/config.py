from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # Database settings
    database_url: str = "sqlite:///./chemezy.db"

    dspy_enabled: bool = True

    # Security settings (REQUIRED for production)
    secret_key: str  # Must be set in environment - no default for security
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30

    # CORS settings
    # Add your SvelteKit frontend domains
    allowed_origins: list[str] = ["*"]

    # PubChem API settings
    pubchem_base_url: str = "https://pubchem.ncbi.nlm.nih.gov/rest/pug"
    pubchem_timeout: int = 10

    # DSPy/LLM settings - OpenAI-Compatible API (works with any OpenAI-compatible provider)
    openai_api_key: Optional[str] = None
    openai_api_base: Optional[str] = None
    openai_model_name: str = "gpt-4o-mini"


    # Application settings
    app_name: str = "Chemezy Backend Engine"
    debug: bool = False
    testing: bool = False

    pubchem_retries: int = 3
    dspy_retries: int = 3

    class Config:
        env_file = ".env"


settings = Settings()
