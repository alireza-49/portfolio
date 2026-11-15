/**
 * The home-page estimator is data, not markup.
 *
 * The console edits one config in `estimator_settings.config`; this module is
 * the only place its shape, its defaults and its price math live. The estimator
 * on the home page, the `estimate` payload the contact form posts and the
 * console previews all call the same functions, so adding an option in the
 * console cannot drift from what the visitor sees or what the inbox receives.
 *
 * Prices are million toman. `appliesTo` lists project-type ids, and an empty
 * list means "every type", so a newly added type keeps working with the shared
 * timings and options without a second edit.
 */

export type EstimatorProjectType = {
  id: string;
  label: string;
  min: number;
  max: number;
  active: boolean;
};

export type EstimatorTiming = {
  id: string;
  label: string;
  timeline: string;
  /** Advertised rush surcharge, in percent. */
  surchargePercent: number;
  /** `true` waives the surcharge: it is shown struck through and priced at 0. */
  waived: boolean;
  note: string;
  appliesTo: string[];
  active: boolean;
};

export type EstimatorOption = {
  id: string;
  label: string;
  /** Added to the project's base range when selected, in million toman. */
  price: number;
  /** Was-price shown struck through; `0` hides it. */
  struckPrice: number;
  appliesTo: string[];
  active: boolean;
};

export type EstimatorConfig = {
  projectTypes: EstimatorProjectType[];
  timings: EstimatorTiming[];
  options: EstimatorOption[];
};

export type EstimateSelection = {
  typeId: string;
  timingId: string;
  optionIds: string[];
};

/** The exact shape the contact form posts as `estimate` and the inbox reads. */
export type Estimate = {
  typeId: string;
  typeTitle: string;
  timingId: string;
  timingLabel: string;
  timeline: string;
  min: string;
  max: string;
  addonsCount: number;
  options: { id: string; label: string; price: number }[];
};

export const DEFAULT_ESTIMATOR: EstimatorConfig = {
  projectTypes: [
    {
      id: "landing",
      label: "لندینگ‌پیج معرفی و تبلیغاتی",
      min: 1,
      max: 2,
      active: true,
    },
    {
      id: "wordpress",
      label: "سایت وردپرسی و قالب آماده",
      min: 2,
      max: 3,
      active: true,
    },
    {
      id: "ecommerce",
      label: "آنلاین شاپ (همراه با صفحه معرفی و لندینگ رایگان)",
      min: 5,
      max: 7,
      active: true,
    },
    {
      id: "webapp",
      label:
        "اپلیکیشن بر پایه وب / داشبورد مدیریتی (همراه با صفحه معرفی و لندینگ رایگان)",
      min: 6,
      max: 8,
      active: true,
    },
  ],
  timings: [
    {
      id: "standard",
      label: "عادی (۱۰ تا ۱۴ روز)",
      timeline: "۱۰ تا ۱۴ روز کاری",
      surchargePercent: 0,
      waived: false,
      note: "بدون هزینه اضافه",
      appliesTo: [],
      active: true,
    },
    {
      id: "fast",
      label: "سریع (۵ تا ۷ روز)",
      timeline: "۵ تا ۷ روز کاری (شتاب‌یافته)",
      surchargePercent: 10,
      waived: true,
      note: "",
      appliesTo: ["landing", "wordpress", "ecommerce", "webapp"],
      active: true,
    },
    {
      id: "urgent",
      label: "فوری (۳ تا ۵ روز)",
      timeline: "۳ تا ۵ روز کاری (تحویل فوری)",
      surchargePercent: 15,
      waived: true,
      note: "",
      appliesTo: ["landing"],
      active: true,
    },
  ],
  options: [
    {
      id: "cms",
      label: "پنل مدیریت محتوای (وبلاگ اختصاصی)",
      price: 1,
      struckPrice: 0,
      appliesTo: [],
      active: true,
    },
    {
      id: "support",
      label: "پشتیبانی و مراقبت ۶ ماهه",
      price: 1,
      struckPrice: 0,
      appliesTo: [],
      active: true,
    },
    {
      id: "motion",
      label: "انیمیشن‌های اضافه",
      price: 0,
      struckPrice: 0.5,
      appliesTo: ["landing", "ecommerce", "webapp"],
      active: true,
    },
    {
      id: "payportal",
      label: "پرتال پرداخت",
      price: 0,
      struckPrice: 0,
      appliesTo: ["wordpress", "ecommerce"],
      active: true,
    },
  ],
};

