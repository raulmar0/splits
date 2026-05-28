"use client";

import { X } from "lucide-react";
import type { Block } from "@/lib/types";

interface BlockListProps {
  blocks: Block[];
  onRemove?: (index: number) => void;
}

function colorFor(kind: Block["kind"]): string {
  switch (kind) {
    case "WU":
      return "var(--blue-dim)";
    case "INTERVAL":
      return "var(--red)";
    case "REST":
      return "var(--text-4)";
    case "CD":
      return "var(--text-4)";
  }
}

function fmtDur(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  if (s === 0) return `${m}:00`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function BlockList({ blocks, onRemove }: BlockListProps) {
  if (blocks.length === 0) {
    return (
      <p className="mono text-[10px] mt-3" style={{ color: "var(--text-3)" }}>
        sin bloques — empieza desde una plantilla o añade uno
      </p>
    );
  }
  return (
    <div className="mt-3">
      {blocks.map((b, i) => (
        <div
          key={i}
          className="flex items-center gap-3 py-2.5"
          style={{ borderBottom: "1px solid var(--hairline)" }}
        >
          <div className="w-1 rounded-[2px] shrink-0" style={{ height: 28, background: colorFor(b.kind) }} />
          <span className="mono uc text-[10px] font-medium w-10 shrink-0" style={{ color: "var(--text-2)" }}>
            {b.reps && b.reps > 1 ? `${b.reps}×` : b.kind}
          </span>
          <span className="text-[12.5px] flex-1" style={{ color: "var(--text)" }}>
            {b.label}
            {b.reps && b.reps > 1 && b.recovery && (
              <span className="mono text-[10px] ml-1.5" style={{ color: "var(--text-3)" }}>
                × {b.reps} reps · {fmtDur(b.recovery.durationSec)} rec
              </span>
            )}
          </span>
          <span className="mono text-[11px] w-14 text-right shrink-0" style={{ color: "var(--text-2)" }}>
            {fmtDur(b.durationSec)}
          </span>
          <span className="mono text-[11px] w-20 text-right shrink-0 truncate" style={{ color: "var(--text-2)" }} title={b.target.value}>
            {b.target.value}
          </span>
          {onRemove && (
            <button className="shrink-0 p-1 rounded transition-colors hover:bg-surface-2" onClick={() => onRemove(i)} type="button" aria-label="Eliminar bloque">
              <X size={14} style={{ color: "var(--text-3)" }} />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
