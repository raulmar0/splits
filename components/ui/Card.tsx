import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: number;
  hover?: boolean;
}

export function Card({ children, className, padding, hover }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-[6px] overflow-hidden",
        hover && "transition-colors duration-[120ms] ease-out hover:bg-surface-2",
        className
      )}
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        padding: padding !== undefined ? padding : undefined,
      }}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
  right?: React.ReactNode;
}

export function CardHeader({ children, className, right }: CardHeaderProps) {
  return (
    <div
      className={cn("flex items-center justify-between px-3.5 py-2.5", className)}
      style={{ borderBottom: "1px solid var(--hairline)" }}
    >
      <span className="mono text-[11px] font-medium uc tracking-[0.1em] text-text-3">
        {children}
      </span>
      {right}
    </div>
  );
}
