# Ollama Setup Guide (Single Machine - Mac M4 16GB)

This guide covers installing and configuring Ollama to run the required models within our strict 16GB RAM constraint.

## 1. Install Ollama
Download and install Ollama for macOS from [ollama.com/download](https://ollama.com/download).

## 2. Pull Required Models
We are heavily constrained by memory. Therefore, we use small and quantized models to ensure all models, along with our backend, frontend, and RAG databases, fit in 16GB.

Run these commands in your terminal:

```bash
# Reasoning and Code Generation
ollama pull llama3.2

# Vision and OCR Tasks
ollama pull llava:7b

# Text Embeddings for RAG
ollama pull nomic-embed-text
```

## 3. Important Memory Warning

**⚠️ WARNING: HOT SWAPPING AND MEMORY SPIKES ⚠️**

Running a vision request (`llava:7b`) and a reasoning request (`llama3.2`) simultaneously *will* cause Ollama to hot-swap models in and out of memory. This will result in memory spikes and increased latency.

Under our 16GB constraint, this is **expected behavior**. The system will gracefully handle the swap, but be aware that concurrent multi-model inference is limited by physical memory.
