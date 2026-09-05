"use client"

import { useState, useRef } from "react"
import { setWorkflowContext } from "@/lib/workflow/context"
import { Sidebar } from "@/components/layout/sidebar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { UploadCloud, Database } from "lucide-react"

type ExtractedField = { field: string; value: string }

// Placeholder extraction result — will come from Mac 2 (Qwen-VL) later
const MOCK_EXTRACTION: ExtractedField[] = [
  { field: "Equipment ID", value: "V-104" },
  { field: "Type", value: "Pressure Vessel" },
  { field: "Status", value: "Corroded" },
  { field: "Inspected By", value: "R. Nair" },
  { field: "Date", value: "2026-08-14" },
]

export default function ScanAgent() {
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [extracted, setExtracted] = useState<ExtractedField[] | null>(null)
  const [processing, setProcessing] = useState(false)
  const [committed, setCommitted] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleFile(file: File) {
  const url = URL.createObjectURL(file)
  setImagePreview(url)
  setExtracted(null)
  setCommitted(false)
  setProcessing(true)

  // Placeholder — replace with real backend call to Mac 2 later
  setTimeout(() => {
    setExtracted(MOCK_EXTRACTION)

    setWorkflowContext({
      equipment_id: "V-104",
      type: "Pressure Vessel",
      status: "Corroded",
      inspected_by: "R. Nair",
      inspection_date: "2026-08-14",

      extracted_data: {
        equipment_id: "V-104",
        type: "Pressure Vessel",
        status: "Corroded",
        inspected_by: "R. Nair",
        inspection_date: "2026-08-14",
      },
    })

    setProcessing(false)
  }, 1200)
}

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex flex-1 flex-col px-14 py-10">
                <h1 className="text-2xl font-semibold text-foreground">Scan / Vision Agent</h1>
        <p className="text-sm text-muted-foreground">
          Extract data from physical engineering schematics.
        </p>

        {!imagePreview && (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="mt-8 flex h-64 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border text-muted-foreground hover:bg-muted/50 transition-colors"
          >
            <UploadCloud className="h-8 w-8" />
            <p className="text-sm">Drag & drop a scanned document, or click to browse</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,application/pdf"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleFile(file)
              }}
            />
          </div>
        )}

        {imagePreview && (
          <div className="mt-8 grid flex-1 grid-cols-2 gap-6">
            {/* Left: original image */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Original</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setImagePreview(null)
                    setExtracted(null)
                    setCommitted(false)
                  }}
                >
                  Upload another
                </Button>
              </div>
              <img
                src={imagePreview}
                alt="Uploaded scan"
                className="rounded-lg border border-border object-contain"
              />
            </div>

            {/* Right: extracted data */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Extracted Data</span>
                {processing && <Badge variant="secondary">Processing...</Badge>}
                {extracted && !committed && <Badge variant="secondary">Extracted</Badge>}
                {committed && <Badge className="bg-[--success] text-white">Committed</Badge>}
              </div>

              <div className="rounded-lg border border-border">
                {processing && (
                  <div className="p-6 text-sm text-muted-foreground">
                    Running OCR extraction...
                  </div>
                )}

                {extracted && (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Field</TableHead>
                        <TableHead>Value</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {extracted.map((row) => (
                        <TableRow key={row.field}>
                          <TableCell className="text-muted-foreground">{row.field}</TableCell>
                          <TableCell>{row.value}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>

              {extracted && (
                <Button
                  className="mt-2"
                  disabled={committed}
                  onClick={() => setCommitted(true)}
                >
                  <Database className="h-4 w-4" />
                  {committed ? "Committed to Knowledge Base" : "Commit to Knowledge Base"}
                </Button>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}