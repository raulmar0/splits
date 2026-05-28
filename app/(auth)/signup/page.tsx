"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signUp, type AuthState } from "@/lib/appwrite/auth";
import { Button, Card, Input } from "@/components/ui";

export default function SignupPage() {
  const [state, formAction, pending] = useActionState<AuthState, FormData>(signUp, null);

  return (
    <Card>
      <div className="p-5">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-[1px]" style={{ background: "var(--lime)" }} />
          <span className="mono uc text-[10px] tracking-[0.12em]" style={{ color: "var(--text-3)" }}>
            SPLITS · REGISTRO
          </span>
        </div>
        <h1 className="text-[20px] font-bold tracking-[-0.02em] mt-1" style={{ color: "var(--text)" }}>
          Crea tu cuenta
        </h1>
        <p className="text-[12px] mt-1" style={{ color: "var(--text-3)" }}>
          Empieza a planificar tu temporada en 30 segundos.
        </p>

        <form action={formAction} className="flex flex-col gap-3 mt-5">
          <Input name="name" type="text" label="NOMBRE" placeholder="Mateo R." autoComplete="name" required />
          <Input name="email" type="email" label="EMAIL" placeholder="tu@correo.com" autoComplete="email" required />
          <Input
            name="password"
            type="password"
            label="CONTRASEÑA"
            placeholder="mínimo 8 caracteres"
            autoComplete="new-password"
            minLength={8}
            required
          />
          {state?.error && (
            <p className="mono text-[11px]" style={{ color: "var(--red)" }}>
              {state.error}
            </p>
          )}
          <Button variant="primary" type="submit" disabled={pending} className="mt-1 justify-center">
            {pending ? "Creando…" : "Crear cuenta"}
          </Button>
        </form>

        <p className="mono text-[11px] mt-5" style={{ color: "var(--text-3)" }}>
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" style={{ color: "var(--lime)" }}>
            Inicia sesión
          </Link>
        </p>
      </div>
    </Card>
  );
}
