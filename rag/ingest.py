import os
import chromadb

# Set up local persistent client
base_dir = os.path.dirname(os.path.abspath(__file__))
chroma_data_dir = os.path.join(base_dir, "chroma_data")

client = chromadb.PersistentClient(path=chroma_data_dir)

# Create collection
collection = client.get_or_create_collection(name="gaurda_knowledge")

# Ingest one minimal sample document text
sample_doc = "GAURDA is a sovereign AI workbench designed for MRPL, ensuring complete data privacy on a single machine."

collection.upsert(
    documents=[sample_doc],
    metadatas=[{"source": "system_init", "type": "overview"}],
    ids=["doc1"]
)

print(f"✅ Successfully ingested sample document into ChromaDB at {chroma_data_dir}")
