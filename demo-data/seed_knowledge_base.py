#!/usr/bin/env python3
"""
GAURDA Knowledge Base Ingestion Engine v2.0
=============================================
Ingests ALL data sources into ChromaDB for the RAG pipeline:
  - Plain text manuals (demo-data/manuals/*.txt)
  - PDF Annual Reports (demo-data/01_Annual_Reports/*.pdf)
  - PDF Inspection Reports (demo-data/06_Inspection_Reports/*.pdf)

Usage:
    source venv/bin/activate
    python demo-data/seed_knowledge_base.py
"""
import os
import sys
import glob
import time
import chromadb

# ── Setup Paths ──────────────────────────────────────────────────────────────
base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
chroma_data_dir = os.path.join(base_dir, "rag", "chroma_data")
manuals_dir = os.path.join(base_dir, "demo-data", "manuals")
annual_reports_dir = os.path.join(base_dir, "demo-data", "01_Annual_Reports")
inspection_reports_dir = os.path.join(base_dir, "demo-data", "06_Inspection_Reports")

os.makedirs(chroma_data_dir, exist_ok=True)

client = chromadb.PersistentClient(path=chroma_data_dir)
collection = client.get_or_create_collection(name="gaurda_knowledge")

total_ingested = 0
start_time = time.time()


# ── Helper: Intelligent Text Chunking ────────────────────────────────────────
def chunk_text(text: str, chunk_size: int = 1000, overlap: int = 200) -> list[str]:
    """
    Split text into overlapping chunks for dense retrieval.
    Uses RecursiveCharacterTextSplitter logic: try splitting on paragraphs first,
    then sentences, then words, then characters.
    """
    if not text or len(text.strip()) < 50:
        return []
    
    chunks = []
    # Split on double newlines (paragraphs) first
    paragraphs = text.split("\n\n")
    
    current_chunk = ""
    for para in paragraphs:
        para = para.strip()
        if not para:
            continue
        
        if len(current_chunk) + len(para) + 2 <= chunk_size:
            current_chunk = current_chunk + "\n\n" + para if current_chunk else para
        else:
            if current_chunk and len(current_chunk.strip()) > 50:
                chunks.append(current_chunk.strip())
            # Start new chunk with overlap from previous
            if current_chunk and overlap > 0:
                overlap_text = current_chunk[-overlap:]
                current_chunk = overlap_text + "\n\n" + para
            else:
                current_chunk = para
    
    # Don't forget the last chunk
    if current_chunk and len(current_chunk.strip()) > 50:
        chunks.append(current_chunk.strip())
    
    # If we got no chunks from paragraph splitting (e.g. one giant block), 
    # fall back to character-level chunking
    if not chunks and len(text.strip()) > 50:
        for i in range(0, len(text), chunk_size - overlap):
            chunk = text[i:i + chunk_size].strip()
            if len(chunk) > 50:
                chunks.append(chunk)
    
    return chunks


# ── Helper: Extract Text from PDF ────────────────────────────────────────────
def extract_pdf_text(pdf_path: str) -> str:
    """Extract all text from a PDF using PyMuPDF."""
    try:
        import fitz  # PyMuPDF
        doc = fitz.open(pdf_path)
        full_text = ""
        for page_num in range(len(doc)):
            page = doc[page_num]
            page_text = page.get_text("text")
            if page_text.strip():
                full_text += f"\n\n--- Page {page_num + 1} ---\n\n{page_text}"
        doc.close()
        return full_text
    except Exception as e:
        print(f"  ⚠️  Failed to extract text from {os.path.basename(pdf_path)}: {e}")
        return ""


