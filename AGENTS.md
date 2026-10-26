<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project

A Persian (RTL) portfolio site with a live **theme studio** at `/create` («استودیو کدولوژی»).
Stack: Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4, `@base-ui/react`,
`lucide-react`; Postgres via `pg` for the console, blog and project tracking.

`/create` is a preview canvas: the top bar picks an **archetype** (`landing` is the default, then
`ecommerce`, `clinic`, `dashboard`, and the «المان‌های خام» catalog last), the sidebar picks one of
**13 style presets** (`corporate` «شرکتی رادیال» is both first tile and default, then nova,
editorial, swiss, blueprint, terminal, glass, edtech, terracotta, zine, memphis, manga, steampunk),
plus palette, radius, shadow, font and icon library. The canvas re-skins instantly and exports the
theme as CSS/Tailwind tokens or JSON.

Everything inside the window is built on `src/components/create-components/` — one token-themed
library. Tokens come from `theme.ts` (plus per-preset `chartPalettes` in
`style-presets/chart-palettes.ts`) and are consumed as `var(--cc-*)`, so adding a token re-themes
every preset and scenario.

## Routes

| Route | What it is |
|---|---|
| `/` | home: hero, services, estimator, contact form with the theme hand-off card |
| `/create` | the studio (bar + sidebar + one scrolling preview window) |
| `/blog`, `/blog/[slug]` | public archive and reader (TOC, progress, share, related) |
| `/track`, `/track/[code]` | public project lookup and ledger |
| `/admin/login` | single-admin login (server action, HMAC cookie) |
| `/admin` | console overview (KPIs, 14-day chart, recents) |
| `/admin/projects`, `/admin/projects/[id]` | project CRUD + full progress editor |
| `/admin/progress` | quick progress board |
| `/admin/inbox` | contact submissions (filters, bulk status, CSV, slide-over) |
| `/admin/posts`, `/admin/posts/new`, `/admin/posts/[id]` | post list + Tiptap editor |
| `/api/contact` | validates, throttles and stores a submission |

## Where things live

- `src/components/create-components/` — the library (`index.ts` barrel), `style-presets/`,
  `icon-set.tsx`, `styles.css`, `theme.ts`, plus primitives (`chart.tsx`, `chart-recharts.tsx`,
  `calendar.tsx`, `stepper.tsx`, `stat.tsx`, `timeline.tsx`, `jalali.ts`).
- `src/components/create-scenarios/` — one file per scenario (`tutoring-landing.tsx`,
  `clothing-shop.tsx` + `shop/`, `clinic-reservation.tsx`, `analytics-dashboard.tsx` + `dashboard/`,
  `elements-gallery.tsx`), shared `motion-primitives.tsx`, art in `art/`, data in `data/`.
- `src/components/create-studio*.tsx` — the shell around the window: `create-studio.tsx` (bar,
  sidebar, layout), `-canvas.tsx` (window chrome and scenario switch), `-config.ts` (`ARCHETYPES`,
  `STYLES`, `SHADOWS`, `buildThemeSnippet`), `-store.ts`, `-palette.ts`, `-shuffle.ts`,
  `-handoff.ts`, `-tour.tsx`, `-custom-fonts.ts`.
- `src/lib/` — `db.ts`, `content.ts` (the only DB module), `auth.ts`, `sanitize.ts`, `fa.ts`
  (Tehran-aware Jalali dates, Persian digits), `text.ts` + `post-html.ts` + `inquiry-csv.ts`
  (client-safe), `types.ts`, `schema.sql`.
- `src/app/admin/(console)/{projects,posts}/validation.ts` — JSONB re-validation.
- `scripts/db-setup.mjs` + `scripts/seed/*.mjs`; `public/fonts` (20 files) and
  `src/app/create/fonts.css`.

## Studio defaults and state

- Defaults are `landing` + `corporate`, its matched palette («اقیانوس فیروزه», primary `#0e7490`),
  radius `16`, shadow «پیرو سبک», body face `samim`, the `google` icon set and
  `DEFAULT_ICON_STYLE` (`md` / `regular` / `inherit`). The style is declared once as
  `DEFAULT_STYLE_ID` and the rest derives from it (`paletteForStyle`,
  `createThemePresets[…].tokens.radius`, `STYLE_FONTS`), so the untouched studio equals clicking
  that tile; the palette fallback is `ocean-teal`.
- Picking a style overwrites palette, radius and body font and puts the shadow back on «پیرو سبک»;
  palette, radius, shadow, font and icons stay user-controlled afterwards.
