interface ListRowProps {
  title: string;
  subtitle?: string;
  icon?: string;
  timestamp?: string;
  tags?: string[];
  onClick?: () => void;
}

export default function ListRow({ title, subtitle, icon = "description", timestamp, tags = [], onClick }: ListRowProps) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left group flex flex-col p-space-sm rounded-xl bg-surface-container-lowest hover:bg-surface-container hover:shadow-sm transition-all"
    >
      <div className="flex items-start justify-between gap-space-xs">
        <div className="flex items-center gap-space-xs min-w-0">
          <span className="material-symbols-outlined text-[16px] text-secondary">{icon}</span>
          <span className="text-label-md font-medium text-on-surface truncate group-hover:text-primary transition-colors">{title}</span>
        </div>
        {timestamp && <span className="text-label-sm font-semibold text-secondary shrink-0">{timestamp}</span>}
      </div>
      {subtitle && <p className="text-body-sm text-secondary mt-1 line-clamp-1">{subtitle}</p>}
      {tags.length > 0 && (
        <div className="flex items-center gap-space-xs mt-space-2xs">
          {tags.map((tag, i) => (
            <span key={i} className="px-2 py-0.5 rounded-md bg-surface-container text-secondary text-label-sm font-semibold">{tag}</span>
          ))}
        </div>
      )}
    </button>
  );
}
