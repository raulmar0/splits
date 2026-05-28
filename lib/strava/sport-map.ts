import type { Sport } from "@/lib/types";

export function mapStravaType(type: string): Sport {
  switch (type) {
    case "Ride":
    case "VirtualRide":
    case "EBikeRide":
      return "ride";
    case "MountainBikeRide":
    case "GravelRide":
      return "mtb";
    case "Run":
    case "VirtualRun":
      return "run";
    case "TrailRun":
    case "Hike":
      return "trail";
    case "Swim":
      return "swim";
    case "WeightTraining":
    case "Workout":
      return "strength";
    default:
      return "ride";
  }
}
