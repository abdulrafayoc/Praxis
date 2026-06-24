from pydantic import BaseModel, ConfigDict, Field
from typing import Optional, List, Dict, Any
from datetime import datetime, date, time
from uuid import UUID

# Patient
class PatientBase(BaseModel):
    phone_number: str
    full_name: str
    date_of_birth: Optional[date] = None
    email: Optional[str] = None
    notes: Optional[str] = None

class PatientCreate(PatientBase):
    pass

class PatientUpdate(BaseModel):
    phone_number: Optional[str] = None
    full_name: Optional[str] = None
    date_of_birth: Optional[date] = None
    email: Optional[str] = None
    notes: Optional[str] = None

class Patient(PatientBase):
    id: UUID
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)

# Doctor
class DoctorBase(BaseModel):
    full_name: str
    specialty: str
    phone_extension: Optional[str] = None
    email: Optional[str] = None
    bio: Optional[str] = None
    is_active: bool = True

class DoctorCreate(DoctorBase):
    pass

class DoctorUpdate(BaseModel):
    full_name: Optional[str] = None
    specialty: Optional[str] = None
    phone_extension: Optional[str] = None
    email: Optional[str] = None
    bio: Optional[str] = None
    is_active: Optional[bool] = None

class Doctor(DoctorBase):
    id: UUID
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

# Appointment
class AppointmentBase(BaseModel):
    patient_id: UUID
    doctor_id: UUID
    scheduled_at: datetime
    duration_minutes: int = 30
    status: str = 'confirmed'
    appointment_type: Optional[str] = None
    notes: Optional[str] = None

class AppointmentCreate(AppointmentBase):
    pass

class AppointmentUpdate(BaseModel):
    scheduled_at: Optional[datetime] = None
    duration_minutes: Optional[int] = None
    status: Optional[str] = None
    appointment_type: Optional[str] = None
    notes: Optional[str] = None
    late_cancel: Optional[bool] = None

class Appointment(AppointmentBase):
    id: UUID
    call_log_id: Optional[UUID] = None
    rescheduled_from_id: Optional[UUID] = None
    cancellation_timestamp: Optional[datetime] = None
    late_cancel: bool
    reminder_sent: bool
    reminder_confirmed: Optional[bool] = None
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)

# CallLog
class CallLogBase(BaseModel):
    call_session_id: str
    call_sid: Optional[str] = None
    patient_id: Optional[UUID] = None
    started_at: Optional[datetime] = None
    ended_at: Optional[datetime] = None
    duration_seconds: Optional[int] = None
    audio_recording_url: Optional[str] = None
    transcript_json: Optional[Dict[str, Any]] = None
    tts_text_log: Optional[Dict[str, Any]] = None
    transcript_reliability_flag: Optional[str] = None
    tool_calls_log: Optional[Dict[str, Any]] = None
    prompt_versions: Optional[Dict[str, Any]] = None
    agents_invoked: Optional[List[str]] = None
    intent_sequence: Optional[List[str]] = None
    escalation_reason: Optional[str] = None
    notes: Optional[str] = None

class CallLog(CallLogBase):
    id: UUID
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

# KnowledgeBaseDocument
class KnowledgeBaseDocumentBase(BaseModel):
    title: str
    content: str
    category: str
    is_active: bool = True
    embedding_id: Optional[str] = None

class KnowledgeBaseDocumentCreate(KnowledgeBaseDocumentBase):
    pass

class KnowledgeBaseDocumentUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    category: Optional[str] = None
    is_active: Optional[bool] = None
    embedding_id: Optional[str] = None

class KnowledgeBaseDocument(KnowledgeBaseDocumentBase):
    id: UUID
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)

# Notification
class NotificationBase(BaseModel):
    patient_id: UUID
    appointment_id: Optional[UUID] = None
    call_log_id: Optional[UUID] = None
    notification_type: str
    channel: str = 'sms'
    recipient_phone: str
    message_body: str
    twilio_sid: Optional[str] = None
    status: str = 'pending'

class Notification(NotificationBase):
    id: UUID
    sent_at: Optional[datetime] = None
    delivered_at: Optional[datetime] = None
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

# PromptVersion
class PromptVersionBase(BaseModel):
    prompt_id: str
    agent_id: str
    version: int
    content: str
    author: Optional[str] = None
    change_notes: Optional[str] = None
    test_coverage: Optional[str] = None
    is_active: bool = False

class PromptVersionCreate(PromptVersionBase):
    pass

class PromptVersion(PromptVersionBase):
    id: UUID
    activated_at: Optional[datetime] = None
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)
