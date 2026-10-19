---
name: Warm Risograph Editorial
colors:
  surface: '#fdf9f0'
  surface-dim: '#dddad1'
  surface-bright: '#fdf9f0'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f7f3ea'
  surface-container: '#f1eee5'
  surface-container-high: '#ece8df'
  surface-container-highest: '#e6e2d9'
  on-surface: '#1c1c17'
  on-surface-variant: '#5b403c'
  inverse-surface: '#31312b'
  inverse-on-surface: '#f4f0e7'
  outline: '#8f706b'
  outline-variant: '#e3beb8'
  surface-tint: '#b62515'
  primary: '#b22212'
  on-primary: '#ffffff'
  primary-container: '#d53c29'
  on-primary-container: '#fffbff'
  inverse-primary: '#ffb4a7'
  secondary: '#555d7a'
  on-secondary: '#ffffff'
  secondary-container: '#d4dbfe'
  on-secondary-container: '#58607d'
  tertiary: '#835100'
  on-tertiary: '#ffffff'
  tertiary-container: '#a46700'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad4'
  primary-fixed-dim: '#ffb4a7'
  on-primary-fixed: '#400100'
  on-primary-fixed-variant: '#920700'
  secondary-fixed: '#dbe1ff'
  secondary-fixed-dim: '#bec5e7'
  on-secondary-fixed: '#121a34'
  on-secondary-fixed-variant: '#3e4661'
  tertiary-fixed: '#ffddb9'
  tertiary-fixed-dim: '#ffb961'
  on-tertiary-fixed: '#2b1700'
  on-tertiary-fixed-variant: '#663e00'
  background: '#fdf9f0'
  on-background: '#1c1c17'
  surface-variant: '#e6e2d9'
typography:
  display-lg:
    fontFamily: Epilogue
    fontSize: 56px
    fontWeight: '800'
    lineHeight: 64px
    letterSpacing: -0.03em
  display-lg-mobile:
    fontFamily: Epilogue
    fontSize: 40px
    fontWeight: '800'
    lineHeight: 48px
    letterSpacing: -0.02em
  display-sm:
    fontFamily: Epilogue
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  display-sm-mobile:
    fontFamily: Epilogue
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Epilogue
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Epilogue
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Epilogue
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Newsreader
    fontSize: 20px
    fontWeight: '400'
    lineHeight: 30px
  body-md:
    fontFamily: Newsreader
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  body-sm:
    fontFamily: Newsreader
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  label-lg:
    fontFamily: Space Grotesk
    fontSize: 15px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-md:
    fontFamily: Space Grotesk
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: 0.03em
  label-sm:
    fontFamily: Space Grotesk
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 3rem
  margin-tablet: 2rem
  margin-mobile: 1.25rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system channels the layered craft of physical risograph printing and independent editorial publishing into a responsive digital space. It feels deliberately tangible, energetic, and literary—rejecting cold, sterile software tropes in favor of warm paper textures, intense soy-ink pigments, and balanced typographic tension.

### Brand Personality & Emotional Impact
- **Crafted & Tangible:** Evokes physical matter—raw uncoated stock, dynamic spot inks, and calculated misregistration aesthetics without faux-skeuomorphic gimmicks.
- **Warm & Energetic:** Radiates human warmth, intellectual vitality, and optimistic momentum without causing screen fatigue or optical glare.
- **Disciplined Editorial:** Combines structured broadsheet rigor with avant-garde zine flair. Interfaces convey authority while feeling vibrant and accessible.

### Visual Style
The system employs an **Editorial Tactile** style—merging high-contrast spot-color typography, structural ink boundaries, paper-like container tiers, and purposeful multi-pass color overlays.

## Colors

The palette simulates tactile riso soy inks layered over heavy-grain warm stock. All functional surfaces pull from this controlled chromatic hierarchy.

### Color Archetypes
- **Primary Ink (`#E64833` / Warm Vermilion):** The signature spot ink. Used for high-intent actions, critical focus states, energetic keylines, and expressive display highlights.
- **Secondary Ink (`#1E2640` / Deep Warm Indigo):** The grounding structure. Serves as our primary reading ink, heavy borders, deep fills, and high-contrast structural scaffolding.
- **Tertiary Ink (`#F39C12` / Warm Amber Gold):** The illuminator. Used for notifications, badge highlights, secondary callouts, and expressive decorative accents.
- **Base Canvas (`#FBF7EE` / Warm Paper Parchment):** The foundational substrate. Replaces pure sterile white across all major surface tiers, softening contrast while maintaining crisp readability.

### Surface Hierarchy & Contrast Rules
- **Base Canvas:** `#FBF7EE` provides an organic, non-glare reading plane.
- **Surface Layer 1 (Card/Container):** `#FFFDF9` provides clean tonal lift without introducing stark artificial white.
- **Surface Layer 2 (Inset/Muted):** `#F2ECE0` provides grounding contrast for table headers, inactive wells, and input backings.
- **Text On Neutral:** Minimum contrast must always exceed WCAG AA (4.5:1). Secondary ink (`#1E2640`) on parchment yields an accessible, deep-ink ratio of 12.8:1.

## Typography

The typographic hierarchy establishes a deliberate tension between three distinct expressive voices:

