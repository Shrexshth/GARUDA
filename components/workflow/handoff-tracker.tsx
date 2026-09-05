"use client"

import { useState } from "react"
import {
  Check,
  Circle,
  FileText,
  ScanLine,
  ShieldCheck,
  ArrowRight,
  Database,
} from "lucide-react"

type Stage = "scan" | "document" | "approval"

const stages = [
  {
    id: "scan" as Stage,
    title: "Scan / Vision",
    description: "Extract engineering data",
    icon: ScanLine,
  },
  {
    id: "document" as Stage,
    title: "Document",
    description: "Draft official deliverable",
    icon: FileText,
  },
  {
    id: "approval" as Stage,
    title: "Approval",
    description: "Human review required",
    icon: ShieldCheck,
  },
]

const contextData = [
  {
    field: "Equipment ID",
    value: "V-104",
  },
  {
    field: "Type",
    value: "Pressure Vessel",
  },
  {
    field: "Status",
    value: "Corroded",
  },
  {
    field: "Inspected By",
    value: "R. Nair",
  },
  {
    field: "Inspection Date",
    value: "14 August 2026",
  },
]

export function HandoffTracker() {
  const [activeStage, setActiveStage] = useState<Stage>("document")

  const stageOrder: Stage[] = ["scan", "document", "approval"]

  function getStageState(stage: Stage) {
    const activeIndex = stageOrder.indexOf(activeStage)
    const stageIndex = stageOrder.indexOf(stage)

    if (stageIndex < activeIndex) return "complete"
    if (stageIndex === activeIndex) return "active"
    return "pending"
  }

  return (
    <section className="rounded-lg border border-border bg-card">
      {/* Header */}
      <div className="border-b border-border px-5 py-4">
        <div className="flex items-center gap-2">
          <ArrowRight className="h-4 w-4 text-muted-foreground" />

          <div>
            <h2 className="text-sm font-semibold">
              Cross-Agent Handoff
            </h2>

            <p className="text-xs text-muted-foreground">
              Shared session pipeline across GARUDA agents.
            </p>
          </div>
        </div>
      </div>

      {/* Pipeline */}
      <div className="px-6 py-6">
        <div className="flex items-center">
          {stages.map((stage, index) => {
            const state = getStageState(stage.id)
            const Icon = stage.icon

            return (
              <div
                key={stage.id}
                className="flex flex-1 items-center"
              >
                {/* Stage */}
                <button
                  onClick={() => setActiveStage(stage.id)}
                  className="flex items-center gap-3 text-left"
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border ${
                      state === "complete"
                        ? "border-[--success] bg-[--success]/10 text-[--success]"
                        : state === "active"
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground"
                    }`}
                  >
                    {state === "complete" ? (
                      <Check className="h-4 w-4" />
                    ) : state === "active" ? (
                      <Icon className="h-4 w-4" />
                    ) : (
                      <Circle className="h-4 w-4" />
                    )}
                  </div>

                  <div>
                    <p
                      className={`text-sm font-medium ${
                        state === "pending"
                          ? "text-muted-foreground"
                          : "text-foreground"
                      }`}
                    >
                      {stage.title}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {state === "complete"
                        ? "Complete"
                        : state === "active"
                          ? "Active"
                          : "Awaiting"}
                    </p>
                  </div>
                </button>

                {/* Connector */}
                {index < stages.length - 1 && (
                  <div
                    className={`mx-5 h-px flex-1 ${
                      stageOrder.indexOf(stage.id) <
                      stageOrder.indexOf(activeStage)
                        ? "bg-[--success]"
                        : "bg-border"
                    }`}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Active Stage */}
      <div className="border-t border-border px-5 py-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">
              Current Agent
            </p>

            <p className="mt-1 text-sm font-semibold">
              {stages.find((stage) => stage.id === activeStage)?.title}
            </p>
          </div>

          <div className="rounded-md border border-border px-3 py-2">
            <p className="text-xs text-muted-foreground">
              Session
            </p>

            <p className="font-mono text-xs">
              GARUDA-V104-2026
            </p>
          </div>
        </div>
      </div>

      {/* Shared Context */}
      <div className="border-t border-border">
        <div className="flex items-center gap-2 px-5 py-4">
          <Database className="h-4 w-4 text-muted-foreground" />

          <div>
            <h3 className="text-sm font-semibold">
              Shared Session Context
            </h3>

            <p className="text-xs text-muted-foreground">
              Data passed between agents during the workflow.
            </p>
          </div>
        </div>

        <div className="px-5 pb-5">
          <div className="overflow-hidden rounded-md border border-border">
            {contextData.map((item) => (
              <div
                key={item.field}
                className="grid grid-cols-[180px_1fr] border-b border-border last:border-0"
              >
                <div className="bg-muted/30 px-3 py-2.5 text-xs text-muted-foreground">
                  {item.field}
                </div>

                <div className="px-3 py-2.5 font-mono text-xs">
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Context JSON */}
      <div className="border-t border-border px-5 py-4">
        <p className="mb-2 text-xs font-medium text-muted-foreground">
          Session Context JSON
        </p>

        <pre className="overflow-x-auto rounded-md border border-border bg-muted/30 p-4 font-mono text-xs leading-5">
{`{
  "equipment_id": "V-104",
  "type": "Pressure Vessel",
  "status": "Corroded",
  "inspected_by": "R. Nair",
  "inspection_date": "2026-08-14"
}`}
        </pre>
      </div>
    </section>
  )
}