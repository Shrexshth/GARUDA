"use client";

import { useState } from "react";
import AppShell from "@/components/layout/AppShell";
import Card from "@/components/ui/Card";
import StatusBadge from "@/components/ui/StatusBadge";
import EmptyState from "@/components/ui/EmptyState";

interface ExtractedRow {
  tag: string;
  type: string;
  description: string;
  flowRate: string;
  suctionPress: string;
  dischargePress: string;
  status: string;
  confidence: number;
}

interface ScanSession {
  id: string;
  fileName: string;
  timestamp: string;
  pageCount: number;
}

export default function ScanAgentPage() {
  const [extractedData] = useState<ExtractedRow[]>([]);
  const [scanSessions] = useState<ScanSession[]>([]);
  const [activeView, setActiveView] = useState<"structured" | "original">("structured");

  return (
    <AppShell>
      <div className="flex flex-col xl:flex-row gap-space-lg w-full items-start">
        {/* Main */}
        <div className="flex-1 min-w-0 flex flex-col gap-space-lg w-full">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
            <div className="flex flex-col">
              <div className="flex items-center gap-space-xs">
                <span className="text-label-sm font-semibold text-secondary uppercase tracking-wider">Vision Ingestion Pipeline</span>
                <span className="w-1 h-1 rounded-full bg-secondary" />
                <span className="text-label-sm font-semibold text-secondary">OCR & Vector Node</span>
              </div>
              <h1 className="text-headline-lg font-semibold text-on-surface tracking-tight mt-1">Optical Extraction & Schematic Parser</h1>
            </div>
            <div className="inline-flex items-center gap-space-xs px-3 py-1.5 rounded-full bg-secondary-container/60 self-start sm:self-auto">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-label-sm font-semibold text-on-secondary-container">Air-Gapped Sovereign Vision</span>
            </div>
          </div>

          {/* Upload Dropzone */}
          <div className="relative group cursor-pointer rounded-[20px] bg-surface-container-low/70 hover:bg-surface-container-low transition-all duration-200 p-space-xl text-center shadow-sm flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-2xl bg-surface-container-lowest shadow-sm flex items-center justify-center text-primary group-hover:scale-105 transition-transform duration-200 mb-space-sm">
              <span className="material-symbols-outlined text-[30px]">cloud_upload</span>
            </div>
            <h3 className="text-headline-sm font-semibold text-on-surface">Drop P&ID blueprints, pump data sheets, or scanned drawings here</h3>
            <p className="text-body-sm text-secondary mt-1">High-fidelity schematic vectorizer parses symbol trees, line tags, and tabular schedules automatically.</p>
            <div className="flex flex-wrap items-center justify-center gap-space-xs mt-space-md">
              <span className="px-2.5 py-1 rounded-full bg-surface-container-highest text-on-surface-variant text-label-sm font-semibold">PDF (Multi-page)</span>
              <span className="px-2.5 py-1 rounded-full bg-surface-container-highest text-on-surface-variant text-label-sm font-semibold">DWG / DXF CAD</span>
              <span className="px-2.5 py-1 rounded-full bg-surface-container-highest text-on-surface-variant text-label-sm font-semibold">Vector & Raster PNG</span>
              <span className="px-2.5 py-1 rounded-full bg-surface-container text-secondary text-label-sm font-semibold">Up to 50MB</span>
            </div>
          </div>

          {/* Extracted Data */}
          <Card className="flex flex-col gap-space-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pb-space-sm">
              <div className="flex items-center gap-space-sm">
                <div className="w-10 h-10 rounded-xl bg-secondary-container flex items-center justify-center text-on-secondary-container">
                  <span className="material-symbols-outlined text-[22px]">table_view</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-headline-sm font-semibold text-on-surface">Parsed Spec Schedule</span>
                  <span className="text-body-sm text-secondary">Upload a document to view extracted structured data</span>
                </div>
              </div>
              <div className="inline-flex p-1 rounded-full bg-surface-container-low self-start sm:self-auto">
                <button
                  onClick={() => setActiveView("structured")}
                  className={`px-3.5 py-1.5 rounded-full text-label-md font-medium transition-all ${activeView === "structured" ? "bg-surface-container-lowest text-on-surface shadow-sm" : "text-secondary hover:text-on-surface"}`}
                >
                  Structured Data
                </button>
                <button
                  onClick={() => setActiveView("original")}
                  className={`px-3.5 py-1.5 rounded-full text-label-md font-medium transition-all ${activeView === "original" ? "bg-surface-container-lowest text-on-surface shadow-sm" : "text-secondary hover:text-on-surface"}`}
                >
                  Original Scan
                </button>
              </div>
            </div>

            {extractedData.length === 0 ? (
              <EmptyState icon="document_scanner" title="Upload a document to get started" description="Extracted equipment schedules, spec tables, and line tags will appear here." />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[720px]">
                  <thead>
                    <tr className="text-secondary text-label-sm font-semibold uppercase tracking-wider bg-surface-container-low/60 rounded-xl">
                      <th className="py-3 px-4 rounded-l-xl">Item Tag</th>
                      <th className="py-3 px-4">Description</th>
                      <th className="py-3 px-4">Flow Rate</th>
                      <th className="py-3 px-4">Suction Press.</th>
                      <th className="py-3 px-4">Discharge Press.</th>
                      <th className="py-3 px-4 text-right rounded-r-xl">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container-low">
                    {extractedData.map((row) => (
                      <tr key={row.tag} className="hover:bg-surface-container-low/40 transition-colors">
                        <td className="py-4 px-4">
                          <span className="text-headline-sm font-semibold text-on-surface">{row.tag}</span>
                          <br />
                          <span className="text-label-sm font-semibold text-secondary">{row.type}</span>
                        </td>
                        <td className="py-4 px-4 text-body-md text-on-surface">{row.description}</td>
                        <td className="py-4 px-4 text-body-md text-on-surface">{row.flowRate}</td>
                        <td className="py-4 px-4 text-body-md text-on-surface">{row.suctionPress}</td>
                        <td className="py-4 px-4 text-body-md text-on-surface">{row.dischargePress}</td>
                        <td className="py-4 px-4 text-right">
                          <StatusBadge label={row.status} variant="success" icon="check_circle" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>

        {/* Right Panel: Scan Sessions */}
        <div className="w-full xl:w-80 shrink-0 bg-surface-container-low/40 rounded-2xl p-space-md flex flex-col gap-space-md">
          <h2 className="text-headline-sm font-semibold text-on-surface">Scan Sessions</h2>
          {scanSessions.length === 0 ? (
            <EmptyState icon="photo_camera" title="No scans yet" description="Upload a document to start a scan session." />
          ) : (
            <div className="flex flex-col gap-space-xs">
              {/* Scan session rows would render here */}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
