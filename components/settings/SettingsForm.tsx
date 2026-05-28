"use client";

import { useActionState } from "react";
import { saveAthlete, clearLlmKey, type SaveAthleteState } from "@/lib/appwrite/athlete-actions";
import { signOut } from "@/lib/appwrite/auth";
import { Button, Card, CardHeader, Input } from "@/components/ui";

export interface SettingsInitial {
  name: string;
  weight: number | null;
  maxHR: number | null;
  ftp: number | null;
  lthr: number | null;
  vo2max: number | null;
  restingHR: number | null;
  hrv: number | null;
  mainSport: string;
  goal: string;
  llmProvider: "anthropic" | "openai" | null;
  hasLlmKey: boolean;
  integrations: { strava: boolean; garmin: boolean; wahoo: boolean };
}

const v = (n: number | null) => (n == null || n === 0 ? "" : String(n));

export function SettingsForm({ initial }: { initial: SettingsInitial }) {
  const [state, formAction, pending] = useActionState<SaveAthleteState, FormData>(saveAthlete, null);

  return (
    <>
      <div
        className="flex items-center shrink-0"
        style={{ padding: "14px 22px", borderBottom: "1px solid var(--border)", background: "var(--bg-2)" }}
      >
        <div>
          <p className="mono uc text-[10px]" style={{ color: "var(--text-3)" }}>
            CONFIGURACIÓN
          </p>
          <h1 className="text-[18px] font-bold tracking-[-0.02em] mt-0.5" style={{ color: "var(--text)" }}>
            Ajustes
          </h1>
        </div>
        <div className="ml-auto flex items-center gap-2.5">
          {state?.success && (
            <span className="mono text-[11px]" style={{ color: "var(--lime)" }}>
              guardado ✓
            </span>
          )}
          {state?.error && (
            <span className="mono text-[11px]" style={{ color: "var(--red)" }}>
              {state.error}
            </span>
          )}
          <Button variant="primary" type="submit" form="settings-form" disabled={pending}>
            {pending ? "Guardando…" : "Guardar cambios"}
          </Button>
        </div>
      </div>

      <main className="flex-1 overflow-auto p-5">
        <form id="settings-form" action={formAction} className="grid gap-3" style={{ gridTemplateColumns: "1fr 1fr" }}>
          <Card>
            <CardHeader>PERFIL DE ATLETA</CardHeader>
            <div className="p-4 flex flex-col gap-3">
              <Input name="name" label="NOMBRE" defaultValue={initial.name} required />
              <div className="grid grid-cols-2 gap-3">
                <Input name="weight" label="PESO (KG)" defaultValue={v(initial.weight)} mono />
                <Input name="maxHR" label="FC MÁX." defaultValue={v(initial.maxHR)} mono />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input name="ftp" label="FTP (W)" defaultValue={v(initial.ftp)} mono />
                <Input name="lthr" label="LTHR" defaultValue={v(initial.lthr)} mono />
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader>UMBRALES Y ZONAS</CardHeader>
            <div className="p-4 flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                <Input name="vo2max" label="VO2MAX" defaultValue={v(initial.vo2max)} mono />
                <Input name="restingHR" label="FC REPOSO" defaultValue={v(initial.restingHR)} mono />
              </div>
              <Input name="hrv" label="HRV BASAL" defaultValue={v(initial.hrv)} mono />
            </div>
          </Card>

          <Card>
            <CardHeader>PREFERENCIAS</CardHeader>
            <div className="p-4 flex flex-col gap-3">
              <Input name="mainSport" label="DEPORTE PRINCIPAL" defaultValue={initial.mainSport} />
              <Input name="goal" label="OBJETIVO" defaultValue={initial.goal} />
            </div>
          </Card>

          <Card>
            <CardHeader>INTELIGENCIA ARTIFICIAL · BYO KEY</CardHeader>
            <div className="p-4 flex flex-col gap-3">
              <div>
                <label className="mono uc text-[10px] block mb-1" style={{ color: "var(--text-3)" }}>
                  PROVEEDOR
                </label>
                <select
                  name="llmProvider"
                  defaultValue={initial.llmProvider ?? "anthropic"}
                  className="rounded-[5px] px-3 py-2 text-[13px] w-full"
                  style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}
                >
                  <option value="anthropic">Anthropic Claude</option>
                  <option value="openai">OpenAI GPT</option>
                </select>
              </div>
              <Input
                name="llmApiKey"
                type="password"
                label={initial.hasLlmKey ? "API KEY (REEMPLAZAR — DEJAR VACÍO PARA MANTENER)" : "API KEY"}
                placeholder={initial.hasLlmKey ? "•••••••••• guardada" : "sk-ant-…  o  sk-…"}
                autoComplete="off"
              />
              <p className="mono text-[10px]" style={{ color: "var(--text-3)" }}>
                Tu key se cifra en reposo. El Coach IA usará tu cuenta para llamar al modelo.
              </p>
              {initial.hasLlmKey && (
                <form action={clearLlmKey}>
                  <Button variant="ghost" type="submit">
                    Eliminar key guardada
                  </Button>
                </form>
              )}
            </div>
          </Card>

          <Card>
            <CardHeader>INTEGRACIONES</CardHeader>
            <div className="p-4 flex flex-col gap-2">
              <a
                href="/api/strava/auth"
                className="inline-flex items-center justify-center gap-1.5 rounded-[5px] border font-medium px-2.5 py-1.5 text-[12px] transition-colors duration-[120ms] ease-out"
                style={{
                  background: initial.integrations.strava ? "var(--surface)" : "transparent",
                  borderColor: "var(--border)",
                  color: "var(--text-2)",
                }}
              >
                {initial.integrations.strava ? "Strava · conectado" : "Conectar Strava"}
              </a>
              <Button variant="ghost" disabled title="Próximamente">
                Conectar Garmin
              </Button>
              <Button variant="ghost" disabled title="Próximamente">
                Conectar Wahoo
              </Button>
            </div>
          </Card>

          <Card>
            <CardHeader>SESIÓN</CardHeader>
            <div className="p-4">
              <form action={signOut}>
                <Button variant="ghost" type="submit">
                  Cerrar sesión
                </Button>
              </form>
            </div>
          </Card>
        </form>
      </main>
    </>
  );
}
