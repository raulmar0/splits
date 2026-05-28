import type { Sport } from "@/lib/types";

export function mapFitSport(sport: string | undefined, subSport?: string | undefined): Sport {
  const s = (sport ?? "").toLowerCase();
  const sub = (subSport ?? "").toLowerCase();
  if (s === "cycling" || s === "e_biking") return sub === "mountain" || sub === "downhill" || sub === "gravel_cycling" ? "mtb" : "ride";
  if (s === "running") return sub === "trail" ? "trail" : "run";
  if (s === "swimming") return "swim";
  if (s === "training" || s === "fitness_equipment") return "strength";
  if (s === "hiking" || s === "trail_running" || s === "mountaineering") return "trail";
  return "ride";
}

export function mapTcxSport(sport: string | undefined): Sport {
  const s = (sport ?? "").toLowerCase();
  if (s === "biking" || s === "cycling") return "ride";
  if (s === "running") return "run";
  return "ride";
}

export function mapGpxType(type: string | undefined): Sport {
  const t = (type ?? "").toLowerCase();
  if (t.includes("bike") || t.includes("cycl") || t === "ride") return "ride";
  if (t.includes("run") || t === "running") return "run";
  if (t.includes("swim")) return "swim";
  if (t.includes("trail") || t.includes("hike")) return "trail";
  return "ride";
}

export function mapZwoSport(sport: string | undefined): Sport {
  const s = (sport ?? "").toLowerCase();
  if (s === "bike") return "ride";
  if (s === "run") return "run";
  return "ride";
}
