"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { buttonVariants } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { agents } from "@/lib/agents"

const recentSessions = [
  { agent: "Reasoning", label: "Pump specs query" },
  { agent: "Document", label: "Draft NFA for V-104" },
  { agent: "Scan / Vision", label: "P&ID upload - Unit 3" },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex h-screen w-72 flex-col border-r border-border bg-sidebar text-sidebar-foreground">
      <div className="flex items-center gap-2 px-4 py-4">
        <div className="h-8 w-8 rounded-md bg-primary" />
        <span className="font-semibold text-sm">GARUDA</span>
      </div>

      <Separator />

      {/* Agent Switcher */}
      <div className="flex flex-col gap-1 px-2 py-3">
        {agents.map(({ name, icon: Icon, href }) => (
          <Link
            key={name}
            href={href}
            className={buttonVariants({
              variant: pathname === href ? "secondary" : "ghost",
              className: "justify-start gap-3 px-3",
            })}
          >
            <Icon className="h-4 w-4" />
            {name}
          </Link>
        ))}
      </div>

      {/* Pipeline View link */}
      <div className="px-2 pb-2">
        <Link
          href="/pipeline"
          className={buttonVariants({
            variant: pathname === "/pipeline" ? "secondary" : "ghost",
            className: "w-full justify-start gap-3 px-3",
          })}
        >
          Pipeline View
        </Link>
      </div>

      <Separator />

      {/* Recent Sessions */}
      <div className="px-4 py-3 text-xs font-medium text-muted-foreground">
        Recent Sessions
      </div>
      <ScrollArea className="flex-1 px-2">
        <div className="flex flex-col gap-1 pb-4">
          {recentSessions.map((s, i) => (
            <button
              key={i}
              className="flex flex-col items-start rounded-md px-3 py-2 text-left hover:bg-muted transition-colors"
            >
              <div className="text-xs font-medium text-muted-foreground">{s.agent}</div>
              <div className="truncate text-xs">{s.label}</div>
            </button>
          ))}
        </div>
      </ScrollArea>

      <Separator />

      <div className="flex items-center gap-2 px-4 py-3">
        <Avatar className="h-7 w-7">
          <AvatarFallback>PA</AvatarFallback>
        </Avatar>
        <span className="text-xs text-muted-foreground">Piyush A.</span>
      </div>
    </aside>
  )
}