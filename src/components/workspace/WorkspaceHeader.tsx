import React from 'react';
import { Link } from 'react-router-dom';

interface WorkspaceHeaderProps {
  agentName: string;
  agentRole: string;
}

export const WorkspaceHeader: React.FC<WorkspaceHeaderProps> = ({
  agentName,
  agentRole,
}) => {
  return (
    <header className="flex-none bg-white/95 backdrop-blur-md border-b border-mint-200 border-t-4 border-t-forest-900 px-5 py-2.5 z-30 shadow-sm transition-all">
      <div className="max-w-[1920px] mx-auto flex items-center justify-between gap-4">
        {/* Brand & Agent Breadcrumb */}
        <div className="flex items-center gap-3.5 min-w-max">
          <Link to="/" className="flex items-center gap-2 group transition-opacity hover:opacity-90">
            <img 
              alt="GARUDA Sovereign Crest" 
              className="h-6 w-auto object-contain brightness-95 contrast-125" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD869HcB9ownXsmywfMVu5JxcXG4NZJPlinJ-0wIsOO-7qgn6kC2G5O2ot5LZsOKpRhpKLJ4L4woOs5irokmwGy4fE4U_QmS5FAOh0BDEgvfQNNnxtgZ0NTUFyt9CX7075v3KCh4iBR2bYgh_Y4up5cF7VZoT0DqSKtuLEzjtae8Es2r8jzv1miEO2m9RaNKKjM4k5dqslyjlpF7eu_uKGdDXdWkO_0BasaT923eF-OQe3IvKSGbIsegYwVuZYvsqIascU" 
            />
            <div className="flex items-center gap-1.5">
              <span className="font-black tracking-wider text-base text-forest-900 leading-none">GARUDA</span>
              <span className="text-[9px] font-extrabold tracking-wider uppercase px-2 py-0.5 rounded-full bg-mint-200/80 text-forest-900 border border-mint-300 shadow-xs">
                MRPL ON-PREM
              </span>
            </div>
          </Link>
          
          <div className="h-4 w-px bg-mint-300/80 mx-1"></div>
          
          {/* Breadcrumb / Active Agent Path */}
          <nav aria-label="Breadcrumb" className="hidden md:flex items-center gap-1.5 text-xs text-refinery-muted">
            <Link to="/" className="hover:text-forest-900 transition-colors">Workbench</Link>
            <span className="text-mint-400">/</span>
            <span className="hover:text-forest-900 transition-colors cursor-default">Agents</span>
            <span className="text-mint-400">/</span>
            <span className="font-semibold text-forest-900 flex items-center gap-1.5 bg-white/80 px-2.5 py-0.5 rounded-full border border-mint-200 shadow-xs">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-status-green shadow-[0_0_8px_#399572] animate-pulse"></span>
              {agentName} <span className="font-normal text-refinery-muted">({agentRole})</span>
            </span>
          </nav>
        </div>

        {/* Profile & Console Actions */}
        <div className="flex items-center gap-3">

          {/* Authenticated Process Engineer Profile */}
          <div className="flex items-center gap-2.5 pl-1">
            <div className="w-7 h-7 rounded-full bg-forest-900 text-white font-bold text-xs flex items-center justify-center shadow-xs ring-2 ring-mint-300/60">
              RS
            </div>
            <div className="text-left leading-tight hidden sm:block">
              <div className="text-xs font-bold text-forest-950 flex items-center gap-1">
                R. Sharma
                <span className="text-[9px] px-1.5 py-0.5 bg-mint-100/90 text-forest-900 border border-mint-200 rounded font-semibold">CDU/VDU Lead</span>
              </div>
              <div className="text-[10px] text-refinery-muted">Shift Lead (Unit-1)</div>
            </div>
          </div>

          {/* Launch Console Dropdown Button */}
          <button className="ml-1 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-forest-900 hover:bg-forest-950 text-white text-xs font-semibold shadow-xs hover:shadow transition-all" type="button">
            <span>Console</span>
            <svg className="w-3.5 h-3.5 text-zerohash-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};
