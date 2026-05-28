const required = (name: string, value: string | undefined): string => {
  if (!value) throw new Error(`Missing env var: ${name}`);
  return value;
};

export const PUBLIC_ENV = {
  APPWRITE_ENDPOINT: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ?? "",
  APPWRITE_PROJECT_ID: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID ?? "",
  APPWRITE_DATABASE_ID: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID ?? "splits",
  APP_URL: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
};

export const serverEnv = () => ({
  APPWRITE_ENDPOINT: required("NEXT_PUBLIC_APPWRITE_ENDPOINT", process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT),
  APPWRITE_PROJECT_ID: required("NEXT_PUBLIC_APPWRITE_PROJECT_ID", process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID),
  APPWRITE_DATABASE_ID: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID ?? "splits",
  APPWRITE_API_KEY: required("APPWRITE_API_KEY", process.env.APPWRITE_API_KEY),
  ENCRYPTION_KEY: required("ENCRYPTION_KEY", process.env.ENCRYPTION_KEY),
  STRAVA_CLIENT_ID: process.env.STRAVA_CLIENT_ID ?? "",
  STRAVA_CLIENT_SECRET: process.env.STRAVA_CLIENT_SECRET ?? "",
  STRAVA_WEBHOOK_VERIFY_TOKEN: process.env.STRAVA_WEBHOOK_VERIFY_TOKEN ?? "",
  APP_URL: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
});

export const SESSION_COOKIE = "splits-session";
