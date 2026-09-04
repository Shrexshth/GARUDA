interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
}

export default function EmptyState({ icon = "inbox", title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-space-3xl text-center">
      <div className="w-14 h-14 rounded-2xl bg-surface-container flex items-center justify-center mb-space-md">
        <span className="material-symbols-outlined text-[28px] text-secondary">{icon}</span>
      </div>
      <h3 className="text-headline-sm font-semibold text-on-surface mb-space-2xs">{title}</h3>
      {description && <p className="text-body-sm text-secondary max-w-sm">{description}</p>}
    </div>
  );
}
