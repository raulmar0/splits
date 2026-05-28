"use client";

import { cn } from "@/lib/utils";

interface TabNavProps {
  tabs: { id: string; label: string }[];
  active: string;
  onChange: (id: string) => void;
}

export function TabNav({ tabs, active, onChange }: TabNavProps) {
  return (
    <div className="flex gap-0.5" style={{ borderBottom: "1px solid var(--hairline)" }}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            "px-4 py-2.5 text-[12.5px] transition-colors duration-[120ms] ease-out",
            active === tab.id
              ? "font-semibold text-text"
              : "font-medium text-text-2 hover:text-text"
          )}
          style={{
            borderBottom: active === tab.id ? "2px solid var(--lime)" : "2px solid transparent",
            marginBottom: -1,
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
