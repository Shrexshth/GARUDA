"use client"

import { useState } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Send, Terminal as TerminalIcon } from "lucide-react"

// Placeholder — will come from Mac backend (sandboxed Python REPL) later
const MOCK_CODE = `import numpy as np

# L1 pricing calculation
base_cost = 45000
quantity = 12
tax_rate = 0.18

total = base_cost * quantity
final = total * (1 + tax_rate)

print(f"Total before tax: {total}")
print(f"Final L1 price: {final:.2f}")`

const MOCK_OUTPUT = `Total before tax: 540000
Final L1 price: 637200.00

Process finished with exit code 0`

export default function CodeAgent() {
  const [prompt, setPrompt] = useState("")
  const [code, setCode] = useState<string | null>(null)
  const [output, setOutput] = useState<string | null>(null)
  const [running, setRunning] = useState(false)

  function handleRun() {
    if (!prompt.trim()) return
    setRunning(true)
    setCode(null)
    setOutput(null)

    // Placeholder — replace with real backend call later
    setTimeout(() => {
      setCode(MOCK_CODE)
      setTimeout(() => {
        setOutput(MOCK_OUTPUT)
        setRunning(false)
      }, 800)
    }, 800)
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex flex-1 flex-col px-14 py-10">
        <h1 className="text-lg font-semibold text-foreground">Code / Calculation Agent</h1>
        <p className="text-sm text-muted-foreground">
          Run engineering math via sandboxed Python.
        </p>

        {/* Top: chat input */}
        <div className="mt-6 flex items-end gap-2">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. Calculate L1 price for 12 units at ₹45,000 with 18% GST"
            className="flex-1 resize-none"
            rows={2}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleRun()
              }
            }}
          />
          <Button onClick={handleRun} size="icon" disabled={running}>
            <Send className="h-4 w-4" />
          </Button>
        </div>

        {/* Middle: code editor block */}
        <div className="mt-6 flex flex-1 flex-col gap-4">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium">Generated Script</span>
              {running && !code && <Badge variant="secondary">Writing script...</Badge>}
            </div>
            <pre className="min-h-32 overflow-x-auto rounded-lg border border-border bg-[#0d1117] p-4 font-mono text-xs text-[#c9d1d9]">
              {code ?? (running ? "..." : "// Script will appear here after you run a prompt")}
            </pre>
          </div>

          {/* Bottom: terminal/log pane */}
          <div>
            <div className="mb-2 flex items-center gap-2">
              <TerminalIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Execution Log</span>
              {code && !output && running && <Badge variant="secondary">Running...</Badge>}
              {output && <Badge className="bg-[--success] text-white">Success</Badge>}
            </div>
            <pre className="min-h-24 overflow-x-auto rounded-lg border border-border bg-black p-4 font-mono text-xs text-green-400">
              {output ?? (code && running ? "Executing..." : "// stdout/stderr will appear here")}
            </pre>
          </div>
        </div>
      </main>
    </div>
  )
}
