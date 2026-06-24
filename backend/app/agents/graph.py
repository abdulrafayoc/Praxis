from langgraph.graph import StateGraph, END
from app.agents.state import PraxisSessionState
from app.agents.orchestrator import orchestrator_node
from app.agents.booking import booking_node
from app.agents.knowledge import knowledge_node
from app.agents.triage import triage_node
from app.agents.escalation import escalation_node

def route_next(state: PraxisSessionState):
    return state.get("next_node", END)

workflow = StateGraph(PraxisSessionState)

workflow.add_node("orchestrator", orchestrator_node)
workflow.add_node("booking", booking_node)
workflow.add_node("knowledge", knowledge_node)
workflow.add_node("triage", triage_node)
workflow.add_node("escalation", escalation_node)

workflow.set_entry_point("orchestrator")

workflow.add_conditional_edges(
    "orchestrator",
    route_next,
    {
        "booking": "booking",
        "knowledge": "knowledge",
        "triage": "triage",
        "escalation": "escalation",
        "orchestrator": "orchestrator",
        "end": END
    }
)

workflow.add_edge("booking", END)
workflow.add_edge("knowledge", END)
workflow.add_edge("triage", END)
workflow.add_edge("escalation", END)

praxis_graph = workflow.compile()
