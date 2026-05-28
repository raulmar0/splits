import { ThemeToggle } from "./ThemeToggle";
import { PrimitivesShowcase } from "./PrimitivesShowcase";

export default function DevPrimitivesPage() {
  return (
    <div className="min-h-screen p-8" style={{ background: "var(--bg)" }}>
      <div className="max-w-[1200px] mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="mono uc text-[10px] tracking-[0.12em] mb-1" style={{ color: "var(--text-3)" }}>
              DEV · PRIMITIVAS
            </p>
            <h1 className="text-[28px] font-bold tracking-[-0.02em]" style={{ color: "var(--text)" }}>
              Foundation · Tokens & Type
            </h1>
          </div>
          <ThemeToggle />
        </div>

        <ColorSwatches />
        <AccentSwatches />
        <TypeSpecimen />
        <SpacingDemo />
        <PrimitivesShowcase />
      </div>
    </div>
  );
}

function ColorSwatches() {
  const surfaces = [
    { name: "--bg", var: "var(--bg)", desc: "App background" },
    { name: "--bg-2", var: "var(--bg-2)", desc: "Sidebar / topbar" },
    { name: "--surface", var: "var(--surface)", desc: "Cards, inputs" },
    { name: "--surface-2", var: "var(--surface-2)", desc: "Buttons, hover" },
    { name: "--surface-3", var: "var(--surface-3)", desc: "Active, raised" },
  ];

  const borders = [
    { name: "--border", var: "var(--border)", desc: "Card/input border" },
    { name: "--border-strong", var: "var(--border-strong)", desc: "Dashed, focus" },
    { name: "--hairline", var: "var(--hairline)", desc: "Row dividers" },
  ];

  const texts = [
    { name: "--text", var: "var(--text)", desc: "Primary text" },
    { name: "--text-2", var: "var(--text-2)", desc: "Secondary text" },
    { name: "--text-3", var: "var(--text-3)", desc: "Tertiary / labels" },
    { name: "--text-4", var: "var(--text-4)", desc: "Muted / disabled" },
  ];

  return (
    <section className="mb-12">
      <p className="mono uc text-[10px] tracking-[0.12em] mb-4" style={{ color: "var(--text-3)" }}>
        COLORES · SUPERFICIES
      </p>
      <div className="grid grid-cols-5 gap-3 mb-4">
        {surfaces.map((s) => (
          <Swatch key={s.name} name={s.name} color={s.var} desc={s.desc} />
        ))}
      </div>

      <p className="mono uc text-[10px] tracking-[0.12em] mb-4 mt-6" style={{ color: "var(--text-3)" }}>
        COLORES · BORDES
      </p>
      <div className="grid grid-cols-3 gap-3 mb-4">
        {borders.map((s) => (
          <Swatch key={s.name} name={s.name} color={s.var} desc={s.desc} />
        ))}
      </div>

      <p className="mono uc text-[10px] tracking-[0.12em] mb-4 mt-6" style={{ color: "var(--text-3)" }}>
        COLORES · TEXTO
      </p>
      <div className="grid grid-cols-4 gap-3">
        {texts.map((s) => (
          <Swatch key={s.name} name={s.name} color={s.var} desc={s.desc} />
        ))}
      </div>
    </section>
  );
}

function AccentSwatches() {
  const accents = [
    { name: "--lime (accent)", var: "var(--lime)", hex: "#84cc7c" },
    { name: "--lime-dim", var: "var(--lime-dim)", hex: "oklch dim" },
    { name: "--amber", var: "var(--amber)", hex: "#e8a956" },
    { name: "--amber-dim", var: "var(--amber-dim)", hex: "oklch dim" },
    { name: "--red", var: "var(--red)", hex: "oklch" },
    { name: "--red-dim", var: "var(--red-dim)", hex: "oklch dim" },
    { name: "--blue", var: "var(--blue)", hex: "#5fa9e6" },
    { name: "--blue-dim", var: "var(--blue-dim)", hex: "oklch dim" },
    { name: "--violet", var: "var(--violet)", hex: "#a584e0" },
  ];

  return (
    <section className="mb-12">
      <p className="mono uc text-[10px] tracking-[0.12em] mb-4" style={{ color: "var(--text-3)" }}>
        COLORES · DEPORTES Y SEMÁNTICA
      </p>
      <div className="grid grid-cols-5 gap-3">
        {accents.map((s) => (
          <Swatch key={s.name} name={s.name} color={s.var} desc={s.hex} />
        ))}
      </div>
    </section>
  );
}

function Swatch({ name, color, desc }: { name: string; color: string; desc: string }) {
  return (
    <div
      className="rounded-[6px] overflow-hidden"
      style={{ border: "1px solid var(--border)" }}
    >
      <div className="h-16" style={{ background: color }} />
      <div className="p-3" style={{ background: "var(--surface)" }}>
        <p className="mono text-[10px] uc tracking-[0.06em]" style={{ color: "var(--text-2)" }}>
          {name}
        </p>
        <p className="mono text-[10px] mt-1" style={{ color: "var(--text-3)" }}>
          {desc}
        </p>
      </div>
    </div>
  );
}

