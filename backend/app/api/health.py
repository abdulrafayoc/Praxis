from fastapi import APIRouter, Response
from app.db.session import engine
import redis.asyncio as aioredis
from app.config import settings

router = APIRouter(prefix="/health", tags=["Health"])

@router.get("/live")
async def health_live():
    return {"status": "ok"}

@router.get("/ready")
async def health_ready(response: Response):
    try:
        async with engine.connect() as conn:
            pass
            
        r = aioredis.from_url(settings.redis_url)
        await r.ping()
        await r.close()
        
        return {"status": "ready", "db": "ok", "redis": "ok"}
    except Exception as e:
        response.status_code = 503
        return {"status": "not ready", "error": str(e)}
