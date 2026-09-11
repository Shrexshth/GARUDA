# GARUDA (GAURDA) Project Progress & Architecture Report

**Status:** 100% Core Implementation Complete
**Objective:** Single-machine, air-gapped Agentic AI Workbench for MRPL (SIH Problem Statement 26117).

This document serves as an exhaustive, in-depth technical breakdown of every component, file, function, and connection we have built in the GARUDA project so far.

---

## 1. Project Architecture & Philosophy

The system is designed to run entirely on a single MacBook Air M4 with 16GB of unified memory. To achieve this without crashing, we built a tightly controlled orchestration layer that ensures LLMs (Vision vs. Reasoning) are loaded into memory sequentially, never concurrently. The system is strictly air-gapped, meaning no data leaves the local machine.

The stack consists of:
- **Frontend**: Next.js 14, React, Tailwind CSS v4.
- **Backend**: FastAPI (Python), LangGraph (Orchestration), SQLite (Persistence).
- **AI/Local Models**: Ollama (Qwen2.5-VL for Vision, Qwen3.5 9B for Reasoning, Nomic for Embeddings).
- **Vector DB**: ChromaDB (Embedded mode).

---

## 2. Backend Deep Dive (`/backend`)

The backend is completely dynamic, driven by environment variables (via `python-dotenv` and `.env`) to prevent any hardcoding of ports, models, or paths.

### 2.1 Core Orchestration (`/backend/core`)

#### `config.py`
- **Purpose**: Loads environment variables and provides a centralized configuration object.
- **Key Variables**: `OLLAMA_BASE_URL`, `VISION_MODEL`, `REASONING_MODEL`, `ALLOWED_ORIGINS`.

#### `state.py`
- **Class `GraphState` (TypedDict)**: Defines the memory state passed between nodes in our LangGraph. 
- **Fields**:
  - `messages`: List of chat messages (user/assistant).
  - `active_agent`: Which agent is currently processing (e.g., "vision", "reasoning", "code").
  - `extracted_data`: Payload from OCR.
  - `generated_file_path`: Path to saved `.docx` or data files.
  - `error_count`: Tracks sandbox execution failures for self-correction.
  - `task_type`: Specifies the current task context.
  - `tool_results`: Outputs from subprocesses or tools.

#### `graph.py`
- **Purpose**: The LangGraph state machine. This is the brain of the backend. It strictly controls execution flow so models aren't loaded concurrently.
- **Functions (Nodes)**:
  - `vision_node(state)`: Calls the local Vision model (via Ollama API) to extract data from images.
  - `reasoning_node(state)`: Calls the Reasoning model for general chat or code generation. Includes a retry loop if the `error_count` > 0.
  - `tool_node(state)`: A routing node that executes physical tools (like the sandbox) based on the `active_agent`.
- **Connections (Edges)**: Defines the strict conditional edges (e.g., if agent is "code", go to `reasoning_node`, then `tool_node`, then back to `reasoning_node` if the code failed, capped at 2 retries).

### 2.2 Tooling Layer (`/backend/tools`)

#### `sandbox.py`
- **Purpose**: Safely executes AI-generated Python code without the massive overhead of Docker.
- **Functions**:
  - `execute_code(code_string)`: Writes the code to a secure `tempfile.NamedTemporaryFile`, runs it via `subprocess.run` with a strict timeout, strips environment variables to prevent host tampering, and captures `stdout` and `stderr`.

#### `document_exporter.py`
- **Purpose**: Generates formal MRPL documentation (e.g., Note for Approval).
- **Functions**:
  - `draft_docx(payload)`: Uses `docxtpl` to fill Microsoft Word templates with AI-generated text and saves them to the local disk.

#### `rag_engine.py`
- **Purpose**: In-process semantic search using ChromaDB.
- **Class `RAGEngine`**:
  - `__init__()`: Initializes ChromaDB in `PersistentClient` mode, avoiding a separate heavy server process. Uses Nomic embeddings.
  - `search_manuals(query, top_k)`: Queries the embedded database and returns relevant chunks from indexed OISD standards or SOPs.

### 2.3 API Endpoints (`/backend/api`)

Each UI agent has a dedicated FastAPI router.

#### `scan.py` (Vision Agent)
- **Endpoint `POST /api/agents/scan/upload`**: 
  - Takes a `UploadFile`.
  - Converts the file to base64.
  - Invokes the `workflow_app` (LangGraph) with `active_agent = "vision"`.
  - Returns structured, tabular JSON data extracted from P&IDs or data sheets.

#### `code.py` (Code & Calculation Agent)
- **Endpoint `POST /api/agents/code/execute`**:
  - Takes a calculation prompt.
  - Invokes `workflow_app` with `active_agent = "code"`.
  - The graph generates Python code, runs it in `sandbox.py`, and returns both the raw code and the execution `stdout`.

