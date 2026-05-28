"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  Bike,
  Calendar,
  TrendingUp,
  Brain,
  Sparkles,
  Trophy,
  Filter,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: Activity, href: "/" },
  { id: "activities", label: "Actividades", icon: Bike, href: "/activities" },
  { id: "calendar", label: "Calendario", icon: Calendar, href: "/calendar" },
  { id: "load", label: "Carga", icon: TrendingUp, href: "/load" },
  { id: "coach", label: "Coach IA", icon: Brain, href: "/coach", badge: "3" },
  { id: "insights", label: "Insights", icon: Sparkles, href: "/coach/insights" },
  { id: "records", label: "Récords", icon: Trophy, href: "/records" },
  { id: "compare", label: "Comparar", icon: Filter, href: "/coach/compare" },
  { id: "settings", label: "Ajustes", icon: Settings, href: "/settings" },
];

export function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <aside
      className="flex flex-col shrink-0 h-screen sticky top-0"
      style={{
        width: 196,
        borderRight: "1px solid var(--border)",
        background: "var(--bg-2)",
        padding: "16px 10px",
      }}
    >
      <div className="flex items-center gap-2 px-1.5 pb-3.5">
        <div
          className="w-[18px] h-[18px] rounded-[4px] relative"
          style={{ background: "var(--lime)" }}
        >
          <div
            className="absolute rounded-[1px]"
            style={{
              inset: "4px",
              background: "var(--bg-2)",
              clipPath: "polygon(0 70%, 25% 50%, 50% 60%, 75% 30%, 100% 40%, 100% 100%, 0 100%)",
            }}
          />
        </div>
        <span className="font-bold tracking-[-0.02em] text-[14px]" style={{ color: "var(--text)" }}>
          Splits
        </span>
        <span className="mono text-[10px] ml-0.5" style={{ color: "var(--text-3)" }}>
          v3.2
        </span>
      </div>

      <nav className="flex flex-col gap-0.5">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "flex items-center gap-2 px-2 py-1.5 rounded-[5px] text-[12.5px] font-medium",
                "transition-colors duration-[120ms] ease-out",
                active ? "bg-surface-2 text-text" : "text-text-2 hover:bg-surface"
              )}
            >
              <Icon
                size={14}
                stroke={active ? "var(--lime)" : "currentColor"}
                strokeWidth={1.5}
              />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span
                  className="mono text-[9.5px] font-semibold px-1.5 py-0.5 rounded-lg"
                  style={{ background: "var(--lime)", color: "#0a0c10" }}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div
        className="mt-auto p-2 rounded-[6px]"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <p className="mono uc text-[9.5px]" style={{ color: "var(--text-3)" }}>
          Hoy · 19 May
        </p>
        <p className="text-[13px] mt-1" style={{ color: "var(--text)" }}>
          VO2 5x4&apos;
        </p>
        <p className="mono text-[10.5px] mt-0.5" style={{ color: "var(--lime)" }}>
          1h 15&apos; · TSS 118
        </p>
      </div>
    </aside>
  );
}
