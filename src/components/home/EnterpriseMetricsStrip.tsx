import React from 'react';

/**
 * EnterpriseMetricsStrip Component
 * 
 * Props / Interface:
 * - `metrics`: MetricItem[] { value: string, label: string }
 * 
 * API Endpoints:
 * - GET /api/metrics/overview
 * 
 * Real-time Needs:
 * - None, standard REST is fine.
 * 
 * States:
 * - Loading: Skeleton numbers.
 * - Error: Fallback to static defaults (used here).
 */

interface MetricItem {
  value: string;
  label: string;
}

interface EnterpriseMetricsStripProps {
  metrics?: MetricItem[];
}

const defaultMetrics: MetricItem[] = [
  { value: "6", label: "Specialized Agents" },
  { value: "100%", label: "Air-Gapped Operation" },
  { value: "1", label: "Unified Session Context" },
  { value: "0", label: "Cloud API Calls" }
];

export const EnterpriseMetricsStrip: React.FC<EnterpriseMetricsStripProps> = ({
  metrics = defaultMetrics
}) => {
  return (
    <section className="py-12 bg-white relative z-10 border-b border-mint-100" data-purpose="enterprise-metrics">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {metrics.map((metric, idx) => (
            <div key={idx} className="bg-gradient-to-b from-mint-50/50 to-white border border-mint-200 rounded-xl p-6 text-center shadow-sm hover:shadow-md hover:border-mint-300 transition-all cursor-default">
              <div className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-forest-950 to-forest-700 tracking-tighter">{metric.value}</div>
              <div className="mt-2 text-[11px] font-bold tracking-wider uppercase text-forest-800/80">{metric.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
