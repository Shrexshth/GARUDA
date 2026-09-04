"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { label: "Home", icon: "home", href: "/" },
  { label: "Reasoning Agent", icon: "psychology", href: "/agents/reasoning" },
  { label: "Scan & Vision", icon: "document_scanner", href: "/agents/scan" },
  { label: "Document Agent", icon: "article", href: "/agents/document" },
  { label: "Code & Calculation", icon: "terminal", href: "/agents/code" },
  { label: "Knowledge Base", icon: "auto_stories", href: "/agents/knowledge-base" },
  { label: "Approval & Workflow", icon: "verified", href: "/agents/approval" },
];

interface RecentItem {
  label: string;
  href: string;
}

interface SidebarProps {
  recentItems?: RecentItem[];
}

export default function Sidebar({ recentItems = [] }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-full md:w-60 lg:w-[240px] shrink-0 bg-surface-container-low/40 md:rounded-l-[28px] flex flex-col justify-between p-space-md">
      <div className="flex flex-col gap-space-lg">
        {/* Logo */}
        <div className="flex items-center gap-space-sm px-space-xs pt-space-xs">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-sm">
            <span className="material-symbols-outlined text-on-primary text-[20px]">hub</span>
          </div>
          <div className="flex flex-col">
            <span className="text-headline-sm font-semibold text-on-surface tracking-tight leading-none">GAURDA</span>
            <span className="text-label-sm font-semibold text-secondary tracking-wide">ENGINEERING OS</span>
          </div>
        </div>

        {/* Nav */}
        <div className="flex flex-col gap-space-xs">
          <span className="px-space-xs text-label-sm font-semibold uppercase tracking-wider text-secondary">AGENTS</span>
          <nav className="flex flex-col gap-0.5">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-space-sm px-space-sm py-2 rounded-xl transition-colors ${
                    isActive
                      ? "bg-surface-container text-on-surface font-semibold"
                      : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                  <span className="text-label-md font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Recent */}
        <div className="flex flex-col gap-space-xs">
          <span className="px-space-xs text-label-sm font-semibold uppercase tracking-wider text-secondary">RECENT</span>
          <div className="flex flex-col gap-0.5">
            {recentItems.length === 0 ? (
              <span className="px-space-sm py-1.5 text-body-sm text-secondary">No recent sessions yet</span>
            ) : (
              recentItems.map((item, i) => (
                <Link
                  key={i}
                  href={item.href}
                  className="flex items-center gap-space-sm px-space-sm py-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors text-body-sm truncate"
                >
                  <span className="material-symbols-outlined text-[16px] text-secondary">description</span>
                  <span className="truncate">{item.label}</span>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>

      {/* User */}
      <div className="mt-space-lg pt-space-md">
        <div className="flex items-center justify-between p-2 rounded-xl bg-surface-container-low">
          <div className="flex items-center gap-space-sm min-w-0">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-label-md font-medium text-on-surface truncate">User</span>
              <span className="text-label-sm font-semibold text-secondary truncate">Engineer</span>
            </div>
          </div>
          <button className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-on-primary hover:bg-on-surface-variant transition-colors">
            <span className="material-symbols-outlined text-[14px]">more_vert</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
