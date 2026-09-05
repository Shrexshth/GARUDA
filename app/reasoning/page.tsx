"use client"

import { useState } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Send } from "lucide-react"

type Message = { role: "user" | "agent"; text: string }

export default function ReasoningAgent() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "agent", text: "Hi, I'm the Reasoning Agent. Ask me anything." },
  ])
  const [input, setInput] = useState("")

  function handleSend() {
    if (!input.trim()) return
    setMessages((prev) => [...prev, { role: "user", text: input }])
    setInput("")
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: "agent", text: "(Response will come from Mac 3 backend once connected.)" },
      ])
    }, 500)
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

        <h1 className="text-2xl font-semibold text-foreground">Reasoning Agent</h1>      <main className="flex flex-1 flex-col px-14 py-10">
        
        <p className="text-sm text-muted-foreground">
          Open-ended Q&A, drafting, and summarization.
        </p>

        <div className="mt-6 flex-1 space-y-4 overflow-y-auto">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`max-w-2xl rounded-lg px-4 py-2 text-sm ${
                m.role === "user"
                  ? "ml-auto bg-primary text-primary-foreground"
                  : "bg-card border border-border"
              }`}
            >
              {m.text}
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-end gap-2 border-t border-border pt-4">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 resize-none"
            rows={2}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
          />
          <Button onClick={handleSend} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </main>
    </div>
  )
}