import os
import chromadb
from backend.core.config import settings

class RAGEngine:
    def __init__(self):
        # Initialize ChromaDB in embedded/PersistentClient mode
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        chroma_data_dir = os.path.join(base_dir, "rag", "chroma_data")
        
        self.client = chromadb.PersistentClient(path=chroma_data_dir)
        self.collection_name = "gaurda_knowledge"
        
        # Use embedding model from config
        self.embedding_model = settings.routes.embeddings
        
        try:
            self.collection = self.client.get_or_create_collection(name=self.collection_name)
        except Exception as e:
            print(f"Error initializing ChromaDB collection: {e}")
            self.collection = None

    def search_manuals(self, query: str, top_k: int = 3) -> dict:
        """
        Searches the local knowledge base for relevant chunks.
        Returns a structured dictionary to avoid unhandled exceptions.
        """
        if not self.collection:
            return {"success": False, "results": [], "error": "ChromaDB collection not initialized."}
            
        try:
            # We don't have a robust embedding function wired directly to Ollama yet,
            # so for demonstration, ChromaDB's default embedding function will be used
            # if we pass raw texts. In production, we'd query Ollama's embed endpoint first.
            results = self.collection.query(
                query_texts=[query],
                n_results=top_k
            )
            
            structured_results = []
            if results and 'documents' in results and results['documents'] and results['documents'][0]:
                for idx, doc in enumerate(results['documents'][0]):
                    metadata = results['metadatas'][0][idx] if results['metadatas'] and results['metadatas'][0] else {}
                    distance = results['distances'][0][idx] if results['distances'] and results['distances'][0] else 0.0
                    
                    # Convert distance to a crude relevance score (0.0 to 1.0)
                    relevance = max(0.0, 1.0 - distance)
                    
                    structured_results.append({
                        "id": results['ids'][0][idx],
                        "snippet": doc,
                        "title": metadata.get("title", f"Result {idx+1}"),
                        "source": metadata.get("source", "Unknown Source"),
                        "relevance": relevance,
                        "tags": [metadata.get("type", "manual")]
                    })
                    
            return {"success": True, "results": structured_results, "error": None}
            
        except Exception as e:
            return {"success": False, "results": [], "error": str(e)}

rag_engine = RAGEngine()
