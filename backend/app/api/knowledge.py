from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from uuid import UUID

from app.db.session import get_db
from app.db.models import KnowledgeBaseDocument
from app import schemas

router = APIRouter()

@router.get("/", response_model=List[schemas.KnowledgeBaseDocument])
async def read_knowledge(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(KnowledgeBaseDocument).offset(skip).limit(limit))
    return result.scalars().all()

@router.post("/", response_model=schemas.KnowledgeBaseDocument)
async def create_knowledge(doc: schemas.KnowledgeBaseDocumentCreate, db: AsyncSession = Depends(get_db)):
    db_doc = KnowledgeBaseDocument(**doc.model_dump())
    db.add(db_doc)
    await db.commit()
    await db.refresh(db_doc)
    return db_doc

@router.put("/{doc_id}", response_model=schemas.KnowledgeBaseDocument)
async def update_knowledge(doc_id: UUID, doc: schemas.KnowledgeBaseDocumentUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(KnowledgeBaseDocument).filter(KnowledgeBaseDocument.id == doc_id))
    db_doc = result.scalars().first()
    if not db_doc:
        raise HTTPException(status_code=404, detail="Document not found")
    
    update_data = doc.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_doc, key, value)
        
    await db.commit()
    await db.refresh(db_doc)
    return db_doc

@router.delete("/{doc_id}")
async def delete_knowledge(doc_id: UUID, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(KnowledgeBaseDocument).filter(KnowledgeBaseDocument.id == doc_id))
    db_doc = result.scalars().first()
    if not db_doc:
        raise HTTPException(status_code=404, detail="Document not found")
    
    await db.delete(db_doc)
    await db.commit()
    return {"message": "Document deleted"}
