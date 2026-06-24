from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from uuid import UUID

from app.db.session import get_db
from app.db.models import Appointment
from app import schemas

router = APIRouter()

@router.get("/", response_model=List[schemas.Appointment])
async def read_appointments(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Appointment).offset(skip).limit(limit))
    return result.scalars().all()

@router.post("/", response_model=schemas.Appointment)
async def create_appointment(appointment: schemas.AppointmentCreate, db: AsyncSession = Depends(get_db)):
    db_appointment = Appointment(**appointment.model_dump())
    db.add(db_appointment)
    await db.commit()
    await db.refresh(db_appointment)
    return db_appointment

@router.put("/{appointment_id}", response_model=schemas.Appointment)
async def update_appointment(appointment_id: UUID, appointment: schemas.AppointmentUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Appointment).filter(Appointment.id == appointment_id))
    db_appointment = result.scalars().first()
    if not db_appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    update_data = appointment.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_appointment, key, value)
        
    await db.commit()
    await db.refresh(db_appointment)
    return db_appointment
