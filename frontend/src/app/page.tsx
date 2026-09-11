"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import AgentCard from "@/components/ui/AgentCard";
import InputBar from "@/components/ui/InputBar";
import EmptyState from "@/components/ui/EmptyState";
import WorkflowBuilderModal from "@/components/ui/WorkflowBuilderModal";

interface RecentSession {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  timestamp: string;
}

const AGENTS = [
  { name: "Reasoning Agent", description: "General technical queries & troubleshooting", icon: "psychology", href: "/agents/reasoning", bgClass: "bg-secondary-container" },
  { name: "Scan & Vision", description: "Extract data from physical engineering schematics", icon: "document_scanner", href: "/agents/scan", bgClass: "bg-secondary-fixed" },
  { name: "Document Agent", description: "Draft standardized NFAs and compliance notes", icon: "article", href: "/agents/document", bgClass: "bg-tertiary-fixed" },
  { name: "Code & Calculation", description: "Compute orifice flow rates and fluid dynamics", icon: "terminal", href: "/agents/code", bgClass: "bg-secondary-fixed-dim" },
  { name: "Knowledge Base", description: "Search indexed OISD standards & refinery SOPs", icon: "auto_stories", href: "/agents/knowledge-base", bgClass: "bg-surface-container-high" },
  { name: "Approval & Workflow", description: "Track multi-tier approval chains and signatures", icon: "verified", href: "/agents/approval", bgClass: "bg-tertiary-fixed-dim" },
];

