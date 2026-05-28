"use client";

import { Brain } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { SectionLabel, SportDot } from "@/components/ui";
import { BlockTimeline } from "./BlockTimeline";
import type { WorkoutFormData } from "./types";
import { WORKOUT_TEMPLATES } from "@/lib/workout-templates";

const DOW = ["DOM", "LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB"];
const MON = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];

function fmtHeader(date: string): string {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "";
  return `${DOW[d.getUTCDay()]} ${d.getUTCDate()} ${MON[d.getUTCMonth()]}`;
}

export function LivePreview() {
  const { watch, setValue } = useFormContext<WorkoutFormData>();
  const title = watch("title") || "Sin título";
  const date = watch("date");
  const sport = watch("sport");
  const targetDur = watch("targetDur");
  const targetTSS = watch("targetTSS");
  const targetIF = watch("targetIF");
  const blocks = watch("blocks") ?? [];

  function applyTemplate(id: string) {
    const tpl = WORKOUT_TEMPLATES.find((t) => t.id === id);
    if (!tpl) return;
    setValue("title", tpl.name);
    setValue("sport", tpl.sport);
    setValue("targetDur", `${Math.floor(tpl.estDurationSec / 3600)}:${String(Math.floor((tpl.estDurationSec % 3600) / 60)).padStart(2, "0")}:00`);
    setValue("targetTSS", String(tpl.estTSS));
    setValue("targetIF", String(tpl.estIF));
    setValue("blocks", tpl.blocks);
  }

  return (
    <div
      className="w-[380px] shrink-0 p-5 space-y-4 overflow-auto"
      style={{ background: "var(--bg-2)", borderLeft: "1px solid var(--border)" }}
    >
      <div className="rounded-[6px] p-3.5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
        <SectionLabel>VISTA PREVIA · TARJETA DE SESIÓN</SectionLabel>
        <div className="mt-3">
          <div className="flex items-center gap-2">
            <span className="mono uc text-[9.5px]" style={{ color: "var(--text-3)" }}>
              {fmtHeader(date)}
            </span>
            <SportDot sport={sport} />
          </div>
          <p className="text-[17px] font-semibold tracking-[-0.01em] mt-1.5" style={{ color: "var(--text)" }}>
            {title}
          </p>
          <p className="mono text-[11px] mt-1" style={{ color: "var(--text-2)" }}>
            {targetDur} · TSS {targetTSS || "—"} · IF {targetIF || "—"}
          </p>
          <div className="mt-3">
            <BlockTimeline blocks={blocks} />
          </div>
        </div>
      </div>

      <div
        className="rounded-[6px] p-3.5"
        style={{
          background: "linear-gradient(135deg, rgba(132,204,124,0.08), transparent)",
          border: "1px solid var(--border)",
        }}
      >
        <div className="flex items-center gap-2">
          <Brain size={14} stroke="var(--lime)" />
          <SectionLabel accent>SUGERENCIA IA</SectionLabel>
        </div>
        <p className="text-[13px] mt-2 leading-relaxed" style={{ color: "var(--text)" }}>
          Conecta tu API key en Ajustes para que el Coach calibre los intervalos según tu FTP y HRV actual.
        </p>
      </div>

      <div>
        <SectionLabel>EMPEZAR DESDE PLANTILLA</SectionLabel>
        <div className="mt-3 space-y-0.5">
          {WORKOUT_TEMPLATES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => applyTemplate(t.id)}
              className="w-full flex items-center justify-between py-2.5 px-2 rounded-[4px] transition-colors duration-[120ms] ease-out hover:bg-surface-2"
            >
              <span className="text-[12.5px]" style={{ color: "var(--text)" }}>
                {t.name}
              </span>
              <span className="mono text-[10px]" style={{ color: "var(--text-3)" }}>
                {t.sport} · {t.duration}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
