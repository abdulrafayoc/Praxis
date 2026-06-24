from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file='.env', env_file_encoding='utf-8')
    
    # OpenAI
    openai_api_key: str = ''
    
    # ElevenLabs
    elevenlabs_api_key: str = ''
    elevenlabs_voice_id: str = 'EXAVITQu4vr4xnSDxMaL'  # default voice
    
    # Deepgram
    deepgram_api_key: str = ''
    
    # Twilio
    twilio_account_sid: str = ''
    twilio_auth_token: str = ''
    twilio_phone_number: str = ''
    twilio_websocket_url: str = 'wss://localhost:8000/ws/call'
    receptionist_extension: str = ''
    
    # Database
    database_url: str = 'postgresql+asyncpg://praxis:praxis@postgres:5432/praxis'
    
    # Redis
    redis_url: str = 'redis://redis:6379/0'
    celery_broker_url: str = 'redis://redis:6379/1'
    
    # Auth
    jwt_secret: str = 'change-me-in-production'
    jwt_algorithm: str = 'HS256'
    jwt_expiry_hours: int = 24
    admin_username: str = 'admin'
    admin_password_hash: str = ''  # bcrypt hash of admin password
    
    # ChromaDB
    chroma_host: str = 'localhost'
    chroma_port: int = 8001
    chroma_collection_name: str = 'praxis_knowledge'
    
    # App
    max_concurrent_calls: int = 5
    context_max_tokens: int = 3000
    filler_audio_dir: str = './filler_audio'
    prompts_dir: str = './prompts'
    redis_session_ttl: int = 7200  # 2 hours
    
    # Server
    host: str = '0.0.0.0'
    port: int = 8000
    debug: bool = False

@lru_cache()
def get_settings() -> Settings:
    return Settings()

settings = get_settings()
