import Link from "next/link";

interface AgentCardProps {
  name: string;
  description: string;
  icon: string;
  href: string;
  bgClass?: string;
}

export default function AgentCard({ name, description, icon, href, bgClass = "bg-secondary-container" }: AgentCardProps) {
  return (
    <Link
      href={href}
      className="group relative flex flex-col p-space-md rounded-[20px] bg-surface-container-lowest shadow-[0_4px_16px_-2px_rgba(17,24,39,0.04),0_1px_2px_0_rgba(17,24,39,0.02)] hover:shadow-[0_12px_28px_-6px_rgba(17,24,39,0.08)] hover:-translate-y-0.5 transition-all duration-200"
    >
      <div className="flex items-center justify-between mb-space-md">
        <div className={`w-10 h-10 rounded-full ${bgClass} flex items-center justify-center shadow-sm`}>
          <span className="material-symbols-outlined text-[20px]">{icon}</span>
        </div>
        <span className="text-secondary opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="material-symbols-outlined text-[18px]">arrow_outward</span>
        </span>
      </div>
      <h3 className="text-headline-sm font-semibold text-on-surface mb-space-2xs">{name}</h3>
      <p className="text-body-sm text-secondary line-clamp-2">{description}</p>
    </Link>
  );
}
