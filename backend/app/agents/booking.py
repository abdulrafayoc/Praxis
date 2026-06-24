from langchain_openai import ChatOpenAI
from app.agents.state import PraxisSessionState
from app.agents.context_assembly import assemble_context
from app.redis_client import get_active_prompt_version

async def booking_node(state: PraxisSessionState) -> PraxisSessionState:
    llm = ChatOpenAI(model="gpt-4o", temperature=0.2)
    prompt_text = await get_active_prompt_version("booking") or "You are the booking agent."
    
    messages = assemble_context(state, prompt_text)
    
    # In a real implementation, tools would be bound here
    # llm_with_tools = llm.bind_tools(booking_tools)
    # response = await llm_with_tools.ainvoke(messages)
    
    response = await llm.ainvoke(messages)
    
    state["response_text"] = response.content
    state["next_node"] = "end"
    
    return state
