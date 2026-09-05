from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from backend.core.graph import app as workflow_app
from backend.core.state import GraphState

router = APIRouter()

class CodeRequest(BaseModel):
    prompt: str

@router.post("/execute")
async def execute_code_agent(request: CodeRequest):
    """
    Triggers the Reasoning agent to write python code based on a prompt,
    then executes the Code Sandbox tool to run it securely.
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
        
        result_state = workflow_app.invoke(initial_state)
        
        # Extract the last tool result
        tool_results = result_state.get("tool_results", [])
        last_result = tool_results[-1] if tool_results else None
        
        return {
            "success": True,
            "tool_result": last_result,
            "messages": result_state["messages"]
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
