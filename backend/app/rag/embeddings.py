import os
from chromadb.utils import embedding_functions

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

def get_openai_embedding_function():
    """Return an OpenAI embedding function for ChromaDB."""
    if not OPENAI_API_KEY:
        raise ValueError("OPENAI_API_KEY environment variable is not set.")
    
    return embedding_functions.OpenAIEmbeddingFunction(
        api_key=OPENAI_API_KEY,
        model_name="text-embedding-3-small"
    )
