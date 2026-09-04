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
  const [calculationResults] = useState<CalculationResult[]>([]);
  const [executionOutput] = useState<CodeBlock | null>(null);
  const [executionHistory] = useState<ExecutionSession[]>([]);

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
              <InputBar placeholder="Describe a calculation — e.g., Mass flow rate across orifice plate FE-104..." />
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
                {/* Code execution output would render here */}
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
                {/* Execution history rows would render here */}
              </div>
            )}
          </aside>
        </div>
      </div>
    </AppShell>
  );
}
