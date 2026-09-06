import React from 'react';
import { CheckCircle2 } from 'lucide-react';

/**
 * DarkTrustSection Component
 * 
 * Props / Interface:
 * - `verificationLogs`: string[]
 * 
 * API Endpoints:
 * - GET /api/system/telemetry
 * 
 * Real-time Needs:
 * - WebSocket/SSE for streaming the `NODE VERIFICATION STACK` terminal outputs.
 * 
 * States:
 * - Connecting: Terminal spinner.
 * - Error: Verification failed alert.
 */

interface DarkTrustSectionProps {
  verificationLogs?: string[];
}

const defaultLogs = [
  "> cluster.verify_airgap() -> true",
  "> lan_adapters: [en0: 10.14.80.22] (WAN: BLOCKED)",
  "> model_weights: sha256:e3b0c44298... [VERIFIED]"
];

export const DarkTrustSection: React.FC<DarkTrustSectionProps> = ({
  verificationLogs = defaultLogs
}) => {
  return (
    <section className="py-16 bg-forest-950 text-white relative overflow-hidden" data-purpose="security-and-airgap-trust">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* Card 1: Industrial Compliance */}
          <div className="rounded-2xl bg-forest-900 border border-forest-700/60 p-8 flex flex-col justify-between relative overflow-hidden">
            {/* Subtle dot matrix motif */}
            <div className="absolute right-0 top-0 w-64 h-64 dark-dot-matrix pointer-events-none opacity-20"></div>
            
            <div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-mono tracking-wider font-semibold uppercase bg-mint-500/10 text-mint-300 border border-mint-500/20">
                COMPLIANCE & SECURITY
              </span>
              <h3 className="mt-4 text-2xl font-bold tracking-tight text-white">
                Built for Industrial Compliance
              </h3>
              <p className="mt-3 text-sm text-mint-100/80 leading-relaxed max-w-md">
                Zero third-party telemetry, certified under India DPDP Act and CERT-In critical infrastructure safety guidelines. Data never traverses public ingress routers.
              </p>
            </div>
            
            <div className="mt-8 pt-6 border-t border-forest-700/40 flex items-center justify-between text-xs text-mint-300/80 font-mono">
              <span className="flex items-center">
                <CheckCircle2 className="w-4 h-4 mr-1.5 text-mint-400" />
                Audit-Ready Immutable Logs
              </span>
              <span>ISO 27001 Certified</span>
            </div>
          </div>
          
          {/* Card 2: Local Hardware Execution */}
          <div className="rounded-2xl bg-forest-900 border border-forest-700/60 p-8 flex flex-col justify-between relative overflow-hidden">
            <div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-mono tracking-wider font-semibold uppercase bg-mint-500/10 text-mint-300 border border-mint-500/20">
                AIR-GAPPED ARCHITECTURE
              </span>
              <h3 className="mt-4 text-2xl font-bold tracking-tight text-white">
                Built for Local Hardware Execution
              </h3>
              <p className="mt-3 text-sm text-mint-100/80 leading-relaxed max-w-md">
                Quantized LLM/VLM models running strictly on isolated local Mac clusters with cryptographic input verification and instantaneous failover.
              </p>
              
              {/* Local cluster verification terminal snippet */}
              <div className="mt-5 rounded-lg bg-forest-950 p-3.5 font-mono text-[11px] text-mint-300 border border-forest-800/60 leading-relaxed">
                <div className="text-slate-400 font-semibold mb-1">// NODE VERIFICATION STACK</div>
                {verificationLogs.map((log, idx) => (
                  <div key={idx} className={idx === 0 ? "text-mint-400" : "text-slate-300"}>
                    {log}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-forest-700/40 flex items-center justify-between text-xs text-mint-300/80 font-mono">
              <span>Latency: &lt; 42ms TTFT</span>
              <span>100% Local Inference</span>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};
