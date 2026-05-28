"use client";

import { SectionLabel, StatValue } from "@/components/ui";

interface WeekSummaryProps {
  volume: string;
  load: number;
  distance: number;
  elevation: number;
}

export function WeekSummary({ volume, load, distance, elevation }: WeekSummaryProps) {
  return (
    <div
      className="rounded-[6px] p-3.5"
      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
    >
      <SectionLabel>RESUMEN SEMANA</SectionLabel>
      <div className="grid grid-cols-2 gap-3 mt-3">
        <div>
          <p className="mono text-[10px]" style={{ color: "var(--text-3)" }}>VOLUMEN</p>
          <StatValue value={volume} unit="h" />
        </div>
        <div>
          <p className="mono text-[10px]" style={{ color: "var(--text-3)" }}>CARGA</p>
          <StatValue value={load} unit="TSS" color="var(--lime)" />
        </div>
        <div>
          <p className="mono text-[10px]" style={{ color: "var(--text-3)" }}>DISTANCIA</p>
          <StatValue value={distance} unit="km" />
        </div>
        <div>
          <p className="mono text-[10px]" style={{ color: "var(--text-3)" }}>D+</p>
          <StatValue value={elevation.toLocaleString("es-ES").replace(/,/g, "\u2009")} unit="m" />
        </div>
      </div>
    </div>
  );
}
