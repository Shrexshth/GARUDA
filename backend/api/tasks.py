import os
import sqlite3
import datetime
import json
import uuid
from fastapi import APIRouter, HTTPException, BackgroundTasks
from typing import Optional

router = APIRouter()

base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
db_dir = os.path.join(base_dir, "data")
os.makedirs(db_dir, exist_ok=True)
db_path = os.path.join(db_dir, "gaurda.db")

def init_db():
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS background_tasks (
            id TEXT PRIMARY KEY,
            agent TEXT,
            status TEXT,
            result_json TEXT,
            created_at TEXT,
            updated_at TEXT
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS chat_sessions (
            id TEXT PRIMARY KEY,
            title TEXT,
            subtitle TEXT,
            timestamp TEXT,
            tags TEXT
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS task_events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            task_id TEXT,
            event_text TEXT,
            event_type TEXT,
            timestamp TEXT
        )
    """)
    conn.commit()
    conn.close()

init_db()

def register_task(agent: str) -> str:
    task_id = str(uuid.uuid4())
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    now = datetime.datetime.utcnow().isoformat()
    cursor.execute(
        "INSERT INTO background_tasks (id, agent, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
        (task_id, agent, "running", now, now)
    )
    conn.commit()
    conn.close()
    return task_id

def finish_task(task_id: str, status: str, result: dict):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    now = datetime.datetime.utcnow().isoformat()
    cursor.execute(
        "UPDATE background_tasks SET status = ?, result_json = ?, updated_at = ? WHERE id = ?",
        (status, json.dumps(result), now, task_id)
    )
    conn.commit()
    conn.close()

def log_task_event(task_id: str, event_text: str, event_type: str = "info"):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    now = datetime.datetime.utcnow().isoformat()
    cursor.execute(
        "INSERT INTO task_events (task_id, event_text, event_type, timestamp) VALUES (?, ?, ?, ?)",
        (task_id, event_text, event_type, now)
    )
    conn.commit()
    conn.close()

def format_node_event(node_name: str, state_update: dict) -> list[str]:
    events = []
    if node_name == "router":
        events.append("[Router] Analyzing request and routing task...")
    elif node_name == "retrieval_node":
        ctx = state_update.get("retrieved_context", [])
        events.append(f"[Tool] Searching knowledge base...")
        events.append(f"[Tool] Found {len(ctx)} relevant documents.")
    elif node_name == "reasoning_node":
        events.append("[Model] Synthesizing response based on context...")
        meta = state_update.get("model_metadata")
        if meta and meta.get("model"):
            dur_ms = meta.get("total_duration", 0) / 1_000_000
            tok = meta.get("eval_count", 0)
            events.append(f"[Metadata] model={meta['model']} latency={dur_ms:.0f}ms tokens={tok}")
    elif node_name == "vision_node":
        events.append("[Model] Analyzing image with vision model...")
        meta = state_update.get("model_metadata")
        if meta and meta.get("model"):
            dur_ms = meta.get("total_duration", 0) / 1_000_000
            tok = meta.get("eval_count", 0)
            events.append(f"[Metadata] model={meta['model']} latency={dur_ms:.0f}ms tokens={tok}")
    elif node_name == "tool_node":
        agent = state_update.get("active_agent", "")
        if agent == "code":
            events.append("[Tool] Executing Python sandbox...")
        elif agent == "document":
            events.append("[Tool] Generating .docx approval note...")
        else:
            events.append("[Tool] Executing tool...")
    return events

def execute_graph_task(task_id: str, initial_state: dict, session_id: str = None):
    from backend.core.graph import app as workflow_app
    try:
        log_task_event(task_id, "[System] Initializing agent orchestrator...")
        
        current_state = initial_state
        for output in workflow_app.stream(initial_state):
            # stream() yields dicts mapping node_name -> state_update
            for node_name, state_update in output.items():
                # Merge state to keep track
                current_state = {**current_state, **state_update}
                msgs = format_node_event(node_name, state_update)
                for msg in msgs:
                    log_task_event(task_id, msg)
                    
        finish_task(task_id, "completed", current_state)
        log_task_event(task_id, "[System] Task completed successfully.", "done")
        
        # Log session for UI
        agent = initial_state.get("active_agent", "unknown").capitalize()
        messages = initial_state.get("messages", [])
        title = "New Task"
        if messages and len(messages) > 0:
            title = messages[0].get("content", "")[:50] + "..."
            
        sid = session_id or task_id
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        now = datetime.datetime.utcnow().isoformat()
        
        cursor.execute("SELECT id FROM chat_sessions WHERE id = ?", (sid,))
        if not cursor.fetchone():
            cursor.execute(
                "INSERT INTO chat_sessions (id, title, subtitle, timestamp, tags) VALUES (?, ?, ?, ?, ?)",
                (sid, title, f"{agent} Agent", now, json.dumps([agent]))
            )
        conn.commit()
        conn.close()
        
    except Exception as e:
        finish_task(task_id, "failed", {"error": str(e)})
        log_task_event(task_id, f"[Error] {str(e)}", "error")

async def execute_workflow_task(task_id: str, initial_request: str, plan: list[dict]):
    from backend.core.graph import app as workflow_app
    try:
        log_task_event(task_id, "[System] Initializing Multi-Agent Orchestrator...")
        
        # Log the session
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        now = datetime.datetime.utcnow().isoformat()
        cursor.execute(
            "INSERT INTO chat_sessions (id, title, subtitle, timestamp, tags) VALUES (?, ?, ?, ?, ?)",
            (task_id, initial_request[:50] + "...", "Multi-Agent Workflow", now, json.dumps(["workflow"]))
        )
        conn.commit()
        conn.close()

        current_state = {
            "messages": [{"role": "user", "content": initial_request}],
            "active_agent": "reasoning"
        }
        
        for step in plan:
            agent = step.get("agent", "reasoning")
            action = step.get("action", "")
            step_num = step.get("step", 1)
            
            log_task_event(task_id, f"--- Starting Step {step_num}: {agent.upper()} AGENT ---")
            log_task_event(task_id, f"[System] Executing goal: {action}")
            
            # Prepare state for this step
            current_state["active_agent"] = agent
            current_state["messages"].append({"role": "user", "content": f"Workflow step {step_num} instruction: {action}"})
            
            for output in workflow_app.stream(current_state):
                for node_name, state_update in output.items():
                    current_state = {**current_state, **state_update}
                    msgs = format_node_event(node_name, state_update)
                    for msg in msgs:
                        log_task_event(task_id, msg)
                        
            log_task_event(task_id, f"--- Completed Step {step_num} ---")
            
        finish_task(task_id, "completed", current_state)
        log_task_event(task_id, "[System] Entire workflow completed successfully.", "done")
        
    except Exception as e:
        finish_task(task_id, "failed", {"error": str(e)})
        log_task_event(task_id, f"[Error] Workflow failed: {str(e)}", "error")

def run_agent_task(background_tasks: BackgroundTasks, agent: str, initial_state: dict, session_id: str = None) -> str:
    task_id = register_task(agent)
    background_tasks.add_task(execute_graph_task, task_id, initial_state, session_id)
    return task_id

@router.get("/{task_id}")
async def get_task(task_id: str):
    """
    Returns the status and result of a specific background task.
    """
    try:
        conn = sqlite3.connect(db_path)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM background_tasks WHERE id = ?", (task_id,))
        row = cursor.fetchone()
        conn.close()
        
        if not row:
            raise HTTPException(status_code=404, detail="Task not found")
            
        task_data = dict(row)
        if task_data["result_json"]:
            task_data["result"] = json.loads(task_data["result_json"])
        else:
            task_data["result"] = None
            
        return {"success": True, "task": task_data}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

import asyncio
from fastapi.responses import StreamingResponse

@router.get("/{task_id}/stream")
async def stream_task_events(task_id: str):
    """
    Streams Server-Sent Events (SSE) for a specific task.
    Polls the task_events table and yields new events.
    """
    async def event_generator():
        last_id = 0
        try:
            while True:
                # Check task status to know when to stop
                conn = sqlite3.connect(db_path)
                conn.row_factory = sqlite3.Row
                cursor = conn.cursor()
                cursor.execute("SELECT status FROM background_tasks WHERE id = ?", (task_id,))
                task_row = cursor.fetchone()
                
                # Fetch new events
                cursor.execute("SELECT id, event_text, event_type FROM task_events WHERE task_id = ? AND id > ? ORDER BY id ASC", (task_id, last_id))
                events = cursor.fetchall()
                conn.close()
                
                for ev in events:
                    last_id = ev["id"]
                    data = json.dumps({"text": ev["event_text"], "type": ev["event_type"]})
                    yield f"data: {data}\n\n"
                    
                if task_row:
                    status = task_row["status"]
                    if status in ["completed", "failed"]:
                        # We yielded all events, and task is done. Stop streaming.
                        break
                        
                await asyncio.sleep(0.5)
        except Exception as e:
            yield f"data: {json.dumps({'text': f'[Error] Stream failed: {str(e)}', 'type': 'error'})}\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")

@router.get("/active/all")
async def get_active_tasks():
    """
    Returns all currently running background tasks.
    """
    try:
        conn = sqlite3.connect(db_path)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute("SELECT id, agent, status, created_at, updated_at FROM background_tasks WHERE status IN ('pending', 'running') ORDER BY created_at DESC")
        rows = cursor.fetchall()
        conn.close()
        
        tasks = [dict(row) for row in rows]
        return {"success": True, "tasks": tasks}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
