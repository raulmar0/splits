"use client";

import { Brain } from "lucide-react";
import { SectionLabel, SportDot } from "@/components/ui";

const TEMPLATES = [
  { name: "VO2max 5x4'", sport: "ride", duration: "1h 15'" },
  { name: "Sweet Spot 2x20'", sport: "ride", duration: "1h 30'" },
  { name: "Long run Z2", sport: "run", duration: "1h 30'" },
  { name: "Tempo 3x10'", sport: "run", duration: "1h 00'" },
  { name: "Técnica nado", sport: "swim", duration: "0h 45'" },
];

export function LivePreview() {
  return (
    <div
      className="w-[380px] shrink-0 p-5 space-y-4 overflow-auto"
      style={{ background: "var(--bg-2)", borderLeft: "1px solid var(--border)" }}
    >
      <div
        className="rounded-[6px] p-3.5"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <SectionLabel>VISTA PREVIA · TARJETA DE SESIÓN</SectionLabel>
        <div className="mt-3">
          <div className="flex items-center gap-2">
            <span className="mono uc text-[9.5px]" style={{ color: "var(--text-3)" }}>
              LUN 19 MAY
            </span>
            <SportDot sport="ride" />
          </div>
          <p className="text-[17px] font-semibold tracking-[-0.01em] mt-1.5" style={{ color: "var(--text)" }}>
            VO2max · 5x4&apos;
          </p>
          <p className="mono text-[11px] mt-1" style={{ color: "var(--text-2)" }}>
            1h 15&apos; · TSS 118 · IF 0.85
          </p>
          <div
            className="flex rounded-[3px] overflow-hidden mt-3"
            style={{ height: 20 }}
          >
            <div style={{ flex: 15, background: "var(--blue-dim)" }} />
            <div style={{ flex: 4, background: "var(--red)" }} />
            <div style={{ flex: 3, background: "var(--text-4)" }} />
            <div style={{ flex: 4, background: "var(--red)" }} />
            <div style={{ flex: 3, background: "var(--text-4)" }} />
            <div style={{ flex: 4, background: "var(--red)" }} />
            <div style={{ flex: 3, background: "var(--text-4)" }} />
            <div style={{ flex: 4, background: "var(--red)" }} />
            <div style={{ flex: 3, background: "var(--text-4)" }} />
            <div style={{ flex: 4, background: "var(--red)" }} />
            <div style={{ flex: 10, background: "var(--text-4)" }} />
          </div>
        </div>
      </div>

      <div
        className="rounded-[6px] p-3.5"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <SectionLabel>IMPACTO EN CARGA</SectionLabel>
        <div className="grid grid-cols-3 gap-3 mt-3">
          <div>
            <p className="mono text-[10px]" style={{ color: "var(--text-3)" }}>CTL</p>
            <p className="mono text-[13px] mt-1" style={{ color: "var(--text)" }}>
              82 → <span style={{ color: "var(--lime)" }}>82.8</span>
            </p>
            <p className="mono text-[10px]" style={{ color: "var(--lime)" }}>+0.8</p>
          </div>
          <div>
            <p className="mono text-[10px]" style={{ color: "var(--text-3)" }}>ATL</p>
            <p className="mono text-[13px] mt-1" style={{ color: "var(--text)" }}>
              94 → <span style={{ color: "var(--amber)" }}>97.4</span>
            </p>
            <p className="mono text-[10px]" style={{ color: "var(--amber)" }}>+3.4</p>
          </div>
          <div>
            <p className="mono text-[10px]" style={{ color: "var(--text-3)" }}>TSB</p>
            <p className="mono text-[13px] mt-1" style={{ color: "var(--text)" }}>
              −12 → <span style={{ color: "var(--red)" }}>−14.6</span>
            </p>
            <p className="mono text-[10px]" style={{ color: "var(--red)" }}>−2.6</p>
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
          Con tu FTP actual de <span className="mono" style={{ color: "var(--text)" }}>312W</span>, los intervalos a{" "}
          <span className="mono" style={{ color: "var(--text)" }}>330W</span> están bien calibrados. Si la HRV baja de{" "}
          <span className="mono" style={{ color: "var(--text)" }}>70ms</span> mañana, considera reducir a 4 reps.
        </p>
      </div>

      <div>
        <SectionLabel>EMPEZAR DESDE PLANTILLA</SectionLabel>
        <div className="mt-3 space-y-0.5">
          {TEMPLATES.map((t) => (
            <button
              key={t.name}
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
