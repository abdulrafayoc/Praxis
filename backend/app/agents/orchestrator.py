import json
from langchain_openai import ChatOpenAI
from app.agents.state import PraxisSessionState
from app.agents.context_assembly import assemble_context
from app.redis_client import get_active_prompt_version

async def orchestrator_node(state: PraxisSessionState) -> PraxisSessionState:
    llm = ChatOpenAI(model="gpt-4o", temperature=0.0)
    prompt_text = await get_active_prompt_version("orchestrator") or "You are the orchestrator. Route the call."
    
    messages = assemble_context(state, prompt_text)
    
    response = await llm.ainvoke(messages)
    
    try:
        # Expected output is JSON
        result = json.loads(response.content)
        intent = result.get("intent", "OUT_OF_SCOPE")
        confidence = result.get("confidence", 0.0)
        
        # Route logic based on prompt rules
        if intent == "ESCALATE":
            next_node = "escalation"
        elif intent == "TRIAGE":
            next_node = "triage"
        elif intent == "BOOK" or intent == "CANCEL" or intent == "RESCHEDULE":
            next_node = "booking"
        elif intent == "FAQ":
            next_node = "knowledge"
        else:
            if confidence < 0.8:
                next_node = "orchestrator"
                state["response_text"] = result.get("clarifying_question", "Could you clarify that?")
            else:
                next_node = "escalation"
                
        if intent not in state.get("intent_sequence", []):
            seq = state.get("intent_sequence", [])
            seq.append(intent)
            state["intent_sequence"] = seq
            
    except Exception:
        next_node = "escalation"
        state["response_text"] = "I'm having trouble understanding. Let me connect you to a staff member."
        
    state["next_node"] = next_node
    return state
