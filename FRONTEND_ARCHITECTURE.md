# Frontend Architecture & Backend Integration Guide

To ensure your backend team has a smooth transition, the entire codebase has been meticulously structured following React/Vite best practices. **It is absolutely not linear.** 

The application is heavily componentized into logical domains so that backend engineers know exactly where to plug in their APIs without having to dig through massive files.

## 📂 Project Directory Structure

```text
src/
├── assets/                 # Static images, fonts, and global SVGs
├── pages/                  # Top-level route components (The "Views")
│   ├── Home.tsx            # Landing page
│   ├── ReasoningWorkspace.tsx
│   ├── ScanWorkspace.tsx
│   └── ... (other main views)
├── components/             # Reusable, modular UI pieces
│   ├── common/             # Global components (TopNavigationBar, EnterpriseFooter)
│   ├── home/               # Landing page specific blocks (HeroSection, AgentPillarGrid)
│   └── workspace/          # Shared layout components for all Agent Workspaces
│       ├── WorkspaceHeader.tsx
│       ├── WorkspaceSidebar.tsx
│       ├── DockedInputBar.tsx
│       └── document/       # Sub-components specific to the Document Agent
├── App.tsx                 # Main React Router setup
├── main.tsx                # React root rendering
└── index.css               # Global Tailwind directives & custom classes
```

## 🔌 How to Connect the Backend

Because of this modular structure, your backend team will not be modifying massive spaghetti code. Here is how they can approach integration:

### 1. State Management & API Hooking
Right now, the data is statically rendered for visual presentation. The backend team should create a `src/services/` or `src/api/` folder to store their Axios/Fetch API calls.

### 2. Wiring up the Prompts (Input)
The main interaction point for the user is the **DockedInputBar**.
- **Location:** `src/components/workspace/DockedInputBar.tsx`
- **Action:** The backend team can convert the `<textarea>` to use React State (`useState`) and wire the `onSubmit` event to fire a POST request to your SLM inference endpoints.

### 3. Wiring up the Agent Responses (Output)
The agent responses are housed in domain-specific Main Areas.
- **Location:** `src/components/workspace/ChatStream.tsx` (for Reasoning), `ScanMainArea.tsx`, `CodeMainArea.tsx`, etc.
- **Action:** The backend team will map over the API response data and pass them into these components as props. For example, instead of static text in `ChatStream.tsx`, it will read from `const { messages } = useChatStream()`.

## 🛡️ Compliance & Safety
- **Strict Separation of Concerns:** Layout components (like `WorkspaceSidebar.tsx`) are completely decoupled from data-heavy components (like `ChatStream.tsx`).
- **Tailwind Config:** All theming (Mint/Forest) is centralized in `tailwind.config.js`. The backend team does not need to write custom CSS; they can just use the existing Tailwind classes.
- **Routing:** Built on `react-router-dom` v7. Routes are clearly defined in `App.tsx`.

This architecture ensures your backend team can move fast without breaking the UI design.
