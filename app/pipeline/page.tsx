import { Sidebar } from "@/components/layout/sidebar"
import EnterpriseAIPipeline from "@/components/ui/ai-agent-pipeline"

export default function PipelinePage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex flex-1 flex-col items-center justify-center px-14 py-10">
                <h1 className="text-2xl font-semibold text-foreground">
          Cross-Agent Handoff Tracker
        </h1>
        <p className="mb-8 text-sm text-muted-foreground">
          Live pipeline view: Scan → Document → Approval
        </p>
        <EnterpriseAIPipeline />
      </main>
    </div>
  )
}