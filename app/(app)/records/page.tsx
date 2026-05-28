"use client";

import { TopBar } from "@/components/shell";
import { Card, CardHeader, Chip } from "@/components/ui";
import { Trophy } from "lucide-react";

const RECORDS = [
  { label: "Mayor TSS en un día", value: "220", detail: "Endurance largo · 11 may", sport: "ride" },
  { label: "Mayor distancia bici", value: "112 km", detail: "Endurance largo · 11 may", sport: "ride" },
  { label: "Mayor desnivel", value: "1\u2009240 m", detail: "Endurance largo · 11 may", sport: "ride" },
  { label: "Ritmo más rápido 10K", value: "4:02/km", detail: "Long run · 17 may", sport: "run" },
  { label: "Mayor distancia carrera", value: "18.2 km", detail: "Long run · 17 may", sport: "run" },
  { label: "Mayor desnivel trail", value: "740 m", detail: "Trail Pedriza · 12 may", sport: "trail" },
  { label: "Velocidad media máx. natación", value: "1:42/100m", detail: "Técnica + 8x100 · 14 may", sport: "swim" },
  { label: "Mayor potencia normalizada", value: "264W", detail: "VO2 5x4' · 15 may", sport: "ride" },
];

const SPORT_COLORS: Record<string, string> = {
  ride: "var(--lime)",
  run: "var(--amber)",
  trail: "var(--amber)",
  swim: "var(--blue)",
  strength: "var(--violet)",
};

export default function RecordsPage() {
  return (
    <>
      <TopBar
        subtitle="MARCAS PERSONALES"
        title="Récords"
      />
      <main className="flex-1 overflow-auto p-5">
        <Card>
          <CardHeader right={<span className="mono text-[10px]" style={{ color: "var(--text-3)" }}>últimos 30 días</span>}>
            <Trophy size={12} className="mr-1.5" style={{ color: "var(--lime)" }} />
            RÉCORDS PERSONALES
          </CardHeader>
          <div className="divide-y" style={{ borderColor: "var(--hairline)" }}>
            {RECORDS.map((r) => (
              <div key={r.label} className="flex items-center gap-3 px-3.5 py-3">
                <div
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ background: SPORT_COLORS[r.sport] ?? "var(--text-3)" }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-[12.5px] font-medium" style={{ color: "var(--text)" }}>{r.label}</p>
                  <p className="text-[11px] mt-0.5" style={{ color: "var(--text-3)" }}>{r.detail}</p>
                </div>
                <Chip variant="accent">{r.value}</Chip>
              </div>
            ))}
          </div>
        </Card>
      </main>
    </>
  );
}
