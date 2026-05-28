"use client";

import Link from "next/link";
import { TopBar } from "@/components/shell";
import { Card, CardHeader, Button } from "@/components/ui";
import { AISuggestion } from "@/components/dashboard";
import { Brain, Sparkles, Filter, MessageSquare } from "lucide-react";

const SUGGESTIONS = [
  {
    title: "Recuperación insuficiente",
    text: "Tu HRV ha bajado un 12% esta semana. Considera reducir la intensidad del entrenamiento de mañana.",
    priority: "alta",
  },
  {
    title: "Ratio bici/carrera desequilibrado",
    text: "Para tu prueba olímpica de julio, necesitas sumar al menos 15' de carrera Z2 al brick del domingo.",
    priority: "media",
  },
  {
    title: "Oportunidad de pico de forma",
    text: "Tu CTL está en 72 y tu ATL bajando. Estás entrando en una ventana ideal de tapering para la semana 22.",
    priority: "baja",
  },
];

export default function CoachPage() {
  return (
    <>
      <TopBar
        subtitle="ENTRENADOR INTELIGENTE"
        title="Coach IA"
        right={
          <Button variant="primary">
            <MessageSquare size={12} /> Nueva consulta
          </Button>
        }
      />
      <main className="flex-1 overflow-auto p-5">
        <div className="grid gap-3 mb-4" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
          <Link href="/coach/insights">
            <Card hover padding={16}>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={16} style={{ color: "var(--lime)" }} />
                <span className="text-[13px] font-semibold" style={{ color: "var(--text)" }}>Insights</span>
              </div>
              <p className="text-[12px]" style={{ color: "var(--text-2)" }}>
                Análisis automático de tu rendimiento y tendencias.
              </p>
            </Card>
          </Link>
          <Link href="/coach/compare">
            <Card hover padding={16}>
              <div className="flex items-center gap-2 mb-2">
                <Filter size={16} style={{ color: "var(--amber)" }} />
                <span className="text-[13px] font-semibold" style={{ color: "var(--text)" }}>Comparar</span>
              </div>
              <p className="text-[12px]" style={{ color: "var(--text-2)" }}>
                Compara actividades, periodos y métricas.
              </p>
            </Card>
          </Link>
          <Card hover padding={16}>
            <div className="flex items-center gap-2 mb-2">
              <Brain size={16} style={{ color: "var(--violet)" }} />
              <span className="text-[13px] font-semibold" style={{ color: "var(--text)" }}>Plan semanal</span>
            </div>
            <p className="text-[12px]" style={{ color: "var(--text-2)" }}>
              Planificación adaptativa basada en tu estado actual.
            </p>
          </Card>
        </div>

        <Card>
          <CardHeader right={<span className="mono text-[10px]" style={{ color: "var(--text-3)" }}>3 nuevas</span>}>
            SUGERENCIAS DEL COACH
          </CardHeader>
          <div className="p-4 flex flex-col gap-3">
            {SUGGESTIONS.map((s, i) => (
              <AISuggestion key={i} text={<><b>{s.title}:</b> {s.text}</>} />
            ))}
          </div>
        </Card>
      </main>
    </>
  );
}
