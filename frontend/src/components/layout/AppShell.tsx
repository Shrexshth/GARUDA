import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row text-on-surface text-body-md antialiased bg-surface-container-lowest">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 h-screen">
        <TopBar />
        <main className="flex-1 w-full p-space-lg bg-gradient-to-br from-surface-container to-tertiary-fixed overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
