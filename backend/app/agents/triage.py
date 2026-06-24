from langchain_openai import ChatOpenAI
from app.agents.state import PraxisSessionState
from app.agents.context_assembly import assemble_context
from app.redis_client import get_active_prompt_version

async def triage_node(state: PraxisSessionState) -> PraxisSessionState:
    llm = ChatOpenAI(model="gpt-4o", temperature=0.1)
    prompt_text = await get_active_prompt_version("triage") or "You are the triage agent."
    
    messages = assemble_context(state, prompt_text)
    response = await llm.ainvoke(messages)
    
    state["response_text"] = response.content
    state["next_node"] = "end"
    
    return state
