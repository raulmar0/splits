"use client";

import { TopBar } from "@/components/shell";
import { Card, CardHeader } from "@/components/ui";
import { PMCChart } from "@/components/charts";
import { useLoad } from "@/hooks/useLoad";

export default function LoadPage() {
  const { data: loadData } = useLoad();

  const latest = loadData[loadData.length - 1];

  return (
    <>
      <TopBar
        subtitle="ANÁLISIS"
        title="Carga de entrenamiento"
      />
      <main className="flex-1 overflow-auto p-5">
        <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
          <Card padding={16}>
            <p className="mono uc text-[10px]" style={{ color: "var(--text-3)" }}>CTL (FITNESS)</p>
            <p className="text-[24px] font-bold mt-1" style={{ color: "var(--lime)" }}>
              {latest?.ctl ?? "—"}
            </p>
          </Card>
          <Card padding={16}>
            <p className="mono uc text-[10px]" style={{ color: "var(--text-3)" }}>ATL (FATIGA)</p>
            <p className="text-[24px] font-bold mt-1" style={{ color: "var(--amber)" }}>
              {latest?.atl ?? "—"}
            </p>
          </Card>
          <Card padding={16}>
            <p className="mono uc text-[10px]" style={{ color: "var(--text-3)" }}>TSB (FORMA)</p>
            <p className="text-[24px] font-bold mt-1" style={{ color: latest && latest.tsb >= 0 ? "var(--lime)" : "var(--amber)" }}>
              {latest?.tsb ?? "—"}
            </p>
          </Card>
          <Card padding={16}>
            <p className="mono uc text-[10px]" style={{ color: "var(--text-3)" }}>TSS HOY</p>
            <p className="text-[24px] font-bold mt-1" style={{ color: "var(--text)" }}>
              {latest?.tss ?? "—"}
            </p>
          </Card>
        </div>

        <Card className="mt-3">
          <CardHeader right={<span className="mono text-[10px]" style={{ color: "var(--text-3)" }}>12 semanas</span>}>
            PERFORMANCE MANAGEMENT CHART
          </CardHeader>
          <div className="p-3">
            <PMCChart data={loadData} height={320} />
          </div>
        </Card>
      </main>
    </>
  );
}
