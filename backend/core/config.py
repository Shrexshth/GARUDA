import os
import yaml
from pydantic import BaseModel
from dotenv import load_dotenv

# Load environment variables from .env file (if it exists)
load_dotenv()

class RouteConfig(BaseModel):
    ollama_base_url: str
    vision_task: str
    reasoning_task: str
    embeddings: str

class AppConfig(BaseModel):
    routes: RouteConfig

def load_config() -> AppConfig:
    # Resolve relative to this file unless explicitly set in env
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    routing_file = os.getenv("ROUTING_CONFIG_PATH") or os.path.join(base_dir, "models", "routing.yaml")
    
    # Fallback to env vars or sensible defaults
    default_config = AppConfig(
        routes=RouteConfig(
            ollama_base_url=os.getenv("DEFAULT_OLLAMA_BASE_URL", "http://localhost:11434"),
            vision_task=os.getenv("DEFAULT_VISION_MODEL", "llava:7b"),
            reasoning_task=os.getenv("DEFAULT_REASONING_MODEL", "mistral"),
            embeddings=os.getenv("DEFAULT_EMBEDDING_MODEL", "nomic-embed-text")
        )
    )

    if not os.path.exists(routing_file):
        return default_config
        
    try:
        with open(routing_file, "r") as f:
            raw_config = yaml.safe_load(f)
            
        return AppConfig(
            routes=RouteConfig(
                ollama_base_url=raw_config.get("global", {}).get("ollama_base_url", default_config.routes.ollama_base_url),
                vision_task=raw_config.get("routes", {}).get("vision_task", default_config.routes.vision_task),
                reasoning_task=raw_config.get("routes", {}).get("reasoning_task", default_config.routes.reasoning_task),
                embeddings=raw_config.get("routes", {}).get("embeddings", default_config.routes.embeddings)
            )
        )
    except Exception as e:
        print(f"Warning: Failed to load routing config from {routing_file}, falling back to defaults. Error: {e}")
        return default_config

# Expose global config instance
settings = load_config()
