"use client";

const BLOCKS = [
  { kind: "WU", label: "Calentamiento", minutes: 15, color: "var(--blue-dim)" },
  { kind: "INT", label: "4'", minutes: 4, color: "var(--red)" },
  { kind: "REST", label: "3'", minutes: 3, color: "var(--text-4)" },
  { kind: "INT", label: "4'", minutes: 4, color: "var(--red)" },
  { kind: "REST", label: "3'", minutes: 3, color: "var(--text-4)" },
  { kind: "INT", label: "4'", minutes: 4, color: "var(--red)" },
  { kind: "REST", label: "3'", minutes: 3, color: "var(--text-4)" },
  { kind: "INT", label: "4'", minutes: 4, color: "var(--red)" },
  { kind: "REST", label: "3'", minutes: 3, color: "var(--text-4)" },
  { kind: "INT", label: "4'", minutes: 4, color: "var(--red)" },
  { kind: "CD", label: "Vuelta calma", minutes: 10, color: "var(--text-4)" },
];

export function BlockTimeline() {
  return (
    <div>
      <div
        className="flex rounded-[4px] overflow-hidden"
        style={{ height: 36 }}
      >
        {BLOCKS.map((block, i) => (
          <div
            key={i}
            className="flex items-center justify-center shrink-0"
            style={{
              flex: block.minutes,
              background: block.color,
              minWidth: 20,
            }}
          >
            <span
              className="mono uc text-[10px] font-medium"
              style={{ color: "#0a0c10" }}
            >
              {block.kind === "INT" ? `${block.label}` : `${block.kind} ${block.minutes}'`}
            </span>
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-1.5">
        <span className="mono text-[10px]" style={{ color: "var(--text-3)" }}>0:00</span>
        <span className="mono text-[10px]" style={{ color: "var(--text-3)" }}>0:30</span>
        <span className="mono text-[10px]" style={{ color: "var(--text-3)" }}>1:00</span>
        <span className="mono text-[10px]" style={{ color: "var(--text-3)" }}>1:15</span>
      </div>
    </div>
  );
}
