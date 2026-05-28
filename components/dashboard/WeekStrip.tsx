"use client";

import { DayCard } from "./DayCard";
import type { Sport } from "@/lib/types";

interface DayData {
  label: string;
  sport: Sport;
  title: string;
  duration: string;
  tss: number;
  today?: boolean;
}

interface WeekStripProps {
  label: string;
  days: DayData[];
  planned?: boolean;
  accent?: boolean;
}

export function WeekStrip({ label, days, planned = false, accent = false }: WeekStripProps) {
  return (
    <div className="mb-5">
      <p
        className="mono uc text-[10px] font-medium tracking-[0.12em] mb-2.5"
        style={{ color: accent ? "var(--lime)" : "var(--text-3)" }}
      >
        {label}
      </p>
      <div className="grid grid-cols-7 gap-2">
        {days.map((d, i) => (
          <DayCard
            key={i}
            label={d.label}
            sport={d.sport}
            title={d.title}
            duration={d.duration}
            tss={d.tss}
            planned={planned}
            today={d.today}
            rest={d.sport === "rest"}
          />
        ))}
      </div>
    </div>
  );
}
