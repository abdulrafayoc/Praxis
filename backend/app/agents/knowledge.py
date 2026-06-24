from langchain_openai import ChatOpenAI
from app.agents.state import PraxisSessionState
from app.agents.context_assembly import assemble_context
from app.redis_client import get_active_prompt_version

async def knowledge_node(state: PraxisSessionState) -> PraxisSessionState:
    llm = ChatOpenAI(model="gpt-4o", temperature=0.1)
    prompt_text = await get_active_prompt_version("knowledge") or "You are the knowledge agent."
    
    # In full implementation, RAG retrieval would happen here and populate state["rag_context"]
    rag_data = state.get("rag_context", "")
    
    messages = assemble_context(state, prompt_text, rag_results=rag_data)
    response = await llm.ainvoke(messages)
    
    state["response_text"] = response.content
    state["next_node"] = "end"
    
    return state
