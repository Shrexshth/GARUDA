import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const DocumentTopBar: React.FC = () => {
  const [versionMenuOpen, setVersionMenuOpen] = useState(false);
  const [activeVersion, setActiveVersion] = useState('v1.2 (Latest)');
  const navigate = useNavigate();

  return (
    <section className="flex-none bg-white/85 backdrop-blur-md border-b border-mint-200 px-6 py-3 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Document Title & Tags */}
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-sm md:text-base font-extrabold text-forest-950 tracking-tight">
              Note for Approval (NFA) — Emergency DCS Setpoint Readjustment &amp; Bypass Inspection
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-mint-100 text-forest-800 border border-mint-300 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-zerohash-bright"></span>
              Live Synthesis
            </span>
          </div>
          {/* Metadata Tags */}
          <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
            <span className="text-[11px] text-refinery-muted font-medium">Target: CDU-1 Pre-flash Tower C-101</span>
          </div>
        </div>

        {/* Action Cluster (Screen 2 visual styling) */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Revision Dropdown */}
          <div className="relative inline-block text-left">
            <button 
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-mint-200 bg-white hover:bg-mint-50/70 text-forest-900 text-xs font-semibold shadow-xs transition-colors" 
              onClick={() => setVersionMenuOpen(!versionMenuOpen)}
              type="button"
            >
              <svg className="w-3.5 h-3.5 text-mint-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
              </svg>
              <span>{activeVersion}</span>
              <svg className="w-3 h-3 text-refinery-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
              </svg>
            </button>
            
            {versionMenuOpen && (
              <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-mint-200 z-50 py-1 text-xs">
                <button 
                  className="w-full text-left px-3 py-2 hover:bg-mint-50 flex items-center justify-between font-medium text-forest-950" 
                  onClick={() => { setActiveVersion('v1.2 (Latest)'); setVersionMenuOpen(false); }}
                >
                  <span>v1.2 (Agent Co-Draft)</span>
                  <span className="text-status-verified font-bold text-[10px]">Active</span>
                </button>
                <button 
                  className="w-full text-left px-3 py-2 hover:bg-mint-50 text-refinery-muted" 
                  onClick={() => { setActiveVersion('v1.1 (Pre-Scan)'); setVersionMenuOpen(false); }}
                >
                  <span>v1.1 (Pre-Scan Raw)</span>
                </button>
                <button 
                  className="w-full text-left px-3 py-2 hover:bg-mint-50 text-refinery-muted" 
                  onClick={() => { setActiveVersion('v1.0 (Template)'); setVersionMenuOpen(false); }}
                >
                  <span>v1.0 (Base Template)</span>
                </button>
              </div>
            )}
          </div>
          
          {/* Edit Clauses Toggle */}
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-mint-200 bg-white hover:bg-mint-50/70 text-forest-900 text-xs font-semibold shadow-xs transition-colors" type="button">
            <svg className="w-3.5 h-3.5 text-mint-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
            </svg>
            <span>Edit Clauses</span>
          </button>
          
          {/* Export PDF */}
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-mint-200 bg-white hover:bg-mint-50/70 text-forest-900 text-xs font-semibold shadow-xs transition-colors" type="button">
            <svg className="w-3.5 h-3.5 text-mint-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
            </svg>
            <span>Export PDF</span>
          </button>
          
          {/* Export DOCX */}
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-mint-200 bg-white hover:bg-mint-50/70 text-forest-900 text-xs font-semibold shadow-xs transition-colors" type="button">
            <svg className="w-3.5 h-3.5 text-mint-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
            </svg>
            <span>Export .DOCX</span>
          </button>
          
          {/* Submit CTA */}
          <button 
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-forest-900 hover:bg-forest-950 text-white text-xs font-semibold shadow-xs hover:shadow transition-all" 
            type="button"
            onClick={() => navigate('/workspace/approval')}
          >
            <span>Submit to Approval Agent</span>
            <span className="text-zerohash-accent font-bold">→</span>
          </button>
        </div>
      </div>
    </section>
  );
};
