import { describe, expect, it } from "vitest";
import {
  designDocForConfig,
  designDocForStyle,
  designDocForSubmission,
} from "@/components/create-studio-design-doc";
import {
  DEFAULT_ICON_STYLE,
  DEFAULT_SHADOW,
  STYLES,
} from "@/components/create-studio-config";
import { paletteForStyle } from "@/components/create-studio-palette";
import { buildStudioHandoff } from "@/components/create-studio-handoff";
import {
  DEFAULT_STUDIO_CONFIG,
  type StudioConfig,
} from "@/components/create-studio-store";

/** A configuration that touches every dimension the sidebar exposes. */
function tunedConfig(): StudioConfig {
  const base = paletteForStyle("terminal");
  return {
    ...DEFAULT_STUDIO_CONFIG,
    styleId: "terminal",
    palette: {
      ...base,
      base: "iris-pink",
      colors: { ...base.colors, primary: "#ff0055" },
      overrides: { ...base.overrides, background: "#101820" },
    },
    radius: 6,
    shadow: "glow",
    font: "gandom",
    iconLibrary: "tabler",
    iconStyle: { ...DEFAULT_ICON_STYLE, size: "sm", weight: "bold" },
  };
}

describe("designDocForStyle", () => {
  it.each(STYLES.map((style) => [style.id, style.label] as const))(
    "documents %s in English with its palette and token map",
    (styleId, label) => {
      const doc = designDocForStyle(styleId);
      const palette = paletteForStyle(styleId);

      expect(doc.startsWith(`# Design guide — ${styleId} («${label}»)`)).toBe(
        true,
      );
      expect(doc).toContain("## Color roles");
      expect(doc).toContain("## Token reference");
      expect(doc).toContain("--cc-primary");
      expect(doc).toContain(`\`${palette.colors.primary}\``);
      expect(doc).toContain("No overrides");
      expect(doc).toContain("```css");
      expect(doc.trimEnd().endsWith("```")).toBe(true);
      expect(doc).not.toContain("راهنمای طراحی");
    },
  );

  it("names the preset shadow as the baseline", () => {
    expect(designDocForStyle("corporate")).toContain(
      `follows the \`corporate\` preset`,
    );
    expect(DEFAULT_SHADOW).toBe("style");
  });
});

describe("designDocForConfig", () => {
  it("documents the visitor's own customizations", () => {
    const doc = designDocForConfig(tunedConfig(), {
      requester: "Sara",
      business: "Atelier North",
      submittedAt: "2026-10-26T12:00:00.000Z",
    });

    expect(doc).toContain("Sara");
    expect(doc).toContain("Atelier North");
    expect(doc).toContain("```css");
    // Resolved tokens, not the preset values.
    expect(doc).toContain("`#ff0055`");
    expect(doc).toContain("`#101820`");
    expect(doc).toContain("6px");
    expect(doc).toContain("`glow`");
    expect(doc).toContain("'Gandom'");
    expect(doc).toContain("`tabler`");
    // The diff list names what changed.
    expect(doc).toContain("## Customizations");
    expect(doc).toContain("**primary role:**");
    expect(doc).toContain("**Corner radius:**");
    expect(doc).toContain("**Shadow:**");
    expect(doc).toContain("**Font:**");
    expect(doc).toContain("**Icon library:**");
  });

  it("uses the stored stack for an uploaded face", () => {
    const doc = designDocForConfig(
      { ...tunedConfig(), font: "custom-abc" },
      { fontStack: '"Atelier Face", sans-serif' },
    );
    expect(doc).toContain('"Atelier Face", sans-serif');
    expect(doc).toContain("custom uploaded face");
  });
});

describe("designDocForSubmission", () => {
  const handoff = buildStudioHandoff(tunedConfig());

  it("builds the document from a hand-off wrapper", () => {
    const doc = designDocForSubmission(handoff, { requester: "Sara" });
    expect(doc).not.toBeNull();
    expect(doc).toContain("# Design guide — terminal");
    expect(doc).toContain("`#ff0055`");
    expect(doc).toContain("Sara");
  });

  it("accepts the console's submission envelope", () => {
    const downloaded = {
      exportedAt: "2026-10-26T12:00:00.000Z",
      applicant: { name: "Sara", contact: "s@example.com", business: "" },
      studioStatus: "customized",
      designChoice: "studio",
      studioConfig: handoff,
    };
    const doc = designDocForSubmission(downloaded);
    expect(doc).toContain("`#ff0055`");
    expect(doc).toContain("```css");
  });

  it("rejects payloads that are not configurations", () => {
    expect(designDocForSubmission({})).toBeNull();
    expect(designDocForSubmission(null)).toBeNull();
    expect(
      designDocForSubmission({ studioConfig: null, designChoice: "delegated" }),
    ).toBeNull();
  });
});
