#!/usr/bin/env python3
"""
GAURDA Smoke Test Suite
========================
Requires: FastAPI backend running on port 8000.
Does NOT require Ollama (tests that need Ollama are marked and skip gracefully).

Run:
    source venv/bin/activate
    python tests/smoke_test.py

Exit code 0 = all critical tests pass.
"""
import os
import sys
import json
import time
import requests
import sqlite3

BASE_URL = os.getenv("GAURDA_API_URL", "http://localhost:8000")
RESULTS = {"pass": 0, "fail": 0, "skip": 0}

def test(name, func):
    try:
        result = func()
        if result == "SKIP":
            print(f"  ⏭️  SKIP: {name}")
            RESULTS["skip"] += 1
        else:
            print(f"  ✅ PASS: {name}")
            RESULTS["pass"] += 1
    except Exception as e:
        print(f"  ❌ FAIL: {name} → {e}")
        RESULTS["fail"] += 1

# ──────────────────────────────────────────
# 1. HEALTH CHECK
# ──────────────────────────────────────────
def test_health():
    r = requests.get(f"{BASE_URL}/api/health", timeout=5)
    assert r.status_code == 200, f"Got {r.status_code}"
    data = r.json()
    assert data["status"] == "online", f"Status is {data['status']}"
    assert "config" in data, "Missing config in health response"

# ──────────────────────────────────────────
# 2. APPROVAL AGENT — CRUD + AUDIT
# ──────────────────────────────────────────
def test_approval_get_tasks():
    r = requests.get(f"{BASE_URL}/api/agents/approval/tasks", timeout=5)
    assert r.status_code == 200
    data = r.json()
    assert data["success"] is True
    assert isinstance(data["tasks"], list)

def test_approval_update_invalid_task():
    """Should return 404 for a non-existent task ID."""
    r = requests.post(f"{BASE_URL}/api/agents/approval/update", json={
        "task_id": "NONEXISTENT_TASK_999",
        "new_status": "approved",
        "actor": "QA_Test"
    }, timeout=5)
    # The endpoint should return 404
    assert r.status_code == 404, f"Expected 404, got {r.status_code}: {r.text}"

