#!/bin/bash

# GAURDA Run Script (Sequential startup for 16GB RAM constraint)
# Usage: ./run.sh [--test] [--airgap]

echo "🚀 Starting GAURDA Workbench..."

# Trap Ctrl+C to kill child processes
trap 'echo -e "\n🛑 Shutting down GAURDA..."; kill $(jobs -p) 2>/dev/null; exit' SIGINT

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Activate venv
if [ -f "$SCRIPT_DIR/venv/bin/activate" ]; then
    source "$SCRIPT_DIR/venv/bin/activate"
    echo "✅ Virtual environment activated"
else
    echo "❌ venv not found. Run: python3 -m venv venv && pip install -r backend/requirements.txt"
    exit 1
fi

# Handle flags
if [ "$1" == "--test" ]; then
    echo "🧪 Running smoke tests..."
    export PYTHONPATH="$SCRIPT_DIR"
    python "$SCRIPT_DIR/tests/smoke_test.py"
    exit $?
fi

if [ "$1" == "--airgap" ]; then
    echo "🔒 Running air-gap verification..."
    python "$SCRIPT_DIR/infra/verify_airgap.py"
    exit $?
fi

# 1. Check Ollama
if curl -s http://127.0.0.1:11434 > /dev/null 2>&1; then
    echo "✅ Ollama is running on port 11434"
else
    echo "❌ Ollama is NOT running. Please open /Applications/Ollama.app first."
    exit 1
fi

# 2. Start FastAPI Backend
echo "⏳ Starting FastAPI Backend..."
export PYTHONPATH="$SCRIPT_DIR"
cd "$SCRIPT_DIR"
python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 &

# Wait a few seconds to let backend initialize without memory spike
sleep 3

# 3. Start Next.js Frontend
echo "⏳ Starting Next.js Frontend..."
cd "$SCRIPT_DIR/frontend"
npm run dev &
cd "$SCRIPT_DIR"

echo ""
echo "✅ GAURDA is now running!"
echo "➡️  Frontend: http://localhost:3000"
echo "➡️  Backend API: http://localhost:8000/api/health"
echo "➡️  Run tests: ./run.sh --test"
echo "➡️  Check airgap: ./run.sh --airgap"
echo "Press Ctrl+C to stop."

# Wait for background jobs
wait
