import type { Sport } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Bike, PersonStanding, Waves, Dumbbell, Mountain, Bed } from "lucide-react";

const SPORT_CONFIG: Record<Sport, { label: string; color: string; icon: React.ComponentType<{ size?: number; stroke?: string }> }> = {
  ride: { label: "Ciclismo", color: "var(--lime)", icon: Bike },
  mtb: { label: "MTB", color: "var(--lime)", icon: Bike },
  run: { label: "Carrera", color: "var(--amber)", icon: PersonStanding },
  trail: { label: "Trail", color: "var(--amber)", icon: Mountain },
  swim: { label: "Natación", color: "var(--blue)", icon: Waves },
  strength: { label: "Fuerza", color: "var(--violet)", icon: Dumbbell },
  rest: { label: "Descanso", color: "var(--text-3)", icon: Bed },
};

interface SportPillProps {
  sport: Sport;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

export function SportPill({ sport, active, onClick, className }: SportPillProps) {
  const config = SPORT_CONFIG[sport];
  const Icon = config.icon;

  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[5px] border text-[12px] font-medium",
        "transition-colors duration-[120ms] ease-out",
        active ? "bg-surface-3" : "bg-surface-2",
        className
      )}
      style={{
        borderColor: active ? config.color : "var(--border)",
        color: active ? "var(--text)" : "var(--text-2)",
      }}
    >
      <Icon size={13} stroke={active ? config.color : "currentColor"} />
      {config.label}
    </button>
  );
}
