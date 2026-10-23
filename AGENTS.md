<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project

A Persian (RTL) portfolio site with a live **theme studio** at `/create` ("استودیو کدولوژی").
Stack: Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4, `@base-ui/react`, `lucide-react`.

`/create` is a preview canvas: the studio's top bar picks an **archetype** (`landing`, `ecommerce`,
`clinic`, `dashboard`, `components` — landing is the default, the component gallery sits last), the
left sidebar picks a **style preset** (13: `nova`, `corporate`, `editorial`, `swiss`, `blueprint`,
`terminal`, `glass`, `edtech`, `terracotta`, `zine`, `memphis`, `manga`, `steampunk`), palette,
radius, font and icon library; the canvas re-skins instantly and can export CSS/Tailwind tokens.

Everything is built on `src/components/create-components/` — one token-themed component library.
Tokens come from `theme.ts` (+ per-preset palettes in `style-presets/chart-palettes.ts`) and are
consumed as `var(--cc-*)` CSS variables, so adding a token automatically re-themes every preset and
scenario.

## What was done in this conversation

- **Default scenario flipped to the landing page.** `/create` now opens on `landing` (لندینگ تدریس
  آنلاین) and the component gallery moved to the end of the strip. `ARCHETYPES` is now ordered
  landing → ecommerce → clinic → dashboard → components; that array is the single source for tab
  order and RTL arrow-key navigation, while the initial scenario is declared separately in
  `create-studio.tsx` (`useState<ArchetypeId>("landing")`). The fake address bar follows the active
  archetype's `demoHost`, so the first paint loads `academy.demo-kodology.ir`; `components` stays
  reachable as the last tab and the last stop in keyboard navigation.
- **Style library rebuilt.** `riso` and `brutalist` were retired and the rest re-tuned; the picker now
  ships 13 presets grouped as modern/corporate (nova, corporate, editorial, swiss), technical
  (blueprint, terminal, glass) and expressive (edtech, terracotta, zine, memphis, manga, steampunk).
  Definitions live in `create-components/style-presets/` (`types.ts`, `chart-palettes.ts`,
  `presets-classic.ts`, `presets-expressive.ts`, `presets-dark.ts`, `index.ts`) behind the same
  `./style-presets` import surface. Each preset owns its chart ramp, its display voice and one
  structural signature in `styles.css` (rings, ticks, gradient rule, arches, tape tilt, confetti,
  screentone/panel cut, brass rivets, glass blur). The sidebar groups the tiles and previews each
  style with its own heading face and a three-dot palette; picking a style also syncs radius, body
  font (`STYLE_FONTS`) and the canvas chip label. `shuffle()` now picks a random style + brand swatch
  instead of a hand-maintained combination list.

Rebuilt the two canvas scenarios and added the primitives they needed:

- **New primitives** (all exported from `create-components/index.ts`): `chart.tsx` (`ChartFrame`,
  `ChartLegend`, `Sparkline`, `MiniBars`, `RadialGauge`, `Heatmap`, `FunnelChart`, `useChartTheme`),
  `chart-recharts.tsx` (themed `AreaTrend`, `LineTrend`, `BarSeries`, `DonutBreakdown`), `calendar.tsx`
  (Jalali month picker with availability), `jalali.ts`, `stepper.tsx`, `stat.tsx`, `timeline.tsx`.
- **Theme**: 7 new chart tokens (`chart1…chart6`, `chartGrid`) plus a `chartPalettes` entry per style
  preset; CSS for chart animations in `create-components/styles.css`.
- **Palette and colour picking rebuilt.** The old swatch list was labelled
  `Primary` / `Secondary` / `Success` / `Warning` but every row called the single
  brand-colour setter, so any click repainted the whole style, while “custom”
  exposed only one HEX field. `create-studio-palette.ts` now owns a layered
  model: five explicit roles (`primary`, `accent`, `success`, `warning`,
  `danger`) from six ready palettes, plus optional neutrals (`background`,
  `surface`, `surfaceForeground`, `muted`, `mutedForeground`, `border`) and
  chart tokens (`chart1…chart6`, `chartGrid`) layered over the active style
  preset. The sidebar tabs really switch content: ready palettes render
  five-dot tiles, and the custom tab is an advanced editor with
  role/neutral/chart groups, per-token colour + HEX input with validation,
  per-token and per-group reset, a live preview and a WCAG contrast warning.
  Editing one token never touches the others; neutrals/charts follow the
  selected style until overridden and reset drops the override.
  `paletteThemeOverrides` is shared by the canvas and `buildThemeSnippet`, and
  `getContrastRatio` keeps soft fills and labels legible on light and dark
  presets.
