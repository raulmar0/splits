"use client";

import { useMemo } from "react";

interface ZoneDonutProps {
  values: number[];
  size?: number;
  label?: string;
}

const ZONE_COLORS = [
  "#3d4a55",
  "var(--blue)",
  "var(--lime)",
  "var(--amber)",
  "var(--red-dim)",
  "var(--red)",
];

interface Segment {
  color: string;
  dashArray: string;
  dashOffset: number;
}

function computeSegments(values: number[], total: number, circumference: number): Segment[] {
  const result: Segment[] = [];
  let accumulated = 0;
  for (let i = 0; i < values.length; i++) {
    const pct = values[i] / total;
    const dash = pct * circumference;
    const gap = circumference - dash;
    result.push({
      color: ZONE_COLORS[i] || "var(--text-4)",
      dashArray: `${dash} ${gap}`,
      dashOffset: -accumulated,
    });
    accumulated = accumulated + dash;
  }
  return result;
}

export function ZoneDonut({ values, size = 120, label }: ZoneDonutProps) {
  const total = values.reduce((a, b) => a + b, 0);
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  const segments = useMemo(
    () => computeSegments(values, total, circumference),
    [values, total, circumference]
  );

  return (
    <div style={{ width: size, height: size, position: "relative" }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        {segments.map((seg, i) => (
          <circle
            key={i}
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={seg.color}
            strokeWidth={strokeWidth}
            strokeDasharray={seg.dashArray}
            strokeDashoffset={seg.dashOffset}
          />
        ))}
      </svg>
      {label && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <span className="mono uc text-[9px] tracking-[0.08em]" style={{ color: "var(--text-3)" }}>
            {label}
          </span>
        </div>
      )}
    </div>
  );
}
