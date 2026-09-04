"use client";

import { useState } from "react";
import AppShell from "@/components/layout/AppShell";
import Card from "@/components/ui/Card";
import PillButton from "@/components/ui/PillButton";
import StatusBadge from "@/components/ui/StatusBadge";
import EmptyState from "@/components/ui/EmptyState";

type TaskStatus = "pending" | "in_review" | "approved" | "rejected" | "draft";

interface ApprovalTask {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  assignee: string;
  priority: string;
  createdAt: string;
  dueDate: string;
}

interface WorkflowStep {
  id: string;
  label: string;
  status: "completed" | "active" | "pending";
}

const STATUS_VARIANT: Record<TaskStatus, "default" | "success" | "warning" | "error" | "info"> = {
  draft: "default",
  pending: "default",
  in_review: "warning",
  approved: "success",
  rejected: "error",
};

const STATUS_LABEL: Record<TaskStatus, string> = {
  draft: "DRAFT",
  pending: "PENDING",
  in_review: "IN REVIEW",
  approved: "APPROVED",
  rejected: "REJECTED",
};

export default function ApprovalAgentPage() {
  const [taskList] = useState<ApprovalTask[]>([]);
  const [workflowSteps] = useState<WorkflowStep[]>([]);

  return (
    <AppShell>
      <div className="flex flex-col w-full gap-space-lg">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
          <div className="flex items-center gap-space-sm">
            <div className="w-10 h-10 rounded-xl bg-tertiary-fixed-dim flex items-center justify-center text-on-tertiary-fixed shadow-sm">
              <span className="material-symbols-outlined text-[20px]">verified</span>
            </div>
            <div>
              <h1 className="text-headline-md font-semibold text-on-surface tracking-tight">Approval & Workflow Agent</h1>
              <span className="text-body-sm text-secondary">Multi-tier approval chains and signature tracking</span>
            </div>
          </div>
          <div className="flex items-center gap-space-xs self-start sm:self-auto">
            <PillButton variant="primary" icon="add">New Workflow</PillButton>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-lg items-start">
          {/* Main */}
          <div className="xl:col-span-8 flex flex-col gap-space-lg">
            {/* Pipeline Tracker */}
            <Card className="flex flex-col gap-space-md">
              <h2 className="text-headline-sm font-semibold text-on-surface">Active Pipeline</h2>
              {workflowSteps.length === 0 ? (
                <EmptyState icon="route" title="No active workflow" description="Create a new workflow to track approval progress through your pipeline." />
              ) : (
                <div className="flex items-center gap-space-xs overflow-x-auto py-space-xs">
                  {workflowSteps.map((step, i) => (
                    <div key={step.id} className="flex items-center gap-space-xs shrink-0">
                      <div className={`px-3 py-2 rounded-xl text-label-sm font-semibold flex items-center gap-1 ${
                        step.status === "completed" ? "bg-secondary-container/70 text-on-secondary-fixed" :
                        step.status === "active" ? "bg-primary text-on-primary" :
                        "bg-surface-container text-secondary"
                      }`}>
                        {step.status === "completed" && <span className="material-symbols-outlined text-[14px]">check</span>}
                        {step.status === "active" && <span className="material-symbols-outlined text-[14px]">settings</span>}
                        {step.label}
                      </div>
                      {i < workflowSteps.length - 1 && (
                        <span className="material-symbols-outlined text-[16px] text-secondary">arrow_forward</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Task List */}
            <Card className="flex flex-col gap-space-md">
              <div className="flex items-center justify-between">
                <h2 className="text-headline-sm font-semibold text-on-surface">Approval Queue</h2>
                <PillButton variant="ghost" icon="filter_list">Filter</PillButton>
              </div>

              {taskList.length === 0 ? (
                <EmptyState icon="task" title="No tasks yet" description="Approval requests and workflow tasks will appear here as they are submitted." />
              ) : (
                <div className="flex flex-col divide-y divide-surface-container-low">
                  {taskList.map((task) => (
                    <div key={task.id} className="py-space-md flex items-center justify-between gap-space-md hover:bg-surface-container-low/30 transition-colors px-space-sm rounded-lg">
                      <div className="flex flex-col gap-space-2xs min-w-0">
                        <div className="flex items-center gap-space-xs">
                          <span className="text-label-md font-medium text-on-surface truncate">{task.title}</span>
                          <StatusBadge label={STATUS_LABEL[task.status]} variant={STATUS_VARIANT[task.status]} />
                        </div>
                        <span className="text-body-sm text-secondary truncate">{task.description}</span>
                      </div>
                      <div className="flex items-center gap-space-sm shrink-0">
                        <span className="text-label-sm font-semibold text-secondary">{task.dueDate}</span>
                        <PillButton variant="secondary" icon="visibility">View</PillButton>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Right: Workflow Activity */}
          <aside className="xl:col-span-4 bg-surface-container-low/40 rounded-2xl p-space-md flex flex-col gap-space-md self-stretch">
            <h2 className="text-headline-sm font-semibold text-on-surface">Workflow Activity</h2>
            <EmptyState icon="timeline" title="Coming soon" description="Real-time audit trail and activity feed for approval workflows." />
          </aside>
        </div>
      </div>
    </AppShell>
  );
}
