import os
import chromadb

# Connect to local persistent client
base_dir = os.path.dirname(os.path.abspath(__file__))
chroma_data_dir = os.path.join(base_dir, "chroma_data")

client = chromadb.PersistentClient(path=chroma_data_dir)
collection = client.get_collection(name="gaurda_knowledge")

# Query for the sample document
query_text = "What is GAURDA?"
results = collection.query(
    query_texts=[query_text],
    n_results=1
)

print(f"🔍 Query: '{query_text}'")
print(f"📄 Retrieved Document: {results['documents'][0][0]}")
