import React from 'react';

export const CodeSidebarBottom: React.FC = () => (
  <div>
    <div className="flex items-center justify-between px-2 mb-2">
      <span className="text-[10px] font-bold tracking-wider uppercase text-refinery-muted">Calc Environments</span>
      <button className="text-xs text-forest-800 hover:text-forest-950 font-bold flex items-center gap-0.5" type="button">
        <span>+ New Sandbox</span>
      </button>
    </div>
    
    <div className="space-y-1 text-xs">
      <div className="p-2.5 rounded-lg bg-mint-100/80 border border-mint-300 text-forest-950 shadow-xs cursor-pointer">
        <div className="font-bold text-[11.5px] truncate text-forest-900">Thermodynamics (CDU)</div>
        <div className="flex items-center justify-between text-[10px] text-forest-700 font-medium mt-1">
          <span>Python 3.10 Kernel</span>
          <span className="font-mono bg-mint-200/90 text-forest-900 px-1.5 py-0.5 rounded text-[9px] font-bold">RUNNING</span>
        </div>
      </div>

      <div className="p-2.5 rounded-lg hover:bg-white text-forest-900 border border-transparent hover:border-mint-200 cursor-pointer transition-all">
        <div className="font-medium text-[11.5px] truncate">L1 Pricing Math Model</div>
        <div className="flex items-center justify-between text-[10px] text-refinery-muted mt-1">
          <span>Stopped</span>
          <span>12h ago</span>
        </div>
      </div>
    </div>
  </div>
);

export const CodeSidebarContextPill: React.FC = () => (
  <div className="p-3 border-t border-mint-200 bg-[#E8F6ED]/80" data-purpose="global-session-pill">
    <div className="p-3 rounded-xl border border-mint-300 bg-white/95 shadow-xs">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[10px] font-bold text-forest-900 uppercase tracking-wider flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-zerohash-bright shadow-[0_0_6px_#10B981]"></span>
          Sandbox Health
        </span>
      </div>
      <p className="text-[11px] text-refinery-muted leading-snug">
        Air-Gapped REPL secure. Memory: 1.2GB/16GB.
      </p>
    </div>
  </div>
);
