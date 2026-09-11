import os
import sys

# Add backend to path so we can import rag_engine
base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(base_dir)

from tools.rag_engine import rag_engine
import uuid

def ingest_baseline():
    file_path = os.path.join(base_dir, "demo-data", "manuals", "mrpl_gaurda_overview.txt")
    if not os.path.exists(file_path):
        print(f"File not found: {file_path}")
        return
        
    with open(file_path, "r") as f:
        content = f.read()
        
    # Split by double newline for simple paragraphs
    paragraphs = [p.strip() for p in content.split("\n\n") if p.strip()]
    
    if not rag_engine.collection:
        print("ChromaDB collection not initialized.")
        return
        
    ids = [str(uuid.uuid4()) for _ in paragraphs]
    metadatas = [{"title": "MRPL & GAURDA Overview", "source": "mrpl_gaurda_overview.txt", "type": "manual"} for _ in paragraphs]
    
    rag_engine.collection.add(
        documents=paragraphs,
        metadatas=metadatas,
        ids=ids
    )
    
    print(f"Successfully ingested {len(paragraphs)} paragraphs from mrpl_gaurda_overview.txt into ChromaDB.")

if __name__ == "__main__":
    ingest_baseline()
