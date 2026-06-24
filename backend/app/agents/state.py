from typing import TypedDict, Optional, List, Dict, Any
from dataclasses import dataclass

@dataclass
class PatientContext:
    patient_id: str
    full_name: str
    phone_number: str
    upcoming_appointments: List[Dict]

class PraxisSessionState(TypedDict, total=False):
    call_session_id: str
    patient: Optional[dict]
    recent_turns: List[dict]
    assembled_context: List[dict]
    conversation_summary: str
    next_node: str
    current_utterance: str
    response_text: str
    intent_sequence: List[str]
    rag_context: Optional[str]
    is_tool_call_turn: bool
    turn_count: int
