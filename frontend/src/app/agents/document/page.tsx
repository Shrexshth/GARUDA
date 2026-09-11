"use client";

import { useState, useRef, useEffect } from "react";
import AppShell from "@/components/layout/AppShell";
import { useTasks } from "@/context/TaskContext";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import Card from "@/components/ui/Card";
import PillButton from "@/components/ui/PillButton";
import EmptyState from "@/components/ui/EmptyState";
import InputBar from "@/components/ui/InputBar";
import toast from "react-hot-toast";

interface DocumentDraft {
  id: string;
  title: string;
  version: string;
  status: string;
  lastSync: string;
  content: string;
  filePath: string;
}

export default function DocumentAgentPage() {
  const [activeDraft, setActiveDraft] = useState<DocumentDraft | null>(null);
  const [promptText, setPromptText] = useState("");
  
  const { tasks, registerTask, clearTask } = useTasks();
  
  const activeTask = Object.values(tasks).find(t => t.agent === "document");
  const loading = activeTask?.status === "running" || activeTask?.status === "pending";
  const router = useRouter();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const q = searchParams.get("q");
    if (q) {
      setTimeout(() => {
        setPromptText(q);
        handleSubmit(q);
        router.replace("/agents/document", { scroll: false });
      }, 100);
    }
  }, [router]);

  useEffect(() => {
    if (activeTask && (activeTask.status === "completed" || activeTask.status === "failed")) {
      if (activeTask.status === "completed" && activeTask.result) {
        const data = activeTask.result;
        setActiveDraft({
          id: Date.now().toString(),
          title: "Note for Approval (NFA)",
          version: "v1.0.0",
          status: "Draft",
          lastSync: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
          content: data.messages && data.messages.length > 0 ? data.messages[data.messages.length - 1].content : "Draft generated successfully.",
          filePath: data.generated_file_path || ""
        });
      } else {
        toast.error(activeTask.result?.error || "Failed to generate document.");
      }
      clearTask(activeTask.id);
    }
  }, [activeTask, clearTask]);

  const handleSubmit = async (textToSubmit?: string) => {
    const text = typeof textToSubmit === 'string' ? textToSubmit : promptText;
    if (!text.trim()) return;

    try {
      const res = await fetch("http://localhost:8000/api/agents/document/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ summary: text }),
      });
      const data = await res.json();
      
      if (res.ok && data.success && data.task_id) {
        registerTask(data.task_id, "document");
      } else {
        throw new Error(data.detail || "Draft generation failed to start.");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to start document generation.");
    }
  };

  const handleDownload = () => {
    if (!activeDraft?.filePath) return;
    
    // The backend returns an absolute path, so we extract just the filename
    const parts = activeDraft.filePath.split('/');
    const filename = parts[parts.length - 1] || parts[parts.length - 2]; 
    // Handle Windows paths just in case
    const safeFilename = filename.split('\\').pop();
    
    window.open(`http://localhost:8000/api/agents/document/download?filename=${safeFilename}`, '_blank');
    toast.success("Download started!");
  };

  return (
    <AppShell>
      <div className="flex flex-col w-full">
        {/* Top Action Bar */}
        <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md mb-space-xl">
          <div className="flex flex-wrap items-center gap-space-sm">
            <div className="w-10 h-10 rounded-2xl bg-surface-container flex items-center justify-center text-on-surface shadow-sm">
              <span className="material-symbols-outlined text-[20px]">assignment_turned_in</span>
            </div>
            <div className="flex flex-col">
              <span className="text-headline-md font-semibold text-on-surface tracking-tight leading-none">Document Agent</span>
              <span className="text-body-sm text-secondary">Autonomous Technical Synthesis</span>
            </div>
          </div>
          <div className="flex items-center gap-space-xs flex-wrap">
            <PillButton variant="secondary" icon="visibility" disabled>Audit Trail</PillButton>
            <PillButton variant="secondary" icon="picture_as_pdf" disabled>Download PDF</PillButton>
            <PillButton 
              variant="primary" 
              icon="description" 
              disabled={!activeDraft}
              onClick={handleDownload}
            >
              Export as .docx
            </PillButton>
          </div>
        </section>

        {/* Document Studio */}
        <div className="w-full max-w-5xl mx-auto flex flex-col gap-space-xl">
          {activeDraft === null ? (
            <Card>
              <EmptyState
                icon="article"
                title="No active document draft"
                description="Start a new NFA or compliance note to begin drafting. The Document Agent will synthesize equipment data and generate formal documentation."
              />
              <div className="mt-space-md w-full max-w-2xl mx-auto">
                <InputBar placeholder="Describe the NFA (e.g. Upgrade pump P-102)..." onSubmit={handleSubmit} />
              </div>
              {loading && <div className="text-center mt-4 text-secondary animate-pulse">Drafting document via docxtpl...</div>}
            </Card>
          ) : (
            <article className="w-full bg-surface-container-lowest rounded-2xl shadow-[0_20px_50px_-12px_rgba(17,24,39,0.06),0_1px_3px_0_rgba(17,24,39,0.02)] p-space-xl md:p-space-3xl flex flex-col relative overflow-hidden">
              <div className="flex items-center justify-between mb-8 border-b border-surface-container-low pb-4">
                 <div>
                    <h2 className="text-headline-lg font-bold text-on-surface">{activeDraft.title}</h2>
                    <p className="text-secondary text-label-sm">Version {activeDraft.version} • Last synced {activeDraft.lastSync}</p>
                 </div>
                 <div className="px-3 py-1 bg-primary-container text-on-primary-container rounded-full text-label-sm font-semibold">
                    {activeDraft.status}
                 </div>
              </div>
              <div className="prose prose-sm max-w-none text-on-surface whitespace-pre-wrap font-serif">
                <ReactMarkdown>{activeDraft.content}</ReactMarkdown>
              </div>
              <div className="mt-8 text-secondary text-label-sm">
                File generated at: {activeDraft.filePath}
              </div>
            </article>
          )}
        </div>
      </div>
    </AppShell>
  );
}
