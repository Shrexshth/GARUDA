"use client";

import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { useSearchParams, useRouter } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import InputBar from "@/components/ui/InputBar";
import Card from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

interface HistoryEntry {
  id: string;
  title: string;
  subtitle: string;
  timestamp: string;
  tags: string[];
}

const SUGGESTION_CARDS = [
  { title: "Summarize a report", description: "Synthesize inspection logs, vibration metrics, or incident dossiers.", icon: "summarize", cta: "Explore templates" },
  { title: "Draft an approval note", description: "Generate formal NFA memos adhering to MRPL Delegation of Powers.", icon: "fact_check", cta: "Start standard draft" },
  { title: "Answer technical query", description: "Look up API 610 tolerances, pump run limits, and safe operational envelopes.", icon: "engineering", cta: "Search standards" },
];

export default function ReasoningAgentPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatHistory, setChatHistory] = useState<HistoryEntry[]>([]);
  const [sessionId] = useState(() => Date.now().toString());
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialized = useRef(false);

  useEffect(() => {
    fetch("http://localhost:8000/api/agents/reasoning/history")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setChatHistory(data.history || []);
        }
      })
      .catch(console.error);
  }, []);

  const handleSend = async (content: string, overrideMessages?: ChatMessage[]) => {
    const userMsg: ChatMessage = { id: Date.now().toString(), role: "user", content, timestamp: new Date().toLocaleTimeString() };
    const currentMessages = overrideMessages || messages;
    const newMessages = [...currentMessages, userMsg];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/agents/reasoning/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId,
          messages: newMessages.map(m => ({ role: m.role, content: m.content }))
        }),
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        setMessages([...newMessages, {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.message.content || "No response.",
          timestamp: new Date().toLocaleTimeString()
        }]);
      } else {
        throw new Error(data.detail || "Chat failed");
      }
    } catch (err: any) {
      console.error(err);
      setMessages([...newMessages, {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Error: ${err.message}`,
        timestamp: new Date().toLocaleTimeString()
      }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const q = searchParams.get("q");
    if (q && !initialized.current) {
      initialized.current = true;
      handleSend(q, []); // Auto-send the query from Home page
      router.replace("/agents/reasoning"); // Clear URL
    }
  }, [searchParams, router]);

  return (
    <AppShell>
      <div className="flex flex-col w-full h-[calc(100vh-100px)]">
        {/* Status Ribbon */}
        <div className="flex items-center justify-between px-space-md py-space-xs bg-surface-container-low rounded-xl mb-space-lg shadow-sm">
          <div className="flex items-center gap-space-xs">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-label-sm font-semibold text-secondary tracking-wide uppercase">Reasoning Engine Online</span>
          </div>
          <div className="flex items-center gap-space-sm text-secondary text-label-sm font-semibold">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">shield</span> Safety Guardrails Active
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-xl items-start h-full pb-4">
          {/* Center Area */}
          <div className="xl:col-span-8 2xl:col-span-9 flex flex-col items-center w-full h-full relative">
            {messages.length === 0 ? (
              <>
                <div className="flex flex-col items-center text-center max-w-2xl px-space-md pt-space-md pb-space-lg">
                  <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center mb-space-sm shadow-sm">
                    <span className="material-symbols-outlined text-on-surface text-[20px]">auto_awesome</span>
                  </div>
                  <h1 className="text-display font-semibold text-on-surface tracking-tight leading-tight">
                    What would you like to work on today?
                  </h1>
                  <p className="mt-space-xs text-body-md text-secondary max-w-lg leading-relaxed">
                    Ask technical questions, troubleshoot anomalies, or query refinery equipment operating logic.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md w-full mb-space-xl">
                  {SUGGESTION_CARDS.map((card, i) => (
                    <div key={i} onClick={() => handleSend(card.title)} className="group flex flex-col p-space-lg bg-surface-container-lowest rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-surface-container-high/40 to-transparent rounded-bl-full pointer-events-none transition-transform group-hover:scale-110 duration-300" />
                      <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center mb-space-md shrink-0">
                        <span className="material-symbols-outlined text-on-surface text-[20px]">{card.icon}</span>
                      </div>
                      <h3 className="text-headline-sm font-semibold text-on-surface group-hover:text-primary transition-colors mb-space-2xs">{card.title}</h3>
                      <p className="text-body-sm text-secondary leading-snug">{card.description}</p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <Card className="w-full mb-space-lg flex-1 overflow-y-auto p-4 flex flex-col gap-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex flex-col max-w-[80%] ${msg.role === 'user' ? 'self-end items-end' : 'self-start items-start'}`}>
                    <div className={`px-4 py-3 rounded-2xl ${msg.role === 'user' ? 'bg-primary text-on-primary rounded-tr-sm' : 'bg-surface-container-lowest text-on-surface rounded-tl-sm shadow-sm border border-surface-container-low'}`}>
                       <div className="prose prose-sm dark:prose-invert max-w-none text-body-md">
                         <ReactMarkdown>{msg.content}</ReactMarkdown>
                       </div>
                    </div>
                    <span className="text-label-sm text-secondary mt-1">{msg.timestamp}</span>
                  </div>
                ))}
                {loading && (
                   <div className="self-start px-4 py-3 bg-surface-container-lowest text-on-surface rounded-2xl rounded-tl-sm shadow-sm border border-surface-container-low animate-pulse">
                     <p className="text-body-md">Thinking...</p>
                   </div>
                )}
              </Card>
            )}

            {/* Input - Sticky at bottom */}
            <div className="w-full max-w-4xl absolute bottom-0">
              <InputBar placeholder="Ask a follow-up or enter equipment tag (e.g., P-201A)..." onSubmit={handleSend} />
            </div>
          </div>

          {/* Right Panel: Chat History */}
          <aside className="xl:col-span-4 2xl:col-span-3 flex flex-col w-full bg-surface-container-low/40 rounded-2xl p-space-md h-full">
            <div className="flex items-center justify-between pb-space-sm">
              <div className="flex items-center gap-space-2xs">
                <span className="material-symbols-outlined text-on-surface text-[20px]">forum</span>
                <h2 className="text-headline-sm font-semibold text-on-surface">Chat history</h2>
              </div>
            </div>
            {chatHistory.length === 0 ? (
              <EmptyState icon="history" title="No chat history" description="Your past reasoning sessions will appear here." />
            ) : (
              <div className="flex flex-col gap-space-2xs flex-1 overflow-y-auto">
                {chatHistory.map((item) => (
                  <div key={item.id} className="p-space-sm bg-surface-container-lowest rounded-xl flex flex-col gap-1 cursor-pointer hover:bg-surface-container-low transition-colors">
                    <h3 className="text-label-md font-semibold text-on-surface line-clamp-1">{item.title}</h3>
                    <div className="flex justify-between items-center text-label-sm text-secondary">
                      <span>{item.subtitle}</span>
                      <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </aside>
        </div>
      </div>
    </AppShell>
  );
}
