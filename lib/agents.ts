import {
  MessageSquare,
  ScanLine,
  FileText,
  Terminal,
  Search,
  ClipboardCheck,
  type LucideIcon,
} from "lucide-react"

export type Agent = {
  name: string
  desc: string
  icon: LucideIcon
  href: string
  color: string
}

export const agents: Agent[] = [
  { name: "Reasoning Agent", desc: "Open-ended Q&A, drafting, and summarization.", icon: MessageSquare, href: "/reasoning", color: "bg-blue-50 text-blue-600" },
  { name: "Scan / Vision Agent", desc: "Extract data from physical engineering schematics.", icon: ScanLine, href: "/scan", color: "bg-purple-50 text-purple-600" },
  { name: "Document Agent", desc: "Generate and version official deliverables.", icon: FileText, href: "/document", color: "bg-amber-50 text-amber-600" },
  { name: "Code / Calculation Agent", desc: "Run engineering math via sandboxed Python.", icon: Terminal, href: "/code", color: "bg-emerald-50 text-emerald-600" },
  { name: "Knowledge Base Agent", desc: "Deep retrieval over SOPs and safety manuals.", icon: Search, href: "/knowledge-base", color: "bg-rose-50 text-rose-600" },
  { name: "Approval / Workflow Agent", desc: "Manage human-in-the-loop sign-off workflows.", icon: ClipboardCheck, href: "/approval", color: "bg-slate-100 text-slate-700" },
]