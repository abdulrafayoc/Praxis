from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from typing import List
from datetime import datetime
from uuid import UUID

from app.db.session import get_db
from app.db.models import PromptVersion
from app import schemas

router = APIRouter()

@router.get("/", response_model=List[schemas.PromptVersion])
async def read_prompts(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(PromptVersion).offset(skip).limit(limit))
    return result.scalars().all()

@router.post("/activate")
async def activate_prompt(prompt_id: str, version: int, db: AsyncSession = Depends(get_db)):
    # Deactivate current active prompt for the same prompt_id
    await db.execute(
        update(PromptVersion)
        .where(PromptVersion.prompt_id == prompt_id)
        .values(is_active=False)
    )
    
    # Activate the selected prompt
    result = await db.execute(
        select(PromptVersion).filter(PromptVersion.prompt_id == prompt_id, PromptVersion.version == version)
    )
    db_prompt = result.scalars().first()
    if not db_prompt:
        raise HTTPException(status_code=404, detail="Prompt version not found")
    
    db_prompt.is_active = True
    db_prompt.activated_at = datetime.utcnow()
    await db.commit()
    await db.refresh(db_prompt)
    return {"message": "Prompt activated successfully", "prompt_version": db_prompt.version}
