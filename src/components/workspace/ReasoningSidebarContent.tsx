import React from 'react';

export const ReasoningSidebarBottom: React.FC = () => (
  <div>
    <div className="flex items-center justify-between px-2 mb-2">
      <span className="text-[10px] font-bold tracking-wider uppercase text-refinery-muted">Reasoning Sessions</span>
      <button className="text-xs text-forest-800 hover:text-forest-950 font-bold flex items-center gap-0.5" type="button">
        <span>+ New</span>
      </button>
    </div>
    
    <div className="space-y-1 text-xs">
      {/* Active Session */}
      <div className="p-2.5 rounded-lg bg-mint-100/80 border border-mint-300 text-forest-950 shadow-xs cursor-pointer">
        <div className="font-bold text-[11.5px] truncate text-forest-900">Crude Assay TBP Curve &amp; Pre-flash</div>
        <div className="flex items-center justify-between text-[10px] text-forest-700 font-medium mt-1">
          <span>CDU-1 Operational</span>
          <span className="font-mono bg-mint-200/90 text-forest-900 px-1.5 py-0.5 rounded text-[9px] font-bold">ACTIVE</span>
        </div>
      </div>

      {/* Session 2 */}
      <div className="p-2.5 rounded-lg hover:bg-white text-forest-900 border border-transparent hover:border-mint-200 cursor-pointer transition-all">
        <div className="font-medium text-[11.5px] truncate">Desalter Conductivity Anomaly</div>
        <div className="flex items-center justify-between text-[10px] text-refinery-muted mt-1">
          <span>Desalter D-101</span>
          <span>2h ago</span>
        </div>
      </div>

      {/* Session 3 */}
      <div className="p-2.5 rounded-lg hover:bg-white text-forest-900 border border-transparent hover:border-mint-200 cursor-pointer transition-all">
        <div className="font-medium text-[11.5px] truncate">Furnace F-101 Coil Outlet Temp Drift</div>
        <div className="flex items-center justify-between text-[10px] text-refinery-muted mt-1">
          <span>F-101 Radiation Zone</span>
          <span>Yesterday</span>
        </div>
      </div>

      {/* Session 4 */}
      <div className="p-2.5 rounded-lg hover:bg-white text-forest-900 border border-transparent hover:border-mint-200 cursor-pointer transition-all">
        <div className="font-medium text-[11.5px] truncate">Hydrocracker Feed Sulfur Compliance</div>
        <div className="flex items-center justify-between text-[10px] text-refinery-muted mt-1">
          <span>HCU Complex</span>
          <span>Apr 27</span>
        </div>
      </div>
    </div>
  </div>
);

export const ReasoningSidebarContextPill: React.FC = () => (
  <div className="p-3 border-t border-mint-200 bg-mint-50/80" data-purpose="global-session-pill">
    <div className="p-3 rounded-xl border border-mint-300 bg-white/95 shadow-xs">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[10px] font-bold text-forest-900 uppercase tracking-wider flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-zerohash-bright shadow-[0_0_6px_#62B18E]"></span>
          Global Session Context
        </span>
        <span className="text-[10px] font-mono text-refinery-muted bg-mint-50 px-1.5 py-0.5 rounded border border-mint-200">4,820 / 32k tok</span>
      </div>
      <p className="text-[11px] text-refinery-muted leading-snug">
        2 active engineering documents attached. Cross-agent handoff pipeline verified.
      </p>
    </div>
  </div>
);
