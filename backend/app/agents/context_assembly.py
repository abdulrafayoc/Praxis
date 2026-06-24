from typing import List, Dict
from app.agents.state import PraxisSessionState
import tiktoken
from app.config import settings

def get_tokenizer():
    return tiktoken.get_encoding("cl100k_base")

def truncate_history(history: List[Dict], max_tokens: int) -> List[Dict]:
    tokenizer = get_tokenizer()
    truncated = []
    current_tokens = 0
    for turn in reversed(history):
        turn_text = turn.get("content", "")
        tokens = len(tokenizer.encode(turn_text))
        if current_tokens + tokens > max_tokens:
            break
        truncated.insert(0, turn)
        current_tokens += tokens
    return truncated

def assemble_context(state: PraxisSessionState, system_prompt: str, rag_results: str = None) -> List[Dict]:
    messages = [{"role": "system", "content": system_prompt}]
    
    if state.get("patient"):
        patient_context = f"[PATIENT_CONTEXT]\nName: {state['patient']['full_name']}\nID: {state['patient']['id']}"
        messages.append({"role": "system", "content": patient_context})
        
    if state.get("conversation_summary"):
        summary_context = f"[TURN_HISTORY]\n{state['conversation_summary']}"
        messages.append({"role": "system", "content": summary_context})
        
    if rag_results:
        rag_context = f"[CLINIC_KNOWLEDGE]\n{rag_results}"
        messages.append({"role": "system", "content": rag_context})
        
    history = state.get("recent_turns", [])
    safe_history = truncate_history(history, settings.context_max_tokens)
    messages.extend(safe_history)
    
    if state.get("current_utterance"):
        messages.append({"role": "user", "content": state["current_utterance"]})
        
    return messages
