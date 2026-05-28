import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { Client, Account, Databases, Users } from "node-appwrite";
import { serverEnv, SESSION_COOKIE } from "@/lib/env";

export async function createSessionClient() {
  const env = serverEnv();
  const client = new Client().setEndpoint(env.APPWRITE_ENDPOINT).setProject(env.APPWRITE_PROJECT_ID);
  const c = await cookies();
  const session = c.get(SESSION_COOKIE);
  if (!session?.value) return null;
  client.setSession(session.value);
  return {
    client,
    account: new Account(client),
    databases: new Databases(client),
  };
}

export function createAdminClient() {
  const env = serverEnv();
  const client = new Client()
    .setEndpoint(env.APPWRITE_ENDPOINT)
    .setProject(env.APPWRITE_PROJECT_ID)
    .setKey(env.APPWRITE_API_KEY);
  return {
    client,
    account: new Account(client),
    databases: new Databases(client),
    users: new Users(client),
  };
}

export const getCurrentUser = cache(async () => {
  const session = await createSessionClient();
  if (!session) return null;
  try {
    return await session.account.get();
  } catch {
    return null;
  }
});