def test_approval_seed_and_approve():
    """Manually seed a task via SQLite, then approve it via API, then verify audit trail."""
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    db_path = os.path.join(base_dir, "backend", "data", "gaurda.db")
    
    task_id = "smoke_test_001"
    
    # Seed directly into SQLite
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("DELETE FROM tasks WHERE id = ?", (task_id,))
    cursor.execute("DELETE FROM audit_trail WHERE task_id = ?", (task_id,))
    cursor.execute("""
        INSERT INTO tasks (id, title, description, status, assignee, priority, created_at, due_date)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (task_id, "Smoke Test NFA", "Test approval pipeline", "pending", "QA Bot", "high",
          "2026-09-05T12:00:00", "2026-09-10"))
    conn.commit()
    conn.close()
    
    # Approve via API
    r = requests.post(f"{BASE_URL}/api/agents/approval/update", json={
        "task_id": task_id,
        "new_status": "approved",
        "actor": "QA_Engineer"
    }, timeout=5)
    assert r.status_code == 200, f"Approve failed: {r.text}"
    
    # Verify audit trail
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM audit_trail WHERE task_id = ?", (task_id,))
    rows = cursor.fetchall()
    conn.close()
    assert len(rows) >= 1, "Audit trail entry not created"

# ──────────────────────────────────────────
# 3. KNOWLEDGE BASE — SEARCH (ChromaDB)
# ──────────────────────────────────────────
def test_kb_search_with_match():
    """Search for 'fire water pump' — should match OISD doc."""
    r = requests.post(f"{BASE_URL}/api/agents/kb/search", json={
        "query": "fire water pump capacity"
    }, timeout=10)
    assert r.status_code == 200, f"Got {r.status_code}: {r.text}"
    data = r.json()
    assert data["success"] is True
    assert len(data["results"]) > 0, "No results returned for 'fire water pump'"

def test_kb_search_no_match():
    """Search for something obscure. Should return empty results, not crash."""
    r = requests.post(f"{BASE_URL}/api/agents/kb/search", json={
        "query": "quantum entanglement in black hole thermodynamics"
    }, timeout=10)
    assert r.status_code == 200, f"Got {r.status_code}: {r.text}"
    data = r.json()
    assert data["success"] is True
    # May return results with low relevance — that's fine, just shouldn't crash

# ──────────────────────────────────────────
# 4. SCAN AGENT — UPLOAD VALIDATION
# ──────────────────────────────────────────
def test_scan_rejects_non_image():
    """Upload a .txt file — should be rejected with 400."""
    files = {"file": ("test.txt", b"this is not an image", "text/plain")}
    r = requests.post(f"{BASE_URL}/api/agents/scan/upload", files=files, timeout=5)
    assert r.status_code == 400, f"Expected 400, got {r.status_code}: {r.text}"

def test_scan_upload_requires_ollama():
    """Upload a real image — requires Ollama running. Skip if unavailable."""
    try:
        requests.get("http://localhost:11434", timeout=2)
    except:
        return "SKIP"
    
    # Create a tiny valid PNG (1x1 pixel)
    import struct
    import zlib
    def create_minimal_png():
        sig = b'\x89PNG\r\n\x1a\n'
        ihdr_data = struct.pack('>IIBBBBB', 1, 1, 8, 2, 0, 0, 0)
        ihdr_crc = zlib.crc32(b'IHDR' + ihdr_data)
        ihdr = struct.pack('>I', 13) + b'IHDR' + ihdr_data + struct.pack('>I', ihdr_crc)
        raw = zlib.compress(b'\x00\x00\x00\x00')
        idat_crc = zlib.crc32(b'IDAT' + raw)
        idat = struct.pack('>I', len(raw)) + b'IDAT' + raw + struct.pack('>I', idat_crc)
        iend_crc = zlib.crc32(b'IEND')
        iend = struct.pack('>I', 0) + b'IEND' + struct.pack('>I', iend_crc)
        return sig + ihdr + idat + iend
    
    png = create_minimal_png()
    files = {"file": ("test_scan.png", png, "image/png")}
    r = requests.post(f"{BASE_URL}/api/agents/scan/upload", files=files, timeout=120)
    assert r.status_code == 200, f"Got {r.status_code}: {r.text}"

# ──────────────────────────────────────────
# 5. CODE AGENT — EXECUTION
# ──────────────────────────────────────────
def test_code_agent_requires_ollama():
    """Requires Ollama. Skip if unavailable."""
    try:
        requests.get("http://localhost:11434", timeout=2)
    except:
        return "SKIP"
    
    r = requests.post(f"{BASE_URL}/api/agents/code/execute", json={
        "prompt": "Calculate the square root of 144 and print it."
    }, timeout=120)
    assert r.status_code == 200, f"Got {r.status_code}: {r.text}"
    data = r.json()
    assert data["success"] is True

# ──────────────────────────────────────────
# 6. REASONING AGENT — CHAT
# ──────────────────────────────────────────
def test_reasoning_requires_ollama():
    """Requires Ollama. Skip if unavailable."""
    try:
        requests.get("http://localhost:11434", timeout=2)
    except:
        return "SKIP"
    
    r = requests.post(f"{BASE_URL}/api/agents/reasoning/chat", json={
        "session_id": "smoke_test_session",
        "messages": [{"role": "user", "content": "What is API 610?"}]
    }, timeout=120)
    assert r.status_code == 200, f"Got {r.status_code}: {r.text}"
    data = r.json()
    assert data["success"] is True
    assert "message" in data

# ──────────────────────────────────────────
# 7. DOCUMENT AGENT — DRAFT
# ──────────────────────────────────────────
def test_document_requires_ollama():
    """Requires Ollama. Skip if unavailable."""
    try:
        requests.get("http://localhost:11434", timeout=2)
    except:
        return "SKIP"
    
    r = requests.post(f"{BASE_URL}/api/agents/document/draft", json={
        "summary": "Upgrade pump P-102A with new mechanical seal"
    }, timeout=120)
    assert r.status_code == 200, f"Got {r.status_code}: {r.text}"
    data = r.json()
    assert data["success"] is True

# ──────────────────────────────────────────
# 8. SANDBOX DIRECT TEST
# ──────────────────────────────────────────
def test_sandbox_direct():
    """Test sandbox.py directly without Ollama."""
    sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
    from backend.tools.sandbox import execute_python_code
    
    result = execute_python_code('import math\nprint(f"sqrt(144) = {math.sqrt(144)}")')
    assert result["success"] is True, f"Sandbox failed: {result['stderr']}"
    assert "12.0" in result["stdout"], f"Expected 12.0 in output, got: {result['stdout']}"

def test_sandbox_timeout():
    """Test that infinite loops get killed."""
    sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
    from backend.tools.sandbox import execute_python_code
    
    result = execute_python_code("while True: pass")
    assert result["success"] is False, "Infinite loop should fail"
    assert "timed out" in result["stderr"].lower(), f"Expected timeout error, got: {result['stderr']}"

def test_sandbox_error_handling():
    """Test that syntax errors are captured, not crashed."""
    sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
    from backend.tools.sandbox import execute_python_code
    
    result = execute_python_code("def broken(\nprint('hi')")
    assert result["success"] is False
    assert result["stderr"] != "", "Should have stderr for syntax error"

# ──────────────────────────────────────────
# RUN ALL TESTS
# ──────────────────────────────────────────
if __name__ == "__main__":
    print("=" * 60)
    print("GAURDA SMOKE TEST SUITE")
    print("=" * 60)
    
    # Check backend is reachable
    try:
        requests.get(f"{BASE_URL}/api/health", timeout=3)
    except:
        print(f"\n❌ FATAL: Backend not reachable at {BASE_URL}")
        print("   Start the backend first: source venv/bin/activate && uvicorn backend.main:app --port 8000")
        sys.exit(1)
    
    print("\n🔧 Infrastructure")
    test("Health check", test_health)
    
    print("\n📋 Approval Agent")
    test("GET /tasks returns list", test_approval_get_tasks)
    test("Update invalid task → 404", test_approval_update_invalid_task)
    test("Seed task → Approve → Audit trail", test_approval_seed_and_approve)
    
    print("\n📚 Knowledge Base Agent")
    test("Search with expected match", test_kb_search_with_match)
    test("Search with no relevant match", test_kb_search_no_match)
    
    print("\n📷 Scan Agent")
    test("Rejects non-image upload", test_scan_rejects_non_image)
    test("Processes real image (needs Ollama)", test_scan_upload_requires_ollama)
    
    print("\n💻 Code Agent")
    test("Execute calculation (needs Ollama)", test_code_agent_requires_ollama)
    
    print("\n🧠 Reasoning Agent")
    test("Chat endpoint (needs Ollama)", test_reasoning_requires_ollama)
    
    print("\n📄 Document Agent")
    test("Draft NFA (needs Ollama)", test_document_requires_ollama)
    
    print("\n🔒 Sandbox (Direct)")
    test("Valid code execution", test_sandbox_direct)
    test("Infinite loop timeout", test_sandbox_timeout)
    test("Syntax error handling", test_sandbox_error_handling)
    
    print("\n" + "=" * 60)
    total = RESULTS["pass"] + RESULTS["fail"] + RESULTS["skip"]
    print(f"Results: {RESULTS['pass']}/{total} passed, {RESULTS['fail']} failed, {RESULTS['skip']} skipped")
    print("=" * 60)
    
    if RESULTS["fail"] > 0:
        print("\n⚠️  SOME TESTS FAILED — See details above.")
        sys.exit(1)
    else:
        print("\n✅ ALL CRITICAL TESTS PASSED!")
        sys.exit(0)
