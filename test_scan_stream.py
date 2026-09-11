import requests
import json
import time

print("Triggering Scan Agent...")
files = {"file": ("dummy.png", b"dummy", "image/png")}
res = requests.post("http://localhost:8000/api/agents/scan/upload", files=files)
if res.status_code != 200:
    print(f"Error: {res.text}")
    exit(1)
    
task_id = res.json().get("task_id")
print(f"Task ID: {task_id}")

print("Streaming events:")
with requests.get(f"http://localhost:8000/api/tasks/{task_id}/stream", stream=True) as r:
    for line in r.iter_lines():
        if line:
            print(f"[{time.strftime('%H:%M:%S')}] {line.decode('utf-8')}")
