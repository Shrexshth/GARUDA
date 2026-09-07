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
    <aside className="flex h-screen w-100 shrink-0 flex-col border-r border-border bg-sidebar text-sidebar-foreground">
      
      {/* GARUDA Logo */}
      <Link
  href="/"
  className="flex items-center gap-3 px-5 py-5 transition-opacity hover:opacity-80"
>
  <div className="h-9 w-9 rounded-lg bg-primary" />

  <span className="text-base font-semibold tracking-tight">
    GARUDA
  </span>
</Link>

      <Separator />

      {/* Agent Switcher */}
      <div className="flex flex-col gap-2 px-3 py-4">
        {agents.map(({ name, icon: Icon, href }) => (
          <Link
            key={name}
            href={href}
            className={buttonVariants({
              variant: pathname === href ? "secondary" : "ghost",
              className:
                "h-11 w-full justify-start gap-3 px-4 text-sm",
            })}
          >
            <Icon className="h-[18px] w-[18px]" />
            {name}
          </Link>
        ))}
      </div>

      {/* Pipeline View */}
      <div className="px-3 pb-4">
        <Link
          href="/pipeline"
          className={buttonVariants({
            variant: pathname === "/pipeline" ? "secondary" : "ghost",
            className:
              "h-11 w-full justify-start gap-3 px-4 text-sm",
          })}
        >
          Pipeline View
        </Link>
      </div>

      <Separator />

      {/* Recent Sessions */}
      <div className="px-5 py-4 text-sm font-medium text-muted-foreground">
        Recent Sessions
      </div>

      <ScrollArea className="flex-1 px-3">
        <div className="flex flex-col gap-2 pb-5">
          {recentSessions.map((s, i) => (
            <button
              key={i}
              className="flex w-full flex-col items-start rounded-lg px-4 py-3 text-left transition-colors hover:bg-muted"
            >
              <div className="text-xs font-medium text-muted-foreground">
                {s.agent}
              </div>

              <div className="mt-1 truncate text-sm">
                {s.label}
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>

      <Separator />

      {/* User */}
      <div className="flex items-center gap-3 px-5 py-4">
        <Avatar className="h-9 w-9">
          <AvatarFallback>PA</AvatarFallback>
        </Avatar>

        <span className="text-sm text-muted-foreground">
          Piyush A.
        </span>
      </div>

    </aside>
  )
}