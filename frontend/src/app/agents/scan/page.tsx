"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import AppShell from "@/components/layout/AppShell";
import { useTasks } from "@/context/TaskContext";
import Card from "@/components/ui/Card";
import StatusBadge from "@/components/ui/StatusBadge";
import EmptyState from "@/components/ui/EmptyState";
import AgentThinkingTrace from "@/components/ui/AgentThinkingTrace";

type ExtractedRow = Record<string, any>;

interface ScanSession {
  id: string;
  fileName: string;
  timestamp: string;
  status: "scanning" | "completed" | "error";
}

export default function ScanAgentPage() {
  const [extractedData, setExtractedData] = useState<ExtractedRow[]>([]);
  const [scanSessions, setScanSessions] = useState<ScanSession[]>([]);
  const [activeView, setActiveView] = useState<"structured" | "compare">("structured");
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [cleanDescription, setCleanDescription] = useState<string>("");
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);
  const [visibleScanCount, setVisibleScanCount] = useState(5);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { tasks, registerTask, clearTask } = useTasks();
  
  const activeTask = Object.values(tasks).find(t => t.agent === "scan");
  const loading = activeTask?.status === "running" || activeTask?.status === "pending";
  
  useEffect(() => {
    if (activeTask && (activeTask.status === "completed" || activeTask.status === "failed")) {
      if (activeTask.status === "completed" && activeTask.result) {
        const data = activeTask.result;
        setExtractedData(data.extracted_data || []);
        
        // Get the uploaded file URL for display
        if (data.generated_file_path) {
          setOriginalImageUrl(`http://localhost:8000/api/agents/scan/uploads/${data.generated_file_path}`);
        }
        
        // Extract clean description from messages
        const messages = data.messages || [];
        const descMsg = messages.find((m: any) => m.type === "clean_description");
        if (descMsg) {
          setCleanDescription(descMsg.content);
        } else {
          // Fallback: use last assistant message
          const assistantMsgs = messages.filter((m: any) => m.role === "assistant");
          if (assistantMsgs.length > 0) {
            setCleanDescription(assistantMsgs[assistantMsgs.length - 1].content);
          }
        }
        
        setScanSessions(prev => {
          if (prev.length > 0 && prev[0].status === "scanning") {
            const next = [...prev];
            next[0].status = "completed";
            return next;
          }
          return prev;
        });
      } else {
        setScanSessions(prev => {
          if (prev.length > 0 && prev[0].status === "scanning") {
            const next = [...prev];
            next[0].status = "error";
            return next;
          }
          return prev;
        });
      }
      clearTask(activeTask.id);
    }
  }, [activeTask, clearTask]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Create local preview immediately
    if (file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setLocalPreviewUrl(url);
    } else {
      setLocalPreviewUrl(null);
    }

    // Reset previous results
    setExtractedData([]);
    setCleanDescription("");
    setOriginalImageUrl(null);
    setActiveView("structured");

    const newSession: ScanSession = {
      id: Date.now().toString(),
      fileName: file.name,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
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
      
      if (response.ok && result.success && result.task_id) {
        registerTask(result.task_id, "scan");
        if (result.uploaded_file) {
          setOriginalImageUrl(`http://localhost:8000/api/agents/scan/uploads/${result.uploaded_file}`);
        }
      } else {
        throw new Error(result.detail || "Scan failed to start");
      }
    } catch (error) {
      console.error(error);
      setScanSessions(prev => 
        prev.map(s => s.id === newSession.id ? { ...s, status: "error" } : s)
      );
    }

    // Reset file input so the same file can be re-uploaded
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const displayImageUrl = originalImageUrl || localPreviewUrl;

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
                <span className="text-label-sm font-semibold text-secondary">OCR &amp; Vector Node</span>
              </div>
              <h1 className="text-headline-lg font-semibold text-on-surface tracking-tight mt-1">Optical Extraction &amp; Schematic Parser</h1>
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
            <h3 className="text-headline-sm font-semibold text-on-surface">Drop P&amp;ID blueprints, pump data sheets, or scanned drawings here</h3>
            <p className="text-body-sm text-secondary mt-1">High-fidelity schematic vectorizer parses symbol trees, line tags, and tabular schedules automatically.</p>
            <div className="flex flex-wrap items-center justify-center gap-space-xs mt-space-md">
              <span className="px-2.5 py-1 rounded-full bg-surface-container-highest text-on-surface-variant text-label-sm font-semibold">PNG / JPEG / WEBP</span>
              <span className="px-2.5 py-1 rounded-full bg-surface-container-highest text-on-surface-variant text-label-sm font-semibold">PDF (First Page)</span>
              <span className="px-2.5 py-1 rounded-full bg-surface-container-highest text-on-surface-variant text-label-sm font-semibold">TIFF / BMP</span>
              <span className="px-2.5 py-1 rounded-full bg-surface-container text-secondary text-label-sm font-semibold">Up to 50MB</span>
            </div>
          </div>

          {/* Agent Thinking Trace */}
          {loading && activeTask?.id && (
            <div className="mb-2">
              <AgentThinkingTrace taskId={activeTask.id} />
            </div>
          )}

          {/* View Toggle & Data */}
          <Card className="flex flex-col gap-space-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pb-space-sm">
              <div className="flex items-center gap-space-sm">
                <div className="w-10 h-10 rounded-xl bg-secondary-container flex items-center justify-center text-on-secondary-container">
                  <span className="material-symbols-outlined text-[22px]">table_view</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-headline-sm font-semibold text-on-surface">Scan Results</span>
                  <span className="text-body-sm text-secondary">
                    {extractedData.length > 0 
                      ? `${extractedData.length} item${extractedData.length > 1 ? 's' : ''} extracted` 
                      : "Upload a document to view extracted data"}
                  </span>
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
                  onClick={() => setActiveView("compare")}
                  className={`px-3.5 py-1.5 rounded-full text-label-md font-medium transition-all ${activeView === "compare" ? "bg-surface-container-lowest text-on-surface shadow-sm" : "text-secondary hover:text-on-surface"}`}
                >
                  Compare View
                </button>
              </div>
            </div>

            {/* Structured Data View */}
            {activeView === "structured" && (
              <>
                {extractedData.length === 0 && !loading ? (
                  <EmptyState icon="document_scanner" title="Upload a document to get started" description="Extracted schedules, tables, and data will appear here." />
                ) : extractedData.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[720px]">
                      <thead>
                        <tr className="text-secondary text-label-sm font-semibold uppercase tracking-wider bg-surface-container-low/60 rounded-xl">
                          {Object.keys(extractedData[0])
                            .filter(key => key !== 'confidence' && key !== 'status')
                            .map((key, idx) => (
                              <th key={key} className={`py-3 px-4 ${idx === 0 ? 'rounded-l-xl' : ''}`}>
                                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                              </th>
                          ))}
                          <th className="py-3 px-4 text-right rounded-r-xl">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-surface-container-low">
                        {extractedData.map((row, i) => (
                          <tr key={row.tag || row.id || i} className="hover:bg-surface-container-low/40 transition-colors">
                            {Object.keys(row)
                              .filter(key => key !== 'confidence' && key !== 'status')
                              .map((key, idx) => (
                                <td key={key} className={`py-4 px-4 ${idx === 0 ? 'text-headline-sm font-semibold text-on-surface' : 'text-body-md text-on-surface'}`}>
                                  {row[key] !== null && row[key] !== undefined ? String(row[key]) : "N/A"}
                                </td>
                            ))}
                            <td className="py-4 px-4 text-right shrink-0">
                              <StatusBadge label={row.status || "Extracted"} variant="success" icon="check_circle" />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : null}
              </>
            )}

            {/* Compare View: Original Image vs AI Clean Analysis */}
            {activeView === "compare" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-lg">
                {/* Left: Original Uploaded Image */}
                <div className="flex flex-col gap-space-sm">
                  <div className="flex items-center gap-space-xs">
                    <span className="w-7 h-7 rounded-lg bg-error/10 text-error flex items-center justify-center">
                      <span className="material-symbols-outlined text-[16px]">image</span>
                    </span>
                    <span className="text-label-md font-semibold text-on-surface">Original Document</span>
                  </div>
                  <div className="rounded-xl border-2 border-dashed border-surface-container-high bg-surface-container-lowest p-2 min-h-[300px] flex items-center justify-center overflow-hidden">
                    {displayImageUrl ? (
                      <img 
                        src={displayImageUrl} 
                        alt="Original uploaded document" 
                        className="max-w-full max-h-[500px] object-contain rounded-lg"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="flex flex-col items-center text-center p-space-lg">
                        <span className="material-symbols-outlined text-[48px] text-surface-container-highest mb-space-sm">image</span>
                        <p className="text-body-sm text-secondary">Upload a document to see the original here</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: AI Clean Analysis */}
                <div className="flex flex-col gap-space-sm">
                  <div className="flex items-center gap-space-xs">
                    <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                      <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
                    </span>
                    <span className="text-label-md font-semibold text-on-surface">AI Clean Analysis</span>
                  </div>
                  <div className="rounded-xl border border-surface-container-low bg-surface-container-lowest p-space-md min-h-[300px] overflow-y-auto max-h-[530px]">
                    {cleanDescription ? (
                      <div className="prose prose-sm dark:prose-invert max-w-none text-body-md">
                        <ReactMarkdown>{cleanDescription}</ReactMarkdown>
                      </div>
                    ) : loading ? (
                      <div className="flex flex-col items-center justify-center h-full p-space-lg text-center">
                        <span className="material-symbols-outlined text-[32px] text-primary animate-pulse mb-space-sm">psychology</span>
                        <p className="text-body-sm text-secondary">Vision model is analyzing the document...</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full p-space-lg text-center">
                        <span className="material-symbols-outlined text-[48px] text-surface-container-highest mb-space-sm">auto_awesome</span>
                        <p className="text-body-sm text-secondary">The AI&apos;s clean, structured interpretation of your document will appear here</p>
                      </div>
                    )}
                  </div>
                </div>
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
            <div className="flex flex-col gap-space-xs max-h-[calc(100vh-14rem)] overflow-y-auto">
              {scanSessions.slice(0, visibleScanCount).map(session => (
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
              {scanSessions.length > visibleScanCount && (
                <button
                  onClick={() => setVisibleScanCount(prev => prev + 5)}
                  className="mt-space-2xs py-2 px-3 rounded-xl bg-surface-container-lowest hover:bg-surface-container-low text-label-sm font-semibold text-primary transition-colors flex items-center justify-center gap-1"
                >
                  <span className="material-symbols-outlined text-[14px]">expand_more</span>
                  View more ({scanSessions.length - visibleScanCount} remaining)
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