export default function HomePage() {
  const [recentSessions, setRecentSessions] = useState<RecentSession[]>([]);
  const [isRouting, setIsRouting] = useState(false);
  const [showBuilder, setShowBuilder] = useState(false);
  const [visibleSessionCount, setVisibleSessionCount] = useState(5);
  const router = useRouter();

  useEffect(() => {
    fetch("http://localhost:8000/api/agents/reasoning/history")
      .then(res => res.json())
      .then(data => {
        if (data.success && data.history) {
          // Map HistoryEntry to RecentSession
          const mapped = data.history.map((h: any) => {
            let icon = "forum";
            if (h.subtitle === "Multi-Agent Workflow") icon = "account_tree";
            else if (h.subtitle.includes("Code")) icon = "terminal";
            else if (h.subtitle.includes("Document")) icon = "article";
            else if (h.subtitle.includes("Scan")) icon = "document_scanner";
            
            return {
              id: h.id,
              title: h.title,
              subtitle: h.subtitle,
              icon: icon,
              timestamp: h.timestamp ? new Date(h.timestamp).toISOString().replace('T', ' ').substring(0, 19) + ' UTC' : new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC'
            };
          });
          setRecentSessions(mapped);
        }
      })
      .catch(console.error);
  }, []);

  const handleSearch = async (query: string) => {
    setIsRouting(true);
    try {
      const res = await fetch("http://localhost:8000/api/orchestrator/route", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query })
      });
      const data = await res.json();
      const agent = data.agent || "reasoning";
      router.push(`/agents/${agent.replace("_", "-")}?q=${encodeURIComponent(query)}`);
    } catch (err) {
      console.error(err);
      router.push(`/agents/reasoning?q=${encodeURIComponent(query)}`);
    } finally {
      setIsRouting(false);
    }
  };

  const handleSessionClick = (session: RecentSession) => {
    if (session.subtitle === "Multi-Agent Workflow") {
      router.push(`/agents/workflow?session_id=${session.id}`);
    } else {
      router.push(`/agents/reasoning?session_id=${session.id}`);
    }
  };

  return (
    <AppShell>
      <div className="flex flex-col xl:flex-row gap-space-lg w-full min-h-[calc(100vh-8.5rem)]">
        {/* Main Content */}
        <div className="flex-1 flex flex-col justify-between min-w-0 pr-0 xl:pr-space-xs">
          {/* Hero */}
          <div className="flex flex-col items-center text-center max-w-2xl mx-auto pt-space-md sm:pt-space-xl pb-space-lg">
            <div className="w-8 h-8 rounded-full bg-secondary-fixed/50 flex items-center justify-center text-on-secondary-fixed-variant mb-space-sm shadow-sm">
              <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
            </div>
            <h1 className="text-display font-semibold text-on-surface tracking-tight">
              Welcome back — what do you need to do today?
            </h1>
            <p className="text-body-md text-secondary mt-space-xs max-w-lg">
              Access confidential on-premise AI assistants for engineering, compliance, and plant operations.
            </p>
          </div>

          {/* Agent Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-md my-auto py-space-sm">
            {AGENTS.map((agent) => (
              <AgentCard key={agent.href} {...agent} />
            ))}
          </div>

          {/* Input Bar */}
          <div className="pt-space-md pb-space-xs mt-auto relative">
            <InputBar placeholder="Initiate a query or ask an agent to start a workflow..." onSubmit={handleSearch} />
            {isRouting && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 bg-surface-container-highest px-4 py-2 rounded-full shadow-lg mt-[-10px]">
                <span className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                <span className="text-label-sm font-semibold text-on-surface">Routing task to correct agent...</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Recent Sessions */}
        <div className="w-full xl:w-80 shrink-0 bg-surface-container-low/60 rounded-[24px] p-space-md flex flex-col justify-between">
          <div className="flex flex-col gap-space-sm">
            <div className="flex items-center justify-between px-space-xs">
              <div className="flex items-center gap-space-xs">
                <span className="text-headline-sm font-semibold text-on-surface">Recent Sessions</span>
              </div>
              <button className="w-7 h-7 rounded-lg flex items-center justify-center text-secondary hover:bg-surface-container hover:text-on-surface transition-colors">
                <span className="material-symbols-outlined text-[18px]">filter_list</span>
              </button>
            </div>

            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-[18px] text-secondary">search</span>
              <input
                className="w-full h-9 pl-9 pr-space-sm bg-surface-container-lowest rounded-xl text-body-sm text-on-surface placeholder:text-secondary focus:outline-none shadow-sm"
                placeholder="Search history..."
                type="text"
              />
            </div>

            {recentSessions.length === 0 ? (
              <EmptyState icon="history" title="No recent sessions yet" description="Your conversations with agents will appear here." />
            ) : (
              <div className="flex flex-col gap-space-xs mt-space-2xs overflow-y-auto max-h-[calc(100vh-21rem)]">
                {recentSessions.slice(0, visibleSessionCount).map((session) => (
                  <div key={session.id} onClick={() => handleSessionClick(session)} className="p-3 bg-surface-container-lowest rounded-xl flex items-center gap-3 cursor-pointer hover:bg-surface-container-low transition-colors shadow-sm">
                    <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[16px] text-on-surface-variant">{session.icon}</span>
                    </div>
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-label-md font-semibold text-on-surface line-clamp-1">{session.title}</span>
                      <div className="flex items-center justify-between mt-0.5">
                        <span className="text-label-sm text-secondary">{session.subtitle}</span>
                        <span className="text-label-sm text-secondary">{session.timestamp}</span>
                      </div>
                    </div>
                  </div>
                ))}
                {recentSessions.length > visibleSessionCount && (
                  <button
                    onClick={() => setVisibleSessionCount(prev => prev + 5)}
                    className="mt-space-2xs py-2 px-3 rounded-xl bg-surface-container-lowest hover:bg-surface-container-low text-label-sm font-semibold text-primary transition-colors flex items-center justify-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[14px]">expand_more</span>
                    View more ({recentSessions.length - visibleSessionCount} remaining)
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="pt-space-md mt-space-sm">
            <button 
              onClick={() => setShowBuilder(true)}
              className="w-full flex items-center justify-center gap-space-xs py-2.5 rounded-full bg-primary text-on-primary text-label-md font-medium hover:bg-inverse-surface shadow-sm transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              <span>New Task</span>
            </button>
          </div>
        </div>
      </div>
      
      {showBuilder && <WorkflowBuilderModal onClose={() => setShowBuilder(false)} />}
    </AppShell>
  );
}
