"use client"

import Link from "next/link"
import { Sidebar } from "@/components/layout/sidebar"
import { HandoffTracker } from "@/components/workflow/handoff-tracker"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { agents } from "@/lib/agents"
import EnterpriseAIPipeline from "@/components/ui/ai-agent-pipeline"

export default function Home() {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      <Sidebar />

      {/* RIGHT SIDE */}
      <main className="relative min-w-0 flex-1 overflow-x-hidden overflow-y-auto">
        {/* Animated Color Background */}
<div className="pointer-events-none absolute inset-0 overflow-hidden">

  <div
    className="
      garuda-float
      absolute
      -top-40
      right-20
      h-96
      w-96
      rounded-full
      bg-blue-500/10
      blur-3xl
    "
  />

  <div
    className="
      garuda-float
      absolute
      top-[500px]
      -left-40
      h-96
      w-96
      rounded-full
      bg-purple-500/10
      blur-3xl
    "
    style={{ animationDelay: "2s" }}
  />

  <div
    className="
      garuda-float
      absolute
      bottom-40
      right-10
      h-80
      w-80
      rounded-full
      bg-cyan-500/10
      blur-3xl
    "
    style={{ animationDelay: "1s" }}
  />

</div>
        <div className="relative z-10 w-full px-8 py-8 lg:px-10">

          {/* HEADER */}
          <div className="w-full">
            <h1 className="text-xl font-semibold text-foreground">
              What do you need to do today?
            </h1>

            <Input
              placeholder="Ask anything, or pick an agent below..."
              className="mt-3 h-11 w-full text-sm"
            />
          </div>

          {/* SIX AGENTS */}
          <div className="mt-6 grid w-full grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {agents.map(({ name, desc, icon: Icon, href }) => (
              <Link key={name} href={href} className="block">
                <Card
                    className="
                      h-[200px]
                      w-full
                      cursor-pointer
                      border-border
                      transition-all
                      duration-500
                      hover:-translate-y-2
                      hover:scale-[1.02]
                      hover:border-blue-500/60
                      hover:shadow-xl
                    "
                  >
                  <CardHeader className="flex h-full flex-col justify-center p-18">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 shadow-lg">
  <Icon className="h-6 w-6 text-white" />
</div>

                    <CardTitle className="mt-10 text-base">
                      {name}
                    </CardTitle>

                    <CardDescription className="mt-2 text-sm leading-relaxed">
                      {desc}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>

          {/* PIPELINE */}
          <div className="mt-15 w-full">
            <h2 className="mb-5 text-base font-medium text-foreground">
              Live Agent Pipeline
            </h2>

                      <div className="w-[1500px] max-w-full">
            <EnterpriseAIPipeline />
          </div>
          </div>

          {/* HANDOFF AFTER PIPELINE */}
          <div className="mt-10 w-full pb-15">
            <HandoffTracker />
          </div>

        </div>
      </main>
    </div>
  )
}