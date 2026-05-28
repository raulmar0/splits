"use client";

import { useTheme } from "@/hooks/useTheme";
import type { Accent } from "@/hooks/useTheme";

const ACCENTS: { value: Accent; label: string }[] = [
  { value: "#84cc7c", label: "Lime" },
  { value: "#e8a956", label: "Amber" },
  { value: "#5fa9e6", label: "Blue" },
  { value: "#a584e0", label: "Violet" },
];

export function ThemeToggle() {
  const { theme, accent, toggleTheme, setAccent } = useTheme();

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1">
        {ACCENTS.map((a) => (
          <button
            key={a.value}
            onClick={() => setAccent(a.value)}
            className="w-5 h-5 rounded-full transition-all duration-[120ms] ease-out"
            style={{
              background: a.value,
              outline: accent === a.value ? `2px solid ${a.value}` : "none",
              outlineOffset: "2px",
            }}
            title={a.label}
          />
        ))}
      </div>
      <button
        onClick={toggleTheme}
        className="mono uc text-[10px] tracking-[0.08em] px-3 py-1.5 rounded-[5px] transition-colors duration-[120ms] ease-out"
        style={{
          background: "var(--surface-2)",
          border: "1px solid var(--border)",
          color: "var(--text-2)",
        }}
      >
        {theme === "oscuro" ? "oscuro" : "claro"}
      </button>
    </div>
  );
}
