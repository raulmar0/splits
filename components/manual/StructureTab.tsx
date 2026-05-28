"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input, Button, SectionLabel } from "@/components/ui";
import { SportPill } from "@/components/shared/SportPill";
import type { Sport } from "@/lib/types";
import { BlockTimeline } from "./BlockTimeline";
import { BlockList } from "./BlockList";
import { Plus, Repeat } from "lucide-react";

const workoutSchema = z.object({
  title: z.string().min(1, "Título requerido"),
  date: z.string().min(1, "Fecha requerida"),
  time: z.string().min(1, "Hora requerida"),
  sport: z.enum(["ride", "run", "swim", "strength", "trail", "rest"]),
  targetDur: z.string(),
  targetDist: z.string().optional(),
  targetTSS: z.string(),
  targetIF: z.string(),
  notes: z.string().optional(),
});

type WorkoutFormData = z.infer<typeof workoutSchema>;

const SPORTS = ["ride", "run", "swim", "strength", "trail", "rest"] as const;

export function StructureTab() {
  const { control, watch, setValue } = useForm<WorkoutFormData>({
    resolver: zodResolver(workoutSchema),
    defaultValues: {
      title: "VO2max · 5x4'",
      date: "2026-05-19",
      time: "07:00",
      sport: "ride",
      targetDur: "1:15:00",
      targetTSS: "118",
      targetIF: "0.85",
      notes: "",
    },
  });

  const sport = watch("sport");

  return (
    <div className="space-y-6">
      <div>
        <SectionLabel>IDENTIDAD</SectionLabel>
        <div className="grid grid-cols-[1fr_180px_140px] gap-3 mt-3">
          <Controller
            name="title"
            control={control}
            render={({ field }) => <Input label="TÍTULO" {...field} />}
          />
          <Controller
            name="date"
            control={control}
            render={({ field }) => <Input label="FECHA" mono {...field} />}
          />
          <Controller
            name="time"
            control={control}
            render={({ field }) => <Input label="HORA" mono {...field} />}
          />
        </div>
      </div>

      <div>
        <SectionLabel>DEPORTE</SectionLabel>
        <div className="flex gap-2 mt-3">
          {SPORTS.map((s) => (
            <SportPill
              key={s}
              sport={s}
              active={sport === s}
              onClick={() => setValue("sport", s)}
            />
          ))}
        </div>
      </div>

      <div>
        <SectionLabel>OBJETIVO PLANIFICADO</SectionLabel>
        <div className="grid grid-cols-4 gap-3 mt-3">
          <Controller
            name="targetDur"
            control={control}
            render={({ field }) => (
              <div
                className="rounded-[6px] p-3"
                style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
              >
                <p className="mono text-[10px]" style={{ color: "var(--text-3)" }}>DURACIÓN</p>
                <input
                  className="mono text-[18px] font-semibold bg-transparent border-none outline-none mt-1 w-full"
                  style={{ color: "var(--text)" }}
                  {...field}
                />
              </div>
            )}
          />
          <Controller
            name="targetDist"
            control={control}
            render={({ field }) => (
              <div
                className="rounded-[6px] p-3"
                style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
              >
                <p className="mono text-[10px]" style={{ color: "var(--text-3)" }}>DISTANCIA</p>
                <input
                  className="mono text-[18px] font-semibold bg-transparent border-none outline-none mt-1 w-full"
                  style={{ color: "var(--text)" }}
                  placeholder="—"
                  {...field}
                />
              </div>
            )}
          />
          <Controller
            name="targetTSS"
            control={control}
            render={({ field }) => (
              <div
                className="rounded-[6px] p-3"
                style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
              >
                <p className="mono text-[10px]" style={{ color: "var(--text-3)" }}>TSS</p>
                <input
                  className="mono text-[18px] font-semibold bg-transparent border-none outline-none mt-1 w-full"
                  style={{ color: "var(--text)" }}
                  {...field}
                />
              </div>
            )}
          />
          <Controller
            name="targetIF"
            control={control}
            render={({ field }) => (
              <div
                className="rounded-[6px] p-3"
                style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
              >
                <p className="mono text-[10px]" style={{ color: "var(--text-3)" }}>IF</p>
                <input
                  className="mono text-[18px] font-semibold bg-transparent border-none outline-none mt-1 w-full"
                  style={{ color: "var(--text)" }}
                  {...field}
                />
              </div>
            )}
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <SectionLabel>ESTRUCTURA · BLOQUES</SectionLabel>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm">
              <Plus size={12} /> Bloque
            </Button>
            <Button variant="ghost" size="sm">
              <Repeat size={12} /> Repetición
            </Button>
          </div>
        </div>
        <div className="mt-3">
          <BlockTimeline />
          <BlockList />
        </div>
      </div>

      <div>
        <SectionLabel>NOTAS</SectionLabel>
        <Controller
          name="notes"
          control={control}
          render={({ field }) => (
            <textarea
              className="w-full mt-3 rounded-[5px] px-3 py-2 text-[13px] resize-none"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                color: "var(--text)",
                height: 80,
              }}
              placeholder="Notas adicionales..."
              {...field}
            />
          )}
        />
      </div>
    </div>
  );
}
