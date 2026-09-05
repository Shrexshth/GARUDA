import os
import sqlite3
import datetime
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

# Resolve path relative to this file
base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
db_dir = os.path.join(base_dir, "data")
os.makedirs(db_dir, exist_ok=True)
db_path = os.path.join(db_dir, "gaurda.db")

def init_db():
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS tasks (
            id TEXT PRIMARY KEY,
            title TEXT,
            description TEXT,
            status TEXT,
            assignee TEXT,
            priority TEXT,
            created_at TEXT,
            due_date TEXT
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS audit_trail (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            task_id TEXT,
            action TEXT,
            actor TEXT,
            timestamp TEXT
        )
    """)
    conn.commit()
    conn.close()

init_db()

class TaskUpdate(BaseModel):
    task_id: str
    new_status: str
    actor: str = "System"

@router.get("/tasks")
async def get_tasks():
    """
    Retrieves all tasks for the approval workflow pipeline.
    """
    try:
        conn = sqlite3.connect(db_path)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM tasks ORDER BY created_at DESC")
        rows = cursor.fetchall()
        conn.close()
        
        tasks = [dict(row) for row in rows]
        return {"success": True, "tasks": tasks}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/update")
async def update_task_status(request: TaskUpdate):
    """
    Updates a task's state and appends to the immutable audit trail.
    """
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Verify task exists
        cursor.execute("SELECT status FROM tasks WHERE id = ?", (request.task_id,))
        row = cursor.fetchone()
        if not row:
            conn.close()
            raise HTTPException(status_code=404, detail="Task not found")
            
        old_status = row[0]
        
        # Update status
        cursor.execute("UPDATE tasks SET status = ? WHERE id = ?", (request.new_status, request.task_id))
        
        # Append to audit trail
        now = datetime.datetime.utcnow().isoformat()
        cursor.execute(
            "INSERT INTO audit_trail (task_id, action, actor, timestamp) VALUES (?, ?, ?, ?)",
            (request.task_id, f"Status changed from {old_status} to {request.new_status}", request.actor, now)
        )
        
        conn.commit()
        conn.close()
        
        return {"success": True, "message": "Task updated and audited."}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/audit")
async def get_audit_trail():
    """
    Retrieves the full audit trail.
    """
    try:
        conn = sqlite3.connect(db_path)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM audit_trail ORDER BY timestamp DESC LIMIT 50")
        rows = cursor.fetchall()
        conn.close()
        
        audit_logs = [dict(row) for row in rows]
        return {"success": True, "audit": audit_logs}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
