"use client";

import { TopBar } from "@/components/shell";
import { Button, Card, CardHeader } from "@/components/ui";
import { WeekStrip, AISuggestion, WeekSummary } from "@/components/dashboard";
import { PMCChart } from "@/components/charts";
import { useLoad } from "@/hooks/useLoad";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

const PREV_WEEK = [
  { label: "L 12", sport: "ride" as const, title: "Z2 ruta", duration: "2:42", tss: 142 },
  { label: "M 13", sport: "strength" as const, title: "Tren inf.", duration: "0:58", tss: 38 },
  { label: "X 14", sport: "swim" as const, title: "8x100", duration: "0:46", tss: 52 },
  { label: "J 15", sport: "ride" as const, title: "VO2 5x4'", duration: "1:14", tss: 118 },
  { label: "V 16", sport: "rest" as const, title: "Descanso", duration: "—", tss: 0 },
  { label: "S 17", sport: "run" as const, title: "Long run", duration: "1:18", tss: 96 },
  { label: "D 18", sport: "ride" as const, title: "Endurance", duration: "3:48", tss: 198 },
];

const CURRENT_WEEK = [
  { label: "L 19", sport: "ride" as const, title: "VO2 5x4'", duration: "1:15", tss: 118, today: true },
  { label: "M 20", sport: "ride" as const, title: "Z2 fácil", duration: "1:30", tss: 78 },
  { label: "X 21", sport: "run" as const, title: "Tempo", duration: "1:18", tss: 96 },
  { label: "J 22", sport: "swim" as const, title: "Aerobic", duration: "0:46", tss: 52 },
  { label: "V 23", sport: "strength" as const, title: "Pesado", duration: "0:58", tss: 38 },
  { label: "S 24", sport: "trail" as const, title: "Trail", duration: "1:42", tss: 110 },
  { label: "D 25", sport: "ride" as const, title: "Largo +", duration: "4:00", tss: 220 },
];

export default function DashboardPage() {
  const { data: loadData } = useLoad();

  return (
    <>
      <TopBar
        subtitle="DASHBOARD · WEEK"
        title="Semana 20"
        right={
          <>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm">
                <ChevronLeft size={14} />
              </Button>
              <span className="mono text-[11px]" style={{ color: "var(--text-2)" }}>
                12 may – 25 may
              </span>
              <Button variant="ghost" size="sm">
                <ChevronRight size={14} />
              </Button>
            </div>
            <Button variant="default">
              <Plus size={12} /> Sesión
            </Button>
          </>
        }
      />
      <main className="flex-1 overflow-auto p-5">
        <WeekStrip
          label="SEMANA ANTERIOR · COMPLETA"
          days={PREV_WEEK}
        />

        <WeekStrip
          label="SEMANA ACTUAL · PLAN IA"
          days={CURRENT_WEEK}
          planned
          accent
        />

        <div className="grid gap-3" style={{ gridTemplateColumns: "1.5fr 1fr" }}>
          <Card>
            <CardHeader right={<span className="mono text-[10px]" style={{ color: "var(--text-3)" }}>tap para drill-down</span>}>
              CARGA ACUMULADA · 12 SEMANAS
            </CardHeader>
            <div className="p-3">
              <PMCChart data={loadData} height={200} />
            </div>
          </Card>

          <div className="flex flex-col gap-3">
            <WeekSummary
              volume="11:43"
              load={712}
              distance={241}
              elevation={3460}
            />
            <AISuggestion
              text={
                <>
                  Tu ratio carrera/bici está sesgado a la bici esta semana. Para tu prueba olímpica de julio, sumemos{" "}
                  <b>15&apos; de carrera Z2</b> al brick del domingo.
                </>
              }
            />
          </div>
        </div>
      </main>
    </>
  );
}
