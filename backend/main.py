import yaml
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI(title="GAURDA Backend")

# Allow frontend to communicate
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For production, restrict to frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health_check():
    return {"status": "ok", "service": "GAURDA API"}

@app.get("/api/routing")
def get_routing():
    try:
        # Resolve path relative to this file to find models/routing.yaml
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        routing_file = os.path.join(base_dir, "models", "routing.yaml")
        
        with open(routing_file, 'r') as f:
            routing_config = yaml.safe_load(f)
        return routing_config
    except Exception as e:
        return {"error": f"Could not load routing config: {str(e)}"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
