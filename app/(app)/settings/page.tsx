"use client";

import { TopBar } from "@/components/shell";
import { Card, CardHeader, Button, Input } from "@/components/ui";
import { ATHLETE } from "@/lib/mock-data";

export default function SettingsPage() {
  return (
    <>
      <TopBar
        subtitle="CONFIGURACIÓN"
        title="Ajustes"
        right={
          <Button variant="primary">Guardar cambios</Button>
        }
      />
      <main className="flex-1 overflow-auto p-5">
        <div className="grid gap-3" style={{ gridTemplateColumns: "1fr 1fr" }}>
          <Card>
            <CardHeader>PERFIL DE ATLETA</CardHeader>
            <div className="p-4 flex flex-col gap-3">
              <div>
                <label className="mono uc text-[10px] block mb-1" style={{ color: "var(--text-3)" }}>Nombre</label>
                <Input defaultValue={ATHLETE.name} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mono uc text-[10px] block mb-1" style={{ color: "var(--text-3)" }}>Peso (kg)</label>
                  <Input defaultValue={String(ATHLETE.weight)} />
                </div>
                <div>
                  <label className="mono uc text-[10px] block mb-1" style={{ color: "var(--text-3)" }}>FC máx.</label>
                  <Input defaultValue={String(ATHLETE.maxHR)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mono uc text-[10px] block mb-1" style={{ color: "var(--text-3)" }}>FTP (W)</label>
                  <Input defaultValue={String(ATHLETE.ftp)} />
                </div>
                <div>
                  <label className="mono uc text-[10px] block mb-1" style={{ color: "var(--text-3)" }}>LTHR</label>
                  <Input defaultValue={String(ATHLETE.lthr)} />
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader>UMBRALES Y ZONAS</CardHeader>
            <div className="p-4 flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mono uc text-[10px] block mb-1" style={{ color: "var(--text-3)" }}>VO2max</label>
                  <Input defaultValue={String(ATHLETE.vo2max)} />
                </div>
                <div>
                  <label className="mono uc text-[10px] block mb-1" style={{ color: "var(--text-3)" }}>FC reposo</label>
                  <Input defaultValue={String(ATHLETE.restingHR)} />
                </div>
              </div>
              <div>
                <label className="mono uc text-[10px] block mb-1" style={{ color: "var(--text-3)" }}>HRV basal</label>
                <Input defaultValue={String(ATHLETE.hrv)} />
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader>PREFERENCIAS</CardHeader>
            <div className="p-4 flex flex-col gap-3">
              <div>
                <label className="mono uc text-[10px] block mb-1" style={{ color: "var(--text-3)" }}>Deporte principal</label>
                <Input defaultValue="Ciclismo" />
              </div>
              <div>
                <label className="mono uc text-[10px] block mb-1" style={{ color: "var(--text-3)" }}>Objetivo</label>
                <Input defaultValue="Triatlón olímpico — julio 2026" />
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader>INTEGRACIONES</CardHeader>
            <div className="p-4 flex flex-col gap-2">
              <Button variant="ghost">Conectar Strava</Button>
              <Button variant="ghost">Conectar Garmin</Button>
              <Button variant="ghost">Importar .FIT</Button>
            </div>
          </Card>
        </div>
      </main>
    </>
  );
}
