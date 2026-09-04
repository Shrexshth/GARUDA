"use client";

import { useEffect, useState } from "react";
import { 
  Brain, 
  ScanSearch, 
  FileText, 
  Calculator, 
  Database, 
  CheckCircle 
} from "lucide-react";

export default function Home() {
  const [backendStatus, setBackendStatus] = useState<string>("checking...");
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const res = await fetch(`${apiUrl}/api/health`);
        if (!res.ok) throw new Error("Network response was not ok");
        const data = await res.json();
        setBackendStatus(data.status === "ok" ? "Connected 🟢" : "Issues 🟡");
        setIsError(false);
      } catch (error) {
        setBackendStatus("Disconnected 🔴");
        setIsError(true);
      }
    };
    
    fetchHealth();
  }, []);

  const agents = [
    { name: "Reasoning", icon: <Brain className="w-8 h-8 mb-4 text-blue-500" />, desc: "Logical reasoning and decision making." },
    { name: "Scan / Vision", icon: <ScanSearch className="w-8 h-8 mb-4 text-purple-500" />, desc: "OCR and visual data extraction." },
    { name: "Document", icon: <FileText className="w-8 h-8 mb-4 text-orange-500" />, desc: "Parse and analyze complex PDFs." },
    { name: "Code / Math", icon: <Calculator className="w-8 h-8 mb-4 text-green-500" />, desc: "Code generation and mathematical calculations." },
    { name: "Knowledge Base", icon: <Database className="w-8 h-8 mb-4 text-red-500" />, desc: "RAG queries over corporate knowledge." },
    { name: "Approval Workflow", icon: <CheckCircle className="w-8 h-8 mb-4 text-teal-500" />, desc: "Human-in-the-loop and automated approvals." },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-8 font-sans text-zinc-900 dark:text-zinc-100 transition-colors">
      <header className="mb-12 flex justify-between items-center max-w-6xl mx-auto border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">GAURDA AI Workbench</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Sovereign, On-Premise Agentic UI</p>
        </div>
        
        {/* Backend Connectivity Indicator */}
        <div className={`px-4 py-2 rounded-full font-medium text-sm flex items-center gap-2 border ${
          isError 
            ? "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-900" 
            : backendStatus.includes("checking")
              ? "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-900"
              : "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-900"
        }`}>
          Backend Status: <span>{backendStatus}</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent, index) => (
            <div 
              key={index}
              className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-sm border border-zinc-200 dark:border-zinc-800 hover:shadow-md hover:border-blue-500 dark:hover:border-blue-500 transition-all cursor-pointer group"
            >
              <div className="group-hover:scale-110 transition-transform origin-left">
                {agent.icon}
              </div>
              <h2 className="text-xl font-semibold mb-2">{agent.name} Agent</h2>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm">{agent.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
