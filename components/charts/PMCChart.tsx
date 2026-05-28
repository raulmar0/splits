"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";
import type { LoadPoint } from "@/lib/types";

interface PMCChartProps {
  data: LoadPoint[];
  height?: number;
}

export function PMCChart({ data, height = 200 }: PMCChartProps) {
  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="pmc-ctl-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--blue)" stopOpacity={0.2} />
              <stop offset="100%" stopColor="var(--blue)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="pmc-atl-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--amber)" stopOpacity={0.15} />
              <stop offset="100%" stopColor="var(--amber)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="var(--hairline)" strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fontFamily: "var(--font-mono)", fill: "var(--text-3)" }}
            tickLine={false}
            axisLine={{ stroke: "var(--hairline)" }}
            tickFormatter={(v: string) => v.slice(5)}
          />
          <YAxis
            tick={{ fontSize: 10, fontFamily: "var(--font-mono)", fill: "var(--text-3)" }}
            tickLine={false}
            axisLine={false}
            width={32}
          />
          <Tooltip
            contentStyle={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 6,
              fontSize: 11,
              fontFamily: "var(--font-mono)",
            }}
            labelStyle={{ color: "var(--text-3)" }}
          />
          <Area
            type="monotone"
            dataKey="ctl"
            stroke="var(--blue)"
            strokeWidth={2}
            fill="url(#pmc-ctl-fill)"
            name="CTL"
            dot={false}
            animationDuration={320}
          />
          <Area
            type="monotone"
            dataKey="atl"
            stroke="var(--amber)"
            strokeWidth={1.5}
            fill="url(#pmc-atl-fill)"
            name="ATL"
            dot={false}
            animationDuration={320}
          />
          <Area
            type="monotone"
            dataKey="tsb"
            stroke="var(--lime)"
            strokeWidth={1}
            fill="none"
            name="TSB"
            dot={false}
            strokeDasharray="4 2"
            animationDuration={320}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
