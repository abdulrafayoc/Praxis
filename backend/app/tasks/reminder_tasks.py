from app.tasks.celery_app import celery_app
from app.tools.notification_tools import send_sms
import logging

logger = logging.getLogger(__name__)

@celery_app.task
def send_appointment_reminder(to_number: str, patient_name: str, appointment_time: str):
    """Celery task to send an appointment reminder SMS."""
    message = f"Hi {patient_name}, this is a reminder for your upcoming appointment at {appointment_time}. Please reply YES to confirm or NO to cancel."
    try:
        result = send_sms(to_number, message)
        logger.info(f"Reminder sent to {to_number}: {result}")
        return result
    except Exception as e:
        logger.error(f"Failed to send reminder to {to_number}: {e}")
        raise
