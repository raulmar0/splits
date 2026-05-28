"use client";

import { TopBar } from "@/components/shell";
import { Card, CardHeader, Chip } from "@/components/ui";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const INSIGHTS = [
  { label: "FTP estimado", value: "318W", delta: "+6W", trend: "up" as const, period: "vs. hace 4 semanas" },
  { label: "VO2max estimado", value: "58.2", delta: "+0.2", trend: "up" as const, period: "vs. mes anterior" },
  { label: "Eficiencia cardíaca", value: "7.8%", delta: "-0.3%", trend: "down" as const, period: "desacople aeróbico" },
  { label: "Volumen semanal", value: "11h 43'", delta: "+8%", trend: "up" as const, period: "vs. media 4 sem." },
  { label: "Intensidad media", value: "0.72 IF", delta: "0.00", trend: "stable" as const, period: "estable" },
  { label: "Consistencia", value: "92%", delta: "+5%", trend: "up" as const, period: "6 de 7 días activos" },
];

const TREND_ICON = {
  up: TrendingUp,
  down: TrendingDown,
  stable: Minus,
};

const TREND_COLOR = {
  up: "var(--lime)",
  down: "var(--amber)",
  stable: "var(--text-3)",
};

export default function InsightsPage() {
  return (
    <>
      <TopBar
        subtitle="COACH IA"
        title="Insights"
      />
      <main className="flex-1 overflow-auto p-5">
        <Card>
          <CardHeader right={<span className="mono text-[10px]" style={{ color: "var(--text-3)" }}>últimos 28 días</span>}>
            MÉTRICAS CLAVE
          </CardHeader>
          <div className="grid grid-cols-3 divide-x divide-y" style={{ borderColor: "var(--hairline)" }}>
            {INSIGHTS.map((insight) => {
              const Icon = TREND_ICON[insight.trend];
              return (
                <div key={insight.label} className="p-4">
                  <p className="mono uc text-[10px]" style={{ color: "var(--text-3)" }}>{insight.label}</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-[22px] font-bold" style={{ color: "var(--text)" }}>{insight.value}</span>
                    <Chip dot={TREND_COLOR[insight.trend]}>
                      <Icon size={10} />
                      {insight.delta}
                    </Chip>
                  </div>
                  <p className="text-[11px] mt-1" style={{ color: "var(--text-3)" }}>{insight.period}</p>
                </div>
              );
            })}
          </div>
        </Card>
      </main>
    </>
  );
}
