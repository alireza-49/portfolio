import { themeToCssVars } from "./create-components/theme";
import { createThemePresets } from "./create-components/style-presets";
import {
  DEFAULT_ICON_STYLE,
  DEFAULT_SHADOW,
  FONTS,
  FONT_STACKS,
  SHADOWS,
  STYLES,
  STYLE_FONTS,
  buildStudioTheme,
  type StyleId,
} from "./create-studio-config";
import {
  COLOR_TOKENS,
  ROLE_IDS,
  paletteForStyle,
  paletteLabel,
  type PaletteChartId,
  type PaletteNeutralId,
  type PaletteRoleId,
} from "./create-studio-palette";
import { unwrapConfig } from "./create-studio-handoff";
import { DEFAULT_STUDIO_CONFIG, parseStudioConfig } from "./create-studio-store";
import type { StudioConfig } from "./create-studio-store";

/**
 * `design.md` for a studio configuration — English by design, so the file can
 * be handed to a developer or another tool without translation.
 *
 * The console has two entry points: one document per built-in style (the
 * preset baseline) and one per contact request (the configuration the visitor
 * actually submitted, customizations included). Both are rendered from the same
 * `buildStudioTheme` call the canvas uses, so the values in the file can never
 * drift from what the visitor saw.
 */

type Row = [label: string, token: `--cc-${string}`];

export type DesignDocMeta = {
  /** Applicant the document was generated for. */
  requester?: string;
  business?: string;
  /** ISO timestamp of the request, printed verbatim. */
  submittedAt?: string;
  /** Stack of an uploaded face; unknown ids do not live in `FONT_STACKS`. */
  fontStack?: string;
};

const NEUTRALS: Row[] = [
  ["Page background", "--cc-background"],
  ["Card surface", "--cc-surface"],
  ["Text on surface", "--cc-surface-foreground"],
  ["Inset surface", "--cc-muted"],
  ["Muted text", "--cc-muted-foreground"],
  ["Borders and dividers", "--cc-border"],
  ["Focus ring", "--cc-ring"],
];

const CHARTS: Row[] = [
  ["Series 1", "--cc-chart-1"],
  ["Series 2", "--cc-chart-2"],
  ["Series 3", "--cc-chart-3"],
  ["Series 4", "--cc-chart-4"],
  ["Series 5", "--cc-chart-5"],
  ["Series 6", "--cc-chart-6"],
  ["Chart grid", "--cc-chart-grid"],
];

const SHAPE: Row[] = [
  ["Base radius", "--cc-radius"],
  ["Small radius", "--cc-radius-sm"],
  ["Large radius", "--cc-radius-lg"],
  ["Card radius", "--cc-card-radius"],
  ["Border width", "--cc-border-width"],
  ["Border style", "--cc-border-style"],
  ["Shadow", "--cc-shadow"],
  ["Hover shadow", "--cc-shadow-hover"],
  ["Hover translate", "--cc-hover-translate"],
  ["Hover rotate", "--cc-hover-rotate"],
  ["Badge radius", "--cc-badge-radius"],
  ["Avatar radius", "--cc-avatar-radius"],
  ["Progress bar height", "--cc-progress-height"],
  ["Alert rule width", "--cc-alert-rule-width"],
  ["Focus ring width", "--cc-focus-ring-width"],
  ["Layout density", "--cc-density"],
  ["Transition duration", "--cc-duration"],
  ["Transition easing", "--cc-ease"],
];

const TYPOGRAPHY: Row[] = [
  ["Body stack", "--cc-font-family"],
  ["Base size", "--cc-font-size"],
  ["Body weight", "--cc-font-weight"],
  ["Line height", "--cc-line-height"],
  ["Letter spacing", "--cc-letter-spacing"],
  ["Heading stack", "--cc-heading-font-family"],
  ["Heading weight", "--cc-heading-weight"],
  ["Heading letter spacing", "--cc-heading-letter-spacing"],
  ["Heading transform", "--cc-heading-transform"],
  ["Heading line height", "--cc-heading-line-height"],
  ["Label stack", "--cc-label-font-family"],
  ["Label weight", "--cc-label-weight"],
  ["Label letter spacing", "--cc-label-letter-spacing"],
  ["Label transform", "--cc-label-transform"],
  ["Numeric stack", "--cc-mono-font-family"],
];

const ICONS: Row[] = [
  ["Scale", "--cc-icon-scale"],
  ["Stroke", "--cc-icon-stroke"],
  ["Color", "--cc-icon-color"],
];

