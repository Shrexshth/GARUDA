from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel
from backend.core.state import GraphState
from backend.api.tasks import run_agent_task

router = APIRouter()

class CodeRequest(BaseModel):
    prompt: str

@router.post("/execute")
async def execute_code_agent(request: CodeRequest, background_tasks: BackgroundTasks):
    """
    Triggers the Reasoning agent to write python code based on a prompt,
    then executes the Code Sandbox tool to run it securely in the background.
    """
    try:
        sys_prompt = f"""
        You are the Code & Calculation Agent. 
        Write Python 3.11 code to solve the following problem. 
        Do not use external libraries other than math, json, datetime unless explicitly requested.
        Output ONLY the raw code wrapped in ```python ... ``` tags. Do not explain the code.
        
        Problem:
        {request.prompt}
        """
        
        initial_state: GraphState = {
            "messages": [{"role": "user", "content": sys_prompt}],
            "active_agent": "code",
            "extracted_data": None,
            "generated_file_path": None,
            "error_count": 0,
            "task_type": "",
            "tool_results": []
        }
        
        task_id = run_agent_task(background_tasks, "code", initial_state)
        
        return {
            "success": True,
            "task_id": task_id,
            "status": "running"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
