import type { Sport } from "@/lib/types";

export const SPORTS: Record<Sport, { label: string; color: string; dotClass: string }> = {
  ride: { label: "Ciclismo", color: "var(--lime)", dotClass: "bg-lime" },
  mtb: { label: "MTB", color: "var(--lime)", dotClass: "bg-lime" },
  run: { label: "Carrera", color: "var(--amber)", dotClass: "bg-amber" },
  trail: { label: "Trail", color: "var(--amber)", dotClass: "bg-amber" },
  swim: { label: "Natación", color: "var(--blue)", dotClass: "bg-blue" },
  strength: { label: "Fuerza", color: "var(--violet)", dotClass: "bg-violet" },
  rest: { label: "Descanso", color: "var(--text-3)", dotClass: "bg-text-4" },
};