- **`clinic-reservation.tsx`**: hero + illustrated scene, and a 4-step booking wizard (specialty/doctor →
  Jalali calendar + slot + visit mode → validated patient form → review, payment, tracking code).
  Data in `create-scenarios/data/clinic.ts`, art in `create-scenarios/art/clinic-art.tsx`.
- **`analytics-dashboard.tsx`**: KPI stats, area/line/donut/bar charts, gauges, heatmap, funnel,
  sortable + selectable + paginated orders table, alerts, activity timeline, system health.
  Data in `create-scenarios/data/dashboard.ts`.
- Added a "نمودارها و زمان‌بندی" gallery section to the `components` archetype.
- Added `recharts` + `react-is`; wired both views into `create-studio-canvas.tsx`.
- Made the artboard the hero of `/create`: the canvas fills the viewport height with slimmer
  padding, shows the active scenario + preset in its chrome, has a "بزرگ‌نمایی" full-screen toggle
  (Esc closes), and comes before the sidebar on small screens (`order-1`/`lg:order-2`). The scenario
  switcher itself lives in the studio bar (see the next bullet); `ARCHETYPES` entries still carry
  `description` and `shortLabel` for the tiles/labels that use them.
- `/create` no longer renders `SiteHeader`: the global `main` is a `h-dvh` flex column whose
  first child is the studio's own full-width 60px bar (`create-studio.tsx`), combining the logo,
  a labelled scenario switcher (`role='tablist'`, ink-filled active tab, RTL arrow-key navigation,
  coral reserved for the CTA) and the "مشاوره و سفارش" CTA (`/#contact-section`) — no nav links,
  language toggle or mobile sheet. The artboard chrome is a single-line browser bar (zoom toggle at
  the right edge, traffic lights, scenario name, demo address bar, style chip) plus a status bar;
  it is painted `mustard` so it never matches the preset's page background.
- The artboard is a fixed-height browser frame on a workbench: the stage uses the token-only
  `studio-desk` utility (ink-mixed bed + paper dots, `globals.css`) with a wide `lg:p-8 xl:p-10`
  frame. The window is `flex flex-col overflow-hidden` (`h-[72dvh]` on small screens, `flex-1` on
  `lg`), and **only** `data-preview-viewport` scrolls (`studio-scroll` utility in `globals.css`).
  The browser bar and status bar sit outside that scroller, so the header always stays up; never
  reintroduce a sticky chrome or a second scroller around the preview. The viewport is `dir="ltr"`
  so its scrollbar sits on the right; the site content wrapper restores `dir="rtl"`. Below `lg` the
  **page** container still scrolls to reach the sidebar — the nested preview viewport is
  intentional and needs its `min-h-0` / `flex-1` chain to keep shrinking.
- The window reads as a *separate site*: the shell (ink bezel, browser bar with traffic lights,
  `https://<archetype>.demo-kodology.ir` address, "پیش‌نمایش زنده" badge, status bar under the
  viewport and a "پنجرهٔ سایتِ مستقل" plate on the bed) is built from page tokens only, and
  `ARCHETYPE_ICONS` (from `create-studio-config.ts`) supplies a fixed glyph.
  `CreateComponentsThemeProvider` wraps **only** the content viewport, so the preset restyles the
  site inside the window and can never repaint the studio frame.
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
- **Icon libraries actually swap the glyphs.** The old picker only replaced a single logo mark while
  every other icon stayed Lucide, so picking Tabler did nothing visible. `create-components/icon-set.tsx`
  is now a semantic registry (`arrow-left`, `shopping-bag`, `calendar-check`, …) mapped onto three real
  packages — `lucide-react`, `@tabler/icons-react` and Material Design via `react-icons/md` — and every
  scenario, gallery and library primitive (`Accordion`, `Select`, `Checkbox`) renders `<Icon name=…>`.
  The library is scoped by `IconSetProvider` **inside** the window viewport, so the studio frame keeps
  its own Lucide glyphs. The sidebar tiles preview three sample glyphs per library, and the new
  «ساخت و استایل آیکون» controls drive `theme.iconScale` / `iconStroke` / `iconColor`
  (`--cc-icon-scale`, `--cc-icon-stroke`, `--cc-icon-color`): size scales every glyph around its own
  centre, weight sets the stroke for line sets (Material is filled and ignores it), and tone picks
  `currentColor` / `--cc-primary` / `--cc-accent` / `--cc-muted-foreground`. `buildThemeSnippet`
  exports those tokens too.
