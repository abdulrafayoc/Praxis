from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from app.db.session import get_db
from app.db.models import Notification
from app import schemas

router = APIRouter()

@router.get("/", response_model=List[schemas.Notification])
async def read_notifications(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Notification).offset(skip).limit(limit))
    return result.scalars().all()
