import { cn } from "@/lib/utils";

type DeltaVariant = "up-good" | "up-bad" | "down-good" | "down-bad" | "neutral";

interface StatDeltaProps {
  children: React.ReactNode;
  variant?: DeltaVariant;
  className?: string;
}

const VARIANT_COLORS: Record<DeltaVariant, string> = {
  "up-good": "var(--lime)",
  "up-bad": "var(--red)",
  "down-good": "var(--lime)",
  "down-bad": "var(--red)",
  neutral: "var(--text-3)",
};

export function StatDelta({ children, variant = "neutral", className }: StatDeltaProps) {
  return (
    <span
      className={cn("mono text-[11px]", className)}
      style={{ color: VARIANT_COLORS[variant] }}
    >
      {children}
    </span>
  );
}
