"use client";

import { useState } from "react";
import AppShell from "@/components/layout/AppShell";
import Card from "@/components/ui/Card";
import InputBar from "@/components/ui/InputBar";
import EmptyState from "@/components/ui/EmptyState";

interface CalculationResult {
  id: string;
  label: string;
  value: string;
  unit: string;
}

interface CodeBlock {
  language: string;
  code: string;
  output: string;
}

interface ExecutionSession {
  id: string;
  title: string;
  timestamp: string;
  status: "completed" | "running" | "error";
}

export default function CodeAgentPage() {
  const [calculationResults, setCalculationResults] = useState<CalculationResult[]>([]);
  const [executionOutput, setExecutionOutput] = useState<CodeBlock | null>(null);
  const [executionHistory, setExecutionHistory] = useState<ExecutionSession[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (prompt: string) => {
    setLoading(true);
    setExecutionOutput({ language: "python", code: "Generating code...", output: "" });
    
    // Add to history as running
    const newSession: ExecutionSession = {
      id: Date.now().toString(),
      title: prompt.slice(0, 30) + "...",
      timestamp: new Date().toLocaleTimeString(),
      status: "running"
    };
    setExecutionHistory([newSession, ...executionHistory]);

    try {
      const res = await fetch("http://localhost:8000/api/agents/code/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      
      if (data.success) {
        // Find the generated code from messages
        const messages = data.messages || [];
        let generatedCode = "";
        for (let i = messages.length - 1; i >= 0; i--) {
          const content = messages[i].content || "";
          const match = content.match(/```python\n([\s\S]*?)\n```/);
          if (match) {
            generatedCode = match[1];
            break;
          }
        }
        
        const toolResult = data.tool_result || {};
        
        setExecutionOutput({
          language: "python",
          code: generatedCode || "No code generated.",
          output: toolResult.success 
            ? toolResult.stdout 
            : `Error:\n${toolResult.stderr}`
        });

        // Update history
        setExecutionHistory((prev) => 
          prev.map((s) => s.id === newSession.id ? { ...s, status: toolResult.success ? "completed" : "error" } : s)
        );
      } else {
        throw new Error(data.detail || "Failed to execute.");
      }
    } catch (err: any) {
      setExecutionOutput({
        language: "python",
        code: "",
        output: `Request Failed: ${err.message}`
      });
      setExecutionHistory((prev) => 
        prev.map((s) => s.id === newSession.id ? { ...s, status: "error" } : s)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <div className="flex flex-col w-full gap-space-lg">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pb-space-xs">
          <div className="flex items-center gap-space-sm">
            <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-on-surface shadow-sm">
              <span className="material-symbols-outlined text-[20px]">terminal</span>
            </div>
            <div>
              <div className="flex items-center gap-space-xs">
                <span className="text-label-sm font-semibold uppercase tracking-wider text-secondary">GAURDA ENGINE</span>
                <span className="text-secondary text-label-sm">/</span>
                <span className="text-label-sm font-bold uppercase tracking-wider text-primary">SOLVER</span>
              </div>
              <h1 className="text-headline-md font-semibold text-on-surface tracking-tight">Code & Calculation Agent</h1>
            </div>
          </div>
          <div className="flex items-center gap-space-sm self-start sm:self-auto">
            <div className="flex items-center gap-space-2xs px-3 py-1 rounded-full bg-surface-container text-on-surface">
              <span className="w-2 h-2 rounded-full bg-secondary" />
              <span className="text-label-sm font-semibold">Kernel: Python 3.11 (Scipy / ISO-5167)</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
          {/* Main Workspace */}
          <div className="lg:col-span-8 flex flex-col gap-space-lg">
            {/* Prompt Card */}
            <Card className="flex flex-col gap-space-md">
              <div className="flex items-center gap-space-xs">
                <span className="w-7 h-7 rounded-lg bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center">
                  <span className="material-symbols-outlined text-[16px]">psychology</span>
                </span>
                <span className="text-label-md font-medium text-secondary">Prompt & Synthesis Request</span>
              </div>
              <InputBar placeholder="Describe a calculation — e.g., Mass flow rate across orifice plate FE-104..." onSubmit={handleSubmit} />
            </Card>

            {/* Execution Block */}
            {executionOutput === null ? (
              <div className="bg-primary-container text-surface-bright rounded-2xl overflow-hidden shadow-md">
                <div className="px-space-md py-3 flex items-center gap-space-sm">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-error" />
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary" />
                    <span className="w-2.5 h-2.5 rounded-full bg-outline" />
                  </div>
                  <span className="text-label-sm font-semibold text-surface-container-lowest/70">sandbox_exec.py — Awaiting input</span>
                </div>
                <div className="px-space-lg py-space-xl flex items-center justify-center">
                  <p className="text-body-md text-surface-container-lowest/50">Enter a calculation prompt above to generate and execute code.</p>
                </div>
              </div>
            ) : (
              <div className="bg-primary-container text-surface-bright rounded-2xl overflow-hidden shadow-md">
                <div className="px-space-md py-3 flex items-center justify-between border-b border-surface-container-lowest/10">
                   <div className="flex items-center gap-space-sm">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-error" />
                        <span className="w-2.5 h-2.5 rounded-full bg-secondary" />
                        <span className="w-2.5 h-2.5 rounded-full bg-outline" />
                      </div>
                      <span className="text-label-sm font-semibold text-surface-container-lowest/70">sandbox_exec.py</span>
                   </div>
                   {loading && <span className="text-label-sm text-secondary animate-pulse">Running...</span>}
                </div>
                <div className="p-space-md bg-surface-container-lowest/5 overflow-x-auto">
                  <pre className="text-body-sm font-mono text-secondary-fixed">
                    {executionOutput.code}
                  </pre>
                </div>
                <div className="p-space-md bg-surface-container-lowest/20 border-t border-surface-container-lowest/10">
                  <span className="text-label-sm font-semibold text-surface-container-lowest/50 uppercase tracking-wider mb-2 block">Output</span>
                  <pre className="text-body-sm font-mono text-on-primary">
                    {executionOutput.output || "No output"}
                  </pre>
                </div>
              </div>
            )}

            {/* Results */}
            <Card>
              {calculationResults.length === 0 ? (
                <EmptyState icon="calculate" title="No results yet" description="Submit a calculation to see computed values, charts, and validated outputs." />
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-md">
                  {calculationResults.map((r) => (
                    <div key={r.id} className="flex flex-col p-space-sm bg-surface-container-low rounded-xl">
                      <span className="text-label-sm font-semibold uppercase tracking-wider text-secondary">{r.label}</span>
                      <span className="text-headline-md font-semibold text-on-surface mt-0.5">{r.value} <span className="text-body-sm text-secondary font-normal">{r.unit}</span></span>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Right: Execution History */}
          <aside className="lg:col-span-4 bg-surface-container-low/40 rounded-2xl p-space-md flex flex-col gap-space-md self-stretch">
            <h2 className="text-headline-sm font-semibold text-on-surface">Execution History</h2>
            {executionHistory.length === 0 ? (
              <EmptyState icon="history" title="No executions yet" description="Past calculations and code runs will appear here." />
            ) : (
              <div className="flex flex-col gap-space-xs">
                {executionHistory.map(session => (
                   <div key={session.id} className="p-3 bg-surface-container rounded-lg flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-body-sm font-medium text-on-surface">{session.title}</span>
                        <span className="text-label-sm text-secondary">{session.timestamp}</span>
                      </div>
                      <div>
                        {session.status === 'running' && <span className="material-symbols-outlined text-secondary animate-spin text-[16px]">sync</span>}
                        {session.status === 'completed' && <span className="material-symbols-outlined text-primary text-[16px]">check_circle</span>}
                        {session.status === 'error' && <span className="material-symbols-outlined text-error text-[16px]">error</span>}
                      </div>
                   </div>
                ))}
              </div>
            )}
          </aside>
        </div>
      </div>
    </AppShell>
  );
}
