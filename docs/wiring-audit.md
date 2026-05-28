# Auditoría de wiring pendiente — Splits

## Context

El UI de Splits está prácticamente terminado: dashboard, calendar, load, coach, records, settings, activities/new (estructura/import/export) — todo se ve y se navega. Pero **nada está conectado a backend, datos reales, ni servicios externos**. Toda la data viene de `lib/mock-data.ts` y sólo `theme`/`accent` se persisten (localStorage). El `appwrite.config.json` que ya existe sólo configura **Appwrite Sites como hosting** (SSR Next.js) — NO usa Appwrite Auth, Databases, ni Functions todavía.

Este documento NO es un plan de implementación — es la **tabla solicitada**: qué falta wired y qué opciones existen para cada pieza, con sus tradeoffs, para que tú decidas el camino.

## Estado actual en una línea

100% mock + theme. Único archivo backend-adyacente es `appwrite.config.json` (sólo hosting). No hay `app/api/`, no hay auth, no hay DB, no hay `lib/workout-io/` (vacío), no hay SDKs de terceros instalados.

---

## Decisiones tomadas (2026-05-28)

- **A1 Auth + A2 DB:** Appwrite Auth + Appwrite Databases (NoSQL, mismo proyecto que hosting).
- **C1 Modelo de costo de IA:** BYO key — el usuario pega su API key Claude/OpenAI en Settings; sin Stripe en v1.
- **Primera entrega:** Foundation completa en un paso — Auth + DB + Strava OAuth + parsers `.fit`/`.gpx`/`.tcx`/`.zwo`/`.erg`/`.mrc`/`.csv` + persistencia de forms.

---

## Tabla principal — Wiring pendiente, agrupada por bloque

Leyenda: **UI** = qué tan listo está visualmente · **Hoy** = qué hace ahora mismo · **Opciones** = caminos con tradeoffs.

---

### Bloque A — Plataforma (foundations, todo lo demás depende de esto)

| # | Área | UI | Hoy | Opciones (con tradeoff) | Notas |
|---|---|---|---|---|---|
| A1 | **Auth / sesión** | ❌ no existe ruta `/login`, `/signup`, no hay middleware | App pública, atleta hardcoded `Mateo R.` | **a)** Appwrite Auth (ya tienes proyecto Appwrite, email/OAuth/anon, SDK web) · **b)** Clerk (UX pulido, free hasta 10k MAU, $25/mes después) · **c)** NextAuth/Auth.js (gratis, autohospedado, más código) · **d)** Supabase Auth (gratis hasta 50k MAU, pero te ata a Supabase DB) | Tienes Appwrite ya; lo natural es (a). Sólo cambia si Appwrite Auth te queda corto en OAuth providers que necesites. |
| A2 | **DB / persistencia** | ❌ ningún hook escribe; settings tiene `defaultValue` sin onChange | Mock estático en `lib/mock-data.ts` | **a)** Appwrite Databases (NoSQL, mismo proyecto que hosting/auth, gratuito hasta 2GB) · **b)** Supabase Postgres (SQL, más potente para queries de load, gratis hasta 500MB) · **c)** Drizzle + Neon/Turso (SQL, control total, requiere infra propia) · **d)** Convex (reactivo, TS-first, free tier generoso) | Para queries time-series (CTL/ATL/load por día, PRs por sport) un SQL real (b/c) es mejor que NoSQL. Appwrite (a) sirve para v1 pero verás dolor en agregaciones. |
| A3 | **API routes / Server Actions** | ❌ `app/api/` no existe | Sin endpoints | **a)** Next.js Route Handlers (`app/api/*/route.ts`) · **b)** Next.js Server Actions (más simple para mutations) · **c)** Appwrite Functions (si la lógica vive cerca de la DB) | Combinar: Server Actions para writes simples; Route Handlers para webhooks (Strava, Stripe). |

---

### Bloque B — Ingreso de actividad (el corazón del producto)

