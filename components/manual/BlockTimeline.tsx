"use client";

import type { Block } from "@/lib/types";

interface BlockTimelineProps {
  blocks: Block[];
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

function totalSeconds(blocks: Block[]): number {
  return blocks.reduce((acc, b) => acc + b.durationSec * (b.reps ?? 1) + (b.recovery ? b.recovery.durationSec * (b.reps ?? 1) : 0), 0);
}

function fmtClock(sec: number): string {
  const h = Math.floor(sec / 3600);
  const m = Math.round((sec % 3600) / 60);
  if (h === 0) return `${m}'`;
  return `${h}h ${String(m).padStart(2, "0")}'`;
}

export function BlockTimeline({ blocks }: BlockTimelineProps) {
  const segments: { kind: Block["kind"]; minutes: number; label: string }[] = [];
  for (const b of blocks) {
    const reps = b.reps ?? 1;
    for (let i = 0; i < reps; i++) {
      segments.push({ kind: b.kind, minutes: Math.max(0.1, b.durationSec / 60), label: b.label });
      if (b.recovery) {
        segments.push({ kind: b.recovery.kind, minutes: Math.max(0.1, b.recovery.durationSec / 60), label: b.recovery.label });
      }
    }
  }
  const total = totalSeconds(blocks);

  if (segments.length === 0) {
    return (
      <div className="rounded-[4px] flex items-center justify-center" style={{ height: 36, background: "var(--surface)", border: "1px dashed var(--border)" }}>
        <span className="mono text-[10px]" style={{ color: "var(--text-3)" }}>
          añade bloques para visualizar la estructura
        </span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex rounded-[4px] overflow-hidden" style={{ height: 36 }}>
        {segments.map((s, i) => (
          <div
            key={i}
            className="flex items-center justify-center shrink-0"
            style={{ flex: s.minutes, background: colorFor(s.kind), minWidth: 14 }}
          >
            <span className="mono uc text-[10px] font-medium" style={{ color: "#0a0c10" }}>
              {s.minutes >= 3 ? s.label : ""}
            </span>
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-1.5">
        <span className="mono text-[10px]" style={{ color: "var(--text-3)" }}>
          0:00
        </span>
        <span className="mono text-[10px]" style={{ color: "var(--text-3)" }}>
          {fmtClock(total / 2)}
        </span>
        <span className="mono text-[10px]" style={{ color: "var(--text-3)" }}>
          {fmtClock(total)}
        </span>
      </div>
    </div>
  );
}
