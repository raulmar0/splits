import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/supabase/server";
import { getAthlete, getIntegration } from "@/lib/supabase/db";
import { SettingsForm, type SettingsInitial } from "@/components/settings/SettingsForm";

export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const athlete = await getAthlete();
  const [strava, garmin, wahoo] = await Promise.all([
    getIntegration(user.id, "strava"),
    getIntegration(user.id, "garmin"),
    getIntegration(user.id, "wahoo"),
  ]);

  const initial: SettingsInitial = {
    name: athlete?.name ?? ((user.user_metadata?.name as string) ?? user.email ?? ""),
    weight: athlete?.weight ?? null,
    maxHR: athlete?.max_hr ?? null,
    ftp: athlete?.ftp ?? null,
    lthr: athlete?.lthr ?? null,
    vo2max: athlete?.vo2max ?? null,
    restingHR: athlete?.resting_hr ?? null,
    hrv: athlete?.hrv ?? null,
    mainSport: athlete?.main_sport ?? "",
    goal: athlete?.goal ?? "",
    llmProvider: athlete?.llm_provider ?? null,
    hasLlmKey: !!athlete?.llm_api_key_encrypted,
    integrations: { strava: !!strava, garmin: !!garmin, wahoo: !!wahoo },
  };

  return <SettingsForm initial={initial} />;
}