| # | Área | UI | Hoy | Opciones (con tradeoff) | Notas |
|---|---|---|---|---|---|
| B1 | **Garmin Connect** | ✅ botones "Conectar Garmin" en Settings + ImportTab | Sin onClick, sin OAuth | **a)** Sólo importar `.FIT` (user descarga del dispositivo o de Garmin Connect Web y lo sube) — cero fricción legal, parseo local · **b)** Garmin Health API (oficial, OAuth1.0a, requiere aprobación de partner, gratis pero el proceso es lento — 2-8 semanas) · **c)** Garmin Connect unofficial (scraping vía `garth`/`garminconnect` python libs, frágil, sin garantías, riesgo de baneo del user) · **d)** Leer desde Strava (la mayoría de garmins sync a Strava automáticamente — un import único cubre dos pájaros) | Recomendado: (a) **YA** + (d) **luego** + (b) **a futuro** cuando consigas el partner. (c) lo evitaría. |
| B2 | **Strava** | ✅ botón "Conectar Strava" en Settings + tarjeta en ImportTab | Sin handler | **a)** Strava API v3 con OAuth (gratis, 100 req/15min, 1000/día por app, suficiente para usuarios individuales) · **b)** Strava Webhooks (push de actividades nuevas en tiempo real, requires endpoint público — perfecto con Next route handler) · **c)** Sólo import .FIT/.TCX/.GPX desde Strava UI (manual, sin OAuth) | Recomendado: (a) + (b) juntos. Strava es la integración con mejor ROI: pública, gratis, docs claros, y muchas plataformas (Zwift, Garmin, Wahoo, Coros) ya empujan ahí. |
| B3 | **TrainingPeaks** | ✅ tarjeta en ImportTab | Sin handler | **a)** Importar `.TCX`/`.ZWO`/JSON exportados desde TP · **b)** TrainingPeaks API (Partner Program, **de pago**, requiere acuerdo comercial — caro y lento) · **c)** Marcar como "Próximamente" en UI hasta que valga la pena | Recomendación: (a) o (c). La API oficial es prohibitiva para una app pre-producto. |
| B4 | **Zwift** | ✅ tarjeta en ImportTab + ExportTab | Sin handler | **a)** Importar `.FIT`/`.ZWO` (Zwift exporta `.FIT` automáticamente al final de cada ride) · **b)** Zwift NO tiene API pública oficial · **c)** Leer desde Strava (Zwift sync a Strava por default) | Sólo (a) y (c) son viables. (b) no existe. |
| B5 | **Wahoo Elemnt** | ✅ "push integration" en ExportTab | Display estado fake | **a)** Sólo export `.FIT` que user descarga al dispositivo · **b)** Wahoo Cloud API (OAuth oficial, gratis, requiere registro de app — más amigable que Garmin) · **c)** Leer desde Strava (Wahoo Elemnt sync a Strava) | (b) es razonable, mucho menos burocrático que Garmin Partner Program. |
| B6 | **Polar / Coros / Suunto** | ❌ no mencionados en UI | — | **a)** Accelink (Polar) y Coros API y Suunto API son OAuth oficiales y free · **b)** Saltar y depender de Strava como agregador · **c)** Soporte vía import `.FIT` genérico | Si vas con (a) en Bloque B2 (Strava), cubres ~80% del mercado sin tocar estos. |
| B7 | **Parsers de archivo** (`lib/workout-io/`) | ⚠️ UI dice ".FIT · .GPX · .TCX · .ZWO · .ERG · .MRC · .CSV" pero el directorio está **vacío** | Sin parsers, sin `<input type="file">` real, sin FileReader | **a)** Librerías npm — `fit-file-parser` (.FIT), `gpxparser` o `@tmcw/togeojson` (.GPX), `tcx-js` (.TCX), DOMParser nativo para .ZWO/.ERG/.MRC (XML/text simples). **b)** Server-side con SDK oficial Garmin FIT SDK (más completo, requiere Node nativo en API route) · **c)** Parser propio (mucho trabajo para .FIT que es binario complejo) | Recomendado: (a) en cliente para .GPX/.TCX/.ZWO/.ERG/.MRC/.CSV; (b) en server para .FIT grandes o si quieres validation estricta. |

---

### Bloque C — IA (Coach, sugerencias, insights)

