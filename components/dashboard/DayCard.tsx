"use client";

import type { Sport } from "@/lib/types";
import { SportDot } from "@/components/ui";
import { cn } from "@/lib/utils";

interface DayCardProps {
  label: string;
  sport: Sport;
  title: string;
  duration: string;
  tss: number;
  maxTss?: number;
  planned?: boolean;
  today?: boolean;
  rest?: boolean;
}

const SPORT_COLORS: Record<Sport, string> = {
  ride: "var(--lime)",
  mtb: "var(--lime)",
  run: "var(--amber)",
  trail: "var(--amber)",
  swim: "var(--blue)",
  strength: "var(--violet)",
  rest: "var(--text-4)",
};

export function DayCard({
  label,
  sport,
  title,
  duration,
  tss,
  maxTss = 220,
  planned = false,
  today = false,
  rest = false,
}: DayCardProps) {
  const color = SPORT_COLORS[sport];
  const pct = Math.min(100, (tss / maxTss) * 100);

  return (
    <div
      className={cn(
        "rounded-[6px] p-3 relative",
        "transition-colors duration-[120ms] ease-out hover:bg-surface-2"
      )}
      style={{
        background: "var(--surface)",
        border: `1px solid ${today ? "var(--lime)" : "var(--border)"}`,
        opacity: rest ? 0.7 : 1,
      }}
    >
      {today && (
        <span
          className="absolute -top-[7px] left-2.5 mono text-[9px] font-bold px-1.5 py-0.5 rounded-[2px]"
          style={{ background: "var(--lime)", color: "#0a0c10" }}
        >
          HOY
        </span>
      )}
      <div className="flex justify-between items-center">
        <span
          className="mono uc text-[10px]"
          style={{ color: today ? "var(--lime)" : "var(--text-3)" }}
        >
          {label}
        </span>
        <SportDot sport={sport} />
      </div>
      <p className="text-[12.5px] mt-2" style={{ color: "var(--text)" }}>
        {title}
      </p>
      <p className="mono text-[10px] mt-0.5" style={{ color: "var(--text-3)" }}>
        {duration}
      </p>
      <div
        className="h-[3px] rounded-[2px] mt-2.5 overflow-hidden"
        style={{ background: "var(--surface-3)" }}
      >
        <div
          className="h-full"
          style={{
            width: `${pct}%`,
            background: color,
            opacity: planned ? 0.7 : 1,
          }}
        />
      </div>
      <p className="mono text-[10px] mt-1" style={{ color }}>
        {tss > 0 ? `${tss} ${planned ? "planned" : "TSS"}` : "—"}
      </p>
    </div>
  );
}
