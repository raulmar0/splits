import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/appwrite/server";
import { getAthlete, getIntegration } from "@/lib/appwrite/db";
import { SettingsForm, type SettingsInitial } from "@/components/settings/SettingsForm";

export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const athlete = await getAthlete(user.$id);
  const [strava, garmin, wahoo] = await Promise.all([
    getIntegration(user.$id, "strava"),
    getIntegration(user.$id, "garmin"),
    getIntegration(user.$id, "wahoo"),
  ]);

  const initial: SettingsInitial = {
    name: athlete?.name ?? user.name,
    weight: athlete?.weight ?? null,
    maxHR: athlete?.maxHR ?? null,
    ftp: athlete?.ftp ?? null,
    lthr: athlete?.lthr ?? null,
    vo2max: athlete?.vo2max ?? null,
    restingHR: athlete?.restingHR ?? null,
    hrv: athlete?.hrv ?? null,
    mainSport: athlete?.mainSport ?? "",
    goal: athlete?.goal ?? "",
    llmProvider: athlete?.llmProvider ?? null,
    hasLlmKey: !!athlete?.llmApiKeyEncrypted,
    integrations: { strava: !!strava, garmin: !!garmin, wahoo: !!wahoo },
  };

  return <SettingsForm initial={initial} />;
}