# ── Helper: Ingest a Single File ─────────────────────────────────────────────
def ingest_file(filepath: str, doc_type: str, title: str = None):
    """Read a file, chunk it, and upsert all chunks into ChromaDB."""
    global total_ingested
    
    filename = os.path.basename(filepath)
    if not title:
        title = filename.replace("_", " ").rsplit(".", 1)[0]
    
    # Extract text based on file type
    ext = filepath.rsplit(".", 1)[-1].lower()
    if ext == "pdf":
        full_text = extract_pdf_text(filepath)
    elif ext == "txt":
        with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
            full_text = f.read()
    else:
        print(f"  ⏭️  Skipping unsupported file: {filename}")
        return 0
    
    if not full_text or len(full_text.strip()) < 50:
        print(f"  ⚠️  No usable text extracted from: {filename}")
        return 0
    
    # Chunk the text
    chunks = chunk_text(full_text, chunk_size=1000, overlap=200)
    
    if not chunks:
        print(f"  ⚠️  No valid chunks from: {filename}")
        return 0
    
    # Batch upsert into ChromaDB (batch of 50 for speed)
    batch_size = 50
    for batch_start in range(0, len(chunks), batch_size):
        batch_end = min(batch_start + batch_size, len(chunks))
        batch_chunks = chunks[batch_start:batch_end]
        
        ids = [f"{filename}_chunk_{batch_start + i}" for i in range(len(batch_chunks))]
        metadatas = [{
            "source": filename,
            "title": title,
            "type": doc_type,
            "chunk_index": batch_start + i
        } for i in range(len(batch_chunks))]
        
        collection.upsert(
            documents=batch_chunks,
            metadatas=metadatas,
            ids=ids
        )
    
    total_ingested += len(chunks)
    return len(chunks)


# ══════════════════════════════════════════════════════════════════════════════
# PHASE 1: Ingest Plain Text Manuals
# ══════════════════════════════════════════════════════════════════════════════
print("=" * 60)
print("📘 PHASE 1: Ingesting Text Manuals")
print("=" * 60)

manual_files = sorted(glob.glob(os.path.join(manuals_dir, "*.txt")))
if manual_files:
    for filepath in manual_files:
        count = ingest_file(filepath, doc_type="manual")
        print(f"  ✅ {os.path.basename(filepath)}: {count} chunks")
else:
    print("  ⏭️  No .txt manuals found, skipping.")


# ══════════════════════════════════════════════════════════════════════════════
# PHASE 2: Ingest PDF Annual Reports
# ══════════════════════════════════════════════════════════════════════════════
print("\n" + "=" * 60)
print("📊 PHASE 2: Ingesting MRPL Annual Reports (PDFs)")
print("=" * 60)

annual_reports = sorted(glob.glob(os.path.join(annual_reports_dir, "*.pdf")))
if annual_reports:
    for filepath in annual_reports:
        filename = os.path.basename(filepath)
        # Extract a clean title from filename
        title = filename.replace("mrpl_", "MRPL ").replace("_", " ").replace(".pdf", "").title()
        count = ingest_file(filepath, doc_type="annual_report", title=title)
        print(f"  ✅ {filename}: {count} chunks")
else:
    print("  ⏭️  No Annual Report PDFs found, skipping.")


# ══════════════════════════════════════════════════════════════════════════════
# PHASE 3: Ingest PDF Inspection Reports
# ══════════════════════════════════════════════════════════════════════════════
print("\n" + "=" * 60)
print("🔍 PHASE 3: Ingesting Inspection Reports (PDFs)")
print("=" * 60)

inspection_reports = sorted(glob.glob(os.path.join(inspection_reports_dir, "*.pdf")))
if inspection_reports:
    for filepath in inspection_reports:
        filename = os.path.basename(filepath)
        title = filename.replace("_", " ").replace(".pdf", "").title()
        count = ingest_file(filepath, doc_type="inspection_report", title=title)
        print(f"  ✅ {filename}: {count} chunks")
else:
    print("  ⏭️  No Inspection Report PDFs found, skipping.")


# ══════════════════════════════════════════════════════════════════════════════
# SUMMARY
# ══════════════════════════════════════════════════════════════════════════════
elapsed = time.time() - start_time
print("\n" + "=" * 60)
print(f"🎉 INGESTION COMPLETE")
print(f"   Total chunks embedded: {total_ingested}")
print(f"   ChromaDB collection '{collection.name}' total docs: {collection.count()}")
print(f"   Time elapsed: {elapsed:.1f}s")
print("=" * 60)
