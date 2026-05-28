"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ID } from "node-appwrite";
import { createAdminClient, createSessionClient } from "./server";
import { upsertAthlete } from "./db";
import { SESSION_COOKIE } from "@/lib/env";

export type AuthState = { error?: string } | null;

const COOKIE_OPTS = {
  path: "/",
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  maxAge: 60 * 60 * 24 * 30,
};

function initialsFor(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return "AT";
  const parts = trimmed.split(/\s+/);
  return parts.slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "").join("") || "AT";
}

export async function signUp(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  if (!email || !password || !name) return { error: "Todos los campos son requeridos." };
  if (password.length < 8) return { error: "La contraseña debe tener al menos 8 caracteres." };

  let userId: string;
  let secret: string;
  try {
    const { account } = createAdminClient();
    const user = await account.create(ID.unique(), email, password, name);
    userId = user.$id;
    const session = await account.createEmailPasswordSession(email, password);
    secret = session.secret;
  } catch (e) {
    const msg = e instanceof Error ? e.message : "No se pudo crear la cuenta.";
    return { error: msg };
  }

  (await cookies()).set(SESSION_COOKIE, secret, COOKIE_OPTS);

  try {
    await upsertAthlete(userId, { name, initials: initialsFor(name) });
  } catch {
    /* atleta se crea en primer save si falla aquí */
  }

  redirect("/");
}

export async function signIn(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Email y contraseña son requeridos." };

  let secret: string;
  try {
    const { account } = createAdminClient();
    const session = await account.createEmailPasswordSession(email, password);
    secret = session.secret;
  } catch {
    return { error: "Credenciales inválidas." };
  }

  (await cookies()).set(SESSION_COOKIE, secret, COOKIE_OPTS);
  redirect("/");
}

export async function signOut() {
  const session = await createSessionClient();
  if (session) {
    try {
      await session.account.deleteSession("current");
    } catch {
      /* ignore */
    }
  }
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/login");
}
