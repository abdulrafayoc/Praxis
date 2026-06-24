import chromadb
from chromadb.config import Settings
import os

CHROMA_DB_PATH = os.getenv("CHROMA_DB_PATH", "./chroma_db")

def get_chroma_client():
    """Initialize and return a ChromaDB client."""
    client = chromadb.PersistentClient(path=CHROMA_DB_PATH)
    return client

def get_or_create_collection(collection_name: str, embedding_function=None):
    """Get or create a ChromaDB collection."""
    client = get_chroma_client()
    if embedding_function:
        return client.get_or_create_collection(
            name=collection_name, 
            embedding_function=embedding_function
        )
    return client.get_or_create_collection(name=collection_name)