- Persistence: `localStorage` key `cc-studio-config-v1` (scenario, style, palette, radius, shadow,
  font id, icon library + style) through `create-studio-store.ts`. The store returns `null` until
  storage has been read (and on the server), so the prerender and hydration both use
  `DEFAULT_STUDIO_CONFIG`. Uploaded fonts follow the same contract through
  `create-studio-custom-fonts.ts` / IndexedDB `cc-studio-fonts`. Reads are defensive: unknown ids
  fall back, radius clamps 0–48, palette roles re-validate, invalid JSON is ignored.
- «بازگردانی به تنظیمات اولیه» calls `resetStudioConfig()`: it writes the defaults but **keeps the
  active archetype** (tabs are navigation, the sidebar owns the theme), persists like any edit,
  brings the sidebar's local view state back in line and is two-step (arms, label
  «برای بازگردانی دوباره بزنید», disarms on blur). Uploaded fonts are never deleted.
- The dice («بر زدن و ترکیب تصادفی تم») calls `rollStudioConfig()`: new style, palette derived from
  it, a face from `FONTS` plus uploaded ids, an elevation, a radii step and a whole icon setup. It
  skips the current value in every dimension, never touches the scenario and accepts an injectable
  dice so it stays deterministic.
- `create-studio-tour.tsx` renders a driver.js tour (12 steps) that opens once per browser
  (`cc-studio-tour-v1`) and replays from «راهنما»; `driver.css` is imported in
  `src/app/create/page.tsx` before `tour.css`.
- The hand-off lives in `create-studio-handoff.ts`: `studioConfigStatus()` (derived, never stored),
  `describeStudioConfig`/`describeStudioOptions`, `buildStudioHandoff`, `parseStudioConfigPayload`
  and the store's `parseStudioConfig`.

## Console: data, auth, content

- Postgres via `pg`; `DATABASE_URL` is the *pooled* connection string. `src/lib/db.ts` creates one
  lazily-cached pool per process and applies `src/lib/schema.sql` once per process, so
  `next build` never needs a database. `npm run db:setup` applies the schema and seeds demo rows
  only into empty tables.
- `src/lib/content.ts` is the only module that queries Postgres — never import it (or `db.ts`,
  `sanitize.ts`, `auth.ts`) from a client component. `steps`/`updates`/`tags` are JSONB,
  re-validated field by field in `app/admin/(console)/{projects,posts}/validation.ts`; UUID guards
  keep malformed URL ids out of Postgres.
- Public DB pages `await connection()` (Next 16 — no `dynamic`/`revalidate` with Cache Components)
  and declare `instant = false`; the console layout does the same so the session read streams.
- Auth: `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET` (see `.env.example`). Sessions are
  HMAC-SHA256 signed, HttpOnly, `SameSite=Lax`, 12 h (30 days with «ثبت نشست»); login failures are
  throttled per IP in memory. `requireAdmin()` sits at the top of every server action
  (`requireConsolePage()` on every console page) — never trust the layout for authorization.
  Without env vars the console only opens in development (`admin` / `phill-dev`, mustard warning
  bar); in production it fails closed.
- Post HTML is sanitized **on write** (`sanitizePostHtml`) and rendered with
  `dangerouslySetInnerHTML` — never render raw editor output from elsewhere. Editor swatches store
  `var(--color-*)`, never hex. Images are URLs only (`https://` or site-relative); never hotlink
  the Stitch exports.
- `/api/contact` validates, throttles and stores the hand-off JSONB exactly as sent; `/admin/inbox`
  only reads that row and never invents a submission.
- Admin UI never uses fake controls: no SMS/OTP, no email sending, no uploads, no password reset.
  Known limits: URL-only media, one admin account, in-memory throttles per instance, and missing
  content answers with the themed 404 plus a 200 status and `noindex`.

## Rules

### Studio frame

- Style only through tokens (`var(--cc-*)`); never hardcode a colour.
- The frame keeps `paper`, `indigo-ink`, `coral`, `mustard` and `teal-craft`, and
  `CreateComponentsThemeProvider` wraps **only** the content viewport.
- Exactly one scroller: `data-preview-viewport` + `studio-scroll`. The browser bar (painted
  `mustard` so it never matches a preset background) and the status bar sit outside it — never
  sticky, never a second scroller. The viewport is `dir="ltr"` only to put the scrollbar on the
  right; the site content wrapper restores `dir="rtl"`, never the chrome.
- Scenario order and the scenario default are separate declarations: `ARCHETYPES` drives the tab
  strip and its RTL arrow-key path, while `useState<ArchetypeId>("landing")` in
  `create-studio.tsx` decides what `/create` opens on. Keep `landing` first, `components` last; the
  canvas resolves with `ARCHETYPES.find(...) ?? ARCHETYPES[0]` and renders a per-id chain.
