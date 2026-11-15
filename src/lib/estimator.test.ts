import { describe, expect, it } from "vitest";
import {
  DEFAULT_ESTIMATOR,
  buildEstimate,
  cloneEstimatorConfig,
  optionsForType,
  sanitizeEstimatorConfig,
  timingsForType,
  validateEstimatorDraft,
  type EstimatorConfig,
} from "./estimator";

/** The console always sends a full config; tests build one from the defaults. */
function draft(patch: (config: EstimatorConfig) => void): EstimatorConfig {
  const config = cloneEstimatorConfig(DEFAULT_ESTIMATOR);
  patch(config);
  return config;
}

describe("estimator pricing", () => {
  it("prices the shipped defaults exactly as the home page always did", () => {
    const estimate = buildEstimate(DEFAULT_ESTIMATOR, {
      typeId: "landing",
      timingId: "standard",
      optionIds: ["cms", "support"],
    });

    expect(estimate).not.toBeNull();
    expect(estimate?.typeTitle).toBe("لندینگ‌پیج معرفی و تبلیغاتی");
    expect(estimate?.min).toBe("3");
    expect(estimate?.max).toBe("4");
    expect(estimate?.addonsCount).toBe(2);
    expect(estimate?.options.map((option) => option.label)).toEqual([
      "پنل مدیریت محتوای (وبلاگ اختصاصی)",
      "پشتیبانی و مراقبت ۶ ماهه",
    ]);
  });

  it("keeps a waived surcharge out of the price and charges a real one", () => {
    const waived = buildEstimate(DEFAULT_ESTIMATOR, {
      typeId: "landing",
      timingId: "fast",
      optionIds: [],
    });
    expect(waived?.min).toBe("1");
    expect(waived?.max).toBe("2");

    const charged = draft((config) => {
      const fast = config.timings.find((timing) => timing.id === "fast");
      if (fast) fast.waived = false;
    });
    const priced = buildEstimate(charged, {
      typeId: "landing",
      timingId: "fast",
      optionIds: [],
    });
    expect(priced?.min).toBe("1.1");
    expect(priced?.max).toBe("2.2");
  });

  it("drops an option the console removed and offers nothing stale", () => {
    const removed = draft((config) => {
      config.options = config.options.filter((option) => option.id !== "cms");
    });

    expect(optionsForType(removed, "landing").map((option) => option.id)).toEqual([
      "support",
      "motion",
    ]);

    // A selection that still carries the removed id cannot be priced with it.
    const estimate = buildEstimate(removed, {
      typeId: "landing",
      timingId: "standard",
      optionIds: ["cms", "support"],
    });
    expect(estimate?.addonsCount).toBe(1);
    expect(estimate?.min).toBe("2");
    expect(estimate?.max).toBe("3");
  });

  it("prices an option the console added", () => {
    const added = draft((config) => {
      config.options.push({
        id: "seo",
        label: "سئوی پایه",
        price: 1.5,
        struckPrice: 0,
        appliesTo: ["landing"],
        active: true,
      });
    });

    expect(optionsForType(added, "landing").map((option) => option.id)).toContain(
      "seo",
    );
    const estimate = buildEstimate(added, {
      typeId: "landing",
      timingId: "standard",
      optionIds: ["seo"],
    });
    expect(estimate?.min).toBe("2.5");
    expect(estimate?.max).toBe("3.5");
  });

  it("hides the whole estimator when the console removes every type", () => {
    const empty = draft((config) => {
      config.projectTypes = [];
    });
    expect(
      buildEstimate(empty, { typeId: "landing", timingId: "standard", optionIds: [] }),
    ).toBeNull();
  });

  it("honours a timing scoped to one project type", () => {
    expect(timingsForType(DEFAULT_ESTIMATOR, "landing").map((t) => t.id)).toEqual([
      "standard",
      "fast",
      "urgent",
    ]);
    expect(timingsForType(DEFAULT_ESTIMATOR, "ecommerce").map((t) => t.id)).toEqual([
      "standard",
      "fast",
    ]);
    expect(optionsForType(DEFAULT_ESTIMATOR, "wordpress").map((o) => o.id)).toEqual([
      "cms",
      "support",
      "payportal",
    ]);
  });
});

describe("estimator config", () => {
  it("falls back to the defaults for missing or unusable data", () => {
    expect(sanitizeEstimatorConfig(undefined)).toEqual(DEFAULT_ESTIMATOR);
    expect(sanitizeEstimatorConfig({ projectTypes: "nope" })).toEqual(
      DEFAULT_ESTIMATOR,
    );
    expect(
      sanitizeEstimatorConfig({ projectTypes: [{ label: "" }] }),
    ).toEqual(DEFAULT_ESTIMATOR);
  });

  it("respects a deliberately emptied catalogue", () => {
    const sanitized = sanitizeEstimatorConfig({
      projectTypes: [],
      timings: [],
      options: [],
    });
    expect(sanitized.projectTypes).toEqual([]);
  });

  it("repairs numbers and drops references to deleted types", () => {
    const sanitized = sanitizeEstimatorConfig({
      projectTypes: [
        { id: "shop", label: "فروشگاه", min: -2, max: "4", active: true },
      ],
      timings: [
        {
          id: "fast",
          label: "سریع",
          timeline: "۵ روز",
          surchargePercent: 250,
          waived: false,
          appliesTo: ["shop", "gone"],
          active: true,
        },
      ],
      options: [
        { id: "seo", label: "سئو", price: "2", appliesTo: ["gone"], active: true },
      ],
    });

    expect(sanitized.projectTypes[0]).toMatchObject({ min: 0, max: 4 });
    expect(sanitized.timings[0].surchargePercent).toBe(100);
    expect(sanitized.timings[0].appliesTo).toEqual(["shop"]);
    // Its only target is gone, so it reads as "every type" instead of nothing.
    expect(sanitized.options[0].appliesTo).toEqual([]);
    expect(sanitized.options[0].price).toBe(2);
  });

  it("refuses a draft the public page could not render", () => {
    expect(
      validateEstimatorDraft({
        projectTypes: [{ id: "shop", label: "فروشگاه", min: 5, max: 2 }],
        timings: [],
        options: [],
      }),
    ).toContain("در «فروشگاه» کف قیمت از سقف بیشتر است.");

    expect(
      validateEstimatorDraft({
        projectTypes: [{ id: "shop", label: "فروشگاه", min: 1, max: 2 }],
        timings: [],
        options: [],
      }),
    ).toContain(
      "هیچ زمان‌بندی فعالی وجود ندارد؛ برای هر نوع پروژه یک بازهٔ تحویل لازم است.",
    );

    expect(validateEstimatorDraft(DEFAULT_ESTIMATOR)).toEqual([]);
  });
});