const ID_SHAPE = /^[a-z0-9][a-z0-9-]{0,39}$/;
const MAX_AMOUNT = 10_000;

function asText(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

/** A non-negative, finite amount rounded to one decimal (0.5 m.ت is real). */
function asAmount(value: unknown, fallback = 0): number {
  const parsed = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) return fallback;
  return Math.min(MAX_AMOUNT, Math.round(parsed * 10) / 10);
}

function asPercent(value: unknown): number {
  const parsed = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) return 0;
  return Math.min(100, Math.round(parsed));
}

function asList(value: unknown): Record<string, unknown>[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (entry): entry is Record<string, unknown> =>
      Boolean(entry) && typeof entry === "object" && !Array.isArray(entry),
  );
}

function asScope(value: unknown, typeIds: Set<string>): string[] {
  if (!Array.isArray(value)) return [];
  const kept = new Set<string>();
  for (const item of value) {
    if (typeof item === "string" && typeIds.has(item)) kept.add(item);
  }
  return [...kept];
}

/** A stable, URL-safe id, deduplicated against the ids already in this list. */
function takeId(
  raw: unknown,
  prefix: string,
  index: number,
  used: Set<string>,
): string {
  const wanted = asText(raw, 40);
  const base = ID_SHAPE.test(wanted) ? wanted : `${prefix}-${index + 1}`;
  let id = base;
  let suffix = 2;
  while (used.has(id)) {
    id = `${base}-${suffix}`;
    suffix += 1;
  }
  used.add(id);
  return id;
}

export function cloneEstimatorConfig(config: EstimatorConfig): EstimatorConfig {
  return {
    projectTypes: config.projectTypes.map((type) => ({ ...type })),
    timings: config.timings.map((timing) => ({
      ...timing,
      appliesTo: [...timing.appliesTo],
    })),
    options: config.options.map((option) => ({
      ...option,
      appliesTo: [...option.appliesTo],
    })),
  };
}

/**
 * Reads whatever is stored (or posted) and returns a config the estimator can
 * render. Missing or unusable data falls back to the defaults; an explicitly
 * emptied list is respected, because that is how the owner takes the estimator
 * off the home page.
 */
export function sanitizeEstimatorConfig(value: unknown): EstimatorConfig {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return cloneEstimatorConfig(DEFAULT_ESTIMATOR);
  }
  const record = value as Record<string, unknown>;
  if (!Array.isArray(record.projectTypes)) {
    return cloneEstimatorConfig(DEFAULT_ESTIMATOR);
  }

  const usedTypeIds = new Set<string>();
  const projectTypes: EstimatorProjectType[] = [];
  for (const row of asList(record.projectTypes)) {
    const label = asText(row.label, 140);
    if (!label) continue;
    const id = takeId(row.id, "type", projectTypes.length, usedTypeIds);
    const min = asAmount(row.min);
    const max = Math.max(min, asAmount(row.max));
    projectTypes.push({
      id,
      label,
      min,
      max,
      active: row.active !== false,
    });
  }

  // A row with types but none of them usable is corrupt, not "no types".
  if (projectTypes.length === 0 && asList(record.projectTypes).length > 0) {
    return cloneEstimatorConfig(DEFAULT_ESTIMATOR);
  }

  const typeIds = new Set(projectTypes.map((type) => type.id));

  const usedTimingIds = new Set<string>();
  const timings: EstimatorTiming[] = [];
  for (const row of asList(record.timings)) {
    const label = asText(row.label, 80);
    const timeline = asText(row.timeline, 160);
    if (!label || !timeline) continue;
    const id = takeId(row.id, "time", timings.length, usedTimingIds);
    timings.push({
      id,
      label,
      timeline,
      surchargePercent: asPercent(row.surchargePercent),
      waived: row.waived === true,
      note: asText(row.note, 120),
      appliesTo: asScope(row.appliesTo, typeIds),
      active: row.active !== false,
    });
  }

  const usedOptionIds = new Set<string>();
  const options: EstimatorOption[] = [];
  for (const row of asList(record.options)) {
    const label = asText(row.label, 160);
    if (!label) continue;
    const id = takeId(row.id, "opt", options.length, usedOptionIds);
    options.push({
      id,
      label,
      price: asAmount(row.price),
      struckPrice: asAmount(row.struckPrice),
      appliesTo: asScope(row.appliesTo, typeIds),
      active: row.active !== false,
    });
  }

  return { projectTypes, timings, options };
}