| # | Área | UI | Hoy | Opciones (con tradeoff) | Notas |
|---|---|---|---|---|---|
| C1 | **Modelo de costo de IA** | ✅ UI hardcoded (3 SUGGESTIONS, AISuggestion component con botones "Aplicar"/"Ver razonamiento" sin handlers) | Texto fijo en el código | **a) BYO Key** — user pega su API key Claude/OpenAI en Settings, se cifra y persiste, llamadas van directo desde tu server con su key. *Pros:* sin costo para ti, sin rate limits. *Cons:* fricción de onboarding, mata conversion casual. · **b) Tú pagas todo** — incluído en suscripción. *Pros:* UX limpísima. *Cons:* costo unitario alto, riesgo de abuso. · **c) Híbrido (RECOMENDADO)** — free tier con tu key (e.g. 10 consultas/mes), opción BYO key en Settings para usuarios power. Stripe maneja el upgrade. · **d) Tú pagas + tier gratis con límite** — N consultas gratis/mes, después upsell. Igual que (c) sin la opción BYO. | El "BYO" reduce risk financiero pero pierde 80% de users. (c) es la opción más usada por productos de athlete-tech porque permite probar antes de pagar. |
| C2 | **Provider de IA** | — | — | **a)** Anthropic Claude (calidad alta, contexto largo de 200k, buen razonamiento longitudinal — encaja con análisis de historial). **b)** OpenAI GPT-4o/4.1 (más rápido, function-calling sólido). **c)** Groq (latencia ultra baja, modelos open-weight, ideal para chat) · **d)** Ollama / autohospedado (gratis pero no escalable, requiere GPU) | Recomendado: Claude (a) para razonamiento ("¿por qué deberías descansar?"), GPT/Groq para chat rápido si lo quieres conversacional. |
| C3 | **Cómo el modelo "ve" la data del atleta** | — | — | **a) Prompt context injection** — meter `ATHLETE` + últimas 14 actividades + load actual en el prompt (simple, suficiente para v1) · **b) Function calling / tool use** — el modelo puede llamar `getActivities()`, `getLoad()`, `getRecords()` dinámicamente (mejor, escala) · **c) RAG** — vectorizar historial y recuperar por similitud (overkill hasta que tengas miles de actividades por user) | (a) → (b) → (c) es el orden natural de evolución. |
| C4 | **Aplicar sugerencias** (botón "Aplicar" en AISuggestion) | ✅ botón visible | onApply nunca se pasa | Cuando IA genere un workout, "Aplicar" debe persistir en `PlannedWorkout` con `source: "ai"` (campo ya existe en types). Requires C1+A2 listos. | Trivial una vez DB lista. |
| C5 | **Coach insights** (`/coach/insights`) | ✅ tabla de 6 métricas | Hardcoded INSIGHTS const | **a)** Computar desde activities reales (FTP estimado vía MMP curve, VO2max vía Daniels formula, eficiencia decoupling) · **b)** Pedir a la IA que las narre desde la data cruda | (a) son cálculos deterministas; no necesitan IA. |
| C6 | **Coach compare** (`/coach/compare`) | ✅ tabla A vs B + sport pill que no filtra | Hardcoded COMPARISON | Computar agregados por rango de fechas + sport. Trivial sin IA, sólo necesita activities reales. | — |

---

### Bloque D — Exportación

| # | Área | UI | Hoy | Opciones (con tradeoff) | Notas |
|---|---|---|---|---|---|
| D1 | **Serializers** (.FIT, .ZWO, .ERG, .MRC, .TCX, .JSON) | ✅ 6 botones "Descargar" en ExportTab | Sin onClick, sin generación | **a)** Generar en cliente con `Blob` + `URL.createObjectURL` (.ZWO/.ERG/.MRC/.TCX/.JSON son texto/XML, triviales; .FIT requiere lib binaria como `fit-file-writer`) · **b)** Generar en server (route handler devuelve `application/octet-stream`) · **c)** Saltar `.FIT` writing y sólo permitir `.ZWO`/`.ERG` (Garmin/Wahoo no aceptan estos para workouts estructurados todavía — verificar) | Recomendado: (a) para los formatos texto, (b) para `.FIT` si decides soportarlo. |
| D2 | **Push automático** a Garmin/Wahoo/Zwift | ✅ ExportTab muestra estado de cada destino | Status fingido | Una vez tengas OAuth con cada uno (B1, B5), publicar workout es una API call más. Zwift NO acepta push (es read-only para devs). | — |

---

### Bloque E — Páginas vacías o sin interactividad

| # | Área | UI | Hoy | Acción |
|---|---|---|---|---|
| E1 | `app/(app)/activities/[id]/` | ❌ directorio vacío | Link rompe | Implementar detail view — mapa GPS si hay, blocks ejecutados vs planeados, splits, charts power/HR. Si vas con (a) en Bloque B (.FIT parsing), tienes todos los streams. |
| E2 | `app/(app)/zones/` | ❌ no existe (CLAUDE.md la promete) | 404 desde sidebar | Editor de zones por sport (power, HR, pace) — los valores van a DB (A2). |
| E3 | **Settings save** | ✅ "Guardar cambios" en TopBar | Sin onClick | Trivial una vez DB lista (A2). |
| E4 | **Calendar interactividad** | ✅ grid renderizado, días clickeables visualmente | Sin onClick | Cada cell debe ser link a `/?date=YYYY-MM-DD` o abrir un peek; navigation de mes con ChevronLeft/Right sin state. |
| E5 | **Form submit** en `activities/new/structure` | ✅ form completo react-hook-form | No hay onSubmit | Conectar a `createPlannedWorkout()` action → A2. |
| E6 | **"Empezar desde plantilla"** en LivePreview | ✅ 5 templates listados | Sin onClick | Preset templates en lib + setValue del form. Trivial. |
| E7 | **"Agregar Bloque / Repetición"** en StructureTab | ✅ botones | Sin onClick | Field array de react-hook-form (`useFieldArray`). Trivial. |
| E8 | **AISuggestion handlers** (Aplicar, Ver razonamiento) | ✅ botones | Callbacks nunca pasados desde el llamador | Conectar a C4 (Aplicar) y abrir drawer con prompt+response (Ver razonamiento). |
| E9 | **Onboarding** | ❌ no existe | Usuario nuevo cae al dashboard sin atleta configurado | Wizard de 3 pasos: perfil → FTP/LTHR → conectar Strava/Garmin (opcional). Depende de A1+A2+B. |