1. **Epilogue (Headlines & Display):** Dense, structural, and architectural. Provides bold editorial presence akin to letterpress poster titles.
2. **Newsreader (Long-form & Body Copy):** Warm, literary, and human. Its organic serifs counteract digital fatigue across reading-heavy workflows.
3. **Space Grotesk (Labels, Data, Navigation, & Meta):** Technical, punchy, and modern. Ensures exceptional legibility for dense UI markers, timestamps, and interactive controls.

### Implementation Guidelines
- Pair `Epilogue` headlines with `Space Grotesk` metadata tags positioned directly above or below to mimic classical magazine decks.
- Always use standard typographic quotation marks and ligatures within `Newsreader` body content.
- Maintain generous line-heights in body text (`1.5` to `1.625`) to preserve comfortable reading over warm parchment backdrops.

## Layout & Spacing

The layout is anchored on an editorial column system that balances structured baseline alignment with airy negative space.

### Grid Anatomy
- **Desktop (1200px+):** 12-column layout with `3rem` canvas margins and `1.5rem` gutters. Editorial compositions may offset text by 1–2 columns to introduce asymmetrical magazine pacing.
- **Tablet (768px - 1199px):** 8-column layout with `2rem` canvas margins and `1.5rem` gutters.
- **Mobile (Up to 767px):** 4-column layout with `1.25rem` canvas margins and `1rem` gutters.

### Rhythm & Rules
- Spacing strictly scales on a base-4 vertical rhythm.
- Use `space-xs` and `space-sm` for compact component interiors (tag padding, button insets).
- Reserve `space-xl` for sectional breaks, emphasizing content transitions like turning printed spreads.

## Elevation & Depth

This design system avoids blurry digital drop-shadows. Instead, elevation mirrors layered print registration, paper cutouts, and crisp physical offsets.

### Depth Mechanics
1. **Low-Elevation Tiers (Cards, Drawers):** 
   - Constructed using high-density, sharp offsets: a solid 1px border of `#1E2640` paired with a sharp, zero-blur hard-edge offset shadow: `2px 2px 0px 0px #1E2640`.
2. **Elevated & Interactive Tiers (Hovered Cards, Modals, Popovers):**
   - Stepped displacement: `4px 4px 0px 0px #1E2640`.
   - On interactive press states, elements translate diagonally (`transform: translate(2px, 2px)`), reducing the offset shadow to simulate mechanical sheet compression.
3. **Overlapping Paper Planes:**
   - Inset zones and secondary panels rely on tonal parchment stepping (`#FBF7EE` over `#F2ECE0`) combined with crisp hairline dividers (`1px solid rgba(30, 38, 64, 0.12)`).

## Shapes

The shape system is strictly **Soft (`0.25rem` / `4px`)**. 

- Edges are subtly softened to mimic die-cut heavy cardstock rather than aggressive digital radiuses or pill shapes.
- High-level containers (cards, modals, inputs) utilize `0.25rem` radii.
- Badges and micro-tags utilize minimal rounding (`0.125rem` / `2px`) to preserve structural crispness.
- Circular shapes are strictly reserved for user avatars and circular iconography buttons.

## Components

### Buttons
- **Primary:** Background in `#E64833`, text in `#FFFDF9`, border `1px solid #1E2640`, shadow `2px 2px 0px #1E2640`. On hover: transition to `3px 3px 0px #1E2640`. On active: depressed `translate(2px, 2px)` with shadow collapsed. Font: `Space Grotesk`, medium weight, uppercase tracking.
- **Secondary:** Background in `#FFFDF9`, text in `#1E2640`, border `1.5px solid #1E2640`, shadow `2px 2px 0px #1E2640`.
- **Ghost/Tertiary:** Background transparent, text in `#1E2640`, underlined with a 2px offset border in `#F39C12`.

### Chips & Badges
- Background `#F2ECE0` with `1px solid rgba(30, 38, 64, 0.25)`.
- Metadata tags feature a `0.375rem` filled circle indicator in Vermilion (`#E64833`) or Amber (`#F39C12`).
- Typography set in `Space Grotesk` (`label-sm`), all-caps.

### Cards
- Surface background in `#FFFDF9` surrounded by a `1px solid #1E2640` keyline.
- Default resting shadow: `2px 2px 0px 0px rgba(30, 38, 64, 0.9)`.
- Cards feature optional top-edge accent strips (3px solid `#E64833` or `#F39C12`) to signal category categorization.

### Input Fields
- Background in `#FFFDF9`, border `1.5px solid #1E2640`, border-radius `0.25rem`.
- Placeholder text in `#1E2640` at 50% opacity in `Space Grotesk`.
- Focus state: Hard-edged highlight border in `#E64833` with an outer offset: `0 0 0 2px #FBF7EE, 0 0 0 4px #E64833`.

### Checkboxes & Radio Buttons
- Custom square box (`18px × 18px`) with `1.5px solid #1E2640` and `#FFFDF9` fill.
- Checked state: Fill shifts to `#E64833` with a crisp, geometric white checkmark.
- Radio buttons: Traditional circular frame with an inset solid vermilion dot (`8px`) upon selection.

### Lists & Article Feeds
- Items separated by dashed or continuous ink hairlines: `1px solid rgba(30, 38, 64, 0.15)`.
- Leading editorial timestamps and section counters set in bold vermilion numerals using `Space Grotesk`.

### Editorial Pull Quotes
- Border-left `4px solid #E64833`, background `rgba(243, 156, 18, 0.08)`, internal padding `space-md` through `space-lg`.
- Quote text set in `Newsreader` italic, headline scale.