- A scenario needs four pieces: the `ArchetypeId` union, an `ARCHETYPES` entry (`label`,
  `shortLabel`, `description`, `demoHost`), an `ARCHETYPE_ICONS` glyph (the chrome never follows the
  sidebar's icon library) and its branch in `create-studio-canvas.tsx`.
- Presets are data, not components: tokens in `style-presets/`, one structural signature per style
  in `styles.css` under `[data-cc-style="…"]`, and the id registered in `CreateThemePreset`,
  `chartPalettes`, `STYLES` and `StyleId` in one pass. `STYLES` order is the tile order — keep
  `corporate` first.
- `STYLE_PALETTES` maps every style onto its palette and `paletteForStyle()` is the only way a
  style pick or a dice roll installs one; the sidebar marks the pair with a «هم‌سبک» chip.
- Palette edits go through `withPaletteToken` and render through `paletteThemeOverrides`, so one
  edit changes exactly one token. A new colour token extends the `Palette*Id` unions and
  `COLOR_TOKENS` (plus `resolvePaletteToken`/`paletteThemeOverrides` when derived). Ready palettes
  own roles only; neutrals and charts follow the style until overridden, and only
  `resetPaletteToken`/`resetPaletteGroup` go back.
- Colour swatches open the in-page HSV popover (`PaletteColorPicker`, Base UI `Popover`, portaled
  and collision-aware), never a native `<input type="color">` — the OS dialog can land off-screen.
- Numerals, dates and chart ticks use `monoType` (`--cc-mono-font-family`), never Tailwind's
  `font-mono`. Cards read `--cc-card-radius` and `--cc-surface-pattern`; buttons and cards read
  `--cc-hover-rotate`.
- Icons: never import a glyph package inside a scenario or gallery — render `<Icon name="…">`. A new
  icon is one semantic key in all three maps (`LUCIDE_ICONS` drives `IconName`; `TABLER_ICONS` and
  `GOOGLE_ICONS` are exhaustive records, so `tsc` catches a missing library). `IconSetProvider` sits
  inside the viewport; sidebar previews pass `library`/`strokeWidth`/`style` explicitly. Never feed
  `--cc-icon-stroke` to the Material set (filled glyphs balloon).

### Scenarios

- Motion goes through `motion-primitives.tsx` (`Reveal`, `Swap`, `Lift`, `Collapse`, `Row`, `Bump`)
  instead of raw `motion.*`; the testimonial dot's `layoutId` pill is the one inline exception.
  `Collapse` and `Row` need `initial={false}` on their `AnimatePresence`. `initial` must stay
  translate-only — `opacity: 0` renders a blank prerendered page. `useReducedMotion` may change
  `transition` values only; branching the element tree splits server and client markup. `motion` is
  imported by scenarios only (`create-components/*` stays dependency-free). New illustration motion
  belongs in `scenes.css` (`sc-*` class + a `prefers-reduced-motion` entry), not in JS timers.
- State-driven SVG (the shop's free-shipping van) takes its geometry from React and lets
  `.sc-track` transition it, instead of animating custom properties in CSS.
- `.sc-art` sets `display: block`, so a Tailwind `hidden`/`flex` on an illustration SVG loses to it.
  Put responsive visibility on a wrapper `<div>`.
- Shop numbers live in `data/shop.ts` (`SHOP_STATS`, `SHOP_SIZE_TABLE`, `SHOP_TRACKING`,
  `SHOP_REVIEW_STATS`, derived `PRICE_FLOOR`/`PRICE_CEILING`) and filters travel as one
  `ShopFilters` object — never a nineteenth prop on the grid. The hero is a bounded stage: art
  column `@3xl:h-[clamp(360px,44vh,470px)]`, copy column `justify-center` with no `mt-auto`, and
  `HeroOffer` docked at `end-3 bottom-3` from `@3xl`. Never repeat the promises or the rating in the
  hero; the trust band and meta line own them.
- Clinic numbers live in `data/clinic.ts`: `buildAvailability()` must keep deriving from
  `slotsFor()`/`freeSlotCount()` and stay cached per doctor so calendar and grid always agree,
  `bookingCode()` is the only tracking-code source, and `selectDoctor()` keeps an online visit off a
  doctor who does not offer one. Capacity, online discount, first-visit fee, tax, cancellation
  window, opening hour and support phone come from `SLOT_CAPACITY` / `CLINIC_PRICING` /
  `CANCEL_WINDOW_HOURS` / `CLINIC_STATUS`.
- Dashboard pages are data: one `DASHBOARD_PAGES` entry in `dashboard/pages.ts` plus a component
  rendering `<DashboardPage page={…}>`, which writes the `aria-labelledby` target. The shell renders
  exactly one page — no scroll-spy, anchor ids or `scroll-mt`; the rail is navigation and
  `selectPage()` resets `[data-preview-viewport]` to the top. Keep `range`/`live`/`tick` in the
  shell and page-local state (sort, paging, metric, draft filters) in the page. Numbers are derived:
  `DASHBOARD_RANGES[*].summary` holds only what rows cannot sum, `PLAN_MIX` comes from `ORDERS`,
  `TRAFFIC_TOTAL`/`ORGANIC_SHARE` from their series, and `filterOrders()` in
  `dashboard/orders-panel.tsx` is the only filter — its counter and the table both call it. Keep CSV
  export inside the panel and machine-readable, with Persian digits on screen.
- «المان‌های خام» is a catalog, not a demo page: `elements-gallery.tsx` owns its stops and its
  `PRIMITIVES`/`SECTIONS` arrays drive the jump bar and the counters. Each `Specimen` names the
  `--cc-*` tokens it consumes — that hint is the point of the page. No English badges, no
  `font-mono`, no raw Lucide imports here.
- Keep scenario data deterministic (hash-based noise, fixed demo dates) — `/create` is statically
  prerendered, so `Math.random()`/`Date.now()` cause hydration mismatches. Keep recharts animations
  off (`isAnimationActive={false}`); they render empty paths in prerender, so use the CSS fade/draw
  classes instead.

### Type, language and hand-off

- Studio typefaces are the raw files in `public/fonts`: declare them in `src/app/create/fonts.css`
  and mirror the family in `FONT_STACKS`. Display faces keep `'Vazir', 'Vazirmatn'` in the stack.
  Avoid `Maktab Rita`, `Ordibehesht`, `A Google` and `Parvaz` in preset stacks — their Persian
  glyphs render disconnected or overlapping; Vazir, Samim, Gandom and Dirooz join body text, and
  A Ghasem is usable for short headline accents only. `MaktabRita-Regular.woff2` needs
  `size-adjust: 210%` and a `unicode-range` limited to the codepoints it really draws (its blanks
  must fall through to Vazir). `blueprint`, `terminal` and `steampunk` ask for `'Vazir Code'`, which
  falls back to `ui-monospace` until that file lands.
- Uploaded fonts are read through `useSyncExternalStore`; IndexedDB is only touched from the store's
  helpers, never during render and never from an effect.
- Persian is a connected script: keep `labelLetterSpacing`/`headingLetterSpacing` at `0em`, with
  tracking only on `dir="ltr"` Latin/numeric spans. Everything visible is Persian — dates through
  `faDate`/`faDateTime`, digits through `faNumber`/`faDigits`; Latin values stay inside `dir="ltr"`
  `monoType` spans.
- The theme hand-off status is derived, never stored: `studioConfigStatus()` compares the saved
  config with what a style pick would install (and deliberately ignores the archetype), so a
  scenario-only visit or a CTA press without edits still reports `defaults`. Don't add a “chosen”
  flag.
- The contact form has exactly **one** theme surface: the «ظاهر و تم سایت» card below the fields.
  Never re-add a status strip above them. Its two buttons are a mode choice (own theme ink,
  delegated teal, `aria-pressed`), never navigation — the small «ویرایش در استودیو ←» link is the
  only way back. The attach checkbox appears only for an existing configuration in own-theme mode.
- The scope note is a product promise: keep all three copies loud and in sync — the mustard plate in
  the theme card, the dark `role='note'` bar above the browser bar, and the `.cc-tour-scope` block in
  the tour. All three state that the studio builds colour, palette, font and style only, while
  layout, sections and functionality are custom-built from scratch.
- Theme fields come only from `buildStudioHandoff()` — add a choice there and the payload, the
  details panel and the downloaded JSON follow. The form submits `studio-config`, `studio-summary`,
  one flat field per choice and the estimator JSON, with `studio-status` and `design-choice` always
  present. Imports go through `parseStudioConfigPayload` → `parseStudioConfig`, never
  `JSON.parse` + `updateStudioConfig`, falling back to `STYLE_FONTS[styleId]` when the saved custom
  font is not on this device.
- The tour targets `data-tour='…'` attributes only (`scenarios`, `styles`, `palette`, `icons`,
  `radius`, `shadow`, `typography`, `canvas-chrome`, `canvas-status`, `submit-config`) and is
  keyboard-first: focus moves to the popover's next button in a microtask, Space advances even after
  a click dropped focus, and `preventScroll` keeps the sidebar still.

## Verify

```bash
npx tsc --noEmit && npx eslint src && npm run build
npm run db:setup   # once per database (reads DATABASE_URL)
```