- **Box-shadow control.** A «سایهٔ جعبه‌ها» section sits between radius and typography (above the
  font picker) and pins `theme.shadow` / `theme.shadowHover` from five token-only presets —
  بدون سایه، نرم، برجسته، چاپی (hard offset) و هاله (brand glow) — plus «پیرو سبک», which keeps the
  active preset's own signature. `SHADOWS` / `shadowOverrides()` live in `create-studio-config.ts`;
  picking a style (or shuffling) resets the choice to «پیرو سبک». The swatches resolve the
  `var(--cc-*)` references with `resolveShadowCss()` because the sidebar sits outside the preset
  scope. `create-studio-canvas.tsx` writes `data-cc-shadow` on the content wrapper only for an
  explicit choice, and `styles.css` uses that hook so the pinned elevation outranks per-style card
  and chart-frame signatures (Swiss flat cards, EdTech inset rule, …). `buildThemeSnippet` consumes
  the resolved shadow, so the exported CSS matches the canvas.

## Studio defaults on first paint

`create-studio.tsx` starts with `landing` + `nova`, `DEFAULT_PALETTE`
(«سفال کهربایی» — primary `#e76f51`), radius `4`, shadow «پیرو سبک»
(`DEFAULT_SHADOW`), body face `vazir`, the `google` icon set and
`DEFAULT_ICON_STYLE` (`size: md`, `weight: regular`, `tone: inherit`). Picking a
style overwrites radius and body font from `STYLE_FONTS` and puts the shadow
back on «پیرو سبک»; palette, radius, shadow, font and icon library stay
user-controlled afterwards. `buildThemeSnippet` always exports the resolved
theme, so a copied snippet reflects the current style + palette + radius +
shadow + font + icon combination.

Studio settings persist in `localStorage` through `create-studio-store.ts`
(`cc-studio-config-v1`): scenario, style, palette, radius, shadow, font id,
icon library and icon style are written on every edit and restored after
hydration, so returning visitors keep their combination. Uploaded fonts still
live in IndexedDB. The store returns `null` until storage has been read (and on
the server), so `create-studio.tsx` renders `DEFAULT_STUDIO_CONFIG` for the
prerender and hydration never mismatches — same contract as the font store.
Reads are defensive: unknown ids fall back, radius clamps to 0–48, palette
roles are re-validated, and invalid JSON is ignored.

### First-visit guide and the contact hand-off

- `create-studio-tour.tsx` renders a `driver.js` tour (12 steps: welcome →
  scenarios → style → palette → icons → radius → shadow → typography → canvas
  chrome → canvas scrolling → submit CTA → closing). It auto-opens once per
  browser (`cc-studio-tour-v1`) and the «راهنما» button in the studio bar
  replays it. `driver.css` is imported in `src/app/create/page.tsx` before
  `tour.css`, which re-skins the popover with the frame tokens only.
- Every guide target is a `data-tour='…'` attribute, never a structural CSS
  path: `scenarios` in the studio bar, `styles`/`palette`/`icons`/`radius`/
  `shadow`/`typography` on the sidebar sections, `canvas-chrome` and
  `canvas-status` on the preview window, `submit-config` on the sidebar CTA.
  Adding or reordering a scenario/section only needs its `data-tour` to stay
  put (or the step list in `create-studio-tour.tsx` updated).
- The guide is keyboard-first: `onPopoverRender` moves focus to the popover's
  **next** button in a microtask (driver focuses its close button right after
  that hook, which made Space dismiss the guide) and a global `keydown` handler
  advances on Space, even when a click dropped focus onto the page. Space on
  «قبلی»/«بستن» keeps its native behaviour so users can still step back or
  close; `preventScroll` keeps the sidebar's scroll position untouched.
- The bottom sidebar CTA persists the current configuration and navigates to
  `/#contact-section`. `ContactSection` reads the same store, shows the saved
  combination as chips, attaches it as a hidden `studio-config` field (toggle
  on by default) and offers «انتخاب ظاهر را به شما می‌سپارم» (`design-choice`
  = `delegated`) for visitors who do not want to pick a theme themselves. The
  CSS export stayed as a secondary button under it.

## Rules for this codebase

- Style only through tokens (`var(--cc-*)`); never hardcode colours, so all presets keep working.
- Scenario order and the scenario default are two separate declarations: `ARCHETYPES` in
  `create-studio-config.ts` drives the tab strip and its RTL arrow-key path, while the initial
  `useState<ArchetypeId>("landing")` in `create-studio.tsx` decides what `/create` opens on.
  `create-studio-canvas.tsx` resolves the active id with `ARCHETYPES.find(...) ?? ARCHETYPES[0]`
  and renders the body through a per-id conditional chain, so reordering only moves tabs and the
  keyboard path — it never changes how a scenario renders. Keep `landing` first and `components`
  last.
