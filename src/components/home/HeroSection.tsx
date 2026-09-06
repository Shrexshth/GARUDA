import React, { useState } from 'react';
import { Paperclip, ArrowRight, Check } from 'lucide-react';
import ParticleGlobe from './ParticleGlobe';

/**
 * HeroSection Component
 * 
 * Props / Interface:
 * - `quickPrompts`: string[]
 * - `onSubmitPrompt`: (prompt: string) => void
 * 
 * API Endpoints:
 * - POST /api/agents/invoke -> Returns the invoked agent session ID or redirects.
 * 
 * Real-time Needs:
 * - None for submission; wait for 200 OK and route to specific agent workspace.
 * 
 * States:
 * - Empty input state.
 * - Loading/Submitting state (disable input & button).
 */

interface HeroSectionProps {
  quickPrompts?: string[];
  onSubmitPrompt?: (prompt: string) => void;
}

const defaultPrompts = [
  "Extract P&ID Valve Specs",
  "Thermodynamic Heat Balance",
  "Draft NFA for Maintenance",
  "Query SOP Safety Clause"
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  quickPrompts = defaultPrompts,
  onSubmitPrompt
}) => {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = () => {
    if (prompt.trim() && onSubmitPrompt) {
      onSubmitPrompt(prompt);
    }
  };

  return (
    <section className="relative pt-8 pb-20 bg-gradient-to-b from-mint-50/80 via-white to-white overflow-hidden">
      {/* Particle Globe Background - positioned to show only the top half */}
      <div className="absolute left-1/2 bottom-0 w-[800px] md:w-[1000px] h-[800px] md:h-[1000px] -translate-x-1/2 translate-y-[45%] opacity-80 pointer-events-none z-0">
        <ParticleGlobe />
      </div>

      <div className="relative z-10">
        {/* Top Compliance Pill Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center mb-8">
        <div className="inline-flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-mint-200 shadow-[0_1px_3px_rgba(0,0,0,0.02)] backdrop-blur-sm text-xs font-medium text-slate-700">
          <span className="inline-flex items-center text-forest-800 font-semibold px-2 py-0.5 rounded-full bg-mint-50 border border-mint-200/80">
            <Check className="text-status-green mr-1 w-3 h-3" strokeWidth={3} /> Air-Gapped
          </span>
          <span className="text-slate-300 hidden sm:inline">|</span>
          <span className="inline-flex items-center text-slate-700 px-2 py-0.5">
            <Check className="text-status-green mr-1 w-3 h-3" strokeWidth={3} /> DPDP Compliant
          </span>
          <span className="text-slate-300 hidden sm:inline">|</span>
          <span className="inline-flex items-center text-slate-700 px-2 py-0.5">
            <Check className="text-status-green mr-1 w-3 h-3" strokeWidth={3} /> On-Premises
          </span>
          <span className="text-slate-300 hidden sm:inline">|</span>
          <span className="inline-flex items-center text-slate-700 px-2 py-0.5">
            <Check className="text-status-green mr-1 w-3 h-3" strokeWidth={3} /> CERT-In Aligned
          </span>
        </div>
      </div>

      {/* Main Headline & Subtitle */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[44px] font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-forest-950 to-forest-700 leading-[1.12]">
          Sovereign AI, Built for the Refinery Floor
        </h1>
        <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
          Air-gapped intelligence for refinery operations, engineering calculations, and high-assurance automated workflows.
        </p>
      </div>

      {/* Large Interactive Prompt Box (Hero Quick Start) */}
      <div className="mt-10 max-w-3xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-2xl p-2.5 sm:p-3 border border-mint-200 shadow-lg shadow-mint-900/5 focus-within:ring-4 focus-within:ring-mint-500/20 focus-within:border-forest-800 transition-all hover:shadow-xl hover:shadow-mint-900/10">
          <div className="flex items-center space-x-3 px-2">
            <span className="text-slate-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </span>
            <input 
              className="w-full border-none focus:ring-0 text-sm sm:text-base placeholder-slate-400 text-forest-950 py-2 px-0 bg-transparent font-medium outline-none" 
              placeholder="What do you need to do today? Ask anything or trigger an agent..." 
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />
            <div className="flex items-center space-x-2">
              <button aria-label="Attach File" className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors" type="button">
                <Paperclip className="w-5 h-5" />
              </button>
              <button 
                className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold tracking-wide text-white bg-forest-900 hover:bg-forest-950 rounded-xl transition-all shadow-sm focus:outline-none focus:ring-4 focus:ring-mint-500/20 whitespace-nowrap" 
                type="button"
                onClick={handleSubmit}
              >
                Run Agent <ArrowRight className="ml-1 w-4 h-4 inline" />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Prompt Chips */}
        <div className="mt-3.5 flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="text-slate-400 font-medium mr-1">Quick prompts:</span>
          {quickPrompts.map((q, idx) => (
            <button 
              key={idx}
              className="px-3 py-1 rounded-full bg-white/70 hover:bg-white text-slate-600 hover:text-forest-900 border border-slate-200/80 transition-all shadow-xs" 
              type="button"
              onClick={() => setPrompt(q)}
            >
              {q}
            </button>
          ))}
        </div>
      </div>
      </div>
    </section>
  );
};
