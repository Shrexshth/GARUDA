import base64
from fastapi import APIRouter, UploadFile, File, HTTPException
from backend.core.graph import app as workflow_app
from backend.core.state import GraphState

router = APIRouter()

@router.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    """
    Accepts an uploaded image, converts it to base64, and triggers the Scan/Vision workflow
    to extract tabular data using the local vision model.
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Only image uploads are supported for now.")
        
    try:
        contents = await file.read()
        image_b64 = base64.b64encode(contents).decode("utf-8")
        
        prompt = """
        Analyze this engineering document. Extract any tabular data or equipment schedules.
        Return the result STRICTLY as a JSON array where each object has these keys:
        tag, type, description, flowRate, suctionPress, dischargePress, status, confidence (0.0 to 1.0).
        Output ONLY the raw JSON array wrapped in ```json ... ``` tags.
        """
        
        initial_state: GraphState = {
            "messages": [{"role": "user", "content": prompt, "image": image_b64}],
            "active_agent": "scan",
            "extracted_data": None,
            "generated_file_path": None,
            "error_count": 0,
            "task_type": "",
            "tool_results": []
        }
        
        # Execute the LangGraph workflow
        result_state = workflow_app.invoke(initial_state)
        
        extracted = result_state.get("extracted_data")
        if not extracted:
            # Fallback if the vision model failed to produce clean JSON
            extracted = []
            
        return {
            "success": True,
            "data": extracted,
            "raw_response": result_state["messages"][-1]["content"] if result_state["messages"] else ""
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