const ROLE_USE: Record<PaletteRoleId, string> = {
  primary: "Primary actions, links and active states",
  accent: "Highlights, badges and secondary emphasis",
  success: "Confirmation and positive states",
  warning: "Caution and pending states",
  danger: "Errors and destructive actions",
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function table(headers: string[], rows: string[][]): string {
  return [
    `| ${headers.join(" | ")} |`,
    `| ${headers.map(() => "---").join(" | ")} |`,
    ...rows.map((row) => `| ${row.join(" | ")} |`),
  ].join("\n");
}

function tokenTable(vars: Record<string, string>, rows: Row[]): string {
  return table(
    ["Property", "Token", "Value"],
    rows.map(([label, token]) => [label, `\`${token}\``, `\`${vars[token] ?? ""}\``]),
  );
}

function esc(value: string): string {
  return value.replace(/\|/g, "\\|");
}

/** Resolve the face used by a configuration, including uploaded families. */
export function configFontStack(
  config: StudioConfig,
  meta: DesignDocMeta = {},
): string {
  return meta.fontStack || FONT_STACKS[config.font as keyof typeof FONT_STACKS] || FONT_STACKS.vazirmatn;
}

function fontLabel(config: StudioConfig): string {
  const builtin = FONTS.find((font) => font.id === config.font);
  return builtin ? `«${builtin.label}»` : "custom uploaded face";
}

function shadowLabel(config: StudioConfig): string {
  if (config.shadow === "style") {
    return `follows the \`${config.styleId}\` preset`;
  }
  const shadow = SHADOWS.find((item) => item.id === config.shadow);
  return shadow ? `\`${shadow.id}\` («${shadow.label}»)` : `\`${config.shadow}\``;
}

/** What this request changed on top of the style preset it started from. */
function customizationLines(config: StudioConfig): string[] {
  const style = STYLES.find((item) => item.id === config.styleId);
  if (!style) return [];

  const baseline = paletteForStyle(config.styleId);
  const preset = createThemePresets[config.styleId];
  const lines: string[] = [];

  if (config.palette.base !== baseline.base) {
    lines.push(`- **Palette:** \`${baseline.base}\` → \`${config.palette.base}\``);
  }

  for (const role of ROLE_IDS) {
    const before = baseline.colors[role];
    const after = config.palette.colors[role];
    if (before !== after) {
      lines.push(`- **${role} role:** \`${before}\` → \`${after}\``);
    }
  }

  for (const [token, hex] of Object.entries(config.palette.overrides)) {
    if (!hex) continue;
    const definition = COLOR_TOKENS.find(
      (item) => item.id === (token as PaletteNeutralId | PaletteChartId),
    );
    const name = definition?.token ?? `--cc-${token}`;
    lines.push(`- **\`${name}\`:** overridden to \`${hex}\``);
  }

  const presetRadius = preset.tokens.radius ?? 4;
  if (config.radius !== presetRadius) {
    lines.push(`- **Corner radius:** \`${presetRadius}px\` → \`${config.radius}px\``);
  }

  if (config.shadow !== DEFAULT_SHADOW) {
    const shadow = SHADOWS.find((item) => item.id === config.shadow);
    lines.push(
      `- **Shadow:** \`${DEFAULT_SHADOW}\` → \`${config.shadow}\`${shadow ? ` («${shadow.label}»)` : ""}`,
    );
  }

  const presetFont = STYLE_FONTS[config.styleId];
  if (config.font !== presetFont) {
    lines.push(`- **Font:** \`${presetFont}\` → \`${config.font}\` ${fontLabel(config)}`);
  }

  if (config.iconLibrary !== DEFAULT_STUDIO_CONFIG.iconLibrary) {
    lines.push(`- **Icon library:** \`${DEFAULT_STUDIO_CONFIG.iconLibrary}\` → \`${config.iconLibrary}\``);
  }

  const iconStyle = config.iconStyle;
  const base = DEFAULT_ICON_STYLE;
  if (iconStyle.size !== base.size) {
    lines.push(`- **Icon size:** \`${base.size}\` → \`${iconStyle.size}\``);
  }
  if (iconStyle.weight !== base.weight) {
    lines.push(`- **Icon weight:** \`${base.weight}\` → \`${iconStyle.weight}\``);
  }
  if (iconStyle.tone !== base.tone) {
    lines.push(`- **Icon tone:** \`${base.tone}\` → \`${iconStyle.tone}\``);
  }

  return lines;
}

/** The full English `design.md` for a studio configuration. */
export function designDocForConfig(
  config: StudioConfig,
  meta: DesignDocMeta = {},
): string {
  const style = STYLES.find((item) => item.id === config.styleId);
  if (!style) throw new Error(`Unknown studio style: ${config.styleId}`);

  const preset = createThemePresets[config.styleId];
  const fontStack = configFontStack(config, meta);
  const theme = buildStudioTheme({
    style: config.styleId,
    palette: config.palette,
    radius: config.radius,
    fontStack,
    iconStyle: config.iconStyle,
    shadow: config.shadow,
  });
  const vars = themeToCssVars(theme) as Record<string, string>;

  const roles = ROLE_IDS.map((role) => COLOR_TOKENS.find((t) => t.id === role))
    .filter((token) => token !== undefined)
    .map((token) => [
      token.id,
      `\`${token.token}\``,
      `\`${vars[token.token] ?? ""}\``,
      ROLE_USE[token.id as PaletteRoleId],
    ]);

  const cssVars = Object.entries(vars)
    .map(([token, value]) => `  ${token}: ${value};`)
    .join("\n");

  const customizations = customizationLines(config);
  const requestBits = [
    meta.requester ? `a contact request by **${esc(meta.requester)}**` : "",
    meta.business ? ` — ${esc(meta.business)}` : "",
  ]
    .filter(Boolean)
    .join("");

  return `# Design guide — ${config.styleId} («${style.label}»)

> A complete, English design-language snapshot: resolved colours, shape, type, motion and icon tokens for this configuration.

Generated from ${requestBits || "the Kodelogy studio configuration"}${meta.submittedAt ? ` on ${meta.submittedAt}` : ""}. Every value below is a \`--cc-*\` CSS custom property resolved by the studio's \`buildStudioTheme\`; copying the token block into \`:root\` reproduces the same design language anywhere.

- **Style:** \`${config.styleId}\` — «${style.label}»
- **Mode:** ${preset.tone === "dark" ? "dark" : "light"}
- **Palette:** \`${config.palette.base}\` — «${paletteLabel(config.palette)}»
- **Corner radius:** ${config.radius}px
- **Shadow:** ${shadowLabel(config)}
- **Font:** ${fontLabel(config)} — \`${fontStack}\`
- **Icons:** \`${config.iconLibrary}\` — size \`${config.iconStyle.size}\`, weight \`${config.iconStyle.weight}\`, tone \`${config.iconStyle.tone}\`
- **Overrides:** ${customizations.length > 0 ? `${customizations.length} difference${customizations.length === 1 ? "" : "s"} from the preset` : "none — matches the preset"}

## Color roles

${table(["Role", "Token", "Value", "Use"], roles)}

## Neutrals

${tokenTable(vars, NEUTRALS)}

## Charts

${tokenTable(vars, CHARTS)}

## Shape, shadow and motion

${tokenTable(vars, SHAPE)}

## Typography

${tokenTable(vars, TYPOGRAPHY)}

## Icons

${tokenTable(vars, ICONS)}

## Customizations

${customizations.length > 0 ? customizations.join("\n") : `No overrides: this configuration uses the \`${config.styleId}\` preset exactly as published.`}

## Token reference

\`\`\`css
:root {
${cssVars}
}
\`\`\`
`;
}

