"use client"
import type { WorkflowContext } from "@/lib/workflow/context"
import { getWorkflowContext, setWorkflowContext } from "@/lib/workflow/context"
import { useState } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  FileText,
  Send,
  RotateCcw,
  GitBranch,
  Download,
} from "lucide-react"

type Version = {
  version: string
  date: string
  status: string
  content: string
}

const INITIAL_DOCUMENT = `# Inspection Report

## Equipment Details

**Equipment ID:** V-104  
**Type:** Pressure Vessel  
**Status:** Corroded  
**Inspected By:** R. Nair  
**Inspection Date:** 14 August 2026

## Findings

Visual inspection indicates corrosion on the pressure vessel.

## Recommendation

Further inspection and maintenance action are recommended.

---

**AI DRAFT - PENDING REVIEW**
`

export default function DocumentAgent() {
  const [instruction, setInstruction] = useState("")
  const [document, setDocument] = useState(INITIAL_DOCUMENT)
  const [workflowContext, setWorkflowContextState] = useState<WorkflowContext>({})
  const [versions, setVersions] = useState<Version[]>([
    {
      version: "v1.0",
      date: "04 Sep 2026",
      status: "Draft",
      content: INITIAL_DOCUMENT,
    },
  ])
  const [generating, setGenerating] = useState(false)
  const [activeVersion, setActiveVersion] = useState("v1.0")

  function handleGenerate() {
    if (!instruction.trim()) return

    setGenerating(true)

    setTimeout(() => {
      const newVersionNumber = versions.length + 1
      const newVersion = `v1.${newVersionNumber}`

      const updatedDocument = `${document}

## Additional Instruction

${instruction}

## Session Context

**Equipment ID:** ${workflowContext.equipment_id || "N/A"}  
**Type:** ${workflowContext.type || "N/A"}  
**Status:** ${workflowContext.status || "N/A"}  
**Inspected By:** ${workflowContext.inspected_by || "N/A"}  
**Inspection Date:** ${workflowContext.inspection_date || "N/A"}

**AI DRAFT - PENDING REVIEW**
`

      setDocument(updatedDocument)

      setVersions((prev) => [
        ...prev,
        {
          version: newVersion,
          date: "04 Sep 2026",
          status: "Draft",
          content: updatedDocument,
        },
      ])

      setActiveVersion(newVersion)
      setInstruction("")
      setGenerating(false)
    }, 1000)
  }

  function handleRollback(version: Version) {
    setDocument(version.content)
    setActiveVersion(version.version)
  }

  function handleSupersede() {
    setVersions((prev) =>
      prev.map((v) =>
        v.version === activeVersion
          ? { ...v, status: "Superseded" }
          : v
      )
    )
  }

  function handleDownload() {
    const blob = new Blob([document], {
      type: "text/markdown;charset=utf-8",
    })

    const url = URL.createObjectURL(blob)
    const link = window.document.createElement("a")

    link.href = url
    link.download = `MRPL-Inspection-Report-${activeVersion}.md`
    link.click()

    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex flex-1 flex-col px-14 py-10">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-muted-foreground" />
                      <h1 className="text-2xl font-semibold text-foreground">
                Document Agent
              </h1>
            </div>

            <p className="mt-1 text-sm text-muted-foreground">
              Generate and version official MRPL deliverables.
            </p>
          </div>

          <Badge variant="secondary">
            {activeVersion}
          </Badge>
        </div>

        {/* Main dual-pane layout */}
        <div className="mt-6 grid flex-1 grid-cols-2 gap-6">
          {/* LEFT — Instruction / Chat */}
          <section className="flex flex-col rounded-lg border border-border bg-card">
            <div className="border-b border-border px-4 py-3">
              <h2 className="text-sm font-semibold">
                Document Instructions
              </h2>
              <p className="text-xs text-muted-foreground">
                Give instructions to generate or modify the deliverable.
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <p className="text-xs font-medium text-muted-foreground">
                  Document Agent
                </p>

                <p className="mt-2 text-sm">
                  I can generate and revise official documents based on
                  your instructions and available session context.
                </p>
              </div>

              <div className="mt-4 rounded-lg border border-border p-4">
                <p className="text-xs font-medium text-muted-foreground">
                  Current Context
                </p>

                <pre className="mt-2 whitespace-pre-wrap font-mono text-xs">
                    {JSON.stringify(workflowContext, null, 2)}
            </pre>
              </div>
            </div>

            <div className="border-t border-border p-4">
              <div className="flex items-end gap-2">
                <Textarea
                  value={instruction}
                  onChange={(e) => setInstruction(e.target.value)}
                  placeholder="e.g. Add a detailed recommendation section..."
                  className="resize-none"
                  rows={3}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleGenerate()
                    }
                  }}
                />

                <Button
                  size="icon"
                  onClick={handleGenerate}
                  disabled={generating}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>

              {generating && (
                <Badge className="mt-2" variant="secondary">
                  Generating document...
                </Badge>
              )}
            </div>
          </section>

          {/* RIGHT — Document Preview */}
          <section className="flex flex-col rounded-lg border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div>
                <h2 className="text-sm font-semibold">
                  Document Preview
                </h2>

                <p className="text-xs text-muted-foreground">
                  Official deliverable • {activeVersion}
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                >
                  <Download className="mr-1 h-3.5 w-3.5" />
                  Export
                </Button>
              </div>
            </div>

            <div className="relative flex-1 overflow-y-auto p-6">
              {/* AI draft watermark */}
              <div className="pointer-events-none absolute right-6 top-6 rotate-[-8deg] text-xs font-semibold text-muted-foreground/40">
                AI DRAFT - PENDING REVIEW
              </div>

              <article className="prose prose-sm max-w-none whitespace-pre-wrap">
                {document}
              </article>
            </div>

            {/* Version controls */}
            <div className="border-t border-border p-4">
              <div className="mb-3 flex items-center gap-2">
                <GitBranch className="h-4 w-4 text-muted-foreground" />

                <span className="text-sm font-semibold">
                  Version Control
                </span>
              </div>

              <div className="space-y-2">
                {versions.map((version) => (
                  <div
                    key={version.version}
                    className={`flex items-center justify-between rounded-md border p-3 ${
                      activeVersion === version.version
                        ? "border-primary"
                        : "border-border"
                    }`}
                  >
                    <button
                      className="flex flex-col text-left"
                      onClick={() => handleRollback(version)}
                    >
                      <span className="text-sm font-medium">
                        {version.version}
                      </span>

                      <span className="text-xs text-muted-foreground">
                        {version.date}
                      </span>
                    </button>

                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          version.status === "Superseded"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {version.status}
                      </Badge>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRollback(version)}
                      >
                        <RotateCcw className="mr-1 h-3.5 w-3.5" />
                        Rollback
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                variant="outline"
                className="mt-3 w-full"
                onClick={handleSupersede}
              >
                <GitBranch className="mr-2 h-4 w-4" />
                Supersede Current Version
              </Button>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}