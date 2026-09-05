"use client";

import { useState } from "react";
import AppShell from "@/components/layout/AppShell";
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
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (summary: string) => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/agents/document/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ summary }),
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        setActiveDraft({
          id: Date.now().toString(),
          title: "Note for Approval (NFA)",
          version: "v1.0.0",
          status: "Draft",
          lastSync: new Date().toLocaleTimeString(),
          content: data.content || "Draft generated successfully.",
          filePath: data.file_path || ""
        });
        toast.success("Draft generated successfully!");
      } else {
        throw new Error(data.detail || "Draft generation failed.");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to generate document.");
    } finally {
      setLoading(false);
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
                <InputBar placeholder="Describe the NFA (e.g. Upgrade pump P-102)..." onSubmit={handleGenerate} />
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
                {activeDraft.content}
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