/** The preset baseline for one built-in style (no request behind it). */
export function designDocForStyle(styleId: StyleId): string {
  const preset = createThemePresets[styleId];
  if (!preset) throw new Error(`Unknown studio style: ${styleId}`);

  return designDocForConfig({
    archetype: "landing",
    styleId,
    palette: paletteForStyle(styleId),
    radius: preset.tokens.radius ?? 4,
    shadow: DEFAULT_SHADOW,
    font: STYLE_FONTS[styleId],
    iconLibrary: DEFAULT_STUDIO_CONFIG.iconLibrary,
    iconStyle: DEFAULT_ICON_STYLE,
  });
}

/** Stack of an uploaded face carried by a hand-off wrapper, when present. */
function handoffFontStack(payload: unknown): string | undefined {
  if (!isRecord(payload)) return undefined;
  const wrapper = isRecord(payload.config)
    ? payload
    : isRecord(payload.studioConfig)
      ? payload.studioConfig
      : null;
  if (!wrapper || !isRecord(wrapper.font)) return undefined;
  return typeof wrapper.font.stack === "string" ? wrapper.font.stack : undefined;
}

/**
 * Build the document for one contact request from the JSONB the console
 * stores (the hand-off wrapper, the console export envelope or a bare config).
 * Returns `null` instead of throwing when the payload is not a configuration.
 */
export function designDocForSubmission(
  payload: unknown,
  meta: DesignDocMeta = {},
): string | null {
  const candidate = unwrapConfig(payload);
  if (!candidate || !STYLES.some((style) => style.id === candidate.styleId)) {
    return null;
  }
  const config = parseStudioConfig(candidate);
  if (!config) return null;

  return designDocForConfig(config, {
    ...meta,
    fontStack: meta.fontStack ?? handoffFontStack(payload),
  });
}
