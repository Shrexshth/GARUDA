"use client";

export default function TopBar() {
  return (
    <header className="h-16 px-space-lg flex items-center justify-end gap-space-md">
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
