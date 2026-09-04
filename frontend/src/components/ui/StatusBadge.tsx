interface StatusBadgeProps {
  label: string;
  variant?: "default" | "success" | "warning" | "error" | "info";
  icon?: string;
}

const VARIANT_CLASSES: Record<string, string> = {
  default: "bg-surface-container text-secondary",
  success: "bg-secondary-container/70 text-on-secondary-fixed",
  warning: "bg-tertiary-fixed text-on-tertiary-fixed",
  error: "bg-error-container text-on-error-container",
  info: "bg-secondary-fixed text-on-secondary-fixed",
};

export default function StatusBadge({ label, variant = "default", icon }: StatusBadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-label-sm font-semibold ${VARIANT_CLASSES[variant]}`}>
      {icon && <span className="material-symbols-outlined text-[14px]">{icon}</span>}
      {label}
    </span>
  );
}
