import os
import sqlite3
import datetime
import json
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Optional
from backend.core.graph import app as workflow_app
from backend.core.state import GraphState

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
    
@router.post("/chat")
async def chat(request: ChatRequest):
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
        
        # Execute workflow
        result_state = workflow_app.invoke(initial_state)
        
        response_msg = result_state["messages"][-1]
        
        # Save to SQLite
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        now = datetime.datetime.utcnow().isoformat()
        
        # Check if session exists, if not create it
        cursor.execute("SELECT id FROM chat_sessions WHERE id = ?", (request.session_id,))
        if not cursor.fetchone():
            # Use the first user message as the title
            title = request.messages[0].content[:50] + "..." if request.messages else "New Chat"
            cursor.execute(
                "INSERT INTO chat_sessions (id, title, subtitle, timestamp, tags) VALUES (?, ?, ?, ?, ?)",
                (request.session_id, title, "Reasoning Agent", now, '["Technical"]')
            )
            
        # Insert user messages and assistant response
        for msg in request.messages:
            cursor.execute(
                "INSERT INTO chat_messages (session_id, role, content, timestamp) VALUES (?, ?, ?, ?)",
                (request.session_id, msg.role, msg.content, now)
            )
        
        cursor.execute(
            "INSERT INTO chat_messages (session_id, role, content, timestamp) VALUES (?, ?, ?, ?)",
            (request.session_id, response_msg["role"], response_msg["content"], now)
        )
        
        conn.commit()
        conn.close()
        
        return {
            "success": True,
            "message": response_msg
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
