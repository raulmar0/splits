"use client";

import {
  SectionLabel,
  SportDot,
  MonoNumber,
  StatValue,
  StatDelta,
  Chip,
  Card,
  CardHeader,
  Input,
  Button,
} from "@/components/ui";
import { SportPill } from "@/components/shared/SportPill";
import type { Sport } from "@/lib/types";

export function PrimitivesShowcase() {
  return (
    <section className="mb-12">
      <p className="mono uc text-[10px] tracking-[0.12em] mb-6" style={{ color: "var(--text-3)" }}>
        COMPONENTES · PRIMITIVAS
      </p>

      <div className="space-y-6">
        <ShowcaseRow title="SectionLabel">
          <div className="flex flex-col gap-3">
            <SectionLabel>SEMANA ANTERIOR · COMPLETA</SectionLabel>
            <SectionLabel accent>SEMANA ACTUAL · PLAN IA</SectionLabel>
            <SectionLabel>IMPACTO EN CARGA</SectionLabel>
          </div>
        </ShowcaseRow>

        <ShowcaseRow title="SportDot">
          <div className="flex items-center gap-4">
            {(["ride", "run", "swim", "strength", "trail", "rest"] as Sport[]).map((s) => (
              <div key={s} className="flex items-center gap-2">
                <SportDot sport={s} />
                <span className="mono text-[10px]" style={{ color: "var(--text-3)" }}>{s}</span>
              </div>
            ))}
          </div>
        </ShowcaseRow>

        <ShowcaseRow title="MonoNumber">
          <div className="flex items-center gap-6">
            <MonoNumber value="712" unit="TSS" size="xl" />
            <MonoNumber value="82" unit="CTL" size="lg" />
            <MonoNumber value="1:15:32" size="md" />
            <MonoNumber value="312" unit="W" size="sm" />
          </div>
        </ShowcaseRow>

        <ShowcaseRow title="StatValue">
          <div className="flex items-center gap-8">
            <StatValue value="82" unit="CTL" color="var(--blue)" />
            <StatValue value="94" unit="ATL" color="var(--amber)" />
            <StatValue value="−12" unit="TSB" color="var(--red)" />
            <StatValue value="712" unit="TSS" color="var(--lime)" />
          </div>
        </ShowcaseRow>

        <ShowcaseRow title="StatDelta">
          <div className="flex items-center gap-6">
            <StatDelta variant="up-good">+4 7d</StatDelta>
            <StatDelta variant="up-bad">+11 — alta</StatDelta>
            <StatDelta variant="down-good">−2 vs ant.</StatDelta>
            <StatDelta variant="down-bad">−6W</StatDelta>
            <StatDelta variant="neutral">carga alta</StatDelta>
          </div>
        </ShowcaseRow>

        <ShowcaseRow title="Chip">
          <div className="flex items-center gap-3">
            <Chip>CTL / ATL / TSB</Chip>
            <Chip dot="var(--lime)">Garmin conectado</Chip>
            <Chip dot="var(--amber)">{"Strava sync 2'"}</Chip>
            <Chip variant="accent">HOY</Chip>
            <Chip>90d</Chip>
            <Chip>FIT</Chip>
          </div>
        </ShowcaseRow>

        <ShowcaseRow title="Card + CardHeader">
          <div className="grid grid-cols-3 gap-3">
            <Card>
              <CardHeader>CARGA SEMANAL · TSS</CardHeader>
              <div className="p-3.5">
                <StatValue value="556" unit="TSS" color="var(--lime)" />
                <StatDelta variant="up-good">+42 vs ant.</StatDelta>
              </div>
            </Card>
            <Card padding={14}>
              <SectionLabel>FITNESS · CTL</SectionLabel>
              <div className="mt-2">
                <StatValue value="82" unit="tss/d" color="var(--blue)" />
              </div>
              <StatDelta variant="up-good">+4 últimos 7 días</StatDelta>
            </Card>
            <Card padding={14}>
              <SectionLabel>FATIGA · ATL</SectionLabel>
              <div className="mt-2">
                <StatValue value="94" unit="tss/d" color="var(--amber)" />
              </div>
              <StatDelta variant="up-bad">+11 — alta</StatDelta>
            </Card>
          </div>
        </ShowcaseRow>

        <ShowcaseRow title="Button">
          <div className="flex items-center gap-3">
            <Button variant="primary">Guardar y planificar</Button>
            <Button variant="default">Guardar borrador</Button>
            <Button variant="ghost">Cancelar</Button>
            <Button variant="primary" size="sm">Aplicar</Button>
            <Button variant="default" size="sm">Ver razonamiento</Button>
          </div>
        </ShowcaseRow>

        <ShowcaseRow title="Input">
          <div className="grid grid-cols-3 gap-3">
            <Input label="TÍTULO" placeholder="VO2max · 5x4'" />
            <Input label="FECHA" placeholder="2026-05-19" mono />
            <Input label="HORA" placeholder="07:00" mono />
          </div>
        </ShowcaseRow>

        <ShowcaseRow title="SportPill">
          <div className="flex items-center gap-2">
            <SportPill sport="ride" active />
            <SportPill sport="run" />
            <SportPill sport="swim" />
            <SportPill sport="strength" />
            <SportPill sport="trail" />
            <SportPill sport="rest" />
          </div>
        </ShowcaseRow>
      </div>
    </section>
  );
}

function ShowcaseRow({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      className="rounded-[6px] p-5"
      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
    >
      <p className="mono uc text-[9.5px] tracking-[0.08em] mb-4" style={{ color: "var(--text-4)" }}>
        {title}
      </p>
      {children}
    </div>
  );
}
