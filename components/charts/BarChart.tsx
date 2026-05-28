"use client";

import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine } from "recharts";

interface BarChartProps {
  data: number[];
  labels: string[];
  height?: number;
  target?: number;
  color?: string;
}

export function BarChart({ data, labels, height = 140, target, color = "var(--lime)" }: BarChartProps) {
  const chartData = data.map((v, i) => ({ name: labels[i], value: v }));

  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart data={chartData} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="var(--hairline)" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 10, fontFamily: "var(--font-mono)", fill: "var(--text-3)" }}
            tickLine={false}
            axisLine={{ stroke: "var(--hairline)" }}
          />
          <YAxis
            tick={{ fontSize: 10, fontFamily: "var(--font-mono)", fill: "var(--text-3)" }}
            tickLine={false}
            axisLine={false}
            width={32}
          />
          {target && (
            <ReferenceLine
              y={target}
              stroke="var(--lime-dim)"
              strokeDasharray="4 2"
              strokeWidth={1}
            />
          )}
          <Bar
            dataKey="value"
            fill={color}
            radius={[2, 2, 0, 0]}
            animationDuration={320}
          />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}
