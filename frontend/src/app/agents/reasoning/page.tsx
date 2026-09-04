"use client";

import { useState } from "react";
import AppShell from "@/components/layout/AppShell";
import InputBar from "@/components/ui/InputBar";
import Card from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import StatusBadge from "@/components/ui/StatusBadge";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

interface HistoryEntry {
  id: string;
  title: string;
  subtitle: string;
  timestamp: string;
  tags: string[];
}

const SUGGESTION_CARDS = [
  { title: "Summarize a report", description: "Synthesize inspection logs, vibration metrics, or incident dossiers.", icon: "summarize", cta: "Explore templates" },
  { title: "Draft an approval note", description: "Generate formal NFA memos adhering to MRPL Delegation of Powers.", icon: "fact_check", cta: "Start standard draft" },
  { title: "Answer technical query", description: "Look up API 610 tolerances, pump run limits, and safe operational envelopes.", icon: "engineering", cta: "Search standards" },
];

export default function ReasoningAgentPage() {
  const [messages] = useState<ChatMessage[]>([]);
  const [chatHistory] = useState<HistoryEntry[]>([]);

  return (
    <AppShell>
      <div className="flex flex-col w-full">
        {/* Status Ribbon */}
        <div className="flex items-center justify-between px-space-md py-space-xs bg-surface-container-low rounded-xl mb-space-lg shadow-sm">
          <div className="flex items-center gap-space-xs">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-label-sm font-semibold text-secondary tracking-wide uppercase">Reasoning Engine Online</span>
          </div>
          <div className="flex items-center gap-space-sm text-secondary text-label-sm font-semibold">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">shield</span> Safety Guardrails Active
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-xl items-start">
          {/* Center Area */}
          <div className="xl:col-span-8 2xl:col-span-9 flex flex-col items-center w-full">
            {/* Hero */}
            <div className="flex flex-col items-center text-center max-w-2xl px-space-md pt-space-md pb-space-lg">
              <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center mb-space-sm shadow-sm">
                <span className="material-symbols-outlined text-on-surface text-[20px]">auto_awesome</span>
              </div>
              <h1 className="text-display font-semibold text-on-surface tracking-tight leading-tight">
                What would you like to work on today?
              </h1>
              <p className="mt-space-xs text-body-md text-secondary max-w-lg leading-relaxed">
                Ask technical questions, troubleshoot anomalies, or query refinery equipment operating logic.
              </p>
            </div>

            {/* Suggestion Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md w-full mb-space-xl">
              {SUGGESTION_CARDS.map((card, i) => (
                <div key={i} className="group flex flex-col p-space-lg bg-surface-container-lowest rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-surface-container-high/40 to-transparent rounded-bl-full pointer-events-none transition-transform group-hover:scale-110 duration-300" />
                  <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center mb-space-md shrink-0">
                    <span className="material-symbols-outlined text-on-surface text-[20px]">{card.icon}</span>
                  </div>
                  <h3 className="text-headline-sm font-semibold text-on-surface group-hover:text-primary transition-colors mb-space-2xs">{card.title}</h3>
                  <p className="text-body-sm text-secondary leading-snug">{card.description}</p>
                  <div className="mt-space-md flex items-center gap-1 text-label-sm font-semibold text-secondary group-hover:text-on-surface transition-colors">
                    <span>{card.cta}</span>
                    <span className="material-symbols-outlined text-[14px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Area */}
            {messages.length === 0 ? (
              <Card className="w-full mb-space-lg">
                <EmptyState
                  icon="forum"
                  title="No active conversation"
                  description="Start a query below to begin a reasoning session with the AI agent."
                />
              </Card>
            ) : (
              <Card className="w-full mb-space-lg">
                {/* Messages would render here from messages state */}
                <span />
              </Card>
            )}

            {/* Input */}
            <div className="w-full max-w-4xl">
              <InputBar placeholder="Ask a follow-up or enter equipment tag (e.g., P-201A)..." />
            </div>
          </div>

          {/* Right Panel: Chat History */}
          <aside className="xl:col-span-4 2xl:col-span-3 flex flex-col w-full bg-surface-container-low/40 rounded-2xl p-space-md self-stretch">
            <div className="flex items-center justify-between pb-space-sm">
              <div className="flex items-center gap-space-2xs">
                <span className="material-symbols-outlined text-on-surface text-[20px]">forum</span>
                <h2 className="text-headline-sm font-semibold text-on-surface">Chat history</h2>
              </div>
              <button className="p-1 rounded-lg text-secondary hover:bg-surface-container hover:text-on-surface transition-colors" title="Filter sessions">
                <span className="material-symbols-outlined text-[18px]">tune</span>
              </button>
            </div>

            <div className="relative mb-space-md">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-secondary">search</span>
              <input
                className="w-full bg-surface-container-lowest rounded-xl pl-9 pr-3 py-2 text-body-sm text-on-surface placeholder:text-secondary outline-none shadow-sm"
                placeholder="Search past technical queries..."
                type="text"
              />
            </div>

            {chatHistory.length === 0 ? (
              <EmptyState icon="history" title="No chat history" description="Your past reasoning sessions will appear here." />
            ) : (
              <div className="flex flex-col gap-space-2xs flex-1">
                {/* Chat history entries would render here */}
              </div>
            )}

            <div className="pt-space-md mt-auto">
              <button className="w-full py-3 px-space-md bg-primary text-on-primary rounded-full text-label-md font-medium flex items-center justify-center gap-space-xs shadow-md hover:bg-on-surface-variant transition-all active:scale-[0.99]">
                <span className="material-symbols-outlined text-[18px]">add</span>
                <span>Create new chat</span>
              </button>
            </div>
          </aside>
        </div>
      </div>
    </AppShell>
  );
}
