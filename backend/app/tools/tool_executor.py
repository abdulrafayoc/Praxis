import json
from app.tools.appointment_tools import check_availability, book_appointment
from app.tools.patient_tools import lookup_patient
from app.tools.notification_tools import send_sms

AVAILABLE_TOOLS = {
    "check_availability": check_availability,
    "book_appointment": book_appointment,
    "lookup_patient": lookup_patient,
    "send_sms": send_sms
}

def execute_tool(tool_name: str, arguments: dict) -> str:
    """Execute a tool by name with the given arguments."""
    if tool_name not in AVAILABLE_TOOLS:
        return f"Error: Tool '{tool_name}' not found."
    
    try:
        tool_func = AVAILABLE_TOOLS[tool_name]
        return tool_func(**arguments)
    except Exception as e:
        return f"Error executing {tool_name}: {str(e)}"
