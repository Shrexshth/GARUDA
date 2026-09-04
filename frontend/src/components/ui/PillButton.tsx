interface PillButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  icon?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
  className?: string;
}

const VARIANT_CLASSES: Record<string, string> = {
  primary: "bg-primary text-on-primary hover:bg-inverse-surface shadow-sm",
  secondary: "bg-surface-container hover:bg-surface-container-high text-on-surface shadow-sm",
  ghost: "text-secondary hover:text-on-surface hover:bg-surface-container",
};

export default function PillButton({
  children,
  variant = "primary",
  icon,
  onClick,
  disabled = false,
  type = "button",
  className = "",
}: PillButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`h-9 px-4 rounded-full text-label-md font-medium flex items-center gap-space-xs transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${VARIANT_CLASSES[variant]} ${className}`}
    >
      {icon && <span className="material-symbols-outlined text-[16px]">{icon}</span>}
      {children}
    </button>
  );
}
