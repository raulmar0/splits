import { cn } from "@/lib/utils";

interface MonoNumberProps {
  value: string | number;
  unit?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  color?: string;
}

const SIZES = {
  sm: "text-[11px]",
  md: "text-[13px]",
  lg: "text-[20px] font-semibold",
  xl: "text-[28px] font-bold tracking-[-0.02em]",
};

export function MonoNumber({ value, unit, size = "md", className, color }: MonoNumberProps) {
  return (
    <span className={cn("num", SIZES[size], className)} style={{ color: color ?? "var(--text)" }}>
      {value}
      {unit && (
        <span className="text-[12px] font-normal ml-1" style={{ color: "var(--text-3)" }}>
          {unit}
        </span>
      )}
    </span>
  );
}
