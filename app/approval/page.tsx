"use client"

import { useState } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle2,
  Clock3,
  FileText,
  ShieldCheck,
  XCircle,
} from "lucide-react"

type WorkflowStatus = "Draft" | "In Review" | "Approved" | "Withdrawn"

type Task = {
  id: string
  title: string
  document: string
  requester: string
  submitted: string
  status: WorkflowStatus
  priority: "Normal" | "High"
}

type AuditEntry = {
  time: string
  user: string
  action: string
  status: WorkflowStatus
}

const INITIAL_TASKS: Task[] = [
  {
    id: "WF-104",
    title: "V-104 Inspection Report",
    document: "Inspection-Report-V104",
    requester: "Engineering / Inspection",
    submitted: "04 Sep 2026, 09:15",
    status: "In Review",
    priority: "High",
  },
  {
    id: "WF-103",
    title: "Unit 3 Maintenance Recommendation",
    document: "Maintenance-Recommendation-U3",
    requester: "Maintenance",
    submitted: "04 Sep 2026, 08:42",
    status: "Draft",
    priority: "Normal",
  },
  {
    id: "WF-102",
    title: "Pressure Vessel Review",
    document: "Pressure-Vessel-Review",
    requester: "Reliability",
    submitted: "03 Sep 2026, 17:30",
    status: "Approved",
    priority: "Normal",
  },
]

const INITIAL_AUDIT: AuditEntry[] = [
  {
    time: "04 Sep 2026, 09:15",
    user: "engineering.user",
    action: "Submitted V-104 Inspection Report for review",
    status: "In Review",
  },
  {
    time: "04 Sep 2026, 08:42",
    user: "maintenance.user",
    action: "Created Maintenance Recommendation",
    status: "Draft",
  },
  {
    time: "03 Sep 2026, 17:45",
    user: "approver.user",
    action: "Approved Pressure Vessel Review",
    status: "Approved",
  },
]

function statusVariant(status: WorkflowStatus) {
  if (status === "Approved") return "default"
  if (status === "Withdrawn") return "destructive"
  return "secondary"
}

function statusIcon(status: WorkflowStatus) {
  if (status === "Approved") {
    return <CheckCircle2 className="h-3.5 w-3.5" />
  }

  if (status === "Withdrawn") {
    return <XCircle className="h-3.5 w-3.5" />
  }

  return <Clock3 className="h-3.5 w-3.5" />
}

