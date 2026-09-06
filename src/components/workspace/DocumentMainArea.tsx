import React from 'react';
import { DocumentTopBar } from './document/DocumentTopBar';
import { CoAuthoringStudio } from './document/CoAuthoringStudio';
import { OfficialDocumentCanvas } from './document/OfficialDocumentCanvas';

export const DocumentMainArea: React.FC = () => {
  return (
    <>
      <DocumentTopBar />
      
      {/* Scrollable Dual Pane Workspace */}
      <div className="flex-1 overflow-y-auto px-6 pt-5 pb-32 space-y-6 [mask-image:linear-gradient(to_bottom,black_calc(100%-4rem),transparent_100%)]" data-purpose="document-workbench-stream">
        <div className="max-w-[1720px] mx-auto space-y-6">
          
          {/* Cross-Agent Pipeline Handoff Tracker Strip */}
          <div className="bg-white border border-mint-200 rounded-xl p-3.5 zerohash-card-glow flex flex-col xl:flex-row xl:items-center justify-between gap-3 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-forest-900 text-zerohash-accent flex items-center justify-center shadow-xs ring-2 ring-mint-300">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold tracking-wider uppercase text-refinery-muted">Air-Gapped Synthesis Pipeline</span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-mint-100 text-forest-800 border border-mint-300">Orchestrated Locally</span>
                </div>
                <p className="text-xs font-medium text-forest-950 mt-0.5">
                  Auto-synthesized from Reasoning Agent &amp; Scan Agent artifacts (Ref: <span className="font-mono text-forest-900">#PID-D101-C101-REV4</span>)
                </p>
              </div>
            </div>
            
            {/* Stepper Nodes */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-mint-100 text-forest-900 border border-mint-200 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-zerohash-bright"></span>
                <span>1. Reasoning (12°C Drop) ✓</span>
              </div>
              <span className="text-mint-400 font-bold">→</span>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-mint-100 text-forest-900 border border-mint-200 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-zerohash-bright"></span>
                <span>2. P&amp;ID Vision (TI-1048) ✓</span>
              </div>
              <span className="text-mint-400 font-bold">→</span>
              <div className="flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-forest-900 text-white font-semibold shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-zerohash-accent animate-ping"></span>
                <span>3. Drafting NFA &amp; CST (Active)</span>
              </div>
              <span className="text-mint-400 font-bold">→</span>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-mint-50/80 text-refinery-muted border border-mint-200">
                <span className="w-1.5 h-1.5 rounded-full bg-mint-300"></span>
                <span>4. DoP Approval Workflow</span>
              </div>
            </div>
          </div>
          
          {/* Agent Ingestion Notice Banner */}
          <div className="bg-mint-50/70 rounded-xl border border-mint-300/80 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs text-forest-950 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-amber-100 text-amber-900 border border-amber-200 font-mono font-bold text-[10px]">HANDOFF</span>
              <span>
                <strong>Handoff Ingested:</strong> 6 Equipment Nodes, 14 Instruments, 1 Anomaly Flag 
                <code className="ml-1 font-mono bg-rose-50 text-rose-700 px-2 py-0.5 rounded border border-rose-200 font-bold">TI-1048: 136°C Delta Alert</code>
              </span>
            </div>
            <div className="hidden md:flex items-center gap-3 font-mono text-[11px] text-refinery-muted">
              <span>Source Hash: <strong className="text-forest-900">#SHA-256:7f4a...92b</strong></span>
              <span className="text-mint-300">|</span>
              <span>Sync Latency: <strong className="text-forest-900">12ms</strong></span>
            </div>
          </div>
          
          {/* MAIN DUAL-PANE WORKBENCH GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
            <CoAuthoringStudio />
            <OfficialDocumentCanvas />
          </div>
        </div>
      </div>
    </>
  );
};
