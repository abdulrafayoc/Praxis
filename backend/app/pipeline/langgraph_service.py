import json
from app.agents.graph import praxis_graph
from app.redis_client import get_session, save_session

class LangGraphLLMService:
    def __init__(self, call_session_id: str, call_sid: str):
        self.call_session_id = call_session_id
        self.call_sid = call_sid

    async def process_turn(self, utterance: str):
        state = await get_session(self.call_session_id)
        if not state:
            state = {
                "call_session_id": self.call_session_id,
                "recent_turns": [],
                "intent_sequence": [],
                "turn_count": 0
            }
            
        state["current_utterance"] = utterance
        state["turn_count"] = state.get("turn_count", 0) + 1
        
        # Add user utterance to history
        state["recent_turns"].append({"role": "user", "content": utterance})
        
        # Invoke LangGraph
        result_state = await praxis_graph.ainvoke(state)
        
        # Add agent response to history
        if "response_text" in result_state and result_state["response_text"]:
            result_state["recent_turns"].append({
                "role": "agent", 
                "content": result_state["response_text"],
                "agent": result_state.get("next_node", "unknown")
            })
            
        # Clean up transient state
        result_state.pop("current_utterance", None)
        
        await save_session(self.call_session_id, result_state)
        
        return result_state.get("response_text", "")
