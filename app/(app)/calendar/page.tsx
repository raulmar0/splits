"use client";

import { TopBar } from "@/components/shell";
import { Card, CardHeader, Button } from "@/components/ui";
import { ChevronLeft, ChevronRight } from "lucide-react";

const DAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const WEEKS = Array.from({ length: 5 }, (_, w) =>
  Array.from({ length: 7 }, (_, d) => ({
    day: w * 7 + d - 2,
    hasActivity: [3, 5, 8, 10, 12, 15, 17, 19, 22, 24, 26].includes(w * 7 + d),
  }))
);

export default function CalendarPage() {
  return (
    <>
      <TopBar
        subtitle="PLANIFICACIÓN"
        title="Calendario"
        right={
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm">
              <ChevronLeft size={14} />
            </Button>
            <span className="mono text-[11px] px-2" style={{ color: "var(--text-2)" }}>
              Mayo 2026
            </span>
            <Button variant="ghost" size="sm">
              <ChevronRight size={14} />
            </Button>
          </div>
        }
      />
      <main className="flex-1 overflow-auto p-5">
        <Card>
          <CardHeader>VISTA MENSUAL</CardHeader>
          <div className="p-4">
            <div className="grid grid-cols-7 gap-1 mb-2">
              {DAYS.map((d) => (
                <div key={d} className="mono uc text-[10px] text-center py-1" style={{ color: "var(--text-3)" }}>
                  {d}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {WEEKS.flat().map((cell, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-[4px] flex items-center justify-center text-[12px]"
                  style={{
                    background: cell.hasActivity ? "var(--surface-2)" : "transparent",
                    color: cell.day > 0 && cell.day <= 31 ? "var(--text)" : "var(--text-4)",
                    border: cell.day === 19 ? "1px solid var(--lime)" : "1px solid transparent",
                  }}
                >
                  {cell.day > 0 && cell.day <= 31 ? cell.day : ""}
                </div>
              ))}
            </div>
          </div>
        </Card>
      </main>
    </>
  );
}