export default function ApprovalAgent() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS)
  const [audit, setAudit] = useState<AuditEntry[]>(INITIAL_AUDIT)

  function updateStatus(
    taskId: string,
    newStatus: WorkflowStatus
  ) {
    const task = tasks.find((item) => item.id === taskId)

    if (!task) return

    setTasks((prev) =>
      prev.map((item) =>
        item.id === taskId
          ? { ...item, status: newStatus }
          : item
      )
    )

    setAudit((prev) => [
      {
        time: "04 Sep 2026, 10:02",
        user: "approver.user",
        action: `${newStatus}: ${task.title}`,
        status: newStatus,
      },
      ...prev,
    ])
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex flex-1 flex-col px-14 py-10">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-muted-foreground" />

                      <h1 className="text-2xl font-semibold text-foreground">
                Approval / Workflow Agent
              </h1>
            </div>

            <p className="mt-1 text-sm text-muted-foreground">
              Human-in-the-loop approval and DoP workflow management.
            </p>
          </div>

          <Badge variant="secondary">
            Human Review Required
          </Badge>
        </div>

        {/* Workflow summary */}
        <div className="mt-6 grid grid-cols-4 gap-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground">
              Draft
            </p>

            <p className="mt-1 text-2xl font-semibold">
              {tasks.filter((t) => t.status === "Draft").length}
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground">
              In Review
            </p>

            <p className="mt-1 text-2xl font-semibold">
              {tasks.filter((t) => t.status === "In Review").length}
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground">
              Approved
            </p>

            <p className="mt-1 text-2xl font-semibold">
              {tasks.filter((t) => t.status === "Approved").length}
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground">
              Withdrawn
            </p>

            <p className="mt-1 text-2xl font-semibold">
              {tasks.filter((t) => t.status === "Withdrawn").length}
            </p>
          </div>
        </div>

        {/* Main content */}
        <div className="mt-6 grid flex-1 grid-cols-[1.6fr_1fr] gap-6">
          {/* Workflow tasks */}
          <section className="rounded-lg border border-border bg-card">
            <div className="border-b border-border px-5 py-4">
              <h2 className="text-sm font-semibold">
                Approval Queue
              </h2>

              <p className="mt-1 text-xs text-muted-foreground">
                Documents requiring human review or approval.
              </p>
            </div>

            <div className="divide-y divide-border">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-3">
                      <div className="rounded-md border border-border p-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-semibold">
                            {task.title}
                          </h3>

                          {task.priority === "High" && (
                            <Badge variant="destructive">
                              High
                            </Badge>
                          )}
                        </div>

                        <p className="mt-1 text-xs text-muted-foreground">
                          {task.id} • {task.document}
                        </p>

                        <p className="mt-1 text-xs text-muted-foreground">
                          Requested by {task.requester}
                        </p>

                        <p className="mt-1 text-xs text-muted-foreground">
                          Submitted {task.submitted}
                        </p>
                      </div>
                    </div>

                    <Badge
                      variant={statusVariant(task.status)}
                      className="flex items-center gap-1"
                    >
                      {statusIcon(task.status)}
                      {task.status}
                    </Badge>
                  </div>

                  {/* Workflow actions */}
                  <div className="mt-4 flex items-center gap-2">
                    {task.status === "Draft" && (
                      <Button
                        size="sm"
                        onClick={() =>
                          updateStatus(task.id, "In Review")
                        }
                      >
                        Submit for Review
                      </Button>
                    )}

                    {task.status === "In Review" && (
                      <>
                        <Button
                          size="sm"
                          onClick={() =>
                            updateStatus(task.id, "Approved")
                          }
                        >
                          <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                          Approve
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            updateStatus(task.id, "Withdrawn")
                          }
                        >
                          <XCircle className="mr-1.5 h-3.5 w-3.5" />
                          Withdraw
                        </Button>
                      </>
                    )}

                    {task.status === "Approved" && (
                      <span className="text-xs text-muted-foreground">
                        Final approval recorded.
                      </span>
                    )}

                    {task.status === "Withdrawn" && (
                      <span className="text-xs text-muted-foreground">
                        Workflow withdrawn.
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Audit Trail */}
          <section className="rounded-lg border border-border bg-card">
            <div className="border-b border-border px-5 py-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-muted-foreground" />

                <h2 className="text-sm font-semibold">
                  Immutable Audit Trail
                </h2>
              </div>

              <p className="mt-1 text-xs text-muted-foreground">
                Workflow actions recorded for traceability.
              </p>
            </div>

            <div className="divide-y divide-border">
              {audit.map((entry, index) => (
                <div
                  key={`${entry.time}-${index}`}
                  className="p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-medium">
                        {entry.action}
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {entry.user}
                      </p>

                      <p className="mt-1 text-[11px] text-muted-foreground">
                        {entry.time}
                      </p>
                    </div>

                    <Badge
                      variant={statusVariant(entry.status)}
                      className="shrink-0"
                    >
                      {entry.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border p-4">
              <div className="rounded-md bg-muted/40 p-3">
                <p className="text-xs font-medium">
                  Audit Integrity
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Workflow actions are recorded and cannot be edited
                  from this interface.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Workflow state tracker */}
        <div className="mt-6 rounded-lg border border-border bg-card p-5">
          <div className="mb-4">
            <h2 className="text-sm font-semibold">
              DoP Workflow
            </h2>

            <p className="mt-1 text-xs text-muted-foreground">
              Standard human approval lifecycle.
            </p>
          </div>

          <div className="flex items-center">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-border">
                <FileText className="h-4 w-4" />
              </div>

              <span className="text-sm font-medium">
                Draft
              </span>
            </div>

            <div className="mx-4 h-px flex-1 bg-border" />

            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-border">
                <Clock3 className="h-4 w-4" />
              </div>

              <span className="text-sm font-medium">
                In Review
              </span>
            </div>

            <div className="mx-4 h-px flex-1 bg-border" />

            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-border">
                <CheckCircle2 className="h-4 w-4" />
              </div>

              <span className="text-sm font-medium">
                Approved
              </span>
            </div>

            <div className="mx-4 h-px flex-1 bg-border" />

            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-border">
                <XCircle className="h-4 w-4" />
              </div>

              <span className="text-sm font-medium">
                Withdrawn
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}