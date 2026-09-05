"use client";

import { useState, useRef } from "react";
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
  status: "scanning" | "completed" | "error";
}

export default function ScanAgentPage() {
  const [extractedData, setExtractedData] = useState<ExtractedRow[]>([]);
  const [scanSessions, setScanSessions] = useState<ScanSession[]>([]);
  const [activeView, setActiveView] = useState<"structured" | "original">("structured");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const newSession: ScanSession = {
      id: Date.now().toString(),
      fileName: file.name,
      timestamp: new Date().toLocaleTimeString(),
      status: "scanning"
    };

    setScanSessions(prev => [newSession, ...prev]);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8000/api/agents/scan/upload", {
        method: "POST",
        body: formData,
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        setExtractedData(result.data || []);
        setScanSessions(prev => 
          prev.map(s => s.id === newSession.id ? { ...s, status: "completed" } : s)
        );
      } else {
        throw new Error(result.detail || "Scan failed");
      }
    } catch (error) {
      console.error(error);
      setScanSessions(prev => 
        prev.map(s => s.id === newSession.id ? { ...s, status: "error" } : s)
      );
    }
  };

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
          <div 
            className="relative group cursor-pointer rounded-[20px] bg-surface-container-low/70 hover:bg-surface-container-low transition-all duration-200 p-space-xl text-center shadow-sm flex flex-col items-center justify-center"
            onClick={() => fileInputRef.current?.click()}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              className="hidden" 
              accept="image/*,.pdf"
            />
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
            ) : activeView === "structured" ? (
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
                    {extractedData.map((row, i) => (
                      <tr key={row.tag || i} className="hover:bg-surface-container-low/40 transition-colors">
                        <td className="py-4 px-4">
                          <span className="text-headline-sm font-semibold text-on-surface">{row.tag || "N/A"}</span>
                          <br />
                          <span className="text-label-sm font-semibold text-secondary">{row.type || "N/A"}</span>
                        </td>
                        <td className="py-4 px-4 text-body-md text-on-surface">{row.description || "N/A"}</td>
                        <td className="py-4 px-4 text-body-md text-on-surface">{row.flowRate || "N/A"}</td>
                        <td className="py-4 px-4 text-body-md text-on-surface">{row.suctionPress || "N/A"}</td>
                        <td className="py-4 px-4 text-body-md text-on-surface">{row.dischargePress || "N/A"}</td>
                        <td className="py-4 px-4 text-right">
                          <StatusBadge label={row.status || "Extracted"} variant="success" icon="check_circle" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-space-xl min-h-[300px] border-2 border-dashed border-surface-container-high rounded-xl bg-surface-container-lowest">
                 <span className="material-symbols-outlined text-[48px] text-surface-container-highest mb-space-sm">image</span>
                 <h3 className="text-headline-sm font-semibold text-on-surface mb-2">Original Document View</h3>
                 <p className="text-body-sm text-secondary text-center max-w-sm">
                   The raw scanned blueprint or P&ID would be displayed here for visual verification against the extracted data.
                 </p>
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
              {scanSessions.map(session => (
                 <div key={session.id} className="p-3 bg-surface-container rounded-lg flex items-center justify-between">
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-body-sm font-medium text-on-surface truncate">{session.fileName}</span>
                      <span className="text-label-sm text-secondary">{session.timestamp}</span>
                    </div>
                    <div className="shrink-0 ml-2">
                      {session.status === 'scanning' && <span className="material-symbols-outlined text-secondary animate-spin text-[16px]">sync</span>}
                      {session.status === 'completed' && <span className="material-symbols-outlined text-primary text-[16px]">check_circle</span>}
                      {session.status === 'error' && <span className="material-symbols-outlined text-error text-[16px]">error</span>}
                    </div>
                 </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
