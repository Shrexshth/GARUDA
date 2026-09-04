"use client";

import { useState } from "react";
import AppShell from "@/components/layout/AppShell";
import Card from "@/components/ui/Card";
import PillButton from "@/components/ui/PillButton";
import EmptyState from "@/components/ui/EmptyState";

interface DocumentDraft {
  id: string;
  title: string;
  version: string;
  status: string;
  lastSync: string;
  content: string;
}

export default function DocumentAgentPage() {
  const [activeDraft] = useState<DocumentDraft | null>(null);

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
            <PillButton variant="primary" icon="description" disabled>Export as .docx</PillButton>
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
              <div className="flex justify-center mt-space-md">
                <PillButton variant="primary" icon="add">Start New Draft</PillButton>
              </div>
            </Card>
          ) : (
            <article className="w-full bg-surface-container-lowest rounded-2xl shadow-[0_20px_50px_-12px_rgba(17,24,39,0.06),0_1px_3px_0_rgba(17,24,39,0.02)] p-space-xl md:p-space-3xl flex flex-col relative overflow-hidden">
              {/* Document content would render here from activeDraft state */}
            </article>
          )}
        </div>
      </div>
    </AppShell>
  );
}
