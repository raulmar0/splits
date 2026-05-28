"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

type Theme = "oscuro" | "claro";
type Accent = "#84cc7c" | "#e8a956" | "#5fa9e6" | "#a584e0";

const ACCENT_DIMS: Record<Accent, string> = {
  "#84cc7c": "oklch(0.55 0.12 145)",
  "#e8a956": "oklch(0.55 0.12 60)",
  "#5fa9e6": "oklch(0.50 0.10 230)",
  "#a584e0": "oklch(0.50 0.13 285)",
};

interface ThemeContextValue {
  theme: Theme;
  accent: Accent;
  setTheme: (t: Theme) => void;
  setAccent: (a: Accent) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "oscuro",
  accent: "#84cc7c",
  setTheme: () => {},
  setAccent: () => {},
  toggleTheme: () => {},
});

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "oscuro";
  const stored = localStorage.getItem("splits-theme");
  if (stored === "claro" || stored === "oscuro") return stored;
  return "oscuro";
}

function getInitialAccent(): Accent {
  if (typeof window === "undefined") return "#84cc7c";
  const stored = localStorage.getItem("splits-accent");
  if (stored && stored in ACCENT_DIMS) return stored as Accent;
  return "#84cc7c";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);
  const [accent, setAccentState] = useState<Accent>(getInitialAccent);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("splits-theme", theme);
  }, [theme]);

  useEffect(() => {
    const r = document.documentElement.style;
    r.setProperty("--accent", accent);
    r.setProperty("--accent-dim", ACCENT_DIMS[accent]);
    r.setProperty("--lime", accent);
    r.setProperty("--lime-dim", ACCENT_DIMS[accent]);
    localStorage.setItem("splits-accent", accent);
  }, [accent]);

  const setTheme = useCallback((t: Theme) => setThemeState(t), []);
  const setAccent = useCallback((a: Accent) => setAccentState(a), []);
  const toggleTheme = useCallback(() => setThemeState((t) => (t === "oscuro" ? "claro" : "oscuro")), []);

  return (
    <ThemeContext.Provider value={{ theme, accent, setTheme, setAccent, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

export { ACCENT_DIMS };
export type { Theme, Accent };
