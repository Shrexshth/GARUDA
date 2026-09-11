import requests
import json
import time
import sys

print("Triggering Code Agent...")
res = requests.post("http://localhost:8000/api/agents/code/execute", json={"prompt": "Calculate flow rate."})
task_id = res.json()["task_id"]
print(f"Task ID: {task_id}")

print("Streaming events:")
with requests.get(f"http://localhost:8000/api/tasks/{task_id}/stream", stream=True) as r:
    for line in r.iter_lines():
        if line:
            print(f"[{time.strftime('%H:%M:%S')}] {line.decode('utf-8')}")

