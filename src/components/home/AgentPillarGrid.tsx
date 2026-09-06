import React from 'react';
import { Link } from 'react-router-dom';

/**
 * AgentCard Component
 * Shared component for displaying an agent.
 */
interface Agent {
  id: string;
  name: string;
  version: string;
  description: string;
  category: string;
  iconId: string;
}

const getIcon = (iconId: string) => {
  switch (iconId) {
    case 'reasoning':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
        </svg>
      );
    case 'scan':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
          <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
        </svg>
      );
    case 'document':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
        </svg>
      );
    case 'code':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
        </svg>
      );
    case 'knowledge':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
        </svg>
      );
    case 'approval':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
        </svg>
      );
    default:
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
        </svg>
      );
  }
};

export const AgentCard: React.FC<{ agent: Agent }> = ({ agent }) => {
  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs agent-card-transition flex flex-col justify-between">
      <div>
        <div className="w-10 h-10 rounded-lg bg-mint-50 border border-mint-200 flex items-center justify-center text-forest-800 mb-4">
          {getIcon(agent.iconId)}
        </div>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-forest-950">{agent.name}</h3>
          <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">{agent.version}</span>
        </div>
        <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-normal">
          {agent.description}
        </p>
      </div>
      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[11px] font-medium text-forest-700">{agent.category}</span>
        <Link to={`/workspace/${agent.iconId}`} className="text-xs font-semibold text-forest-900 inline-flex items-center hover:text-forest-700 transition-colors">
          Engage ↗
        </Link>
      </div>
    </div>
  );
};

/**
 * AgentPillarGrid Component
 * 
 * Props / Interface:
 * - `agents`: Agent[]
 * - `deployedUnits`: string[]
 * 
 * API Endpoints:
 * - GET /api/agents
 * - GET /api/system/deployments
 * 
 * Real-time Needs:
 * - None.
 * 
 * States:
 * - Loading: Skeleton grid.
 * - Empty: No agents available message.
 */

interface AgentPillarGridProps {
  agents?: Agent[];
  deployedUnits?: string[];
}

const defaultAgents: Agent[] = [
  { id: '1', name: 'Reasoning Agent', version: 'v3.4-Q8', description: 'Open-ended operational Q&A, drafting, summarization, and unified session orchestration across plant domains.', category: 'Generalist Orchestrator', iconId: 'reasoning' },
  { id: '2', name: 'Scan / Vision Agent', version: 'VLM-72B', description: 'Converts P&IDs, handwritten inspection data, and engineering schematics into structured, queryable data tables.', category: 'Extractor Engine', iconId: 'scan' },
  { id: '3', name: 'Document Agent', version: 'DOC-CORE', description: 'Drafts, formats, and versions official MRPL NFAs, CSTs, and technical memoranda aligned to refinery compliance.', category: 'Author & Formatter', iconId: 'document' },
  { id: '4', name: 'Code / Calc Agent', version: 'PY-SANDBOX', description: 'Sandboxed Python REPL running certified thermodynamic, chemical, and L1 pricing math with zero cloud dependency.', category: 'Deterministic Verifier', iconId: 'code' },
  { id: '6', name: 'Approval / Workflow', version: 'DOP-VERIFY', description: 'Enforces Delegation of Power (DoP) human-in-the-loop sign-offs, authorization chains, and immutable audit logs.', category: 'Governance Gatekeeper', iconId: 'approval' }
];

const defaultUnits = ["HPCL/MRPL CDU-1", "VDU-2", "Hydrocracker Unit (HCU)", "FCCU", "Utilities & Power"];

export const AgentPillarGrid: React.FC<AgentPillarGridProps> = ({
  agents = defaultAgents,
  deployedUnits = defaultUnits
}) => {
  return (
    <section className="py-20 bg-slate-50/50" data-purpose="specialized-agents-grid" id="agents">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-mint-100 text-forest-800 border border-mint-200">
            Agents
          </span>
          <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-forest-950">
            Precision AI Architecture for Industrial Operations
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            Deploy deterministic, auditable multi-agent teams built directly for safety-critical refinery protocols.
          </p>
        </div>

        {/* Filter Tab Strip */}
        <div className="mt-10 flex justify-center border-b border-slate-200">
          <nav aria-label="Tabs" className="flex space-x-8">
            <button className="border-b-2 border-forest-900 text-forest-900 py-3 px-1 text-xs sm:text-sm font-bold tracking-tight">
              ALL AGENTS
            </button>
            <button className="border-b-2 border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300 py-3 px-1 text-xs sm:text-sm font-medium tracking-tight transition-colors">
              ANALYSIS & VISION
            </button>
            <button className="border-b-2 border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300 py-3 px-1 text-xs sm:text-sm font-medium tracking-tight transition-colors">
              SYNTHESIS & COMPLIANCE
            </button>
          </nav>
        </div>

        {/* 3-Column Grid of Agents */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map(agent => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>

        {/* Deployed At Refinery Units Bar */}
        <div className="mt-12 p-4 rounded-xl bg-white border border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center space-x-2 text-slate-500 font-semibold tracking-wide uppercase">
            <span className="h-2 w-2 rounded-full bg-status-green"></span>
            <span>Deployed At Refinery Units:</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 font-mono text-slate-700">
            {deployedUnits.map((unit, idx) => (
              <span key={idx} className="px-2.5 py-1 bg-slate-100 rounded text-[11px]">{unit}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
