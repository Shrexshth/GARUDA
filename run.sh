#!/bin/bash

# GAURDA Run Script (Sequential startup for 16GB RAM constraint)

echo "🚀 Starting GAURDA Workbench..."

# Trap Ctrl+C to kill child processes
trap 'echo -e "\n🛑 Shutting down GAURDA..."; kill $(jobs -p) 2>/dev/null; exit' SIGINT

# 1. Check Ollama
if curl -s http://127.0.0.1:11434 > /dev/null; then
    echo "✅ Ollama is running on port 11434"
else
    echo "❌ Ollama is NOT running. Please start Ollama before running this script."
    exit 1
fi

# 2. Start FastAPI Backend
echo "⏳ Starting FastAPI Backend..."
cd backend
python3 -m uvicorn main:app --host 0.0.0.0 --port 8000 &
cd ..

# Wait a few seconds to let backend initialize without memory spike
sleep 3

# 3. Start Next.js Frontend
echo "⏳ Starting Next.js Frontend..."
cd frontend
npm run dev &
cd ..

echo "✅ GAURDA is now running!"
echo "➡️ Frontend: http://localhost:3000"
echo "➡️ Backend API: http://localhost:8000/api/health"
echo "Press Ctrl+C to stop."

# Wait for background jobs
wait
