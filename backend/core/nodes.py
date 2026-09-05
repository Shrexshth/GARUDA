import json
import requests
from backend.core.state import GraphState
from backend.core.config import settings

def _call_ollama(model: str, prompt: str, image_base64: str = None) -> str:
    url = f"{settings.routes.ollama_base_url}/api/generate"
    payload = {
        "model": model,
        "prompt": prompt,
        "stream": False
    }
    if image_base64:
        payload["images"] = [image_base64]
        
    try:
        response = requests.post(url, json=payload, timeout=120)
        response.raise_for_status()
        return response.json().get("response", "")
    except Exception as e:
        return f"Error communicating with local Ollama: {str(e)}"

def router_node(state: GraphState) -> GraphState:
    """
    Analyzes the incoming request and determines the task_type.
    For simplicity, if active_agent is set, it routes accordingly.
    """
    task_map = {
        "scan": "vision_task",
        "document": "reasoning_task",
        "code": "reasoning_task",
        "reasoning": "reasoning_task",
    }
    state["task_type"] = task_map.get(state.get("active_agent", ""), "reasoning_task")
    return state

def vision_node(state: GraphState) -> GraphState:
    """
    Calls the local vision model via Ollama.
    """
    model = settings.routes.vision_task
    # Assuming the last message contains the prompt and optionally an image
    last_message = state["messages"][-1]
    prompt = last_message.get("content", "Analyze this image.")
    image = last_message.get("image", None)
    
    response = _call_ollama(model=model, prompt=prompt, image_base64=image)
    
    state["messages"].append({"role": "assistant", "content": response})
    # Attempt to extract JSON from vision output if needed
    try:
        # Very crude JSON extraction for demonstration
        import re
        json_match = re.search(r'```json\n(.*?)\n```', response, re.DOTALL)
        if json_match:
            state["extracted_data"] = json.loads(json_match.group(1))
    except:
        pass
        
    return state

def reasoning_node(state: GraphState) -> GraphState:
    """
    Calls the local reasoning model via Ollama.
    """
    model = settings.routes.reasoning_task
    prompt = "\n".join([f"{m['role']}: {m['content']}" for m in state["messages"]])
    
    response = _call_ollama(model=model, prompt=prompt)
    
    state["messages"].append({"role": "assistant", "content": response})
    return state

def tool_node(state: GraphState) -> GraphState:
    """
    Executes local Python tools based on active_agent.
    """
    # For now, if active_agent is code, run sandbox.
    if state.get("active_agent") == "code":
        from backend.tools.sandbox import execute_python_code
        # Extract python code block from last assistant message
        last_message = state["messages"][-1]["content"]
        import re
        code_match = re.search(r'```python\n(.*?)\n```', last_message, re.DOTALL)
        if code_match:
            code = code_match.group(1)
            result = execute_python_code(code)
            if "tool_results" not in state:
                state["tool_results"] = []
            state["tool_results"].append(result)
            if not result["success"]:
                state["error_count"] += 1
                
    elif state.get("active_agent") == "document":
        from backend.tools.document_exporter import generate_nfa_docx
        # Generate docx from last message content
        payload = {"summary": state["messages"][-1]["content"][:100], "status": "Draft"}
        filepath = generate_nfa_docx(payload)
        state["generated_file_path"] = filepath
        
    return state
