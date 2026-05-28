"use client";

import { useState } from "react";
import { TopBar } from "@/components/shell";
import { Card, CardHeader, Button } from "@/components/ui";
import { SportPill } from "@/components/shared/SportPill";
import type { Sport } from "@/lib/types";

const SPORTS: Sport[] = ["ride", "run", "swim", "trail", "strength"];

const COMPARISON = [
  { metric: "Volumen total", periodA: "11h 43'", periodB: "10h 52'" },
  { metric: "TSS acumulado", periodA: "712", periodB: "684" },
  { metric: "Distancia", periodA: "241 km", periodB: "228 km" },
  { metric: "Desnivel", periodA: "3\u2009460 m", periodB: "2\u2009980 m" },
  { metric: "IF medio", periodA: "0.72", periodB: "0.70" },
  { metric: "Sesiones", periodA: "6", periodB: "5" },
];

export default function ComparePage() {
  const [sport, setSport] = useState<Sport>("ride");

  return (
    <>
      <TopBar
        subtitle="COACH IA"
        title="Comparar"
        right={
          <div className="flex items-center gap-2">
            <Button variant="ghost">Semana actual</Button>
            <span className="mono text-[11px]" style={{ color: "var(--text-3)" }}>vs</span>
            <Button variant="ghost">Semana anterior</Button>
          </div>
        }
      />
      <main className="flex-1 overflow-auto p-5">
        <div className="flex gap-2 mb-4">
          {SPORTS.map((s) => (
            <SportPill key={s} sport={s} active={sport === s} onClick={() => setSport(s)} />
          ))}
        </div>

        <Card>
          <CardHeader>COMPARATIVA PERIODO ACTUAL vs ANTERIOR</CardHeader>
          <div className="divide-y" style={{ borderColor: "var(--hairline)" }}>
            <div className="grid grid-cols-3 px-3.5 py-2" style={{ background: "var(--surface-2)" }}>
              <span className="mono uc text-[10px]" style={{ color: "var(--text-3)" }}>Métrica</span>
              <span className="mono uc text-[10px] text-center" style={{ color: "var(--lime)" }}>Periodo actual</span>
              <span className="mono uc text-[10px] text-center" style={{ color: "var(--text-3)" }}>Periodo anterior</span>
            </div>
            {COMPARISON.map((row) => (
              <div key={row.metric} className="grid grid-cols-3 px-3.5 py-3 items-center">
                <span className="text-[12.5px]" style={{ color: "var(--text)" }}>{row.metric}</span>
                <span className="mono text-[13px] font-semibold text-center" style={{ color: "var(--text)" }}>{row.periodA}</span>
                <span className="mono text-[13px] text-center" style={{ color: "var(--text-2)" }}>{row.periodB}</span>
              </div>
            ))}
          </div>
        </Card>
      </main>
    </>
  );
}
