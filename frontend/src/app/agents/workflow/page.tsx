"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import AgentThinkingTrace from "@/components/ui/AgentThinkingTrace";
import Card from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";

export default function WorkflowResultPage() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [taskData, setTaskData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const sid = searchParams.get("session_id");
    setSessionId(sid);
    
    if (!sid) {
      setLoading(false);
      return;
    }
    fetch(`http://localhost:8000/api/tasks/${sid}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.task) {
          setTaskData(data.task);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [sessionId]);

  return (
    <AppShell>
      <div className="flex flex-col w-full max-w-5xl mx-auto">
        <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md mb-space-xl">
          <div className="flex flex-wrap items-center gap-space-sm">
            <div className="w-10 h-10 rounded-2xl bg-surface-container flex items-center justify-center text-on-surface shadow-sm">
              <span className="material-symbols-outlined text-[20px]">account_tree</span>
            </div>
            <div className="flex flex-col">
              <span className="text-headline-md font-semibold text-on-surface tracking-tight leading-none">Workflow Results</span>
              <span className="text-body-sm text-secondary">Session ID: {sessionId || "Unknown"}</span>
            </div>
          </div>
        </section>

        <div className="flex flex-col gap-6">
          {!sessionId && <EmptyState icon="error" title="No session selected" description="Please select a workflow session from the home page." />}
          
          {loading && sessionId && <div className="animate-pulse text-secondary text-center py-10">Loading workflow data...</div>}
          
          {!loading && taskData && (
            <>
              <div className="w-full">
                <h3 className="text-headline-sm font-semibold mb-4 text-on-surface">Execution Trace</h3>
                {/* We reuse AgentThinkingTrace. Since the task is completed, it will fetch the SSE stream which instantly closes and displays the full historic trace. */}
                <AgentThinkingTrace taskId={sessionId as string} />
              </div>

              <div className="w-full">
                <h3 className="text-headline-sm font-semibold mb-4 text-on-surface mt-6">Final Output Context</h3>
                <Card>
                  {taskData.result ? (
                    <div className="text-body-sm bg-surface-container-lowest p-4 rounded-xl border border-surface-container overflow-x-auto">
                      <pre className="text-xs whitespace-pre-wrap">
                        {JSON.stringify(taskData.result, null, 2)}
                      </pre>
                    </div>
                  ) : (
                    <span className="text-secondary italic">No final result recorded (task may have failed or is still running).</span>
                  )}
                </Card>
              </div>
            </>
          )}
        </div>
      </div>
    </AppShell>
  );
}
