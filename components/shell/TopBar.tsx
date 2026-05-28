"use client";

import { Search, Bell } from "lucide-react";
import { Button } from "@/components/ui";
import { useAuth } from "@/hooks/useAuth";

interface TopBarProps {
  title: string;
  subtitle: string;
  right?: React.ReactNode;
}

function initialsOf(name: string | undefined): string {
  if (!name) return "??";
  const parts = name.trim().split(/\s+/);
  return parts.slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "").join("") || "??";
}

export function TopBar({ title, subtitle, right }: TopBarProps) {
  const { user } = useAuth();
  const initials = initialsOf(user?.name);

  return (
    <div
      className="flex items-center shrink-0"
      style={{
        padding: "14px 22px",
        borderBottom: "1px solid var(--border)",
        background: "var(--bg-2)",
      }}
    >
      <div>
        <p className="mono uc text-[10px]" style={{ color: "var(--text-3)" }}>
          {subtitle}
        </p>
        <h1 className="text-[18px] font-bold tracking-[-0.02em] mt-0.5" style={{ color: "var(--text)" }}>
          {title}
        </h1>
      </div>
      <div className="ml-auto flex items-center gap-2.5">
        {right}
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-[5px] min-w-[160px]"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
          }}
        >
          <Search size={12} style={{ color: "var(--text-3)" }} />
          <span className="text-[12px]" style={{ color: "var(--text-3)" }}>
            Buscar
          </span>
          <span className="mono text-[10px] ml-auto" style={{ color: "var(--text-4)" }}>
            ⌘K
          </span>
        </div>
        <Button variant="default">
          <Bell size={13} />
        </Button>
        <div
          title={user?.name ?? ""}
          className="w-[26px] h-[26px] rounded-full flex items-center justify-center text-[11px] font-bold"
          style={{
            background: "linear-gradient(135deg, oklch(0.55 0.12 145), oklch(0.45 0.10 230))",
            color: "#0a0c10",
          }}
        >
          {initials}
        </div>
      </div>
    </div>
  );
}
