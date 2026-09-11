import json
import requests
from backend.core.state import GraphState
from backend.core.config import settings
from backend.tools.rag_engine import rag_engine

def _call_ollama(model: str, prompt: str, image_base64: str = None) -> dict:
    url = f"{settings.routes.ollama_base_url}/api/generate"
    payload = {
        "model": model,
        "prompt": prompt,
        "stream": False
    }
    if image_base64:
        payload["images"] = [image_base64]
        
    try:
        # Increased timeout to 600 seconds (10 mins) for massive PDFs
        response = requests.post(url, json=payload, timeout=600)
        response.raise_for_status()
        data = response.json()
        return {
            "response": data.get("response", ""),
            "metadata": {
                "model": model,
                "total_duration": data.get("total_duration", 0),
                "eval_count": data.get("eval_count", 0)
            }
        }
    except Exception as e:
        return {"response": f"Error communicating with local Ollama: {str(e)}", "metadata": {}}

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
    Extracts both a clean text description and structured JSON data.
    """
    last_message = state["messages"][-1]
    
    # If this is a PDF, it has no image_b64 but has pdf_text. We should route to the reasoning text model.
    # If it is an image, it has image_b64 and no pdf_text. We route to the vision model.
    is_pdf = last_message.get("pdf_text") is not None
    model = settings.routes.reasoning_task if is_pdf else settings.routes.vision_task
    
    prompt = (
        "Analyze this document carefully. Do two things:\n\n"
        "1. Write a clean, professional summary of everything visible in this document under the heading '## Document Analysis'. "
        "Describe any text, labels, equipment tags, tables, diagrams, flow lines, or annotations you see.\n\n"
        "2. Extract the primary tabular data you see into a structured JSON array. "
        "CRITICAL: You must INFER the column headers based on what you see in the table. "
        "Use these inferred column headers as the keys for each JSON object (format keys as camelCase). "
        "Always include a 'confidence' key (0.0 to 1.0) for each row. "
        "Wrap the JSON in ```json\n...\n``` tags. If no structured data is found, return ```json\n[]\n```.\n\n"
        f"User Instruction: {last_message.get('content', 'Extract data')}"
    )
    image = last_message.get("image", None)
    
    result = _call_ollama(model=model, prompt=prompt, image_base64=image)
    response = result["response"]
    
    state["messages"].append({"role": "assistant", "content": response})
    state["model_metadata"] = result.get("metadata", {})
    
    # Extract clean description (everything before the JSON block)
    import re
    clean_description = response
    json_block_match = re.search(r'```json\s*\n', response)
    if json_block_match:
        clean_description = response[:json_block_match.start()].strip()
    
    # Store the clean description in messages for the UI
    if clean_description:
        state["messages"].append({"role": "system", "content": clean_description, "type": "clean_description"})
    
    # Extract structured JSON data
    try:
        json_match = re.search(r'```json\n(.*?)\n```', response, re.DOTALL)
        if json_match:
            parsed = json.loads(json_match.group(1))
            state["extracted_data"] = parsed if isinstance(parsed, list) else [parsed]
        else:
            # Fallback: look for raw JSON array brackets
            start = response.find('[')
            end = response.rfind(']')
            if start != -1 and end != -1:
                parsed = json.loads(response[start:end+1])
                state["extracted_data"] = parsed if isinstance(parsed, list) else [parsed]
            else:
                # No structured data found
                state["extracted_data"] = []
    except Exception as e:
        # If parsing fails entirely, return the raw text as a single row
        state["extracted_data"] = [{
            "tag": "RAW_TEXT",
            "type": "Unstructured",
            "description": response.strip()[:500],
            "flowRate": "-",
            "suctionPress": "-",
            "dischargePress": "-",
            "status": "Vision model output (unstructured)",
            "confidence": 0.0
        }]
        
    return state


def retrieval_node(state: GraphState) -> GraphState:
    """
    Performs RAG retrieval before reasoning.
    """
    last_message = state["messages"][-1]
    query = last_message.get("content", "")
    
    result = rag_engine.search_manuals(query)
    
    if result.get("success") and result.get("results"):
        state["retrieved_context"] = result["results"]
    else:
        state["retrieved_context"] = []
        
    return state

def reasoning_node(state: GraphState) -> GraphState:
    """
    Calls the local reasoning model via Ollama, using retrieved context and a strict system prompt.
    """
    model = settings.routes.reasoning_task
    
    active_agent = state.get("active_agent", "reasoning")
    
    if active_agent == "code":
        system_prompt = (
            "You are GAURDA's Engineering Calculation Agent. "
            "You MUST first output a step-by-step mathematical plan or reasoning explaining how you will solve the problem. "
            "THEN, output the executable python code inside a ```python\n...\n``` block to perform the calculation."
        )
    elif active_agent == "document":
        system_prompt = (
            "You are GAURDA's Document Drafting Agent. "
            "Draft a professional, highly detailed Note for Approval (NFA) or technical document based on the user's request. "
            "Format the output entirely in clean Markdown."
        )
    else:
        system_prompt = (
            "You are GAURDA (Industrial AI Workbench), an on-premise AI assistant for MRPL (Mangalore Refinery and Petrochemicals Limited). "
            "You are designed to assist with engineering, document synthesis, and operational reasoning based ONLY on the provided context.\n"
            "CRITICAL INSTRUCTIONS:\n"
            "1. Synthesize a comprehensive, natural language response based on the retrieved context.\n"
            "2. If the retrieved context does not contain the answer, or if no context is provided, you MUST reply EXACTLY with: 'I do not have that information in my knowledge base.'\n"
            "3. Do NOT hallucinate, guess, or use external knowledge to answer factual questions about MRPL, GAURDA, or refinery operations.\n"
        )
    
    context_text = ""
    if state.get("retrieved_context"):
        snippets = [c.get("snippet", "") if isinstance(c, dict) else str(c) for c in state["retrieved_context"]]
        context_text = "RETRIEVED CONTEXT:\n" + "\n---\n".join(snippets) + "\n\n"
    else:
        context_text = "RETRIEVED CONTEXT: None. Do not answer factual queries.\n\n"
        
    # Construct prompt with System Prompt + Context + Conversation History
    prompt_parts = [system_prompt, context_text]
    for m in state["messages"]:
        prompt_parts.append(f"{m['role'].upper()}: {m['content']}")
        
    prompt = "\n".join(prompt_parts)
    
    result = _call_ollama(model=model, prompt=prompt)
    response = result["response"]
    
    state["messages"].append({"role": "assistant", "content": response})
    state["model_metadata"] = result.get("metadata", {})
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
        import sqlite3
        import uuid
        import os
        from datetime import datetime
        
        # Generate docx from last message content
        summary_text = state["messages"][-1]["content"]
        payload = {"summary": summary_text, "status": "Draft"}
        filepath = generate_nfa_docx(payload)
        state["generated_file_path"] = filepath
        
        # Insert into approval tasks
        try:
            base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            db_path = os.path.join(base_dir, "data", "gaurda.db")
            conn = sqlite3.connect(db_path)
            cursor = conn.cursor()
            task_id = str(uuid.uuid4())
            now = datetime.utcnow().isoformat()
            cursor.execute(
                "INSERT INTO tasks (id, title, description, status, assignee, priority, created_at, due_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                (task_id, f"Review NFA", f"Please review the generated NFA document draft.", "Pending", "Plant Manager", "High", now, now)
            )
            conn.commit()
            conn.close()
        except Exception as e:
            print(f"Error creating approval task: {e}")
        
    return state
