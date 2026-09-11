from fastapi import APIRouter, HTTPException, BackgroundTasks
from fastapi.responses import PlainTextResponse
from pydantic import BaseModel
from backend.tools.rag_engine import rag_engine
from backend.api.tasks import register_task, finish_task
import os
import glob

router = APIRouter()

class SearchRequest(BaseModel):
    query: str

# Replaced background task with real graph execution

@router.post("/search")
async def search_knowledge_base(request: SearchRequest, background_tasks: BackgroundTasks):
    """
    Queries the local ChromaDB for relevant semantic chunks in the background.
    """
    try:
        from backend.core.state import GraphState
        from backend.api.tasks import run_agent_task
        
        initial_state: GraphState = {
            "messages": [{"role": "user", "content": request.query}],
            "active_agent": "knowledge-base",
            "extracted_data": None,
            "generated_file_path": None,
            "error_count": 0,
            "task_type": "",
            "tool_results": []
        }
        
        task_id = run_agent_task(background_tasks, "knowledge-base", initial_state)
        
        return {
            "success": True,
            "task_id": task_id,
            "status": "running"
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
