from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from uuid import UUID

from app.db.session import get_db
from app.db.models import Patient
from app import schemas

router = APIRouter()

@router.get("/", response_model=List[schemas.Patient])
async def read_patients(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Patient).offset(skip).limit(limit))
    return result.scalars().all()

@router.post("/", response_model=schemas.Patient)
async def create_patient(patient: schemas.PatientCreate, db: AsyncSession = Depends(get_db)):
    db_patient = Patient(**patient.model_dump())
    db.add(db_patient)
    await db.commit()
    await db.refresh(db_patient)
    return db_patient

@router.put("/{patient_id}", response_model=schemas.Patient)
async def update_patient(patient_id: UUID, patient: schemas.PatientUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Patient).filter(Patient.id == patient_id))
    db_patient = result.scalars().first()
    if not db_patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    update_data = patient.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_patient, key, value)
        
    await db.commit()
    await db.refresh(db_patient)
    return db_patient
