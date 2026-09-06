import React from 'react';

/**
 * EnterpriseFooter Component
 * 
 * Props / Interface:
 * - `systemVersion`: string
 * - `nodeStatusText`: string
 * - `activeNodes`: number
 * - `totalNodes`: number
 * 
 * API Endpoints:
 * - GET /api/system/health
 * 
 * Real-time Needs:
 * - WebSocket/SSE for the active node ping.
 * 
 * States:
 * - Degraded: e.g., "2/3 active" with amber coloring.
 */

interface EnterpriseFooterProps {
  systemVersion?: string;
  nodeStatusText?: string;
  activeNodes?: number;
  totalNodes?: number;
}

export const EnterpriseFooter: React.FC<EnterpriseFooterProps> = ({
  systemVersion = "v2.8.4",
  nodeStatusText = "All physical cluster nodes operational",
  activeNodes = 3,
  totalNodes = 3
}) => {
  const isHealthy = activeNodes === totalNodes;

  return (
    <footer className="bg-white border-t border-mint-200" data-purpose="enterprise-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        {/* 5-Column Navigation Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Col 1: System Info */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center space-x-2">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDEXiDAtjT_24XRrV-KzakeHKiMi_kpI1afKhBUkmUWb5Pti-AGk4SdxvUhjmuYvTR9VeMYgveAoAaOmFBtgueEu5ZCa2Cl1zDESkUxU91P8RfTHEFMuHAup5JWvDnDtm4nXtZJYOfNga_4Ssu_O5YJhllwvcdSzlN1sRBwBF5IdOblrerZoA2CP4YSkGeVE0n4cy86tpyfea-WMt_Aehyqzbo96Bo6FFPrfJ0IJSm3w-ub3ZcAe8TpeVIa0fXfqNgeE1E" alt="GARUDA Logo" className="h-7 w-auto object-contain" />
              <span className="font-extrabold tracking-wider text-base text-forest-950">GARUDA</span>
            </div>
            <p className="mt-3 text-xs text-refinery-muted leading-relaxed">
              MRPL Sovereign AI System. Strictly restricted for authorized petroleum refinery engineering personnel.
            </p>
            <div className="mt-4 flex space-x-3 text-xs text-refinery-muted font-mono">
              <span>{systemVersion}</span>
              <span>·</span>
              <span>Intranet-Only</span>
            </div>
          </div>
          
          {/* Col 2: Agents */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-forest-950 mb-4">Agents</h4>
            <ul className="space-y-2.5 text-xs text-forest-900 font-medium">
              <li><a className="hover:text-forest-800 transition-colors" href="#">Reasoning Agent</a></li>
              <li><a className="hover:text-forest-800 transition-colors" href="#">Scan & Vision</a></li>
              <li><a className="hover:text-forest-800 transition-colors" href="#">Document Author</a></li>
              <li><a className="hover:text-forest-800 transition-colors" href="#">Code & REPL</a></li>
              <li><a className="hover:text-forest-800 transition-colors" href="/audit-trail">Audit Trail</a></li>
              <li><a className="hover:text-forest-800 transition-colors" href="#">DoP Approval</a></li>
            </ul>
          </div>
          
          {/* Col 3: Workflows */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-forest-950 mb-4">Workflows</h4>
            <ul className="space-y-2.5 text-xs text-forest-900 font-medium">
              <li><a className="hover:text-forest-800 transition-colors" href="#">P&ID Extraction</a></li>
              <li><a className="hover:text-forest-800 transition-colors" href="#">NFA Generation</a></li>
              <li><a className="hover:text-forest-800 transition-colors" href="#">Safety SOP Retrieval</a></li>
              <li><a className="hover:text-forest-800 transition-colors" href="#">Thermodynamic Verification</a></li>
              <li><a className="hover:text-forest-800 transition-colors" href="#">Turnaround Planning</a></li>
            </ul>
          </div>
          
          {/* Col 4: Compliance */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-forest-950 mb-4">Compliance</h4>
            <ul className="space-y-2.5 text-xs text-forest-900 font-medium">
              <li><a className="hover:text-forest-800 transition-colors" href="#">Air-Gap Verification</a></li>
              <li><a className="hover:text-forest-800 transition-colors" href="#">DPDP Audit Logs</a></li>
              <li><a className="hover:text-forest-800 transition-colors" href="#">CERT-In Architecture</a></li>
              <li><a className="hover:text-forest-800 transition-colors" href="#">Data Retention Rules</a></li>
              <li><a className="hover:text-forest-800 transition-colors" href="#">Immutable Ledger</a></li>
            </ul>
          </div>
          
          {/* Col 5: Refinery Units */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-forest-950 mb-4">Refinery Units</h4>
            <ul className="space-y-2.5 text-xs text-forest-900 font-medium">
              <li><a className="hover:text-forest-800 transition-colors" href="#">CDU / VDU Complex</a></li>
              <li><a className="hover:text-forest-800 transition-colors" href="#">HCU Complex</a></li>
              <li><a className="hover:text-forest-800 transition-colors" href="#">Aromatics Complex</a></li>
              <li><a className="hover:text-forest-800 transition-colors" href="#">Petrochemical Unit</a></li>
              <li><a className="hover:text-forest-800 transition-colors" href="#">Marine Jetty Terminal</a></li>
            </ul>
          </div>
        </div>
        
        {/* Divider */}
        <div className="border-t border-mint-200 my-8"></div>
        
        {/* Bottom Status Row & Security Badges */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-2 text-xs">
          {/* Cluster Node Status Pill */}
          <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full border font-medium ${isHealthy ? 'bg-mint-50 border-mint-200 text-forest-900' : 'bg-amber-50 border-amber-200 text-amber-900'}`}>
            <span className={`h-2 w-2 rounded-full ${isHealthy ? 'bg-status-green animate-pulse' : 'bg-amber-500'}`}></span>
            <span>{nodeStatusText} ({activeNodes}/{totalNodes} active)</span>
          </div>
          
          {/* Compliance Badges */}
          <div className="flex items-center space-x-2 font-mono text-[11px] font-semibold text-refinery-muted">
            <span className="px-2.5 py-1 rounded border border-mint-200 bg-mint-50">DPDP</span>
            <span className="px-2.5 py-1 rounded border border-mint-200 bg-mint-50">ISO 27001</span>
            <span className="px-2.5 py-1 rounded border border-mint-200 bg-mint-50">CERT-In</span>
            <span className="px-2.5 py-1 rounded border border-mint-200 bg-mint-50">CII SECURE</span>
          </div>
        </div>
        
        {/* Copyright & Legal */}
        <div className="mt-8 pt-6 border-t border-mint-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-refinery-muted gap-2">
          <p>© {new Date().getFullYear()} MANGALORE REFINERY AND PETROCHEMICALS LIMITED (MRPL). ALL RIGHTS RESERVED.</p>
          <div className="flex items-center space-x-4">
            <a className="hover:underline" href="#">Terms of Access</a>
            <span>·</span>
            <a className="hover:underline" href="#">Internal Security Protocol</a>
            <span>·</span>
            <span className="text-forest-800 font-semibold uppercase">Classification: RESTRICTED</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
