from fastapi import APIRouter, HTTPException
from fastapi.responses import PlainTextResponse
from pydantic import BaseModel
from backend.tools.rag_engine import rag_engine
import os
import glob

router = APIRouter()

class SearchRequest(BaseModel):
    query: str

@router.post("/search")
async def search_knowledge_base(request: SearchRequest):
    """
    Queries the local ChromaDB for relevant semantic chunks.
    """
    try:
        result = rag_engine.search_manuals(request.query)
        if not result["success"]:
            raise HTTPException(status_code=500, detail=result["error"])
            
        return {
            "success": True,
            "results": result["results"]
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/corpora")
async def list_corpora():
    """Returns a list of all indexed manuals."""
    try:
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        manuals_dir = os.path.join(base_dir, "demo-data", "manuals")
        files = glob.glob(os.path.join(manuals_dir, "*.txt"))
        
        corpora = []
        for f in files:
            name = os.path.basename(f)
            corpora.append({
                "name": name,
                "documentCount": 1,
                "lastUpdated": "Today"
            })
        return {"success": True, "corpora": corpora}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/corpus/{filename}")
async def get_corpus(filename: str):
    """Returns the raw text content of a manual."""
    try:
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        file_path = os.path.join(base_dir, "demo-data", "manuals", filename)
        if not os.path.exists(file_path):
            raise HTTPException(status_code=404, detail="File not found")
            
        with open(file_path, "r") as f:
            content = f.read()
        return PlainTextResponse(content)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
