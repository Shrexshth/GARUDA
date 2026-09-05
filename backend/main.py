import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.core.config import settings
import uvicorn
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="GAURDA Backend API")

# Dynamically load CORS configuration
allowed_origins_env = os.getenv("ALLOWED_ORIGINS", "*")
allowed_origins = [origin.strip() for origin in allowed_origins_env.split(",")]

from backend.api import scan, document, code, knowledge, approval, reasoning

# Add CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(scan.router, prefix="/api/agents/scan", tags=["Scan"])
app.include_router(document.router, prefix="/api/agents/document", tags=["Document"])
app.include_router(code.router, prefix="/api/agents/code", tags=["Code"])
app.include_router(knowledge.router, prefix="/api/agents/kb", tags=["Knowledge"])
app.include_router(approval.router, prefix="/api/agents/approval", tags=["Approval"])
app.include_router(reasoning.router, prefix="/api/agents/reasoning", tags=["Reasoning"])


@app.get("/api/health")
def health_check():
    """
    Health check endpoint that returns backend status and active configuration.
    """
    return {
        "status": "online",
        "service": "GAURDA API",
        "config": settings.dict()
    }

if __name__ == "__main__":
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", "8000"))
    uvicorn.run(app, host=host, port=port)
