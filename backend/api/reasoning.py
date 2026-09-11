import os
import sqlite3
import datetime
import json
from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import List, Dict, Optional
from backend.core.graph import app as workflow_app
from backend.core.state import GraphState
from backend.api.tasks import register_task, finish_task

router = APIRouter()

# Setup SQLite for basic chat history
base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
db_dir = os.path.join(base_dir, "data")
os.makedirs(db_dir, exist_ok=True)
db_path = os.path.join(db_dir, "gaurda.db")

def init_chat_db():
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
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
        CREATE TABLE IF NOT EXISTS chat_messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id TEXT,
            role TEXT,
            content TEXT,
            timestamp TEXT
        )
    """)
    conn.commit()
    conn.close()

init_chat_db()

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    session_id: str
    messages: List[ChatMessage]
    
def chat_background_task(task_id: str, session_id: str, request_messages: List[ChatMessage], initial_state: GraphState):
    try:
        # Execute workflow
        result_state = workflow_app.invoke(initial_state)
        response_msg = result_state["messages"][-1]
        
        # Save to SQLite
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        now = datetime.datetime.utcnow().isoformat()
        
        # Check if session exists, if not create it
        cursor.execute("SELECT id FROM chat_sessions WHERE id = ?", (session_id,))
        if not cursor.fetchone():
            # Use the first user message as the title
            title = request_messages[0].content[:50] + "..." if request_messages else "New Chat"
            cursor.execute(
                "INSERT INTO chat_sessions (id, title, subtitle, timestamp, tags) VALUES (?, ?, ?, ?, ?)",
                (session_id, title, "Reasoning Agent", now, '["Technical"]')
            )
            
        # Insert user messages
        for msg in request_messages:
            cursor.execute(
                "INSERT INTO chat_messages (session_id, role, content, timestamp) VALUES (?, ?, ?, ?)",
                (session_id, msg.role, msg.content, now)
            )
        
        # Insert assistant response
        cursor.execute(
            "INSERT INTO chat_messages (session_id, role, content, timestamp) VALUES (?, ?, ?, ?)",
            (session_id, response_msg["role"], response_msg["content"], now)
        )
        
        conn.commit()
        conn.close()
        
        # Finish the global task
        finish_task(task_id, "completed", {"message": response_msg})
    except Exception as e:
        finish_task(task_id, "failed", {"error": str(e)})

@router.post("/chat")
async def chat(request: ChatRequest, background_tasks: BackgroundTasks):
    """
    General chat endpoint utilizing the Reasoning Agent.
    """
    try:
        # Convert pydantic models to dicts for LangGraph state
        messages_dict = [{"role": msg.role, "content": msg.content} for msg in request.messages]
        
        initial_state: GraphState = {
            "messages": messages_dict,
            "active_agent": "reasoning",
            "extracted_data": None,
            "generated_file_path": None,
            "error_count": 0,
            "task_type": "",
            "tool_results": []
        }
        
        task_id = register_task("reasoning")
        background_tasks.add_task(chat_background_task, task_id, request.session_id, request.messages, initial_state)
        
        return {
            "success": True,
            "task_id": task_id,
            "status": "running"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/history")
async def get_history():
    """Returns a list of all past chat sessions."""
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        cursor.execute("SELECT id, title, subtitle, timestamp, tags FROM chat_sessions ORDER BY timestamp DESC")
        rows = cursor.fetchall()
        conn.close()
        
        history = []
        for row in rows:
            history.append({
                "id": row[0],
                "title": row[1],
                "subtitle": row[2],
                "timestamp": row[3],
                "tags": json.loads(row[4]) if row[4] else []
            })
            
        return {"success": True, "history": history}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/history/{session_id}")
async def get_session_history(session_id: str):
    """Returns messages for a specific session."""
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        cursor.execute("SELECT role, content, timestamp FROM chat_messages WHERE session_id = ? ORDER BY id ASC", (session_id,))
        rows = cursor.fetchall()
        conn.close()
        
        messages = []
        for i, row in enumerate(rows):
            messages.append({
                "id": f"{session_id}-{i}",
                "role": row[0],
                "content": row[1],
                "timestamp": row[2]
            })
            
        return {"success": True, "messages": messages}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
