"use server";

import { redirect } from "next/navigation";
import { supabaseServer } from "./server";
import { upsertAthlete } from "./db";

export type AuthState = { error?: string } | null;

function initialsFor(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return "AT";
  return (
    trimmed
      .split(/\s+/)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() ?? "")
      .join("") || "AT"
  );
}

export async function signUp(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  if (!email || !password || !name) return { error: "Todos los campos son requeridos." };
  if (password.length < 8) return { error: "La contraseña debe tener al menos 8 caracteres." };

  const supabase = await supabaseServer();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } },
  });
  if (error) return { error: error.message };

  if (data.user) {
    try {
      await upsertAthlete(data.user.id, { name, initials: initialsFor(name) });
    } catch {
      /* athlete row se crea en el primer save si falla aquí */
    }
  }

  // Si la confirmación por email está activada, no hay sesión todavía
  if (!data.session) {
    return { error: "Cuenta creada — revisa tu correo para confirmarla y luego inicia sesión." };
  }

  redirect("/");
}

export async function signIn(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Email y contraseña son requeridos." };

  const supabase = await supabaseServer();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: "Credenciales inválidas." };
  redirect("/");
}

export async function signOut() {
  const supabase = await supabaseServer();
  await supabase.auth.signOut();
  redirect("/login");
}
