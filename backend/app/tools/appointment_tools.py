from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.models.models import Appointment, Patient
from app.database import SessionLocal

def check_availability(date_str: str) -> str:
    """Check available appointment slots for a given date (YYYY-MM-DD)."""
    try:
        target_date = datetime.strptime(date_str, "%Y-%m-%d").date()
    except ValueError:
        return "Invalid date format. Please use YYYY-MM-DD."
    
    db: Session = SessionLocal()
    try:
        # Dummy logic: 9 AM to 5 PM slots, 1 hour each
        booked_appointments = db.query(Appointment).filter(
            Appointment.appointment_time >= datetime.combine(target_date, datetime.min.time()),
            Appointment.appointment_time <= datetime.combine(target_date, datetime.max.time())
        ).all()
        
        booked_times = [app.appointment_time.hour for app in booked_appointments]
        available_slots = []
        for hour in range(9, 17):
            if hour not in booked_times:
                available_slots.append(f"{hour:02d}:00")
                
        if not available_slots:
            return f"No availability on {date_str}."
        return f"Available slots on {date_str}: " + ", ".join(available_slots)
    finally:
        db.close()

def book_appointment(patient_id: int, date_str: str, time_str: str) -> str:
    """Book an appointment for a patient at a specific date and time."""
    try:
        app_time = datetime.strptime(f"{date_str} {time_str}", "%Y-%m-%d %H:%M")
    except ValueError:
        return "Invalid date/time format. Use YYYY-MM-DD and HH:MM."
        
    db: Session = SessionLocal()
    try:
        patient = db.query(Patient).filter(Patient.id == patient_id).first()
        if not patient:
            return f"Patient with ID {patient_id} not found."
            
        # Check if slot is taken
        existing = db.query(Appointment).filter(Appointment.appointment_time == app_time).first()
        if existing:
            return f"The slot at {date_str} {time_str} is already booked."
            
        new_app = Appointment(patient_id=patient_id, appointment_time=app_time, status="scheduled")
        db.add(new_app)
        db.commit()
        return f"Appointment successfully booked for {patient.first_name} on {date_str} at {time_str}."
    finally:
        db.close()
