import redis.asyncio as aioredis
import json
from typing import Optional
from app.config import settings

_redis_pool = None

async def get_redis_pool():
    global _redis_pool
    if _redis_pool is None:
        _redis_pool = aioredis.from_url(
            settings.redis_url,
            encoding='utf-8',
            decode_responses=True
        )
    return _redis_pool

async def save_session(call_session_id: str, state: dict, ttl: int = None) -> None:
    r = await get_redis_pool()
    await r.setex(
        f'session:{call_session_id}',
        ttl or settings.redis_session_ttl,
        json.dumps(state, default=str)
    )

async def get_session(call_session_id: str) -> Optional[dict]:
    r = await get_redis_pool()
    data = await r.get(f'session:{call_session_id}')
    return json.loads(data) if data else None

async def delete_session(call_session_id: str) -> None:
    r = await get_redis_pool()
    await r.delete(f'session:{call_session_id}')

async def get_active_call_count() -> int:
    r = await get_redis_pool()
    val = await r.get('active_calls_count')
    return int(val) if val else 0

async def increment_active_calls() -> int:
    r = await get_redis_pool()
    return await r.incr('active_calls_count')

async def decrement_active_calls() -> int:
    r = await get_redis_pool()
    return await r.decr('active_calls_count')

async def get_active_prompt_version(agent_id: str) -> Optional[str]:
    r = await get_redis_pool()
    return await r.get(f'active_prompt:{agent_id}')

async def set_active_prompt_version(agent_id: str, prompt_id: str) -> None:
    r = await get_redis_pool()
    await r.set(f'active_prompt:{agent_id}', prompt_id)