- A scenario needs four matching pieces: the `ArchetypeId` union, an `ARCHETYPES` entry (`label`,
  `shortLabel`, `description`, `demoHost`), an `ARCHETYPE_ICONS` glyph (the window chrome never
  follows the sidebar's icon library) and its conditional body in `create-studio-canvas.tsx`. The
  browser bar prints `https://<demoHost>` from that entry.
- Never import a glyph package inside a scenario or gallery; render `<Icon name="…">` from
  `create-components/icon-set.tsx`. Adding an icon means adding one semantic key to all three maps
  (`LUCIDE_ICONS` drives the `IconName` union, `TABLER_ICONS` and `GOOGLE_ICONS` are exhaustive
  `Record<IconName, Glyph>` maps, so `tsc` catches a missing library). `IconSetProvider` belongs
  inside the preview viewport — the studio frame keeps its own Lucide marks, and library/size previews
  in the sidebar pass `library` / `strokeWidth` / `style` explicitly because they sit outside the
  `--cc-*` scope. Never feed `--cc-icon-stroke` to the Material set (filled glyphs balloon); the
  `Icon` component skips the weight for it.
- Presets are data, not components: add tokens in `style-presets/`, keep per-style structural
  signatures in `create-components/styles.css` under `[data-cc-style="…"]`, and register the id in
  `CreateThemePreset`, `chartPalettes`, `STYLES` and `StyleId` in one pass.
- Palette state lives in `create-studio-palette.ts`: the five roles are explicit, while neutrals and
  charts are overrides on the active style preset. Never wire a role swatch straight to `primary` —
  route edits through `withPaletteToken` and render through `paletteThemeOverrides`, so one edit
  changes exactly one token. Adding a colour token means extending the `Palette*Id` unions and
  `COLOR_TOKENS`, plus `resolvePaletteToken` / `paletteThemeOverrides` when it is derived.
  Ready palettes own roles only; neutrals/charts stay with the style until the visitor overrides
  them, and `resetPaletteToken`/`resetPaletteGroup` are the only ways back.
- Colour swatches open the studio's in-page HSV popover (`PaletteColorPicker`, Base UI
  `Popover`), never a native `<input type="color">`: the native dialog is an OS popup and Chrome
  can anchor it off-screen (especially on Wayland). Keep the positioner collision-aware and
  portaled so the picker stays inside the viewport in the narrow RTL sidebar.
- Numerals, dates and chart ticks use `monoType` (`--cc-mono-font-family`), never Tailwind's
  `font-mono` — the preset must own that face. Cards read `--cc-card-radius` and
  `--cc-surface-pattern`, buttons/cards read `--cc-hover-rotate`.
- Persian is a connected script: keep `labelLetterSpacing`/`headingLetterSpacing` at `0em`. Tracking
  is only acceptable on `dir="ltr"` Latin/numeric spans.
- Style presets never touch the studio frame: the frame keeps `paper`, `indigo-ink`, `coral`,
  `mustard`, `teal-craft`. Never move `CreateComponentsThemeProvider` outside the window viewport.
- The preview window has exactly one scroller (`data-preview-viewport`, `studio-scroll`). Keep the
  browser bar and status bar out of it so they stay visible; don't make them `sticky`. The
  viewport is `dir="ltr"` purely to put the scrollbar on the right — restore `dir="rtl"` on the
  site content wrapper, never on the chrome.
- Studio typefaces are the raw files in `public/fonts` (no woff2 conversion); declare them in
  `src/app/create/fonts.css` and mirror the family name in `FONT_STACKS`. Display faces must keep
  `'Vazir', 'Vazirmatn'` in their stack — A Ghasem has no digit glyphs, A Google/Parvaz no Latin ones.
  `blueprint`, `terminal` and `steampunk` already ask for `'Vazir Code'` (mono) and the editorial /
  terracotta / steampunk headings can take `Morabba`; until those files land the stacks fall back to
  `ui-monospace` / Gandom, so adding them is only a fonts.css + FONT_STACKS change.
  **Avoid `Maktab Rita`, `Ordibehesht`, `A Google` and `Parvaz` in preset stacks**: their Persian
  glyphs render disconnected/overlapping, so they cannot shape body copy or UI headings. The faces
  that actually join Persian text are Vazir, Samim, Gandom and Dirooz; A Ghasem is usable for short
  headline accents only.
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

