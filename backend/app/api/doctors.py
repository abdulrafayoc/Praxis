from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from uuid import UUID

from app.db.session import get_db
from app.db.models import Doctor
from app import schemas

router = APIRouter()

@router.get("/", response_model=List[schemas.Doctor])
async def read_doctors(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Doctor).offset(skip).limit(limit))
    return result.scalars().all()

@router.post("/", response_model=schemas.Doctor)
async def create_doctor(doctor: schemas.DoctorCreate, db: AsyncSession = Depends(get_db)):
    db_doctor = Doctor(**doctor.model_dump())
    db.add(db_doctor)
    await db.commit()
    await db.refresh(db_doctor)
    return db_doctor

@router.put("/{doctor_id}", response_model=schemas.Doctor)
async def update_doctor(doctor_id: UUID, doctor: schemas.DoctorUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Doctor).filter(Doctor.id == doctor_id))
    db_doctor = result.scalars().first()
    if not db_doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    
    update_data = doctor.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_doctor, key, value)
        
    await db.commit()
    await db.refresh(db_doctor)
    return db_doctor