/**
 * Persian messages for the console. Empty array = the draft can be saved.
 * The estimator hides itself when nothing is active, so the owner is told that
 * instead of silently losing the section.
 */
export function validateEstimatorDraft(value: unknown): string[] {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return ["ساختار تنظیمات برآوردگر خوانده نشد."];
  }
  const record = value as Record<string, unknown>;
  if (!Array.isArray(record.projectTypes)) {
    return ["فهرست نوع پروژه‌ها خوانده نشد."];
  }

  const problems: string[] = [];
  const typeRows = asList(record.projectTypes);
  if (typeRows.length === 0) {
    problems.push(
      "حداقل یک نوع پروژه لازم است؛ با حذف همه، برآوردگر از صفحهٔ اصلی حذف می‌شود.",
    );
  }

  const typeIds = new Set<string>();
  typeRows.forEach((row, index) => {
    const label = asText(row.label, 140);
    const name = label || `ردیف ${index + 1}`;
    const id = asText(row.id, 40);
    if (!ID_SHAPE.test(id)) {
      problems.push(`شناسهٔ نوع پروژهٔ «${name}» معتبر نیست.`);
    } else if (typeIds.has(id)) {
      problems.push(`شناسهٔ نوع پروژهٔ «${name}» تکراری است.`);
    } else {
      typeIds.add(id);
    }
    if (!label) problems.push(`نوع پروژهٔ ردیف ${index + 1} نام ندارد.`);
    const min = asAmount(row.min);
    const max = asAmount(row.max);
    if (min > max) {
      problems.push(`در «${name}» کف قیمت از سقف بیشتر است.`);
    }
  });

  if (
    typeRows.length > 0 &&
    !typeRows.some((row) => row.active !== false && asText(row.label, 140))
  ) {
    problems.push(
      "هیچ نوع پروژهٔ فعالی نمانده است؛ برآوردگر در صفحهٔ اصلی نمایش داده نمی‌شود.",
    );
  }

  const usedTimingIds = new Set<string>();
  asList(record.timings).forEach((row, index) => {
    const label = asText(row.label, 80);
    const name = label || `ردیف ${index + 1}`;
    const id = asText(row.id, 40);
    if (!ID_SHAPE.test(id)) {
      problems.push(`شناسهٔ زمان‌بندی «${name}» معتبر نیست.`);
    } else if (usedTimingIds.has(id)) {
      problems.push(`شناسهٔ زمان‌بندی «${name}» تکراری است.`);
    } else {
      usedTimingIds.add(id);
    }
    if (!label) problems.push(`زمان‌بندی ردیف ${index + 1} عنوان ندارد.`);
    if (!asText(row.timeline, 160)) {
      problems.push(`برای زمان‌بندی «${name}» مدت تحویل نوشته نشده است.`);
    }
    const percent = Number(row.surchargePercent ?? 0);
    if (!Number.isFinite(percent) || percent < 0 || percent > 100) {
      problems.push(`درصد زمان‌بندی «${name}» باید عددی بین ۰ و ۱۰۰ باشد.`);
    }
    if (Array.isArray(row.appliesTo)) {
      for (const scope of row.appliesTo) {
        if (typeof scope !== "string" || !typeIds.has(scope)) {
          problems.push(
            `زمان‌بندی «${name}» به نوع پروژه‌ای وصل است که وجود ندارد.`,
          );
          break;
        }
      }
    }
  });

  const usedOptionIds = new Set<string>();
  asList(record.options).forEach((row, index) => {
    const label = asText(row.label, 160);
    const name = label || `ردیف ${index + 1}`;
    const id = asText(row.id, 40);
    if (!ID_SHAPE.test(id)) {
      problems.push(`شناسهٔ امکان «${name}» معتبر نیست.`);
    } else if (usedOptionIds.has(id)) {
      problems.push(`شناسهٔ امکان «${name}» تکراری است.`);
    } else {
      usedOptionIds.add(id);
    }
    if (!label) problems.push(`امکان اضافهٔ ردیف ${index + 1} عنوان ندارد.`);
    const price = Number(row.price);
    if (!Number.isFinite(price) || price < 0) {
      problems.push(`قیمت امکان «${name}» باید عددی صفر یا بیشتر باشد.`);
    }
    const struck = Number(row.struckPrice ?? 0);
    if (!Number.isFinite(struck) || struck < 0) {
      problems.push(`قیمت خط‌خوردهٔ «${name}» باید عددی صفر یا بیشتر باشد.`);
    }
    if (Array.isArray(row.appliesTo)) {
      for (const scope of row.appliesTo) {
        if (typeof scope !== "string" || !typeIds.has(scope)) {
          problems.push(`امکان «${name}» به نوع پروژه‌ای وصل است که وجود ندارد.`);
          break;
        }
      }
    }
  });

  const activeTypes = typeRows.filter(
    (row) => row.active !== false && asText(row.label, 140),
  );
  const activeTimings = asList(record.timings).filter(
    (row) => row.active !== false && asText(row.label, 80),
  );
  if (activeTypes.length > 0 && activeTimings.length === 0) {
    problems.push(
      "هیچ زمان‌بندی فعالی وجود ندارد؛ برای هر نوع پروژه یک بازهٔ تحویل لازم است.",
    );
  }

  return problems;
}

