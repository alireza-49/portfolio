<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project

A Persian (RTL) portfolio site with a live **theme studio** at `/create` ("استودیو کدولوژی").
Stack: Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4, `@base-ui/react`, `lucide-react`.

`/create` is a preview canvas: the left sidebar picks an **archetype** (`components`, `landing`,
`ecommerce`, `clinic`, `dashboard`), a **style preset** (`nova`, `riso`, `brutalist`, `editorial`,
`swiss`, `terminal`), palette, radius, font and icon library; the canvas re-skins instantly and can
export CSS/Tailwind tokens.

Everything is built on `src/components/create-components/` — one token-themed component library.
Tokens come from `theme.ts` (+ per-preset palettes in `style-presets.ts`) and are consumed as
`var(--cc-*)` CSS variables, so adding a token automatically re-themes every preset and scenario.

## What was done in this conversation

Rebuilt the two canvas scenarios and added the primitives they needed:

- **New primitives** (all exported from `create-components/index.ts`): `chart.tsx` (`ChartFrame`,
  `ChartLegend`, `Sparkline`, `MiniBars`, `RadialGauge`, `Heatmap`, `FunnelChart`, `useChartTheme`),
  `chart-recharts.tsx` (themed `AreaTrend`, `LineTrend`, `BarSeries`, `DonutBreakdown`), `calendar.tsx`
  (Jalali month picker with availability), `jalali.ts`, `stepper.tsx`, `stat.tsx`, `timeline.tsx`.
- **Theme**: 7 new chart tokens (`chart1…chart6`, `chartGrid`) plus a `chartPalettes` entry per style
  preset; CSS for chart animations in `create-components/styles.css`.
- **`clinic-reservation.tsx`**: hero + illustrated scene, and a 4-step booking wizard (specialty/doctor →
  Jalali calendar + slot + visit mode → validated patient form → review, payment, tracking code).
  Data in `create-scenarios/data/clinic.ts`, art in `create-scenarios/art/clinic-art.tsx`.
- **`analytics-dashboard.tsx`**: KPI stats, area/line/donut/bar charts, gauges, heatmap, funnel,
  sortable + selectable + paginated orders table, alerts, activity timeline, system health.
  Data in `create-scenarios/data/dashboard.ts`.
- Added a "نمودارها و زمان‌بندی" gallery section to the `components` archetype.
- Added `recharts` + `react-is`; wired both views into `create-studio-canvas.tsx`.
- Made the artboard the hero of `/create`: the scenario picker is now a prominent
  icon-tile strip (`ARCHETYPES` gained `tagline`/`description`), the canvas fills the
  viewport height with slimmer padding, shows the active scenario + preset in its
  chrome, has a "بزرگ‌نمایی" full-screen toggle (Esc closes), and comes before the
  sidebar on small screens (`order-1`/`lg:order-2`).
- Wired the real Persian typefaces in `public/fonts` into the studio: `src/app/create/fonts.css`
  declares 12 `@font-face` rules (Vazir, Samim, Gandom, Dirooz, Maktab Rita, A Ordibehesht,
  A Ghasem, A Google, Parvaz), `FONT_STACKS` maps the ten picker ids onto them, and the
  sidebar previews every face in its own family under "متن" / "نمایشی" groups. The placeholder
  options (sahel/shabnam/tanha/editorial) and the unused Next starter SVGs, duplicate font
  formats and FD/WOL variants were removed — `public/fonts` went from 133 files to 20.
- **Custom fonts**: visitors can upload their own font files (woff2/woff/ttf/otf, ≤ ۵ MB) from the
  typography section, name them, and use them on the canvas like a built-in face. The binary is kept
  in IndexedDB (`create-studio-custom-fonts.ts`, DB `cc-studio-fonts`) and re-registered with the CSS
  Font Loading API on every visit, so uploaded fonts survive reloads and can be deleted. The list is
  exposed through `useSyncExternalStore`, keeping hydration in sync with the prerendered HTML.

## Rules for this codebase

- Style only through tokens (`var(--cc-*)`); never hardcode colours, so all six presets keep working.
- Studio typefaces are the raw files in `public/fonts` (no woff2 conversion); declare them in
  `src/app/create/fonts.css` and mirror the family name in `FONT_STACKS`. Display faces must keep
  `'Vazir', 'Vazirmatn'` in their stack — A Ghasem has no digit glyphs, A Google/Parvaz no Latin ones.
- Uploaded fonts are read through `useSyncExternalStore` (`create-studio-custom-fonts.ts`); IndexedDB
  is only touched from the store's subscribe/mutation helpers, never during render and never from an
  effect (`react-hooks/set-state-in-effect` is enabled).
- Keep scenario data deterministic (hash-based noise, fixed demo dates) — the page is statically
  prerendered, so `Math.random()`/`Date.now()` cause hydration mismatches.
- Disable recharts JS animations (`isAnimationActive={false}`); they render empty paths in prerender.
  Use the CSS fade/draw classes from `styles.css` instead.
- Persian text and Jalali dates throughout; numbers stay inside `dir="ltr"` spans where needed.

## Verify

```bash
npx tsc --noEmit && npx eslint src && npm run build
```