function TypeSpecimen() {
  return (
    <section className="mb-12">
      <p className="mono uc text-[10px] tracking-[0.12em] mb-6" style={{ color: "var(--text-3)" }}>
        TIPOGRAFÍA · SPECIMEN
      </p>

      <div
        className="rounded-[6px] p-6"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <div className="space-y-6">
          <TypeRow
            label="STAT VALUE"
            className="mono text-[28px] font-bold tracking-[-0.02em]"
            text="712 TSS"
            note="28px / 700 / mono / tabular-nums"
          />
          <TypeRow
            label="HERO"
            className="text-[40px] font-bold tracking-[-0.025em] leading-[1.1]"
            text="Tu cuerpo está listo"
            note="40px / 700 / sans"
          />
          <TypeRow
            label="PAGE TITLE"
            className="text-[18px] font-bold tracking-[-0.02em]"
            text="Semana 20"
            note="18px / 700 / sans"
          />
          <TypeRow
            label="CARD TITLE"
            className="text-[16px] font-semibold tracking-[-0.01em]"
            text="VO2max · 5x4'"
            note="16px / 600 / sans"
          />
          <TypeRow
            label="BODY"
            className="text-[13px] font-normal"
            text="Tu ratio carrera/bici está sesgado a la bici esta semana."
            note="13px / 400 / sans"
          />
          <TypeRow
            label="SECONDARY"
            className="text-[12.5px] font-medium"
            text="Actividades"
            note="12.5px / 500 / sans"
          />
          <TypeRow
            label="MONO SMALL"
            className="mono text-[11px] font-normal"
            text="1h 15' · TSS 118 · IF 0.85"
            note="11px / 400 / mono"
          />
          <TypeRow
            label="STAT LABEL"
            className="mono uc text-[10.5px] font-medium tracking-[0.1em]"
            text="FITNESS · CTL"
            note="10.5px / 500 / mono / uppercase"
          />
          <TypeRow
            label="EYEBROW"
            className="mono uc text-[10px] font-medium tracking-[0.12em]"
            text="SEMANA ACTUAL · PLAN IA"
            note="10px / 500 / mono / uppercase / 0.12em"
          />
          <TypeRow
            label="MONO TINY"
            className="mono uc text-[9.5px] font-normal tracking-[0.08em]"
            text="HOY · 19 MAY"
            note="9.5px / 400 / mono / uppercase"
          />
        </div>
      </div>

      <p className="mono uc text-[10px] tracking-[0.12em] mb-4 mt-8" style={{ color: "var(--text-3)" }}>
        FONTS
      </p>
      <div className="grid grid-cols-2 gap-3">
        <div
          className="rounded-[6px] p-5"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <p className="mono uc text-[10px] tracking-[0.1em] mb-3" style={{ color: "var(--text-3)" }}>
            MANROPE · SANS
          </p>
          <p className="text-[24px] font-bold" style={{ color: "var(--text)" }}>Aa Bb Cc</p>
          <p className="text-[14px] mt-2" style={{ color: "var(--text-2)" }}>
            The quick brown fox jumps over the lazy dog
          </p>
          <p className="mono text-[10px] mt-2" style={{ color: "var(--text-3)" }}>
            400 · 500 · 600 · 700
          </p>
        </div>
        <div
          className="rounded-[6px] p-5"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <p className="mono uc text-[10px] tracking-[0.1em] mb-3" style={{ color: "var(--text-3)" }}>
            JETBRAINS MONO · MONO
          </p>
          <p className="mono text-[24px] font-bold" style={{ color: "var(--text)" }}>Aa Bb Cc</p>
          <p className="mono text-[14px] mt-2" style={{ color: "var(--text-2)" }}>
            0123456789 TSS CTL ATL TSB
          </p>
          <p className="mono text-[10px] mt-2" style={{ color: "var(--text-3)" }}>
            400 · 500 · tabular-nums
          </p>
        </div>
      </div>
    </section>
  );
}

function TypeRow({
  label,
  className,
  text,
  note,
}: {
  label: string;
  className: string;
  text: string;
  note: string;
}) {
  return (
    <div className="flex items-baseline gap-6 pb-4" style={{ borderBottom: "1px solid var(--hairline)" }}>
      <span className="mono uc text-[9.5px] tracking-[0.08em] w-28 shrink-0" style={{ color: "var(--text-4)" }}>
        {label}
      </span>
      <span className={className} style={{ color: "var(--text)", flex: 1 }}>
        {text}
      </span>
      <span className="mono text-[10px] shrink-0" style={{ color: "var(--text-3)" }}>
        {note}
      </span>
    </div>
  );
}

function SpacingDemo() {
  const spacings = [4, 8, 12, 14, 16, 18, 20, 22, 24, 28, 32, 36, 40, 48];

  return (
    <section className="mb-12">
      <p className="mono uc text-[10px] tracking-[0.12em] mb-4" style={{ color: "var(--text-3)" }}>
        ESPACIADO · SCALE
      </p>
      <div
        className="rounded-[6px] p-6"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <div className="flex items-end gap-2">
          {spacings.map((s) => (
            <div key={s} className="flex flex-col items-center gap-1">
              <div
                className="rounded-[2px]"
                style={{
                  width: s,
                  height: s,
                  background: "var(--lime)",
                  minWidth: 4,
                  minHeight: 4,
                }}
              />
              <span className="mono text-[9px]" style={{ color: "var(--text-3)" }}>
                {s}
              </span>
            </div>
          ))}
        </div>
        <p className="mono text-[10px] mt-4" style={{ color: "var(--text-3)" }}>
          Card padding: 14px · Grid gap: 12px · Progresión: 4/8/12/14/16/18/20/22/24/28/32/36/40/48
        </p>
      </div>
    </section>
  );
}
