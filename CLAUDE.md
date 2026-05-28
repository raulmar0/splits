# CLAUDE.md

> Project conventions for **Splits**. Read on every session. Keep this file short — link to `design_handoff_splits/README.md` for design detail rather than duplicating it.

## What this project is

Splits is a training-analysis web app for endurance athletes. Spanish UI (`es-ES`), dark-tech aesthetic, AI-assisted planning. The canonical surface is the **calendar-first dashboard** — every other surface borrows its week-strip vocabulary.

Full design spec: `design_handoff_splits/README.md`. Original prototype (visual reference only, do not copy code from it): `design_handoff_splits/prototype/`.

## Stack

- Next.js 15 App Router + TypeScript strict
- Tailwind CSS v4, design tokens as CSS custom properties in `app/globals.css`
- shadcn/ui primitives, restyled to dark-tech (NOT default shadcn look)
- lucide-react for icons
- Recharts for charts (wrap per type)
- react-hook-form + zod for forms
- next/font/google for Manrope + JetBrains Mono (self-hosted)

No backend yet — mock data in `lib/mock-data.ts` matching the types in the README. Data access through hooks (`useActivities`, `usePlannedWorkouts`, `useLoad`) so swapping in real fetch later is one file each.

## Non-negotiable conventions

### Design tokens are the source of truth
Never invent new colors, spacing, or type sizes. If something feels missing, ask before adding. The full token list is in the README under "Design Tokens".

### Mono vs sans is load-bearing
- `font-mono` (JetBrains Mono): all numerical data, dates, time, percentages, file extensions, IDs, uppercase eyebrow labels, chart axes, chips
- `font-sans` (Manrope): titles, narrative copy, button labels, nav items

If a number appears in a sentence ("Tu HRV está en 78ms"), the number itself is mono inline, the surrounding sentence is sans. See the README microcopy section for examples.

### Section labels
Every section gets a `<SectionLabel>` eyebrow above it. The component renders:
```
font-mono uppercase tracking-[0.12em] text-[10px] text-[--text-3]
```
Examples: `SEMANA ACTUAL · PLAN IA`, `IMPACTO EN CARGA`, `ESTRUCTURA · BLOQUES`. The middle dot (`·`) is intentional — use it as a separator, not a hyphen.

### Microcopy
- All UI copy is Spanish (`es-ES`). Keep the strings from the prototype verbatim.
- Technical acronyms (TSS, CTL, ATL, TSB, IF, FTP, LTHR, HRV, VO2max) are NEVER translated.
- Sport tags are English internally (`ride`, `run`, `swim`, `strength`, `trail`, `rest`) and Spanish in UI (`Ciclismo`, `Carrera`, …).
- Day abbreviations: `L M X J V S D` (one letter) or `Lun Mar Mié Jue Vie Sáb Dom` (three letters). Wednesday is `X`, not `M`.

### Number formatting
- Tabular nums everywhere (`font-variant-numeric: tabular-nums`)
- Time `H:MM:SS`, drop hours when 0
- Power `W` integer
- HR `bpm` integer
- TSS integer
- IF 2 decimals (e.g. `0.85`)
- Distance: km with 1 decimal under 100, integer above
- Elevation: integer meters with thin-space thousands separator (`2 800 D+`)
- Percentages integer

A `formatters.ts` module should expose `fmtTime, fmtPower, fmtTSS, fmtIF, fmtDist, fmtElev, fmtPct` — use it everywhere; never inline `.toFixed()`.

### Delta colors
- Up + good (CTL rising, PR improving): `--lime`
- Up + bad (ATL rising, fatigue): `--red`
- Neutral / informational: `--text-3`

The semantic, not the direction, determines the color. A `<StatDelta variant="up-good|up-bad|down-good|down-bad|neutral">` component encapsulates this.

### Themes
Two themes ship: `oscuro` (default) and `claro`. Both must be correct on every screen. Always use CSS variables, never class-conditional `dark:` Tailwind — the theme switch happens via a `data-theme` attribute on `<html>` and rebinds the variable set.

### Accent color is user-tweakable
4 options: lime `#84cc7c` (default), amber `#e8a956`, blue `#5fa9e6`, violet `#a584e0`. Plumbed through a `ThemeContext` backed by `localStorage`. When it changes, `--accent`, `--lime`, and `--accent-dim` all remap. **Do not open the picker to free input** — keep the option set curated.

### Animations
- Default easing: `cubic-bezier(0.2, 0.8, 0.2, 1)` (ease-out)
- Default duration: 120–180ms for hover/focus, 240ms for state changes, 320ms for chart entrances
- No bounces, no springy overshoots. The aesthetic is "instrument panel."

### File layout

```
app/
├── (app)/
│   ├── layout.tsx                 # AppLayout = Sidebar + TopBar + <main>
│   ├── page.tsx                   # Calendar-first dashboard
│   ├── activities/
│   │   ├── page.tsx
│   │   ├── new/page.tsx           # Manual create / import / export
│   │   └── [id]/page.tsx          # Detail
│   ├── calendar/page.tsx
│   ├── load/page.tsx
│   ├── coach/
│   │   ├── page.tsx               # Chat
│   │   ├── insights/page.tsx
│   │   └── compare/page.tsx
│   ├── records/page.tsx
│   ├── zones/page.tsx
│   └── settings/page.tsx
├── (dev)/
│   ├── primitives/page.tsx        # Storybook-like
│   └── charts/page.tsx
├── globals.css                    # Design tokens
└── layout.tsx                     # Root, fonts, providers
components/
├── ui/                            # Primitives (Card, Chip, Button, Input, SectionLabel, MonoNumber, SportDot, StatValue, StatDelta, …)
├── charts/                        # PMCChart, Sparkline, BarChart, ZoneDonut
├── shell/                         # Sidebar, TopBar
├── dashboard/                     # WeekStrip, AISuggestion, …
├── manual/                        # StructureBuilder, BlockTimeline, ImportDropzone, ExportFormatList, LivePreview
└── shared/                        # SportPill, ServiceCard, IntegrationTile
lib/
├── mock-data.ts
├── formatters.ts
├── load.ts                        # CTL/ATL/TSB math
└── workout-io/                    # FIT/ZWO/ERG/MRC/TCX/JSON parsers + serializers
hooks/
├── useTheme.ts
├── useActivities.ts
├── usePlannedWorkouts.ts
└── useLoad.ts
```

## When in doubt

- Re-read `design_handoff_splits/README.md`. The section you need is probably there.
- Open the corresponding file in `design_handoff_splits/prototype/` and read the JSX for layout/copy reference.
- Ask before introducing a new token, a new microcopy string, or a new chart type.

## What NOT to do

- ❌ Do not invent new colors or spacing values.
- ❌ Do not translate technical acronyms or paraphrase Spanish microcopy.
- ❌ Do not use default shadcn styling — restyle every primitive to match the dark-tech aesthetic.
- ❌ Do not use emoji.
- ❌ Do not add bouncy / spring animations.
- ❌ Do not implement Dashboard variants A (Command Center) or B (Editorial) — only C (Calendar-first).
- ❌ Do not collapse desktop layouts (1440) into a mobile column. Mobile is a separate, dedicated design (390 wide).
- ❌ Do not copy JSX from the prototype directly — reimplement against the target stack.
