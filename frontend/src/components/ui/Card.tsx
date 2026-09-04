interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export default function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`bg-surface-container-lowest rounded-2xl shadow-[0_4px_16px_-2px_rgba(17,24,39,0.04),0_1px_2px_0_rgba(17,24,39,0.02)] p-card-padding ${className}`}>
      {children}
    </div>
  );
}
