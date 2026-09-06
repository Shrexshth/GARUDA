import React from 'react';

export const CoAuthoringStudio: React.FC = () => {
  return (
    <div className="lg:col-span-5 space-y-4">
      {/* AI Technical Drafter Card */}
      <div className="bg-white border border-mint-200 rounded-2xl p-4.5 zerohash-card-glow space-y-4">
        <div className="flex items-center justify-between border-b border-mint-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-forest-900 text-zerohash-accent flex items-center justify-center shadow-xs ring-2 ring-mint-300">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <div>
              <h3 className="text-xs font-bold text-forest-950">AI Technical Drafter</h3>
              <p className="text-[10.5px] font-mono text-refinery-muted">Engine: DeepSeek-Coder-33B + Llama-3.3-70B</p>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-mint-100 text-forest-800 border border-mint-300">
            Live Synthesis
          </span>
        </div>

        {/* Document Outline & Audit checklist */}
        <div className="space-y-1.5">
          <div className="text-[10px] font-bold tracking-wider uppercase text-refinery-muted px-1">Document Outline &amp; Audit Health</div>
          <div className="space-y-1 text-xs">
            <a className="flex items-center justify-between p-2 rounded-lg bg-mint-50/60 hover:bg-mint-100/70 border border-mint-200/60 transition-colors text-forest-950" href="#sec-1">
              <span className="flex items-center gap-2 font-medium">
                <span className="w-2 h-2 rounded-full bg-zerohash-bright"></span>
                <span>1.0 Executive Summary &amp; Background</span>
              </span>
              <span className="text-[10px] font-mono text-forest-800 font-semibold">Verified</span>
            </a>
            <a className="flex items-center justify-between p-2 rounded-lg bg-mint-50/60 hover:bg-mint-100/70 border border-mint-200/60 transition-colors text-forest-950" href="#sec-2">
              <span className="flex items-center gap-2 font-medium">
                <span className="w-2 h-2 rounded-full bg-zerohash-bright"></span>
                <span>2.0 Telemetry &amp; Root Cause (TI-1048)</span>
              </span>
              <span className="text-[10px] font-mono text-forest-800 font-semibold">Extracted P&amp;ID</span>
            </a>
            <a className="flex items-center justify-between p-2 rounded-lg bg-mint-50/60 hover:bg-mint-100/70 border border-mint-200/60 transition-colors text-forest-950" href="#sec-3">
              <span className="flex items-center gap-2 font-medium">
                <span className="w-2 h-2 rounded-full bg-zerohash-bright"></span>
                <span>3.0 Multi-Agent Thermodynamic Proof</span>
              </span>
              <span className="text-[10px] font-mono text-forest-800 font-semibold">REPL Passed</span>
            </a>
            <a className="flex items-center justify-between p-2 rounded-lg bg-amber-50/80 hover:bg-amber-100/80 border border-amber-200 transition-colors text-forest-950" href="#sec-4">
              <span className="flex items-center gap-2 font-bold text-amber-900">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span>4.0 Actionable DCS Overrides</span>
              </span>
              <span className="text-[9px] font-mono bg-amber-200/80 text-amber-950 px-1.5 py-0.5 rounded font-bold">Needs Eng Signoff</span>
            </a>
            <a className="flex items-center justify-between p-2 rounded-lg bg-mint-50/60 hover:bg-mint-100/70 border border-mint-200/60 transition-colors text-forest-950" href="#sec-5">
              <span className="flex items-center gap-2 font-medium">
                <span className="w-2 h-2 rounded-full bg-zerohash-bright"></span>
                <span>5.0 DoP Justification &amp; Financials</span>
              </span>
              <span className="text-[10px] font-mono text-forest-800 font-semibold">Schedule II-B</span>
            </a>
          </div>
        </div>

        {/* Drafter Reasoning Chain Summary Accordion/Card */}
        <div className="bg-[#F3FAF5] rounded-xl border border-mint-300/80 p-3 space-y-2 text-xs">
          <div className="flex items-center justify-between font-mono text-[11px] text-forest-900 font-bold border-b border-mint-200/70 pb-1.5">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-zerohash-bright"></span>
              <span>Drafter Reasoning Chain (Step 3/3)</span>
            </span>
            <span className="text-[10px] text-refinery-muted">Confidence: 98.4%</span>
          </div>
          <p className="text-refinery-muted leading-relaxed text-[11.5px]">
            "Ingested scan coordinates from Vision Agent for <strong className="text-forest-950 font-semibold">P&amp;ID #D101-C101</strong>. Correlated thermocouple <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-mint-200 text-forest-950">TI-1048</code> temperature dip (136°C vs 148°C baseline) with 3.2% lighter naphtha vapor carryover. Prepared NFA under refinery safety compliance guidelines with DoP Schedule II-B justification."
          </p>
          <div className="pt-1 flex flex-wrap gap-1.5 font-mono text-[10px]">
            <span className="px-2 py-0.5 rounded bg-white text-forest-900 border border-mint-200 shadow-sm font-medium">
              Enthalpy: -41.2 kJ/kg
            </span>
            <span className="px-2 py-0.5 rounded bg-white text-forest-900 border border-mint-200 shadow-sm font-medium">
              FCV-201 Bias: -1.8%
            </span>
            <span className="px-2 py-0.5 rounded bg-mint-100 text-forest-900 border border-mint-300 shadow-sm font-bold">
              Confidence: 98.4%
            </span>
          </div>
        </div>

        {/* Quick Directive Buttons */}
        <div className="space-y-1.5">
          <div className="text-[10px] font-bold tracking-wider uppercase text-refinery-muted px-1">Quick Directives</div>
          <div className="flex flex-wrap gap-1.5">
            <button className="px-2.5 py-1 rounded-lg bg-mint-50/80 hover:bg-mint-100 text-forest-900 border border-mint-200 text-[11px] font-semibold transition-colors flex items-center gap-1" type="button">
              <span>⚡ Tighten Executive Phrasing</span>
            </button>
            <button className="px-2.5 py-1 rounded-lg bg-mint-50/80 hover:bg-mint-100 text-forest-900 border border-mint-200 text-[11px] font-semibold transition-colors flex items-center gap-1" type="button">
              <span>⚡ Recalculate in Code Agent</span>
            </button>
            <button className="px-2.5 py-1 rounded-lg bg-mint-50/80 hover:bg-mint-100 text-forest-900 border border-mint-200 text-[11px] font-semibold transition-colors flex items-center gap-1" type="button">
              <span>⚡ Format for CGM Approval</span>
            </button>
          </div>
        </div>
      </div>

      {/* Associated Refinery Context Assets */}
      <div className="bg-white border border-mint-200 rounded-2xl p-4 zerohash-card-glow space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold tracking-wider uppercase text-refinery-muted">Associated Refinery Context Assets</span>
          <span className="text-[10px] font-mono text-status-verified font-bold bg-mint-100 px-1.5 py-0.5 rounded border border-mint-200">3 Ingested</span>
        </div>
        
        <div className="space-y-1.5 text-xs">
          {/* Asset 1 */}
          <div className="p-2.5 rounded-xl bg-mint-50/70 border border-mint-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-forest-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <div>
                <div className="font-bold text-forest-950 font-mono text-[11px]">MRPL-DoP-Manual-2024-Rev2.pdf</div>
                <div className="text-[10px] text-refinery-muted">Section II-B: Emergency Technical Setpoint Overrides</div>
              </div>
            </div>
            <span className="text-[10px] font-mono text-status-verified font-bold">✓</span>
          </div>
          
          {/* Asset 2 */}
          <div className="p-2.5 rounded-xl bg-mint-50/70 border border-mint-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-forest-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
              <div>
                <div className="font-bold text-forest-950 font-mono text-[11px]">P&amp;ID-CDU1-D101-C101-2023.dwg.pdf</div>
                <div className="text-[10px] text-refinery-muted">Vision Agent bounding box anchor at Node TI-1048</div>
              </div>
            </div>
            <span className="text-[10px] font-mono text-status-verified font-bold">✓</span>
          </div>
          
          {/* Asset 3 */}
          <div className="p-2.5 rounded-xl bg-mint-50/70 border border-mint-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-forest-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
              </svg>
              <div>
                <div className="font-bold text-forest-950 font-mono text-[11px]">Thermodynamic-Enthalpy-Proof.py</div>
                <div className="text-[10px] text-refinery-muted">Executed locally on Apple Silicon Metal Backend</div>
              </div>
            </div>
            <span className="text-[10px] font-mono text-status-verified font-bold">✓</span>
          </div>
        </div>
      </div>
    </div>
  );
};
