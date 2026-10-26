import { describe, expect, it } from "vitest";
import {
  buildStudioHandoff,
  parseStudioConfigPayload,
} from "@/components/create-studio-handoff";
import { DEFAULT_STUDIO_CONFIG } from "@/components/create-studio-store";

/**
 * The console downloads a submission as `{ applicant, studioConfig: handoff }`.
 * That file used to be rejected by the studio's import dialog; every shape the
 * site produces must round-trip.
 */
describe("parseStudioConfigPayload", () => {
  const handoff = buildStudioHandoff(DEFAULT_STUDIO_CONFIG);

  it("accepts the studio hand-off wrapper", () => {
    const result = parseStudioConfigPayload(JSON.stringify(handoff));
    expect(result.status).toBe("ok");
    if (result.status === "ok") {
      expect(result.config.styleId).toBe(DEFAULT_STUDIO_CONFIG.styleId);
    }
  });

  it("accepts the console's submission export", () => {
    const downloaded = {
      exportedAt: "2026-01-01T00:00:00.000Z",
      applicant: { name: "نمونه", contact: "test@example.com", business: "" },
      studioStatus: "customized",
      designChoice: "studio",
      studioConfig: handoff,
    };
    const result = parseStudioConfigPayload(JSON.stringify(downloaded));
    expect(result.status).toBe("ok");
    if (result.status === "ok") {
      expect(result.config).toEqual(handoff.config);
    }
  });

  it("accepts a bare configuration", () => {
    const result = parseStudioConfigPayload(
      JSON.stringify(DEFAULT_STUDIO_CONFIG),
    );
    expect(result.status).toBe("ok");
  });

  it("rejects anything else", () => {
    expect(parseStudioConfigPayload(":root { --cc-primary: red; }").status).toBe(
      "error",
    );
    expect(parseStudioConfigPayload('{"studioConfig": null}').status).toBe(
      "error",
    );
    expect(parseStudioConfigPayload("{}").status).toBe("error");
  });
});
