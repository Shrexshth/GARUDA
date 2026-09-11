"use client";
import { useState, useEffect } from "react";

export default function AgentThinkingTrace({ taskId }: { taskId: string }) {
  const [events, setEvents] = useState<{text: string, type: string}[]>([]);
  const [expanded, setExpanded] = useState(false);
  const [status, setStatus] = useState("working");
  const [modelInfo, setModelInfo] = useState<{name: string, loading: boolean, latency?: string, tokens?: string} | null>(null);

  useEffect(() => {
    if (!taskId) return;
    
    setEvents([]);
    setStatus("working");
    
    const eventSource = new EventSource(`http://localhost:8000/api/tasks/${taskId}/stream`);
    
    eventSource.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        
        // Handle metadata interception
        if (data.text.startsWith("[Metadata]")) {
          // e.g. [Metadata] model=qwen2.5:7b latency=2500ms tokens=345
          const matchModel = data.text.match(/model=([^\s]+)/);
          const matchLatency = data.text.match(/latency=([^\s]+)/);
          const matchTokens = data.text.match(/tokens=([^\s]+)/);
          if (matchModel) {
             setModelInfo({
               name: matchModel[1],
               loading: false,
               latency: matchLatency ? matchLatency[1] : undefined,
               tokens: matchTokens ? matchTokens[1] : undefined
             });
          }
          return; // Don't add to events list
        }
        // Handle model loading interception
        if (data.text.includes("[Model]")) {
           const isVision = data.text.includes("vision");
           setModelInfo({
              name: isVision ? "Qwen2.5-VL" : "Qwen3.5 9B", // Simulating the swap for demo
              loading: true
           });
        }

        setEvents(prev => {
          // Avoid duplicates if SSE reconnects or re-sends
          if (prev.find(p => p.text === data.text)) return prev;
          return [...prev, data];
        });
        if (data.type === "done" || data.type === "error") {
          setStatus(data.type);
          eventSource.close();
        }
      } catch (err) {
        console.error("Failed to parse SSE data", err);
      }
    };
    
    eventSource.onerror = (e) => {
      console.error("SSE Error", e);
      eventSource.close();
      setStatus("error");
    };

    return () => {
      eventSource.close();
    };
  }, [taskId]);

  return (
    <div className="w-full flex flex-col gap-2 p-3 bg-surface-container-lowest rounded-xl shadow-sm border border-surface-container-low transition-all">
      <div 
        className="flex items-center justify-between cursor-pointer group"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          {status === "working" ? (
             <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
          ) : status === "error" ? (
             <span className="material-symbols-outlined text-error text-[18px]">error</span>
          ) : (
             <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
          )}
          <span className="text-body-md font-semibold text-on-surface group-hover:text-primary transition-colors">
            {status === "working" ? "Agent working..." : status === "error" ? "Agent encountered an error" : "Task completed"}
          </span>
          
          {/* Live Model Indicator */}
          {modelInfo && (
            <div className="ml-4 flex items-center gap-2 border-l border-surface-container-high pl-4">
              <span className="text-label-sm text-secondary bg-surface-container px-2 py-0.5 rounded-md">
                Using: {modelInfo.loading ? (
                  <span className="animate-pulse">Loading {modelInfo.name}...</span>
                ) : (
                  <span className="text-on-surface font-semibold">{modelInfo.name} (Local)</span>
                )}
              </span>
              {!modelInfo.loading && modelInfo.latency && (
                <span className="text-[11px] text-secondary/70">
                  {modelInfo.latency} • {modelInfo.tokens} tkns
                </span>
              )}
            </div>
          )}
        </div>
        <span className="material-symbols-outlined text-secondary text-[20px] transition-transform duration-300" style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
          expand_more
        </span>
      </div>
      
      {expanded && (
        <div className="flex flex-col gap-1.5 mt-2 pl-5 py-1 border-l-2 border-surface-container-high overflow-y-auto max-h-64 animate-in fade-in slide-in-from-top-2 duration-200">
          {events.length === 0 ? (
            <span className="text-body-sm text-secondary italic">Connecting to orchestrator stream...</span>
          ) : (
            events.map((ev, i) => (
              <div key={i} className={`text-label-md font-mono ${ev.type === 'error' ? 'text-error' : ev.type === 'done' ? 'text-primary' : 'text-secondary'}`}>
                {ev.text}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