---

### Bloque F — Monetización y observabilidad (cuando estés listo)

| # | Área | Opciones | Notas |
|---|---|---|---|
| F1 | **Pagos / suscripciones** (si vas con modelo C1/c o C1/d) | **a)** Stripe (estándar, control total, debes manejar tu IVA en EU) · **b)** Paddle (Merchant of Record, ellos manejan impuestos globales, comisión 5%+50¢) · **c)** Lemon Squeezy (mismo modelo que Paddle, mejor UX para indie) | Para producto B2C global: (b) o (c) ahorran enormemente en compliance. |
| F2 | **Email transaccional** | **a)** Resend (DX excelente, gratis hasta 3k/mes) · **b)** Postmark · **c)** Loops.so (incluye marketing) | Resend es default si no necesitas campañas. |
| F3 | **Analytics de producto** | **a)** PostHog (eventos + sesiones + flags, free hasta 1M eventos) · **b)** Plausible (privacy-first, sólo pageviews, $9/mes) · **c)** Vercel Analytics (si hosteas en Vercel — no aplica acá) | PostHog si quieres entender funnel; Plausible si solo necesitas tráfico. |
| F4 | **Error tracking** | **a)** Sentry (estándar) · **b)** Highlight.io (open-source, replays) | Sentry hasta que pinche el free tier. |

---

### Bloque G — Cómputo de carga real

| # | Área | UI | Hoy | Acción |
|---|---|---|---|---|
| G1 | **CTL/ATL/TSB desde TSS real** | ✅ PMCChart funciona | `buildLoadSeries(84)` genera TSS aleatorio con RNG seeded, NO lee de `ACTIVITIES` | Una vez B1+B2 traigan actividades a A2, reescribir como agregador: TSS por día → fórmula EMA (42d / 7d) que ya existe en `lib/mock-data.ts:145-146`. Lógica matemática ya implementada, sólo cambia el input. |
| G2 | **Records computados** | ✅ tabla de PRs | `RECORDS` const hardcoded | Calcular `max(tss)`, `max(dist by sport)`, `max(power by duration)` desde activities. Necesita streams (no sólo summaries) para records de potencia/pace por duración. |

---

## Notas de costo/esfuerzo relativos (para priorizar)

- **Bajo esfuerzo, alto valor**: A1 (Auth) + A2 (DB) + B7 (parsers cliente) + B2 (Strava OAuth) + E5/E3 (forms guardando). Esto solo ya hace la app funcional para un usuario que sube `.fit` manual o conecta Strava.
- **Medio esfuerzo**: C1+C2+C3 (IA con prompt context) — un endpoint `app/api/coach/route.ts` + UI streaming.
- **Alto esfuerzo / lento**: B1 (Garmin Health Partner) y B3 (TrainingPeaks API) — burocrático, no estrictamente necesario si tienes Strava como agregador.
- **Saltable en v1**: B3, B6, F1-F4.

## Pregunta abierta que afecta varias filas

**Modelo de costo de IA (C1)** define varias cosas downstream:
- Si BYO key (a): no necesitas Stripe en v1 (F1), pero sí UI de "pega tu key" en Settings.
- Si tú pagas (b/c/d): necesitas Stripe + rate limiting + métricas de uso (F3) desde el primer día.

Si decides eso primero, casi todo lo demás cae solo.

## Verificación (cuando empiece la implementación)

Cada fila wired se verifica abriendo la app en el navegador y ejercitando el flujo completo end-to-end, sin mocks:

- **A1**: registrarse, hacer logout, hacer login, ver que la sesión persiste tras refresh.
- **A2**: cambiar FTP en Settings, refrescar, ver que sigue cambiado.
- **B1/B2**: completar OAuth con la cuenta personal del owner, ver actividades aparecer en `/activities`.
- **B7**: drag-and-drop de un `.fit` real (uno tuyo de Strava), ver que aparece en la lista con TSS/IF calculados.
- **C1-C3**: abrir `/coach`, pedir "¿debería entrenar hoy?", ver respuesta razonable que cite tu HRV/CTL/ATL actuales.
- **D1**: descargar un workout como `.zwo`, abrirlo en Zwift, ver que las zonas mapean.
- **G1**: tras importar 30 días reales de Strava, el chart de `/load` debe mostrar CTL/ATL/TSB calculados desde tus TSS, no la curva sintética actual.

---

*Fin. Esta tabla es informativa, no ejecutiva — al aprobarla no se modifica nada del código; sólo queda guardado este documento como referencia para tus decisiones próximas.*
