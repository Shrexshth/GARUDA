from fastapi import APIRouter, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse
from pydantic import BaseModel
import os
from backend.core.state import GraphState
from backend.api.tasks import run_agent_task

router = APIRouter()

class DraftRequest(BaseModel):
    summary: str

@router.post("/draft")
async def create_draft(request: DraftRequest, background_tasks: BackgroundTasks):
    """
    Triggers the Reasoning agent to prepare content for the document,
    then executes the Document Tool to generate the actual docx file in the background.
    """
    try:
        prompt = f"""
        You are an expert Document Agent generating a formal Note for Approval (NFA) memo based on a summary.
        CRITICAL INSTRUCTION: Your output MUST contain ONLY the final text of the memo. 
        Do NOT include any conversational filler (e.g. "Here is the memo").
        Do NOT repeat these instructions.
        Do NOT use any markdown code blocks or <thought> tags.
        Just output the raw text of the formal memo.

        Summary to expand:
        {request.summary}
        """
        
        initial_state: GraphState = {
            "messages": [{"role": "user", "content": prompt}],
            "active_agent": "document",
            "extracted_data": None,
            "generated_file_path": None,
            "error_count": 0,
            "task_type": "",
            "tool_results": []
        }
        
        task_id = run_agent_task(background_tasks, "document", initial_state)
        
        return {
            "success": True,
            "task_id": task_id,
            "status": "running"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/download")
async def download_document(filename: str):
    """
    Downloads a generated document by filename.
    """
    try:
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        file_path = os.path.join(base_dir, "data", "outputs", filename)
        
        if not os.path.exists(file_path):
            raise HTTPException(status_code=404, detail="File not found")
            
        return FileResponse(path=file_path, filename=filename, media_type='application/vnd.openxmlformats-officedocument.wordprocessingml.document')
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
