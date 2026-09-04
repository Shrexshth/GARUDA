import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-container to-tertiary-fixed text-on-surface text-body-md antialiased p-space-md lg:p-space-xl">
      <div className="max-w-[1600px] mx-auto min-h-[calc(100vh-4rem)] bg-surface-container-lowest rounded-[28px] shadow-[0_20px_50px_-12px_rgba(17,24,39,0.06),0_1px_3px_0_rgba(17,24,39,0.02)] flex flex-col md:flex-row relative">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 bg-surface-container-lowest md:rounded-r-[28px]">
          <TopBar />
          <main className="flex-1 w-full p-space-lg">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
