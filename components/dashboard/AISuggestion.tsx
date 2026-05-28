"use client";

import { Brain } from "lucide-react";
import { Button, SectionLabel } from "@/components/ui";

interface AISuggestionProps {
  text: React.ReactNode;
  onApply?: () => void;
  onReasoning?: () => void;
}

export function AISuggestion({ text, onApply, onReasoning }: AISuggestionProps) {
  return (
    <div
      className="rounded-[6px] p-3.5"
      style={{
        background: "linear-gradient(135deg, rgba(132,204,124,0.08), transparent)",
        border: "1px solid var(--border)",
      }}
    >
      <div className="flex items-center gap-2">
        <Brain size={14} stroke="var(--lime)" />
        <SectionLabel accent>SUGERENCIA IA</SectionLabel>
      </div>
      <p className="text-[13px] mt-2 leading-relaxed" style={{ color: "var(--text)" }}>
        {text}
      </p>
      <div className="flex gap-1.5 mt-3">
        <Button variant="primary" size="sm" onClick={onApply}>
          Aplicar
        </Button>
        <Button variant="default" size="sm" onClick={onReasoning}>
          Ver razonamiento
        </Button>
      </div>
    </div>
  );
}
