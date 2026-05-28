import { cn } from "@/lib/utils";

interface ChipProps {
  children: React.ReactNode;
  className?: string;
  dot?: string;
  variant?: "default" | "accent" | "sport";
}

export function Chip({ children, className, dot, variant = "default" }: ChipProps) {
  const base =
    variant === "accent"
      ? "bg-lime text-[#0a0c10] border-transparent"
      : "bg-surface-2 border-border text-text-2";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-[3px] rounded-[4px] border",
        "mono text-[10.5px] uc tracking-[0.06em]",
        base,
        className
      )}
    >
      {dot && (
        <span
          className="w-1.5 h-1.5 rounded-full shrink-0"
          style={{ background: dot }}
        />
      )}
      {children}
    </span>
  );
}
