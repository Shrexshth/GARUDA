# GAURDA Developer Onboarding

Welcome to the GAURDA project! This guide will help you get set up.

## Prerequisites
- Node.js (v18+)
- Python (3.9+)
- Ollama (installed locally)

## Installation Steps
1. Clone the repository.
2. `cd backend` and run `pip install -r requirements.txt`.
3. `cd frontend` and run `npm install`.
4. Follow `docs/OLLAMA_SETUP.md` to pull required models.
5. Create `.env.local` in `frontend/` with:
   `NEXT_PUBLIC_API_URL=http://localhost:8000`

## Multi-Machine Scaling
GAURDA is built to run on a single 16GB Mac, but can scale instantly:

If a second machine becomes available for Ollama inference:
1. Ensure Ollama is running on the second machine and accessible over the local network.
2. Edit `models/routing.yaml` on the main machine.
3. Change `ollama_base_url` to the IP of the second machine (e.g., `http://192.168.1.100:11434`).
4. Restart the backend. No application code changes are required.
