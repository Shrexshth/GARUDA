#!/usr/bin/env python3
"""
Ingest all demo manuals into ChromaDB for the Knowledge Base Agent.
Run this once before a demo rehearsal:
    source venv/bin/activate
    python demo-data/seed_knowledge_base.py
"""
import os
import sys
import glob
import chromadb

# Setup paths
base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
chroma_data_dir = os.path.join(base_dir, "rag", "chroma_data")
manuals_dir = os.path.join(base_dir, "demo-data", "manuals")

client = chromadb.PersistentClient(path=chroma_data_dir)
collection = client.get_or_create_collection(name="gaurda_knowledge")

# Find all .txt files in manuals dir
manual_files = sorted(glob.glob(os.path.join(manuals_dir, "*.txt")))
if not manual_files:
    print("❌ No manual files found in demo-data/manuals/")
    sys.exit(1)

ingested_count = 0
for filepath in manual_files:
    filename = os.path.basename(filepath)
    with open(filepath, "r") as f:
        full_text = f.read()
    
    # Chunk by paragraphs (split on double newlines) for better retrieval
    paragraphs = [p.strip() for p in full_text.split("\n\n") if p.strip() and len(p.strip()) > 30]
    
    for idx, chunk in enumerate(paragraphs):
        doc_id = f"{filename}_chunk_{idx}"
        collection.upsert(
            documents=[chunk],
            metadatas=[{
                "source": filename,
                "title": filename.replace("_", " ").replace(".txt", ""),
                "type": "manual",
                "chunk_index": idx
            }],
            ids=[doc_id]
        )
        ingested_count += 1

print(f"✅ Ingested {ingested_count} chunks from {len(manual_files)} files into ChromaDB")
print(f"   Collection '{collection.name}' now has {collection.count()} total documents")
