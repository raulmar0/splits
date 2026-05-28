import type { Sport } from "@/lib/types";
import { cn } from "@/lib/utils";

const SPORT_COLORS: Record<Sport, string> = {
  ride: "var(--lime)",
  mtb: "var(--lime)",
  run: "var(--amber)",
  trail: "var(--amber)",
  swim: "var(--blue)",
  strength: "var(--violet)",
  rest: "var(--text-4)",
};

interface SportDotProps {
  sport: Sport;
  size?: number;
  className?: string;
}

export function SportDot({ sport, size = 8, className }: SportDotProps) {
  return (
    <span
      className={cn("inline-block rounded-full shrink-0", className)}
      style={{
        width: size,
        height: size,
        background: SPORT_COLORS[sport],
      }}
    />
  );
}
