import base64
import os
import uuid
from fastapi import APIRouter, UploadFile, File, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse
from backend.core.state import GraphState
from backend.api.tasks import run_agent_task

router = APIRouter()

# Directory to store uploaded scans so the frontend can display them
UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/upload")
async def upload_document(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    """
    Accepts an uploaded image or PDF, converts it to base64,
    saves the original file for UI display, and triggers the
    Scan/Vision workflow to extract tabular data using the local vision model.
    """
    allowed_types = ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/tiff", "image/bmp", "application/pdf"]
    
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail=f"Unsupported file type: {file.content_type}. Supported: images (PNG, JPEG, WEBP, TIFF, BMP) and PDF.")
    
    try:
        contents = await file.read()
        
        pdf_text = None
        # If PDF, extract full text and also generate a cover image for the UI
        if file.content_type == "application/pdf":
            image_b64, saved_filename, pdf_text = _handle_pdf(contents, file.filename)
        else:
            image_b64 = base64.b64encode(contents).decode("utf-8")
            # Save original image to disk for the UI to display
            ext = file.filename.rsplit(".", 1)[-1] if "." in file.filename else "png"
            saved_filename = f"{uuid.uuid4().hex}.{ext}"
            with open(os.path.join(UPLOAD_DIR, saved_filename), "wb") as f:
                f.write(contents)

        if pdf_text:
            prompt = f"""
            Analyze this multi-page document carefully. Do TWO things:
            
            1. FIRST, write a clean, readable plain-text summary of the ENTIRE document. 
               Format this as a neat, professional summary under the heading "## Document Analysis".
            
            2. THEN, extract the primary tabular data you see into a structured JSON array.
               CRITICAL: You must INFER the column headers based on what you see in the text. 
               Use these inferred column headers as the keys for each JSON object (format keys as camelCase).
               Always include a "confidence" key (0.0 to 1.0) for each row.
               Output the JSON array wrapped in ```json ... ``` tags.
            
            If you cannot find structured tabular data, still provide the Document Analysis description 
            and return an empty JSON array: ```json [] ```
            
            DOCUMENT TEXT:
            {pdf_text}
            """
        else:
            prompt = """
            Analyze this engineering document image carefully. Do TWO things:
            
            1. FIRST, write a clean, readable plain-text description of everything you can see in the document. 
               Describe the layout, any text, labels, equipment tags, tables, diagrams, or annotations. 
               Format this as a neat, professional summary under the heading "## Document Analysis".
            
            2. THEN, extract the primary tabular data you see into a structured JSON array.
               CRITICAL: You must INFER the column headers based on what you see in the table. 
               Use these inferred column headers as the keys for each JSON object (format keys as camelCase).
               For example, if you see a financial table, use keys like "year", "revenue", "profit". 
               If you see an inspection sheet, use keys like "component", "defectType", "status".
               Always include a "confidence" key (0.0 to 1.0) for each row.
               Output the JSON array wrapped in ```json ... ``` tags.
            
            If you cannot find structured tabular data, still provide the Document Analysis description 
            and return an empty JSON array: ```json [] ```
            """

        initial_state: GraphState = {
            "messages": [{"role": "user", "content": prompt, "image": image_b64 if not pdf_text else None, "pdf_text": pdf_text}],
            "active_agent": "scan",
            "extracted_data": None,
            "generated_file_path": saved_filename,  # Store filename so frontend can fetch it
            "error_count": 0,
            "task_type": "",
            "tool_results": [],
            "model_metadata": {},
            "retrieved_context": []
        }

        task_id = run_agent_task(background_tasks, "scan", initial_state)

        return {
            "success": True,
            "task_id": task_id,
            "status": "running",
            "uploaded_file": saved_filename
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/uploads/{filename}")
async def serve_uploaded_file(filename: str):
    """Serves an uploaded scan file so the frontend can display it."""
    filepath = os.path.join(UPLOAD_DIR, filename)
    if not os.path.exists(filepath):
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(filepath)


def _handle_pdf(pdf_bytes: bytes, original_filename: str) -> tuple[str, str, str]:
    """
    Extracts the full text from the PDF using PyMuPDF and also converts the 
    first page to a PNG thumbnail for the UI to display in the Compare View.
    Returns: (thumbnail_base64, saved_filename, full_extracted_text)
    """
    saved_filename = f"{uuid.uuid4().hex}.pdf"
    pdf_path = os.path.join(UPLOAD_DIR, saved_filename)
    with open(pdf_path, "wb") as f:
        f.write(pdf_bytes)
    
    full_text = ""
    thumbnail_b64 = None
    
    try:
        import fitz  # PyMuPDF
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        
        # Extract text from all pages
        for page_num in range(len(doc)):
            page = doc[page_num]
            page_text = page.get_text("text")
            if page_text.strip():
                full_text += f"\n\n--- Page {page_num + 1} ---\n\n{page_text}"
        
        # Generate thumbnail from page 1
        if len(doc) > 0:
            page = doc[0]
            mat = fitz.Matrix(2, 2)
            pix = page.get_pixmap(matrix=mat)
            img_bytes = pix.tobytes("png")
            thumbnail_b64 = base64.b64encode(img_bytes).decode("utf-8")
            
            # Save the rendered PNG for UI display
            png_filename = saved_filename.replace(".pdf", ".png")
            with open(os.path.join(UPLOAD_DIR, png_filename), "wb") as f:
                f.write(img_bytes)
            # Override saved_filename so UI loads the PNG instead of raw PDF
            saved_filename = png_filename
            
        doc.close()
        
    except ImportError:
        pass
    except Exception as e:
        print(f"Error extracting PDF: {e}")
    
    # Fallback if fitz fails
    if not thumbnail_b64:
        thumbnail_b64 = base64.b64encode(pdf_bytes).decode("utf-8")
        
    return thumbnail_b64, saved_filename, full_text
