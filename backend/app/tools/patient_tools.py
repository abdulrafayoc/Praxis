from sqlalchemy.orm import Session
from app.models.models import Patient
from app.database import SessionLocal

def lookup_patient(phone_number: str) -> str:
    """Lookup a patient by their phone number."""
    db: Session = SessionLocal()
    try:
        patient = db.query(Patient).filter(Patient.phone_number == phone_number).first()
        if not patient:
            return f"No patient found with phone number {phone_number}."
        return f"Patient found: {patient.first_name} {patient.last_name}, ID: {patient.id}, DOB: {patient.date_of_birth}"
    finally:
        db.close()
