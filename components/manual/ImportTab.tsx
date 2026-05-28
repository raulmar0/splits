"use client";

import { Upload, Check, AlertTriangle } from "lucide-react";
import { Button, SectionLabel, Chip } from "@/components/ui";

const RECENT_UPLOADS = [
  { type: "FIT", name: "VO2max_5x4_mateo.fit", size: "84 KB", time: "hace 2'", status: "ok" },
  { type: "TCX", name: "long_run_mayo17.tcx", size: "126 KB", time: "hace 1h", status: "ok" },
  { type: "ZWO", name: "sweet_spot_zwift.zwo", size: "12 KB", time: "ayer", status: "duplicado" },
  { type: "FIT", name: "endurance_may11.fit", size: "312 KB", time: "hace 7d", status: "parcial" },
];

const INTEGRATIONS = [
  { letter: "S", name: "Strava", desc: "Sincroniza actividades automáticamente", color: "#fc4c02" },
  { letter: "G", name: "Garmin Connect", desc: "Importa desde tu dispositivo Garmin", color: "#007cc3" },
  { letter: "T", name: "TrainingPeaks", desc: "Planes estructurados y workouts", color: "#ed3232" },
  { letter: "Z", name: "Zwift", desc: "Actividades y workouts virtuales", color: "#f57906" },
];

export function ImportTab() {
  return (
    <div className="space-y-8">
      <div>
        <SectionLabel>IMPORTAR DESDE ARCHIVO</SectionLabel>
        <div
          className="mt-3 rounded-[8px] flex flex-col items-center justify-center text-center"
          style={{
            border: "1.5px dashed var(--border-strong)",
            padding: "44px 20px",
          }}
        >
          <Upload size={28} style={{ color: "var(--lime)" }} />
          <p className="text-[15px] mt-3" style={{ color: "var(--text)" }}>
            Arrastra un archivo aquí o selecciona uno
          </p>
          <p className="mono text-[11px] mt-1.5" style={{ color: "var(--text-3)" }}>
            .FIT · .GPX · .TCX · .ZWO · .ERG · .MRC · .CSV — hasta 50 MB
          </p>
          <Button variant="primary" className="mt-4">
            Seleccionar archivo
          </Button>
        </div>
      </div>

      <div>
        <SectionLabel>SUBIDAS RECIENTES</SectionLabel>
        <div className="mt-3">
          {RECENT_UPLOADS.map((upload, i) => (
            <div
              key={i}
              className="flex items-center gap-3 py-2.5"
              style={{ borderBottom: "1px solid var(--hairline)" }}
            >
              <Chip>{upload.type}</Chip>
              <div className="flex-1 min-w-0">
                <p className="text-[12.5px] truncate" style={{ color: "var(--text)" }}>
                  {upload.name}
                </p>
                <p className="mono text-[10px] mt-0.5" style={{ color: "var(--text-3)" }}>
                  {upload.size} · {upload.time}
                </p>
              </div>
              {upload.status === "ok" && (
                <span className="flex items-center gap-1 mono text-[10px]" style={{ color: "var(--lime)" }}>
                  <Check size={12} /> ok
                </span>
              )}
              {upload.status === "duplicado" && (
                <span className="flex items-center gap-1 mono text-[10px]" style={{ color: "var(--amber)" }}>
                  <AlertTriangle size={12} /> duplicado
                </span>
              )}
              {upload.status === "parcial" && (
                <span className="flex items-center gap-1 mono text-[10px]" style={{ color: "var(--amber)" }}>
                  <AlertTriangle size={12} /> parcial
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <SectionLabel>O IMPORTAR DESDE</SectionLabel>
        <div className="grid grid-cols-2 gap-3 mt-3">
          {INTEGRATIONS.map((int) => (
            <div
              key={int.name}
              className="flex items-center gap-3 rounded-[6px] p-3.5 cursor-pointer transition-colors duration-[120ms] ease-out hover:bg-surface-2"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
            >
              <div
                className="w-[26px] h-[26px] rounded-[4px] flex items-center justify-center mono text-[12px] font-bold shrink-0"
                style={{ background: int.color, color: "#fff" }}
              >
                {int.letter}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12.5px] font-medium" style={{ color: "var(--text)" }}>
                  {int.name}
                </p>
                <p className="text-[11px] mt-0.5" style={{ color: "var(--text-3)" }}>
                  {int.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
