"use client";

import { Zap, Download } from "lucide-react";
import { Button, SectionLabel } from "@/components/ui";

const FORMATS = [
  { ext: ".FIT", name: "Garmin FIT", desc: "Compatible con Edge, Forerunner, Wahoo Elemnt", size: "24 KB", primary: true },
  { ext: ".ZWO", name: "Zwift Workout", desc: "Formato XML para Zwift", size: "8 KB", primary: false },
  { ext: ".ERG", name: "ERG (trainer)", desc: "Formato para rodillos inteligentes", size: "6 KB", primary: false },
  { ext: ".MRC", name: "MRC", desc: "Formato de workout genérico", size: "4 KB", primary: false },
  { ext: ".TCX", name: "TrainingCenter XML", desc: "TrainingPeaks y otros", size: "18 KB", primary: false },
  { ext: ".JSON", name: "Splits JSON", desc: "Formato interno, reimportable sin pérdida", size: "12 KB", primary: false },
];

const PUSH_INTEGRATIONS = [
  { letter: "G", name: "Garmin Connect", status: "Conectado · mateo.r", color: "#007cc3" },
  { letter: "W", name: "Wahoo Elemnt", status: "No conectado", color: "#0093d0" },
  { letter: "Z", name: "Zwift", status: "Conectado · @mateo_r", color: "#f57906" },
];

export function ExportTab() {
  return (
    <div className="space-y-8">
      <div
        className="rounded-[6px] p-3.5 flex items-center gap-3"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderLeft: "3px solid var(--lime)",
        }}
      >
        <Zap size={18} style={{ color: "var(--lime)" }} />
        <div>
          <p className="text-[13px] font-medium" style={{ color: "var(--text)" }}>
            VO2max · 5x4&apos;
          </p>
          <p className="mono text-[11px] mt-0.5" style={{ color: "var(--text-3)" }}>
            Ciclismo · 1h 15&apos; · TSS 118 · IF 0.85
          </p>
        </div>
      </div>

      <div>
        <SectionLabel>FORMATOS</SectionLabel>
        <div className="mt-3">
          {FORMATS.map((fmt) => (
            <div
              key={fmt.ext}
              className="flex items-center gap-3 py-3"
              style={{
                borderBottom: "1px solid var(--hairline)",
              }}
            >
              <div
                className="w-11 h-6 rounded-[4px] flex items-center justify-center mono text-[10px] font-medium shrink-0"
                style={{
                  background: "var(--surface-2)",
                  color: "var(--text-2)",
                  border: fmt.primary ? "1px solid var(--lime-dim)" : "1px solid var(--border)",
                }}
              >
                {fmt.ext}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12.5px] font-medium" style={{ color: "var(--text)" }}>
                  {fmt.name}
                </p>
                <p className="text-[11px] mt-0.5" style={{ color: "var(--text-3)" }}>
                  {fmt.desc}
                </p>
              </div>
              <span className="mono text-[11px] shrink-0" style={{ color: "var(--text-3)" }}>
                {fmt.size}
              </span>
              <Button variant={fmt.primary ? "primary" : "default"} size="sm">
                <Download size={12} /> Descargar
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <SectionLabel>O ENVIAR DIRECTAMENTE A</SectionLabel>
        <div className="grid grid-cols-3 gap-3 mt-3">
          {PUSH_INTEGRATIONS.map((int) => (
            <div
              key={int.name}
              className="rounded-[6px] p-3.5"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-[26px] h-[26px] rounded-[4px] flex items-center justify-center mono text-[12px] font-bold shrink-0"
                  style={{ background: int.color, color: "#fff" }}
                >
                  {int.letter}
                </div>
                <p className="text-[12.5px] font-medium" style={{ color: "var(--text)" }}>
                  {int.name}
                </p>
              </div>
              <p className="mono text-[10px]" style={{ color: "var(--text-3)" }}>
                {int.status}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
