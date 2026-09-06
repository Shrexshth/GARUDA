import React from 'react';
import { Link, useLocation } from 'react-router-dom';

/**
 * TopNavigationBar Component
 * 
 * Props / Interface:
 * - `nodeStatus`: 'online' | 'offline' | 'degraded'
 * - `nodeName`: string
 * 
 * API Endpoints:
 * - GET /api/system/status -> { status: string, nodeName: string }
 * 
 * Real-time Needs:
 * - Polling every 30s or SSE for node status.
 * 
 * States:
 * - Loading: Skeleton for node name.
 * - Offline: Amber/Red pulsing indicator.
 */

interface TopNavigationBarProps {
  nodeStatus?: 'online' | 'offline' | 'degraded';
  nodeName?: string;
}

export const TopNavigationBar: React.FC<TopNavigationBarProps> = ({
  nodeStatus = 'online',
  nodeName = 'Mac-Cluster'
}) => {
  const location = useLocation();

  const getStatusColor = () => {
    switch (nodeStatus) {
      case 'online': return 'bg-status-green';
      case 'degraded': return 'bg-status-amber';
      case 'offline': return 'bg-status-red';
    }
  };

  const getStatusBgColor = () => {
    switch (nodeStatus) {
      case 'online': return 'bg-mint-400';
      case 'degraded': return 'bg-amber-400';
      case 'offline': return 'bg-red-400';
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-mint-200 border-t-4 border-t-forest-900 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Identification */}
        <div className="flex items-center space-x-3">
          <Link to="/" className="flex items-center space-x-2.5">
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCu_Q3cKif1th2X9qUZsnDZ8ZQxqqRiwH-T-NfN2Dprmor_b_JhA1vNjg3UbajNLsh0S0xM8pVcV6Msks0-LK16NnQ2dfvDmBbJYDM1DJLbSJxNP8ouK-ejbY2LiOerF47dRNR4bbWJLAf1AnfHeziUFkUBRAQEJA7iel9JfGk7Uz2LkvoA0tW9e_fFXLhr29JEPBq3q1GbLiNGJaxibPEpJhddWyADOEy7QUcNS_-dTDBx2xCVC2YsHVciGfKl_Kb32wY" alt="GARUDA Logo" className="h-8 w-auto object-contain" />
            <div className="flex flex-col">
              <div className="flex items-center space-x-1.5 leading-none">
                <span className="font-extrabold tracking-wider text-base text-forest-950">GARUDA</span>
                <span className="text-[9px] font-bold tracking-tight uppercase bg-mint-100 text-forest-800 px-1.5 py-0.5 rounded border border-mint-300/60">MRPL ON-PREM</span>
              </div>
              <span className="text-[10px] text-refinery-muted font-medium tracking-tight mt-0.5">Sovereign Refinery AI Workbench</span>
            </div>
          </Link>
        </div>
        
        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-forest-900">
          <Link to="/" className={`transition-colors hover:text-forest-800 ${location.pathname === '/' ? 'text-forest-950 font-semibold' : ''}`}>Agents</Link>
          <Link to="/workflows" className={`transition-colors hover:text-forest-800 ${location.pathname === '/workflows' ? 'text-forest-950 font-semibold' : ''}`}>Workflows</Link>
          <Link to="/audit-trail" className={`transition-colors hover:text-forest-800 ${location.pathname === '/audit-trail' ? 'text-forest-950 font-semibold' : ''}`}>Audit Trail</Link>
          <Link to="/documentation" className={`transition-colors hover:text-forest-800 ${location.pathname === '/documentation' ? 'text-forest-950 font-semibold' : ''}`}>Documentation</Link>
          <Link to="/account" className={`transition-colors hover:text-forest-800 ${location.pathname === '/account' ? 'text-forest-950 font-semibold' : ''}`}>Account</Link>
        </nav>
        
        {/* Right Action Items */}
        <div className="flex items-center space-x-4">
          <div className="hidden lg:flex items-center space-x-2 px-2.5 py-1 rounded-full bg-mint-50 border border-mint-200 text-xs font-mono text-forest-800">
            <span className="relative flex h-2 w-2">
              {nodeStatus === 'online' && <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${getStatusBgColor()} opacity-75`}></span>}
              <span className={`relative inline-flex rounded-full h-2 w-2 ${getStatusColor()}`}></span>
            </span>
            <span>Node: {nodeName} · {nodeStatus.charAt(0).toUpperCase() + nodeStatus.slice(1)}</span>
          </div>
          
          <button className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold tracking-wide text-white bg-forest-900 hover:bg-forest-950 rounded-full transition-all shadow-sm focus:outline-none focus:ring-4 focus:ring-mint-500/20" type="button">
            Launch Console
            <svg className="ml-1.5 -mr-0.5 w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};
