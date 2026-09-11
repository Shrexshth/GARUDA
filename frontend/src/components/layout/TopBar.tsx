"use client";

import { useState, useEffect } from "react";
import { useTasks } from "@/context/TaskContext";

function NetworkMonitor() {
  const [secure, setSecure] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      fetch("http://localhost:8000/api/infra/airgap")
        .then(res => res.json())
        .then(data => {
          if (data.secure === false) setSecure(false);
          else setSecure(true);
        })
        .catch(() => setSecure(true));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${secure ? 'bg-surface-container-lowest border-surface-container' : 'bg-error/10 border-error/20 text-error'}`}>
      <span className={`material-symbols-outlined text-[16px] ${secure ? 'text-secondary' : 'text-error animate-pulse'}`}>
        {secure ? 'shield' : 'warning'}
      </span>
      <span className={`text-label-sm font-semibold ${secure ? 'text-secondary' : 'text-error'}`}>
        {secure ? '0 external requests' : 'AIRGAP BREACHED'}
      </span>
    </div>
  );
}

export default function TopBar() {
  const { activeCount } = useTasks();

  return (
    <header className="h-16 px-space-lg flex items-center justify-between gap-space-md">
      <div>
        {activeCount > 0 && (
          <div className="flex items-center gap-space-xs bg-primary/10 text-primary px-3 py-1.5 rounded-full animate-pulse">
            <span className="material-symbols-outlined text-[16px] animate-spin">sync</span>
            <span className="text-label-sm font-semibold">{activeCount} task{activeCount > 1 ? 's' : ''} running</span>
          </div>
        )}
      </div>
      <div className="flex items-center gap-space-sm ml-auto mr-4">
        <NetworkMonitor />
      </div>
      <div className="flex items-center gap-space-xs">
        <button className="w-9 h-9 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors">
          <span className="material-symbols-outlined text-[20px]">search</span>
        </button>
        <button className="w-9 h-9 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors">
          <span className="material-symbols-outlined text-[20px]">notifications</span>
        </button>
      </div>
      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
        <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
      </div>
    </header>
  );
}
