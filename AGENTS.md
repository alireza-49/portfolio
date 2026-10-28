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
plus palette, radius, shadow and font (the icon-library picker is hidden for now). The canvas
re-skins instantly and exports the theme as CSS/Tailwind tokens or JSON.

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
| `/admin/plan` | planner: Jalali month grid, project timeline, task board, Google Calendar sync |
| `/admin/inbox` | contact submissions (filters, bulk status, CSV, slide-over) |
| `/admin/posts`, `/admin/posts/new`, `/admin/posts/[id]` | post list + Tiptap editor |
| `/admin/comments` | reader comments for every post (bulk delete) |
| `/admin/settings` | AmootSMS token/line, SMS on-off, test send, send log |
| `/api/contact` | validates, throttles and stores a submission |
| `/api/google/start`, `/api/google/callback` | OAuth handshake for the planner's calendar account |
| `/api/google/sync` | pull-run, admin cookie or `Authorization: Bearer $CRON_SECRET` |

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
  (Tehran-aware Jalali dates, Persian digits), `schedule.ts` (Tehran wall-time math, month grid,
  timeline geometry), `secrets.ts` (AES-256-GCM at-rest encryption), `google-calendar.ts`
  (OAuth + Calendar REST), `calendar-sync.ts` (push/pull rules), `amootsms.ts` (the REST call),
  `sms.ts` (who gets texted and when), `sms-text.ts` (message copy, client-safe), `site-url.ts`
  (public origin for links), `text.ts` + `post-html.ts` +
  `inquiry-csv.ts` (client-safe), `types.ts`, `schema.sql`.
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
- The sidebar renders the 13 presets as **one flat 2-column grid** — no family headers and no
  per-tile caption line (`description` stays on the tile's `title`), and palette tiles drop their
  `note` line the same way. Radius tiles carry a live corner preview (a bordered box drawn with
  that value) and every shadow preset must read differently at swatch size.
- The font section is «انتخاب فونت» and opens with a «پیش‌فرض» row that resolves to
  `STYLE_FONTS[styleId]`; the style's own face is filtered out of the list below so exactly one
  radio is ever checked. Picking any face still calls `onFontChange` — the default is not a new
  stored sentinel.
- The icon-library section is off: `SHOW_ICON_LIBRARY = false` in `create-studio-sidebar.tsx`
  keeps the whole picker (library, size, weight, tone) out of the DOM and out of the tour. Icons
  keep `google` + `DEFAULT_ICON_STYLE`; flip the flag to bring the section back unchanged.
- `create-studio-tour.tsx` renders a driver.js tour (11 steps) that opens once per browser
  (`cc-studio-tour-v1`) and replays from «راهنما»; `driver.css` is imported in
  `src/app/create/page.tsx` before `tour.css`.
- The hand-off lives in `create-studio-handoff.ts`: `studioConfigStatus()` (derived, never stored),
  `describeStudioConfig`/`describeStudioOptions`, `buildStudioHandoff`, `parseStudioConfigPayload`
  and the store's `parseStudioConfig`. The import unwraps `config` **and** `studioConfig` (the
  console's submission download wraps the hand-off under `studioConfig`), so any file the site
  produces round-trips into `/create` unchanged.
- `create-studio-design-doc.ts` renders an **English** `design.md` from a resolved
  `buildStudioTheme` (roles, neutrals, chart ramp, shape/shadow/motion, typography, icons, the
  customization diff against the style preset, and the full `--cc-*` map), so a token added in
  `theme.ts` appears there without a second declaration. Two entry points: `designDocForStyle(id)`
  is the preset baseline behind the `/admin` «راهنمای طراحی سبک‌ها» panel, and
  `designDocForSubmission(payload)` reads the JSONB the contact form stored (hand-off wrapper,
  console envelope or bare config) so every request in `/admin/inbox` can download a document built
  from what the visitor actually customized.

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
- Project tasks live in `project_tasks` and are internal only — never surface them on `/track`.
  `src/lib/schedule.ts` owns every wall-clock decision: the Tehran offset is derived from `Intl`
  (never a hardcoded constant), `tehranInstant(day, "HH:MM")` is the only way a Jalali day plus a
  wall time becomes an instant, and `faDuration` lives there, not in `fa.ts`. Instants are stored
  UTC; the UI only ever formats them back through `faDate`/`faTime`/`faTimeRange`.
- Google Calendar is optional and must never block a write. `google-calendar.ts` holds OAuth and the
  REST calls (global `fetch`, no SDK); `calendar-sync.ts` holds the rules. A task is saved first and
  pushed afterwards: a failed push leaves `google_sync_state = 'error'` (or `'skipped'` when Google
  is not configured/connected) and the planner shows the reason instead of losing the task. Events
  carry `extendedProperties.private.cc_task_id`; a `404`/`410` on PATCH re-inserts instead of
  duplicating state, and deleting a project deletes its events before the FK cascade drops the rows.
- Pulling is incremental and one-way into a read-only mirror: `sync_token` + `singleEvents`, a `410`
  resets to a full window (now−30d…now+120d), recurring instances are skipped, and only events that
  are not ours are upserted into `calendar_events`. Events we created reconcile back onto their task
  (title and times) when Google's `updated` is newer than `google_synced_at`; an event deleted in
  Google marks its task `'skipped'` rather than resurrecting it.
- Refresh tokens are encrypted at rest with AES-256-GCM in `secrets.ts`, keyed from
  `ADMIN_SESSION_SECRET` — rotating that secret forces a Google reconnect. `GET /api/google/sync`
  exists so a cron can pull (`CRON_SECRET` bearer); without it the planner only pulls on demand.
  Google env keys: `GOOGLE_OAUTH_CLIENT_ID`, `GOOGLE_OAUTH_CLIENT_SECRET`,
  `GOOGLE_OAUTH_REDIRECT_URI` (see README for the Google Cloud steps).
- Post HTML is sanitized **on write** (`sanitizePostHtml`) and rendered with
  `dangerouslySetInnerHTML` — never render raw editor output from elsewhere. Editor swatches store
  `var(--color-*)`, never hex. Media URLs are `https://` or site-relative; direct uploads go to the
  Arvan S3 bucket when `ARVAN_S3_*` is configured. Never hotlink the Stitch exports.
- `/api/contact` validates, throttles and stores the hand-off JSONB exactly as sent; `/admin/inbox`
  only reads that row and never invents a submission.
- The contact form locks its send button for ten minutes per browser
  (`cc-contact-pending-v1` in `localStorage`, server keeps the 6-per-IP throttle) and on success
  replaces the page with `/track?ref=<submission id>`. While that submission is `status = 'new'`
  the whole track page is `inert` and greyed behind `<PendingNotice>`; `<PendingWatcher>` polls
  `/api/contact/status` every 20 s and the page unlocks itself when the console changes the status.
  `<TrackLockSync>` re-attaches the lock on a plain `/track` visit and forgets a deleted reference.
  The notice is the only receipt copy now (no “two hours” call promise, «تا ساعاتی دیگر…»), shows the
  masked mobile number and a `REQ-XXXXXXXX` reference derived from the id; a real mobile also gets
  the submission SMS (see below).
- Client SMS goes through AmootSMS (`POST /rest/SendWithBackupLine` — free text with the
  advertising-line guarantee, never pattern/verify; `Authorization: <token>`, `Mobiles` as a
  comma-separated string because the live endpoint rejects a JSON array, and `BackupLineNumber`
  defaulting to `98` because `public` is not a valid backup line). The token, sender line and the
  on/off switch live in `app_settings`
  (`/admin/settings`); `amootsms_line` empty means the public line (`public`). The token is
  encrypted with `secrets.ts`, keyed from `ADMIN_SESSION_SECRET` — rotating that secret makes the
  stored token unreadable and the settings page says so. `src/lib/sms.ts` is the only sender:
  `notifySubmissionSms` (from `/api/contact`, only when `looksLikePhone`, 5 s timeout so the form is
  never held), `notifySubmissionAlertSms` (the owner's own copy of every submission, to the
  `notify_mobile` saved at `/admin/settings` — phone or not, one 70-char part, no link, same 5 s
  budget), `notifyProjectStatusSms` (a real stored transition only, so a double click texts
  once) and `notifyProjectProgressSms` (the manual «ارسال پیام پیشرفت» button). Wording lives in
  `sms-text.ts`, never in the database: every body starts with `فیل وب دیزاین: `, dates/percent are
  Persian, links are omitted when `published = false`. A failed or skipped send never fails the
  write — it becomes a `sms_log` row plus `withSmsNote` on the action's message. Muted unless the
  switch is on, and a progress button sends the stored row, never the unsaved draft.
- Admin UI never uses fake controls: no OTP, no email sending, no password reset. Media uploads
  appear only when `ARVAN_S3_*` is configured; URL paste always works.
  Known limits: media is URL/S3-only (no binary in Postgres), one admin account, in-memory throttles
  per instance, and missing content answers with the themed 404 plus a 200 status and `noindex`.

## Rules

### Sizing

- Every size on the site is `rem`, never an arbitrary px: `text-[0.8125rem]`, not `text-[13px]`.
  The one knob is the «Design-space scale» rule in `src/app/globals.css` (`@layer base`):
  `html { font-size: clamp(12px, min(1.1111vw, 1.7778vh), 16px) }` from 768px up, i.e.
  `scale = min(width/1440, height/900)` clamped to 0.75–1.0, so a 150%-scaled Windows laptop
  (1280×610) and a 4K desktop at 200% see the same proportions. Add a size as rem and it joins
  the scale for free; the browser exposes no OS-scale factor to read (`devicePixelRatio` is OS
  scale × browser zoom, 2.0 on a Retina Mac at 100%).
- Hairlines (`border-*`), hard shadows, `ring-*`, `backdrop-blur`, fixed SVG geometry and
  `@media` breakpoints stay px on purpose — crisp riso edges, fixed layout breakpoints.

### Studio frame

- Style only through tokens (`var(--cc-*)`); never hardcode a colour.
- The frame keeps `paper`, `indigo-ink`, `coral`, `mustard` and `teal-craft`, and
  `CreateComponentsThemeProvider` wraps **only** the content viewport.
- Exactly one scroller: `data-preview-viewport` + `studio-scroll`. The browser bar (painted
  `mustard` so it never matches a preset background) and the status bar sit outside it — never
  sticky, never a second scroller. The viewport is `dir="ltr"` only to put the scrollbar on the
  right; the site content wrapper restores `dir="rtl"`, never the chrome.
- Below `lg` the sidebar is a **drawer, never a stacked section**: `create-studio-sidebar.tsx` is
  `max-lg:fixed max-lg:inset-y-0 max-lg:start-0` (closed: `invisible translate-x-full
  pointer-events-none`, open: `visible translate-x-0`) with its own sticky «تنظیمات استودیو» header
  and close button; `create-studio.tsx` owns `settingsOpen` plus the header trigger
  (`aria-controls="studio-settings"`), the backdrop, Escape, the Tab focus trap and restoring focus
  to the trigger. The canvas section and preview window are `min-h-0 flex-1` at every width, so the
  sheet overlays the canvas instead of pushing it down and the page itself never scrolls.
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
- The tour targets `data-tour='…'` attributes only (`scenarios`, `styles`, `palette`,
  `radius`, `shadow`, `typography`, `canvas-chrome`, `canvas-status`, `submit-config`) and is
  keyboard-first: focus moves to the popover's next button in a microtask, Space advances even after
  a click dropped focus, and `preventScroll` keeps the sidebar still.
- On compact the tour owns the settings sheet: sidebar steps carry `data: { panel: 'sidebar' }`, so
  config-level `onNextClick`/`onPrevClick` call `onSettingsChange` (open for the sheet, closed for
  the canvas), wait one drawer transition (~260 ms) and only then `moveTo()`. That is also why
  driver's arrow-key control is off below `lg` (it would step onto hidden targets) and why the
  sheet's Tab trap yields while focus is inside `.driver-popover`.

## Verify

```bash
npx tsc --noEmit && npx eslint src && npm test && npm run build
npm run db:setup   # once per database (reads DATABASE_URL)
```
