"use client";

import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { Input, Button, SectionLabel } from "@/components/ui";
import { SportPill } from "@/components/shared/SportPill";
import type { Block, Sport } from "@/lib/types";
import { BlockTimeline } from "./BlockTimeline";
import { BlockList } from "./BlockList";
import { Plus, Repeat } from "lucide-react";
import type { WorkoutFormData } from "./types";

const SPORTS: Sport[] = ["ride", "run", "swim", "strength", "trail", "rest"];

export function StructureTab() {
  const { control, watch, setValue } = useFormContext<WorkoutFormData>();
  const { append, remove } = useFieldArray({ control, name: "blocks" });
  const sport = watch("sport");
  const blocks = (watch("blocks") ?? []) as Block[];

  function addBlock() {
    append({
      kind: "INTERVAL",
      label: "Nuevo bloque",
      durationSec: 300,
      target: { type: "zone", value: "Z2" },
    });
  }

  function addRepetition() {
    append({
      kind: "INTERVAL",
      label: "Intervalo",
      durationSec: 240,
      reps: 4,
      target: { type: "power", value: "100% FTP" },
      recovery: { kind: "REST", label: "Recuperación", durationSec: 120, target: { type: "zone", value: "Z1" } },
    });
  }

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
            render={({ field }) => <Input label="FECHA" mono type="date" {...field} />}
          />
          <Controller
            name="time"
            control={control}
            render={({ field }) => <Input label="HORA" mono type="time" {...field} />}
          />
        </div>
      </div>

      <div>
        <SectionLabel>DEPORTE</SectionLabel>
        <div className="flex gap-2 mt-3">
          {SPORTS.map((s) => (
            <SportPill key={s} sport={s} active={sport === s} onClick={() => setValue("sport", s)} />
          ))}
        </div>
      </div>

      <div>
        <SectionLabel>OBJETIVO PLANIFICADO</SectionLabel>
        <div className="grid grid-cols-4 gap-3 mt-3">
          {[
            { name: "targetDur", label: "DURACIÓN", placeholder: "" },
            { name: "targetDist", label: "DISTANCIA", placeholder: "—" },
            { name: "targetTSS", label: "TSS", placeholder: "" },
            { name: "targetIF", label: "IF", placeholder: "" },
          ].map((f) => (
            <Controller
              key={f.name}
              name={f.name as keyof WorkoutFormData}
              control={control}
              render={({ field }) => (
                <div
                  className="rounded-[6px] p-3"
                  style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
                >
                  <p className="mono text-[10px]" style={{ color: "var(--text-3)" }}>
                    {f.label}
                  </p>
                  <input
                    className="mono text-[18px] font-semibold bg-transparent border-none outline-none mt-1 w-full"
                    style={{ color: "var(--text)" }}
                    placeholder={f.placeholder}
                    {...field}
                    value={typeof field.value === "string" ? field.value : ""}
                  />
                </div>
              )}
            />
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <SectionLabel>ESTRUCTURA · BLOQUES</SectionLabel>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" type="button" onClick={addBlock}>
              <Plus size={12} /> Bloque
            </Button>
            <Button variant="ghost" size="sm" type="button" onClick={addRepetition}>
              <Repeat size={12} /> Repetición
            </Button>
          </div>
        </div>
        <div className="mt-3">
          <BlockTimeline blocks={blocks} />
          <BlockList blocks={blocks} onRemove={(i) => remove(i)} />
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
