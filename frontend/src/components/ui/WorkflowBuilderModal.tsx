"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import InputBar from "./InputBar";

interface Step {
  step: number;
  agent: string;
  action: string;
}

export default function WorkflowBuilderModal({ onClose }: { onClose: () => void }) {
  const [goal, setGoal] = useState("");
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<Step[] | null>(null);
  const [executing, setExecuting] = useState(false);
  const router = useRouter();

  const handlePlan = async (query: string) => {
    if (!query.trim()) return;
    setGoal(query);
    setLoading(true);
    setPlan(null);
    try {
      const res = await fetch("http://localhost:8000/api/orchestrator/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal: query })
      });
      const data = await res.json();
      if (data.success && data.plan) {
        setPlan(data.plan);
      } else {
        throw new Error(data.detail || "Planning failed");
      }
    } catch (e) {
      console.error(e);
      alert("Failed to generate plan");
    } finally {
      setLoading(false);
    }
  };

  const handleExecute = async () => {
    if (!plan || plan.length === 0) return;
    setExecuting(true);
    try {
      const res = await fetch("http://localhost:8000/api/orchestrator/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, initial_request: goal })
      });
      const data = await res.json();
      if (data.success && data.task_id) {
        // Close modal and navigate to tracking page
        onClose();
        router.push(`/agents/workflow?session_id=${data.task_id}`);
      }
    } catch (e) {
      console.error(e);
      alert("Failed to execute workflow");
      setExecuting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-surface-container-lowest w-full max-w-2xl rounded-2xl shadow-xl p-6 flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-headline-sm font-semibold text-on-surface">New Multi-Agent Workflow</h2>
          <button onClick={onClose} className="text-secondary hover:text-on-surface">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        {!plan && (
          <div className="flex flex-col gap-4">
            <p className="text-body-md text-secondary">
              Describe your goal in plain English. The orchestrator will break it down into an ordered sequence of agent steps.
            </p>
            <InputBar placeholder="e.g. Check for new inspection reports, extract findings, and draft approval notes..." onSubmit={handlePlan} />
            {loading && <div className="text-primary mt-4 flex items-center gap-2"><span className="material-symbols-outlined animate-spin">sync</span> Planning pipeline...</div>}
          </div>
        )}

        {plan && (
          <div className="flex flex-col gap-6 overflow-y-auto">
            <div className="flex items-center justify-between">
              <span className="text-label-md text-secondary uppercase font-semibold tracking-wider">Proposed Pipeline</span>
              <button onClick={() => setPlan(null)} className="text-label-sm text-primary hover:underline">Edit Goal</button>
            </div>
            
            <div className="flex flex-col gap-4 relative">
              <div className="absolute left-[15px] top-6 bottom-6 w-0.5 bg-surface-container-high" />
              {plan.map((step) => (
                <div key={step.step} className="flex gap-4 relative z-10">
                  <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-label-md shrink-0">
                    {step.step}
                  </div>
                  <div className="bg-surface-container-low rounded-xl p-4 flex-1">
                    <span className="text-label-md font-semibold text-primary block mb-1 uppercase tracking-wider">{step.agent.replace("_", " ")} Agent</span>
                    <span className="text-body-md text-on-surface">{step.action}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-surface-container-low mt-2">
               <button onClick={onClose} className="px-5 py-2.5 rounded-full text-secondary hover:bg-surface-container font-semibold transition-colors">Cancel</button>
               <button 
                  onClick={handleExecute} 
                  disabled={executing}
                  className="px-5 py-2.5 rounded-full bg-primary text-on-primary font-semibold hover:bg-inverse-surface transition-colors disabled:opacity-50"
               >
                  {executing ? "Starting..." : "Run Now"}
               </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
