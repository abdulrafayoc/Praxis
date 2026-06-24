import uuid
from datetime import datetime
from typing import Optional
from sqlalchemy import String, Text, Boolean, Integer, DateTime, Date, Time, ForeignKey, UniqueConstraint, ARRAY
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func
from app.db.base import Base

class Patient(Base):
    __tablename__ = 'patients'
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    phone_number: Mapped[str] = mapped_column(String(20), unique=True, nullable=False)
    full_name: Mapped[str] = mapped_column(String(200), nullable=False)
    date_of_birth: Mapped[Optional[datetime]] = mapped_column(Date, nullable=True)
    email: Mapped[Optional[str]] = mapped_column(String(254), nullable=True)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    appointments: Mapped[list['Appointment']] = relationship(back_populates='patient')
    call_logs: Mapped[list['CallLog']] = relationship(back_populates='patient')
    notifications: Mapped[list['Notification']] = relationship(back_populates='patient')

class Doctor(Base):
    __tablename__ = 'doctors'
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    full_name: Mapped[str] = mapped_column(String(200), nullable=False)
    specialty: Mapped[str] = mapped_column(String(100), nullable=False)
    phone_extension: Mapped[Optional[str]] = mapped_column(String(10), nullable=True)
    email: Mapped[Optional[str]] = mapped_column(String(254), nullable=True)
    bio: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    availability: Mapped[list['DoctorAvailability']] = relationship(back_populates='doctor')
    appointments: Mapped[list['Appointment']] = relationship(back_populates='doctor')

class DoctorAvailability(Base):
    __tablename__ = 'doctor_availability'
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    doctor_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('doctors.id'), nullable=False)
    day_of_week: Mapped[int] = mapped_column(Integer, nullable=False)
    start_time: Mapped[datetime] = mapped_column(Time, nullable=False)
    end_time: Mapped[datetime] = mapped_column(Time, nullable=False)
    slot_duration_minutes: Mapped[int] = mapped_column(Integer, default=30)
    doctor: Mapped['Doctor'] = relationship(back_populates='availability')

class Appointment(Base):
    __tablename__ = 'appointments'
    __table_args__ = (UniqueConstraint('doctor_id', 'scheduled_at', name='uq_appointments_doctor_slot'),)
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    patient_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('patients.id'), nullable=False)
    doctor_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('doctors.id'), nullable=False)
    scheduled_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    duration_minutes: Mapped[int] = mapped_column(Integer, default=30)
    status: Mapped[str] = mapped_column(String(20), default='confirmed')
    appointment_type: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    call_log_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey('call_logs.id'), nullable=True)
    rescheduled_from_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey('appointments.id'), nullable=True)
    cancellation_timestamp: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    late_cancel: Mapped[bool] = mapped_column(Boolean, default=False)
    reminder_sent: Mapped[bool] = mapped_column(Boolean, default=False)
    reminder_confirmed: Mapped[Optional[bool]] = mapped_column(Boolean, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    patient: Mapped['Patient'] = relationship(back_populates='appointments')
    doctor: Mapped['Doctor'] = relationship(back_populates='appointments')

class CallLog(Base):
    __tablename__ = 'call_logs'
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    call_session_id: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    call_sid: Mapped[Optional[str]] = mapped_column(String(100), unique=True, nullable=True)
    patient_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey('patients.id'), nullable=True)
    started_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    ended_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    duration_seconds: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    audio_recording_url: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    transcript_json: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)
    tts_text_log: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)
    transcript_reliability_flag: Mapped[Optional[str]] = mapped_column(String(10), nullable=True)
    tool_calls_log: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)
    prompt_versions: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)
    agents_invoked: Mapped[Optional[list]] = mapped_column(ARRAY(String), nullable=True)
    intent_sequence: Mapped[Optional[list]] = mapped_column(ARRAY(String), nullable=True)
    escalation_reason: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    patient: Mapped[Optional['Patient']] = relationship(back_populates='call_logs')
    appointments: Mapped[list['Appointment']] = relationship()
    notifications: Mapped[list['Notification']] = relationship(back_populates='call_log')

class Notification(Base):
    __tablename__ = 'notifications'
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    patient_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('patients.id'), nullable=False)
    appointment_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey('appointments.id'), nullable=True)
    call_log_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey('call_logs.id'), nullable=True)
    notification_type: Mapped[str] = mapped_column(String(50), nullable=False)
    channel: Mapped[str] = mapped_column(String(10), default='sms')
    recipient_phone: Mapped[str] = mapped_column(String(20), nullable=False)
    message_body: Mapped[str] = mapped_column(Text, nullable=False)
    twilio_sid: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    status: Mapped[str] = mapped_column(String(20), default='pending')
    sent_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    delivered_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    patient: Mapped['Patient'] = relationship(back_populates='notifications')
    call_log: Mapped[Optional['CallLog']] = relationship(back_populates='notifications')

class KnowledgeBaseDocument(Base):
    __tablename__ = 'knowledge_base_documents'
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title: Mapped[str] = mapped_column(String(300), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    category: Mapped[str] = mapped_column(String(100), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    embedding_id: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

class PromptVersion(Base):
    __tablename__ = 'prompt_versions'
    __table_args__ = (UniqueConstraint('prompt_id', 'version', name='uq_prompt_versions_prompt_version'),)
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    prompt_id: Mapped[str] = mapped_column(String(50), nullable=False)
    agent_id: Mapped[str] = mapped_column(String(50), nullable=False)
    version: Mapped[int] = mapped_column(Integer, nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    author: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    change_notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    test_coverage: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=False)
    activated_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
