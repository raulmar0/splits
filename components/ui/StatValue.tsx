import { cn } from "@/lib/utils";

interface StatValueProps {
  value: string | number;
  unit?: string;
  className?: string;
  color?: string;
}

export function StatValue({ value, unit, className, color }: StatValueProps) {
  return (
    <div className={cn("flex items-baseline", className)}>
      <span
        className="num text-[28px] font-bold tracking-[-0.02em] leading-none"
        style={{ color: color ?? "var(--text)" }}
      >
        {value}
      </span>
      {unit && (
        <span className="mono text-[12px] ml-1" style={{ color: "var(--text-3)" }}>
          {unit}
        </span>
      )}
    </div>
  );
}
