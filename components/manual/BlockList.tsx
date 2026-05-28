"use client";

import { MoreHorizontal } from "lucide-react";

const BLOCKS = [
  { code: "WU", title: "Calentamiento", duration: "15:00", target: "Z1-Z2", color: "var(--blue-dim)" },
  { code: "5×", title: "VO2max interval", duration: "4:00", target: "330W", color: "var(--red)" },
  { code: "CD", title: "Vuelta a la calma", duration: "10:00", target: "Z1", color: "var(--text-4)" },
];

export function BlockList() {
  return (
    <div className="mt-3">
      {BLOCKS.map((block, i) => (
        <div
          key={i}
          className="flex items-center gap-3 py-2.5"
          style={{ borderBottom: "1px solid var(--hairline)" }}
        >
          <div
            className="w-1 rounded-[2px] shrink-0"
            style={{ height: 28, background: block.color }}
          />
          <span className="mono uc text-[10px] font-medium w-8 shrink-0" style={{ color: "var(--text-2)" }}>
            {block.code}
          </span>
          <span className="text-[12.5px] flex-1" style={{ color: "var(--text)" }}>
            {block.title}
            {block.code === "5×" && (
              <span className="mono text-[10px] ml-1.5" style={{ color: "var(--text-3)" }}>
                × 5 reps · 3&apos; rec
              </span>
            )}
          </span>
          <span className="mono text-[11px] w-12 text-right shrink-0" style={{ color: "var(--text-2)" }}>
            {block.duration}
          </span>
          <span className="mono text-[11px] w-16 text-right shrink-0" style={{ color: "var(--text-2)" }}>
            {block.target}
          </span>
          <button className="shrink-0 p-1 rounded transition-colors hover:bg-surface-2">
            <MoreHorizontal size={14} style={{ color: "var(--text-3)" }} />
          </button>
        </div>
      ))}
    </div>
  );
}
