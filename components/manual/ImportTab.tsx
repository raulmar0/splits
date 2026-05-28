"use client";

import { useRef, useState } from "react";
import { Upload, Check, AlertTriangle, Loader2 } from "lucide-react";
import { Button, SectionLabel, Chip } from "@/components/ui";
import { parseWorkoutFile, SUPPORTED_EXTENSIONS, ParseError } from "@/lib/workout-io";
import { importActivityAction, importPlannedAction } from "@/lib/appwrite/import-actions";

type UploadStatus = "parsing" | "saving" | "ok" | "duplicado" | "error";

interface UploadEntry {
  id: string;
  type: string;
  name: string;
  size: string;
  status: UploadStatus;
  detail?: string;
}

const INTEGRATIONS = [
  { letter: "S", name: "Strava", desc: "Sincroniza actividades automáticamente", color: "#fc4c02", href: "/api/strava/auth" },
  { letter: "G", name: "Garmin Connect", desc: "Próximamente", color: "#007cc3", href: null },
  { letter: "T", name: "TrainingPeaks", desc: "Importa via .tcx/.zwo", color: "#ed3232", href: null },
  { letter: "Z", name: "Zwift", desc: "Importa via .fit/.zwo", color: "#f57906", href: null },
];

function fmtBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${Math.round(n / 1024)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

const MAX_BYTES = 50 * 1024 * 1024;

export function ImportTab() {
  const [uploads, setUploads] = useState<UploadEntry[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function ingestFile(file: File) {
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "?";
    const id = `${file.name}-${file.size}-${Math.floor(Math.random() * 1e9)}`;
    const base: UploadEntry = {
      id,
      type: ext.toUpperCase(),
      name: file.name,
      size: fmtBytes(file.size),
      status: "parsing",
    };
    setUploads((prev) => [base, ...prev]);

    if (file.size > MAX_BYTES) {
      return updateEntry(id, { status: "error", detail: "archivo > 50 MB" });
    }
    if (!SUPPORTED_EXTENSIONS.includes(ext as (typeof SUPPORTED_EXTENSIONS)[number])) {
      return updateEntry(id, { status: "error", detail: `formato .${ext} no soportado` });
    }

    let parsed;
    try {
      parsed = await parseWorkoutFile(file);
    } catch (e) {
      const msg = e instanceof ParseError ? e.message : e instanceof Error ? e.message : "error de parseo";
      return updateEntry(id, { status: "error", detail: msg });
    }

    updateEntry(id, { status: "saving" });
    const res =
      parsed.kind === "activity"
        ? await importActivityAction(parsed.data)
        : await importPlannedAction(parsed.data);

    if (res.error) return updateEntry(id, { status: "error", detail: res.error });
    if (res.duplicate) return updateEntry(id, { status: "duplicado" });
    updateEntry(id, { status: "ok" });
  }

  function updateEntry(id: string, patch: Partial<UploadEntry>) {
    setUploads((prev) => prev.map((u) => (u.id === id ? { ...u, ...patch } : u)));
  }

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    for (const f of Array.from(files)) {
      await ingestFile(f);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <SectionLabel>IMPORTAR DESDE ARCHIVO</SectionLabel>
        <div
          className="mt-3 rounded-[8px] flex flex-col items-center justify-center text-center transition-colors"
          style={{
            border: `1.5px dashed ${dragOver ? "var(--lime)" : "var(--border-strong)"}`,
            background: dragOver ? "rgba(132,204,124,0.05)" : "transparent",
            padding: "44px 20px",
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            void handleFiles(e.dataTransfer.files);
          }}
        >
          <Upload size={28} style={{ color: "var(--lime)" }} />
          <p className="text-[15px] mt-3" style={{ color: "var(--text)" }}>
            Arrastra un archivo aquí o selecciona uno
          </p>
          <p className="mono text-[11px] mt-1.5" style={{ color: "var(--text-3)" }}>
            .FIT · .GPX · .TCX · .ZWO · .ERG · .MRC · .CSV — hasta 50 MB
          </p>
          <input
            ref={inputRef}
            type="file"
            multiple
            accept={SUPPORTED_EXTENSIONS.map((e) => `.${e}`).join(",")}
            className="hidden"
            onChange={(e) => {
              void handleFiles(e.target.files);
              e.target.value = "";
            }}
          />
          <Button variant="primary" className="mt-4" onClick={() => inputRef.current?.click()}>
            Seleccionar archivo
          </Button>
        </div>
      </div>

      {uploads.length > 0 && (
        <div>
          <SectionLabel>SUBIDAS DE ESTA SESIÓN</SectionLabel>
          <div className="mt-3">
            {uploads.map((u) => (
              <div
                key={u.id}
                className="flex items-center gap-3 py-2.5"
                style={{ borderBottom: "1px solid var(--hairline)" }}
              >
                <Chip>{u.type}</Chip>
                <div className="flex-1 min-w-0">
                  <p className="text-[12.5px] truncate" style={{ color: "var(--text)" }}>
                    {u.name}
                  </p>
                  <p className="mono text-[10px] mt-0.5" style={{ color: "var(--text-3)" }}>
                    {u.size}
                    {u.detail && ` · ${u.detail}`}
                  </p>
                </div>
                {u.status === "parsing" && (
                  <span className="flex items-center gap-1 mono text-[10px]" style={{ color: "var(--text-3)" }}>
                    <Loader2 size={12} className="animate-spin" /> parseando
                  </span>
                )}
                {u.status === "saving" && (
                  <span className="flex items-center gap-1 mono text-[10px]" style={{ color: "var(--text-3)" }}>
                    <Loader2 size={12} className="animate-spin" /> guardando
                  </span>
                )}
                {u.status === "ok" && (
                  <span className="flex items-center gap-1 mono text-[10px]" style={{ color: "var(--lime)" }}>
                    <Check size={12} /> ok
                  </span>
                )}
                {u.status === "duplicado" && (
                  <span className="flex items-center gap-1 mono text-[10px]" style={{ color: "var(--amber)" }}>
                    <AlertTriangle size={12} /> duplicado
                  </span>
                )}
                {u.status === "error" && (
                  <span className="flex items-center gap-1 mono text-[10px]" style={{ color: "var(--red)" }}>
                    <AlertTriangle size={12} /> error
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <SectionLabel>O IMPORTAR DESDE</SectionLabel>
        <div className="grid grid-cols-2 gap-3 mt-3">
          {INTEGRATIONS.map((int) => {
            const inner = (
              <>
                <div
                  className="w-[26px] h-[26px] rounded-[4px] flex items-center justify-center mono text-[12px] font-bold shrink-0"
                  style={{ background: int.color, color: "#fff" }}
                >
                  {int.letter}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12.5px] font-medium" style={{ color: "var(--text)" }}>
                    {int.name}
                  </p>
                  <p className="text-[11px] mt-0.5" style={{ color: "var(--text-3)" }}>
                    {int.desc}
                  </p>
                </div>
              </>
            );
            const base = "flex items-center gap-3 rounded-[6px] p-3.5 transition-colors duration-[120ms] ease-out";
            const style = { background: "var(--surface)", border: "1px solid var(--border)" };
            return int.href ? (
              <a key={int.name} href={int.href} className={`${base} cursor-pointer hover:bg-surface-2`} style={style}>
                {inner}
              </a>
            ) : (
              <div
                key={int.name}
                className={base}
                style={{ ...style, opacity: 0.5, cursor: "not-allowed" }}
              >
                {inner}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