#### `document.py` (Document Agent)
- **Endpoint `POST /api/agents/document/draft`**:
  - Takes a `summary` of what needs to be drafted.
  - Invokes `workflow_app` to expand the summary into a formal text block.
  - Uses `document_exporter.py` to write the text to a `.docx` file.
  - Returns the file path and generated content.

#### `knowledge.py` (Knowledge Base Agent)
- **Endpoint `POST /api/agents/kb/search`**:
  - Takes a search `query`.
  - Bypasses the LLM graph and directly calls `rag_engine.search_manuals()`.
  - Returns snippet matches, sources, and relevance scores.

#### `reasoning.py` (Reasoning Agent)
- **Database**: Initializes a local SQLite database (`chat_sessions`, `chat_messages`) for history.
- **Endpoint `POST /api/agents/reasoning/chat`**:
  - Takes an array of previous messages.
  - Invokes `workflow_app` with `active_agent = "reasoning"`.
  - Returns the assistant's contextual response.

#### `approval.py` (Approval & Workflow Agent)
- **Database**: Initializes SQLite tables (`tasks`, `audit_trail`).
- **Endpoint `GET /api/agents/approval/tasks`**: Returns all workflow tasks.
- **Endpoint `POST /api/agents/approval/update`**: Takes a `task_id` and `new_status`. Updates the task and writes an immutable record to the `audit_trail` table.

#### `main.py`
- **Purpose**: The FastAPI entry point.
- **Functions**:
  - Adds CORS middleware dynamically based on `.env`.
  - `include_router()`: Mounts all 6 agent API routers under the `/api/agents/...` prefix.
  - **Endpoint `GET /api/health`**: Diagnostic endpoint returning system status and current LLM configurations.

---

## 3. Frontend Deep Dive (`/frontend`)

The frontend is a Next.js application. We fully wired every agent page to communicate with the FastAPI backend using React `fetch` calls.

### 3.1 Components
- `AppShell.tsx`: The main layout wrapper with the sidebar navigation.
- `InputBar.tsx`: A reusable component with an `onSubmit` prop for handling user prompts.
- `Card.tsx`, `EmptyState.tsx`, `StatusBadge.tsx`: Reusable UI elements tailored to the GARUDA design system.

### 3.2 Agent Pages (The Wiring)

#### `src/app/agents/scan/page.tsx`
- **State**: `extractedData`, `scanSessions`.
- **Wiring (`handleFileUpload`)**: Uses an invisible `<input type="file">` wrapped around the dropzone. On select, it creates a `FormData` object, posts to `/api/agents/scan/upload`, and maps the returned JSON into the `ExtractedRow[]` state to display the table.

#### `src/app/agents/code/page.tsx`
- **State**: `executionOutput` (holds code and stdout), `executionHistory`.
- **Wiring (`handleSubmit`)**: Takes the user's prompt from `InputBar`, posts to `/api/agents/code/execute`. Parses the response to extract the markdown Python code block and the sandbox tool result (`stdout` or `stderr`), rendering them in separate syntax-highlighted blocks.

#### `src/app/agents/document/page.tsx`
- **State**: `activeDraft`.
- **Wiring (`handleGenerate`)**: Takes a summary prompt, posts to `/api/agents/document/draft`. Populates the UI with the generated text and the local `.docx` file path returned by the server.

#### `src/app/agents/knowledge-base/page.tsx`
- **State**: `searchResults`, `citedSources`.
- **Wiring (`handleSearch`)**: Posts the query to `/api/agents/kb/search`. Maps the returned ChromaDB results (snippets, relevance scores) into rich UI cards.

#### `src/app/agents/reasoning/page.tsx`
- **State**: `messages` (Chat history array).
- **Wiring (`handleSend`)**: Appends the user's message to the state, posts the entire array to `/api/agents/reasoning/chat`, and appends the assistant's reply. Features a typing indicator/loading state.

#### `src/app/agents/approval/page.tsx`
- **State**: `taskList`.
- **Wiring (`fetchTasks`, `handleApprove`)**: Uses a `useEffect` to `GET` all tasks on mount. Clicking "Approve" triggers a `POST` to `/api/agents/approval/update` and re-fetches the list to instantly update the UI.

---

## 4. Infrastructure & Security (`/infra`)

#### `verify_airgap.py`
- **Purpose**: A critical script required for the hackathon demo to prove the system is secure and sovereign.
- **Functionality**: 
  1. Attempts to `requests.get("https://google.com")`. This **must fail** if the macOS `pfctl` (Packet Filter) rules are correctly configured to block outbound traffic.
  2. Attempts to `requests.get("http://localhost:8000/api/health")`. This **must succeed** to prove internal microservices are operational.
  3. Exits with code 0 if the airgap is secure, or code 1 if the system is leaking data to the internet.

---

## Summary
The GARUDA project is 100% structurally complete. The frontend and backend are seamlessly connected, the SQLite databases are functioning, the secure Python sandbox is operational, and the LangGraph orchestrator guarantees our strict memory constraints are respected.
