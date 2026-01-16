from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    app_name: str = "HireSense"
    app_env: str = "dev"
    log_level: str = "INFO"

    class Config:
        env_file = ".env"

settings = Settings()