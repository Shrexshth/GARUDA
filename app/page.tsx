import Link from "next/link"
import { HandoffTracker } from "@/components/workflow/handoff-tracker"
import { Sidebar } from "@/components/layout/sidebar"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { agents } from "@/lib/agents"
import EnterpriseAIPipeline from "@/components/ui/ai-agent-pipeline"

export default function Home() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 px-10 py-10">
             <div className="w-full">
          <h1 className="text-xl font-semibold text-foreground">
            What do you need to do today?
          </h1>
          <Input
            placeholder="Ask anything, or pick an agent below..."
            className="mt-4 h-12"
          />
                        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {agents.map(({ name, desc, icon: Icon, href }) => (
              <Link key={name} href={href}>
                <Card className="cursor-pointer transition-shadow hover:shadow-md">
                  <CardHeader>
                    <Icon className="h-6 w-6 text-primary" />
                    <CardTitle className="mt-2 text-sm">{name}</CardTitle>
                    <CardDescription className="text-xs">{desc}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>

          {/* Live pipeline visual */}
          <div className="mt-14">
            <h2 className="text-sm font-medium text-foreground mb-4">
              Live Agent Pipeline
            </h2>
            <EnterpriseAIPipeline />
          </div>
        </div>
        <div className="mt-8">
          <HandoffTracker />
        </div>
      </main>
    </div>
  )
}


// import Link from "next/link"
// import { Sidebar } from "@/components/layout/sidebar"
// import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { agents } from "@/lib/agents"

// export default function Home() {
//   return (
//     <div className="flex min-h-screen bg-background">
//       <Sidebar />

//       <main className="flex-1 px-10 py-10">
//         <div className="mx-auto max-w-4xl">
//           <h1 className="text-xl font-semibold text-foreground">
//             What do you need to do today?
//           </h1>

//           <Input
//             placeholder="Ask anything, or pick an agent below..."
//             className="mt-4 h-12"
//           />

//           <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
//             {agents.map(({ name, desc, icon: Icon, href }) => (
//               <Link key={name} href={href}>
//                 <Card className="cursor-pointer transition-shadow hover:shadow-md">
//                   <CardHeader>
//                     <Icon className="h-6 w-6 text-primary" />
//                     <CardTitle className="mt-2 text-sm">{name}</CardTitle>
//                     <CardDescription className="text-xs">{desc}</CardDescription>
//                   </CardHeader>
//                 </Card>
//               </Link>
//             ))}
//           </div>
//         </div>
//       </main>
//     </div>
//   )
// }