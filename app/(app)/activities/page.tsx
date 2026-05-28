"use client";

import Link from "next/link";
import { TopBar } from "@/components/shell";
import { Button, Card, CardHeader, SportDot, Chip } from "@/components/ui";
import { useActivities } from "@/hooks/useActivities";
import { fmtDist, fmtElev, fmtTSS } from "@/lib/formatters";
import { Plus } from "lucide-react";

export default function ActivitiesPage() {
  const { data: activities } = useActivities();

  return (
    <>
      <TopBar
        subtitle="HISTORIAL"
        title="Actividades"
        right={
          <Link href="/activities/new">
            <Button variant="primary">
              <Plus size={12} /> Nueva
            </Button>
          </Link>
        }
      />
      <main className="flex-1 overflow-auto p-5">
        <Card>
          <CardHeader right={<span className="mono text-[10px]" style={{ color: "var(--text-3)" }}>{activities.length} actividades</span>}>
            ÚLTIMAS ACTIVIDADES
          </CardHeader>
          <div className="divide-y" style={{ borderColor: "var(--hairline)" }}>
            {activities.map((a) => (
              <Link
                key={a.id}
                href={`/activities/${a.id}`}
                className="flex items-center gap-3 px-3.5 py-3 transition-colors duration-[120ms] ease-out hover:bg-surface-2"
              >
                <SportDot sport={a.sport} />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium truncate" style={{ color: "var(--text)" }}>
                    {a.title}
                  </p>
                  <p className="mono text-[10.5px] mt-0.5" style={{ color: "var(--text-3)" }}>
                    {a.date} · {a.time}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Chip>{a.dur}</Chip>
                  {a.dist > 0 && (
                    <span className="mono text-[11px]" style={{ color: "var(--text-2)" }}>
                      {fmtDist(a.dist)} km
                    </span>
                  )}
                  {a.elev > 0 && (
                    <span className="mono text-[11px]" style={{ color: "var(--text-3)" }}>
                      {fmtElev(a.elev)} m
                    </span>
                  )}
                  <span className="mono text-[11px] font-semibold" style={{ color: "var(--lime)" }}>
                    TSS {fmtTSS(a.tss)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </Card>
      </main>
    </>
  );
}
