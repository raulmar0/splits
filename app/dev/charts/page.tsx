"use client";

import { Sparkline, PMCChart, BarChart, ZoneDonut } from "@/components/charts";
import { Card, CardHeader } from "@/components/ui";
import { useLoad } from "@/hooks/useLoad";

export default function DevChartsPage() {
  const { data: loadData } = useLoad();

  const tssWeek = [142, 96, 0, 118, 52, 38, 110];
  const tssLabels = ["L", "M", "X", "J", "V", "S", "D"];

  return (
    <div className="min-h-screen p-8" style={{ background: "var(--bg)" }}>
      <div className="max-w-[1200px] mx-auto">
        <div className="mb-10">
          <p className="mono uc text-[10px] tracking-[0.12em] mb-1" style={{ color: "var(--text-3)" }}>
            DEV · CHARTS
          </p>
          <h1 className="text-[28px] font-bold tracking-[-0.02em]" style={{ color: "var(--text)" }}>
            Charts · Preview
          </h1>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>SPARKLINE</CardHeader>
            <div className="p-5">
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-3">
                  <Sparkline data={[68, 70, 72, 71, 74, 76, 78, 80, 82]} width={100} height={28} color="var(--blue)" fill />
                  <span className="mono text-[10px]" style={{ color: "var(--text-3)" }}>CTL trend</span>
                </div>
                <div className="flex items-center gap-3">
                  <Sparkline data={[60, 80, 45, 90, 70, 85, 55, 95]} width={100} height={28} color="var(--amber)" fill />
                  <span className="mono text-[10px]" style={{ color: "var(--text-3)" }}>ATL volatile</span>
                </div>
                <div className="flex items-center gap-3">
                  <Sparkline data={[75, 78, 72, 80, 76, 79, 77, 78]} width={100} height={28} color="var(--red)" fill />
                  <span className="mono text-[10px]" style={{ color: "var(--text-3)" }}>HRV</span>
                </div>
                <div className="flex items-center gap-3">
                  <Sparkline data={[7.2, 8.1, 6.5, 7.8, 7.4, 6.9, 7.6]} width={100} height={28} color="var(--blue)" fill />
                  <span className="mono text-[10px]" style={{ color: "var(--text-3)" }}>Sleep</span>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader>PERFORMANCE MANAGEMENT · 84 DÍAS</CardHeader>
            <div className="p-3">
              <PMCChart data={loadData} height={240} />
            </div>
          </Card>

          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader right={<span className="mono text-[11px]" style={{ color: "var(--lime)" }}>556 / 580</span>}>
                CARGA SEMANAL · TSS
              </CardHeader>
              <div className="p-3">
                <BarChart data={tssWeek} labels={tssLabels} height={160} target={140} />
              </div>
            </Card>

            <Card>
              <CardHeader right={<span className="mono text-[10px]" style={{ color: "var(--text-3)" }}>FTP 312 W</span>}>
                ZONAS POTENCIA · 7D
              </CardHeader>
              <div className="flex items-center gap-4 p-4">
                <ZoneDonut values={[8, 42, 24, 12, 9, 5]} size={120} label="EN ZONA" />
                <div className="flex flex-col gap-2 flex-1">
                  {[
                    ["Z1 recovery", 8, "#3d4a55"],
                    ["Z2 endurance", 42, "var(--blue)"],
                    ["Z3 tempo", 24, "var(--lime)"],
                    ["Z4 threshold", 12, "var(--amber)"],
                    ["Z5 VO2max", 9, "var(--red-dim)"],
                    ["Z6 anaerobic", 5, "var(--red)"],
                  ].map(([n, v, c]) => (
                    <div key={n as string} className="flex items-center gap-2 text-[11px]">
                      <span className="w-1.5 h-1.5 rounded-[1px] shrink-0" style={{ background: c as string }} />
                      <span className="flex-1" style={{ color: "var(--text-2)" }}>{n as string}</span>
                      <span className="mono" style={{ color: "var(--text)" }}>{v as number}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
