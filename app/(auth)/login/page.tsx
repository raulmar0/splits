"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signIn, type AuthState } from "@/lib/supabase/auth";
import { Button, Card, Input, SectionLabel } from "@/components/ui";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState<AuthState, FormData>(signIn, null);

  return (
    <Card>
      <div className="p-5">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-[1px]" style={{ background: "var(--lime)" }} />
          <span className="mono uc text-[10px] tracking-[0.12em]" style={{ color: "var(--text-3)" }}>
            SPLITS · ACCESO
          </span>
        </div>
        <h1 className="text-[20px] font-bold tracking-[-0.02em] mt-1" style={{ color: "var(--text)" }}>
          Inicia sesión
        </h1>
        <p className="text-[12px] mt-1" style={{ color: "var(--text-3)" }}>
          Entra con tu correo y contraseña.
        </p>

        <form action={formAction} className="flex flex-col gap-3 mt-5">
          <Input name="email" type="email" label="EMAIL" placeholder="tu@correo.com" autoComplete="email" required />
          <Input
            name="password"
            type="password"
            label="CONTRASEÑA"
            placeholder="••••••••"
            autoComplete="current-password"
            required
          />
          {state?.error && (
            <p className="mono text-[11px]" style={{ color: "var(--red)" }}>
              {state.error}
            </p>
          )}
          <Button variant="primary" type="submit" disabled={pending} className="mt-1 justify-center">
            {pending ? "Entrando…" : "Entrar"}
          </Button>
        </form>

        <p className="mono text-[11px] mt-5" style={{ color: "var(--text-3)" }}>
          ¿Sin cuenta?{" "}
          <Link href="/signup" style={{ color: "var(--lime)" }}>
            Crear una
          </Link>
        </p>
      </div>
    </Card>
  );
}
