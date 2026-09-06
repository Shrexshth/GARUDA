import React, { type ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface WorkspaceSidebarProps {
  activeAgentId: 'reasoning' | 'scan' | 'document' | 'code' | 'knowledge' | 'approval';
  bottomSection: ReactNode;
  contextPill: ReactNode;
}

export const WorkspaceSidebar: React.FC<WorkspaceSidebarProps> = ({
  activeAgentId,
  bottomSection,
  contextPill
}) => {
  const getAgentLinkClasses = (id: string) => {
    if (activeAgentId === id) {
      return "flex items-center justify-between px-3 py-2.5 rounded-lg bg-gradient-to-r from-forest-900 to-forest-800 text-white font-semibold text-xs shadow-sm ring-1 ring-forest-800 transition-all group";
    }
    return "flex items-center justify-between px-3 py-2 rounded-lg text-forest-900 hover:bg-white hover:text-forest-950 hover:shadow-sm font-medium text-xs border border-transparent hover:border-mint-200 transition-all group";
  };

  const getIconContainerClasses = (id: string) => {
    if (activeAgentId === id) {
      return "p-1 rounded bg-forest-700/90 text-mint-400 shadow-sm transition-all";
    }
    return "p-1 rounded bg-mint-100/70 text-forest-700 group-hover:bg-mint-200 group-hover:text-forest-900 transition-colors";
  };

  return (
    <aside className="w-72 flex-none bg-forest-50 border-r border-mint-200 flex flex-col justify-between h-full select-none" data-purpose="agent-navigation-sidebar">
      {/* Top Section: Agents Switcher & Sessions */}
      <div className="flex-1 overflow-y-auto p-3 space-y-5">
        
        {/* Back to Grid Button */}
        <Link className="flex items-center gap-2 text-xs font-semibold text-forest-900 hover:text-forest-950 px-3 py-2 rounded-lg border border-mint-200 hover:border-mint-300 bg-white/90 hover:bg-white transition-all shadow-xs group" to="/">
          <svg className="w-3.5 h-3.5 text-mint-500 group-hover:text-forest-900 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          <span>All Refinery Agents Hub</span>
        </Link>

        {/* Agent Switcher List */}
        <div>
          <div className="flex items-center justify-between px-2 mb-2">
            <span className="text-[10px] font-bold tracking-wider uppercase text-refinery-muted">Agent Switcher</span>
            <span className="text-[10px] text-forest-800 bg-mint-100 border border-mint-200 px-1.5 py-0.5 rounded font-mono font-medium">5 Ready</span>
          </div>
          
          <nav aria-label="Agent List" className="space-y-1">
            {/* 1. Reasoning Agent */}
            <Link className={getAgentLinkClasses('reasoning')} to="/workspace/reasoning">
              <div className="flex items-center gap-2.5">
                <span className={getIconContainerClasses('reasoning')}>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                </span>
                <span className="tracking-tight">Reasoning Agent</span>
              </div>
              {activeAgentId === 'reasoning' ? (
                <span className="w-2 h-2 rounded-full bg-zerohash-accent shadow-[0_0_10px_#62B18E]"></span>
              ) : (
                <span className="text-[10px] text-refinery-muted font-mono font-medium">01</span>
              )}
            </Link>

            {/* 2. Scan / Vision Agent */}
            <Link className={getAgentLinkClasses('scan')} to="/workspace/scan">
              <div className="flex items-center gap-2.5">
                <span className={getIconContainerClasses('scan')}>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                </span>
                <span>Scan / Vision Agent</span>
              </div>
              {activeAgentId === 'scan' ? (
                <span className="w-2 h-2 rounded-full bg-zerohash-accent shadow-[0_0_10px_#62B18E]"></span>
              ) : (
                <span className="text-[10px] text-refinery-muted font-mono font-medium">02</span>
              )}
            </Link>

            {/* 3. Document Agent */}
            <Link className={getAgentLinkClasses('document')} to="/workspace/document">
              <div className="flex items-center gap-2.5">
                <span className={getIconContainerClasses('document')}>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </span>
                <span>Document Agent</span>
              </div>
              {activeAgentId === 'document' ? (
                <span className="w-2 h-2 rounded-full bg-zerohash-accent shadow-[0_0_10px_#62B18E]"></span>
              ) : (
                <span className="text-[10px] text-refinery-muted font-mono font-medium">03</span>
              )}
            </Link>

            {/* 4. Code / Calc Agent */}
            <Link className={getAgentLinkClasses('code')} to="/workspace/code">
              <div className="flex items-center gap-2.5">
                <span className={getIconContainerClasses('code')}>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
                  </svg>
                </span>
                <span>Code / Calc Agent</span>
              </div>
              {activeAgentId === 'code' ? (
                <span className="w-2 h-2 rounded-full bg-zerohash-accent shadow-[0_0_10px_#62B18E]"></span>
              ) : (
                <span className="text-[10px] text-refinery-muted font-mono font-medium">04</span>
              )}
            </Link>


            {/* 6. Approval / Workflow Agent */}
            <Link className={getAgentLinkClasses('approval')} to="/workspace/approval">
              <div className="flex items-center gap-2.5">
                <span className={getIconContainerClasses('approval')}>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                  </svg>
                </span>
                <span>Approval / Workflow</span>
              </div>
              {activeAgentId === 'approval' ? (
                <span className="w-2 h-2 rounded-full bg-zerohash-accent shadow-[0_0_10px_#62B18E]"></span>
              ) : (
                <span className="text-[10px] text-refinery-muted font-mono font-medium">05</span>
              )}
            </Link>
          </nav>
        </div>

        {/* Dynamic Bottom Section (Recent Sessions / Deliverables) */}
        {bottomSection}

      </div>

      {/* Dynamic Global Session Context Pill */}
      {contextPill}
    </aside>
  );
};
