import React from 'react';

export const ApprovalSidebarBottom: React.FC = () => (
  <div>
    <div className="flex items-center justify-between px-2 mb-2">
      <span className="text-[10px] font-bold tracking-wider uppercase text-refinery-muted">Pending Approvals</span>
      <span className="text-xs text-rose-700 bg-rose-100 font-bold px-1.5 py-0.5 rounded">
        1 Action Required
      </span>
    </div>
    
    <div className="space-y-1 text-xs">
      <div className="p-2.5 rounded-lg bg-rose-50/80 border border-rose-200 text-forest-950 shadow-xs cursor-pointer">
        <div className="font-bold text-[11.5px] truncate text-forest-900">DoP Sec II-B: ILK-101A Override</div>
        <div className="flex items-center justify-between text-[10px] text-rose-700 font-medium mt-1">
          <span>Shift Supt. Approval</span>
          <span className="font-mono bg-rose-200/90 text-rose-900 px-1.5 py-0.5 rounded text-[9px] font-bold">WAITING</span>
        </div>
      </div>

      <div className="p-2.5 rounded-lg hover:bg-white text-forest-900 border border-transparent hover:border-mint-200 cursor-pointer transition-all opacity-70">
        <div className="font-medium text-[11.5px] truncate line-through decoration-slate-400">Naphtha Blending Ratio Adj</div>
        <div className="flex items-center justify-between text-[10px] text-refinery-muted mt-1">
          <span>Approved by R. Sharma</span>
          <span>12h ago</span>
        </div>
      </div>
    </div>
  </div>
);

export const ApprovalSidebarContextPill: React.FC = () => (
  <div className="p-3 border-t border-mint-200 bg-[#E8F6ED]/80" data-purpose="global-session-pill">
    <div className="p-3 rounded-xl border border-mint-300 bg-white/95 shadow-xs">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[10px] font-bold text-forest-900 uppercase tracking-wider flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-zerohash-bright shadow-[0_0_6px_#10B981]"></span>
          Audit Ledger
        </span>
      </div>
      <p className="text-[11px] text-refinery-muted leading-snug">
        Immutable log synced. SHA-256 hash verified.
      </p>
    </div>
  </div>
);