function applies(scope: string[], typeId: string): boolean {
  return scope.length === 0 || scope.includes(typeId);
}

export function activeProjectTypes(
  config: EstimatorConfig,
): EstimatorProjectType[] {
  return config.projectTypes.filter((type) => type.active);
}

export function timingsForType(
  config: EstimatorConfig,
  typeId: string,
): EstimatorTiming[] {
  return config.timings.filter(
    (timing) => timing.active && applies(timing.appliesTo, typeId),
  );
}

export function optionsForType(
  config: EstimatorConfig,
  typeId: string,
): EstimatorOption[] {
  return config.options.filter(
    (option) => option.active && applies(option.appliesTo, typeId),
  );
}

/** `2` and `0.5` read as themselves; anything else is rounded to one decimal. */
export function formatPrice(value: number): string {
  const rounded = Math.round(value * 10) / 10;
  return String(rounded);
}

/**
 * The single price rule. Base range + selected options, then the timing's
 * surcharge unless it is waived. Returns `null` when the type is gone, so a
 * stale selection can never be priced as something else.
 */
export function buildEstimate(
  config: EstimatorConfig,
  selection: EstimateSelection,
): Estimate | null {
  const type = activeProjectTypes(config).find(
    (entry) => entry.id === selection.typeId,
  );
  if (!type) return null;

  const timings = timingsForType(config, type.id);
  const timing =
    timings.find((entry) => entry.id === selection.timingId) ??
    timings[0] ??
    null;

  const available = optionsForType(config, type.id);
  const chosen = available.filter((option) =>
    selection.optionIds.includes(option.id),
  );
  const extra = chosen.reduce((sum, option) => sum + option.price, 0);
  const factor =
    timing && !timing.waived ? 1 + timing.surchargePercent / 100 : 1;

  return {
    typeId: type.id,
    typeTitle: type.label,
    timingId: timing?.id ?? "",
    timingLabel: timing?.label ?? "",
    timeline: timing?.timeline ?? "",
    min: formatPrice(type.min * factor + extra),
    max: formatPrice(type.max * factor + extra),
    addonsCount: chosen.length,
    options: chosen.map((option) => ({
      id: option.id,
      label: option.label,
      price: option.price,
    })),
  };
}

/**
 * Labels of the options in a stored estimate (the inbox JSONB is untrusted).
 * Old submissions that predate options simply return an empty list.
 */
export function estimateOptionLabels(value: unknown): string[] {
  if (!value || typeof value !== "object") return [];
  const options = (value as Record<string, unknown>).options;
  if (!Array.isArray(options)) return [];
  const labels: string[] = [];
  for (const entry of options) {
    if (!entry || typeof entry !== "object") continue;
    const label = (entry as Record<string, unknown>).label;
    if (typeof label === "string" && label.trim()) labels.push(label.trim());
  }
  return labels;
}
