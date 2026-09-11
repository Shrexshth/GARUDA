import os
import json
import requests
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from backend.core.config import settings

router = APIRouter()

class RouteRequest(BaseModel):
    query: str

class PlanRequest(BaseModel):
    goal: str

class WorkflowStep(BaseModel):
    step: int
    agent: str
    action: str

class ExecuteRequest(BaseModel):
    plan: list[WorkflowStep]
    initial_request: str

def _call_ollama_json(prompt: str) -> dict:
    url = f"{settings.routes.ollama_base_url}/api/generate"
    payload = {
        "model": "qwen2.5:7b",
        "prompt": prompt,
        "stream": False,
        "format": "json"
    }
    try:
        response = requests.post(url, json=payload, timeout=120)
        response.raise_for_status()
        text_resp = response.json().get("response", "{}")
        return json.loads(text_resp)
    except Exception as e:
        print(f"Ollama JSON Error: {e}")
        return {}

@router.post("/route")
async def route_query(req: RouteRequest):
    """
    Given a user's natural language query, route to the correct agent.
    Options: 'scan', 'document', 'code', 'knowledge_base', 'reasoning'
    """
    prompt = f"""
    You are an intelligent router for an industrial AI workbench (GAURDA).
    Categorize the following user query into one of these agents:
    - "scan": extracting data from images, PDFs, P&IDs, schematics.
    - "document": drafting memos, NFAs (Notes for Approval), formal documents.
    - "code": math calculations, python scripts, flow rate, pressure formulas.
    - "knowledge_base": searching OISD manuals, standards, SOPs.
    - "reasoning": general technical questions, explanations, troubleshooting.

    User Query: "{req.query}"

    Respond ONLY with a valid JSON object containing a single key "agent" and the chosen string value.
    Example: {{"agent": "code"}}
    """
    result = _call_ollama_json(prompt)
    agent = result.get("agent", "reasoning")
    
    # Validation fallback
    if agent not in ["scan", "document", "code", "knowledge_base", "reasoning"]:
        agent = "reasoning"
        
    return {"success": True, "agent": agent}

@router.post("/plan")
async def plan_workflow(req: PlanRequest):
    prompt = f"""
    You are an intelligent workflow planner for GAURDA. Break down the user's goal into an ordered sequence of agent steps.
    Available agents: 'scan', 'document', 'code', 'knowledge_base', 'reasoning', 'approval'.
    
    Goal: "{req.goal}"
    
    Respond ONLY with a valid JSON array of objects. 
    Each object must have exactly these keys: "step" (int), "agent" (string), "action" (string).
    Example: [{{"step": 1, "agent": "scan", "action": "Extract items from P&ID"}}, {{"step": 2, "agent": "document", "action": "Draft NFA"}}]
    """
    plan = _call_ollama_json(prompt)
    if not isinstance(plan, list):
        plan = [{"step": 1, "agent": "reasoning", "action": req.goal}]
    
    return {"success": True, "plan": plan}

@router.post("/execute")
async def execute_workflow(req: ExecuteRequest):
    from backend.api.tasks import register_task
    from backend.api.tasks import execute_workflow_task
    from fastapi import BackgroundTasks
    
    # We can't use dependency injection in a simple functional call here easily, 
    # but we can start the background task manually or import the background tasks instance.
    # To keep it clean, we'll just use a fire-and-forget asyncio task since this is a demo.
    import asyncio
    
    task_id = register_task("workflow")
    
    plan_dicts = [{"step": s.step, "agent": s.agent, "action": s.action} for s in req.plan]
    
    asyncio.create_task(execute_workflow_task(task_id, req.initial_request, plan_dicts))
    
    return {"success": True, "task_id": task_id}
