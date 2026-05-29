"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { TopBar } from "@/components/shell";
import { Button } from "@/components/ui";
import { TabNav, StructureTab, ImportTab, ExportTab, LivePreview } from "@/components/manual";
import type { WorkoutFormData } from "@/components/manual/types";
import { createPlannedAction } from "@/lib/supabase/planned-actions";

const TABS = [
  { id: "estructura", label: "Estructura" },
  { id: "importar", label: "Importar" },
  { id: "exportar", label: "Exportar" },
];

function parseDurToSec(s: string): number {
  const parts = s.split(":").map((p) => parseInt(p, 10) || 0);
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return parts[0] || 0;
}

export default function NewActivityPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("estructura");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const today = new Date().toISOString().slice(0, 10);
  const form = useForm<WorkoutFormData>({
    defaultValues: {
      title: "",
      date: today,
      time: "07:00",
      sport: "ride",
      targetDur: "1:00:00",
      targetDist: "",
      targetTSS: "60",
      targetIF: "0.75",
      notes: "",
      blocks: [],
    },
  });

  async function submit(status: "draft" | "scheduled") {
    const data = form.getValues();
    if (!data.title.trim()) {
      setError("Necesitas un título.");
      return;
    }
    setError(null);
    setSubmitting(true);
    const res = await createPlannedAction({
      title: data.title,
      date: data.date,
      time: data.time,
      sport: data.sport,
      estDurationSec: parseDurToSec(data.targetDur),
      estDistanceM: data.targetDist ? parseFloat(data.targetDist) * 1000 : undefined,
      estTSS: parseInt(data.targetTSS, 10) || undefined,
      estIF: parseFloat(data.targetIF) || undefined,
      blocks: data.blocks,
      notes: data.notes || undefined,
      status,
    });
    setSubmitting(false);
    if (res?.error) {
      setError(res.error);
      return;
    }
    router.push(status === "scheduled" ? "/calendar" : "/activities");
  }

  return (
    <FormProvider {...form}>
      <TopBar
        subtitle="ACTIVIDADES · NUEVA"
        title="Crear entrenamiento"
        right={
          <>
            {error && (
              <span className="mono text-[11px]" style={{ color: "var(--red)" }}>
                {error}
              </span>
            )}
            <Button variant="ghost" type="button" onClick={() => router.back()}>
              Cancelar
            </Button>
            <Button variant="default" type="button" disabled={submitting} onClick={() => void submit("draft")}>
              Guardar borrador
            </Button>
            <Button variant="primary" type="button" disabled={submitting} onClick={() => void submit("scheduled")}>
              {submitting ? "Guardando…" : "Guardar y planificar"}
            </Button>
          </>
        }
      />
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-auto p-5">
          <TabNav tabs={TABS} active={activeTab} onChange={setActiveTab} />
          <div className="mt-6">
            {activeTab === "estructura" && <StructureTab />}
            {activeTab === "importar" && <ImportTab />}
            {activeTab === "exportar" && <ExportTab />}
          </div>
        </div>
        <LivePreview />
      </div>
    </FormProvider>
  );
}
