"use client";

import {
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type FormEvent,
} from "react";
import Link from "next/link";
import { Calculator, Check, Info, Mail, Palette, Send } from "lucide-react";
import { cn } from "cn";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useEstimate } from "@/components/estimate-store";
import { useStudioConfig } from "@/components/create-studio-store";
import {
  STUDIO_STATUS_LABELS,
  buildStudioHandoff,
  describeStudioConfig,
  describeStudioOptions,
  studioConfigStatus,
  type StudioThemeStatus,
} from "@/components/create-studio-handoff";
import {
  getCustomFontsServerSnapshot,
  getCustomFontsSnapshot,
  subscribeCustomFonts,
} from "@/components/create-studio-custom-fonts";

const SOCIALS = [
  { href: "https://github.com", label: "GitHub" },
  { href: "https://linkedin.com", label: "LinkedIn" },
  { href: "https://instagram.com", label: "Instagram" },
];

const FIELD_CLASS =
  "h-auto rounded-sm border-[2px] border-indigo-ink bg-paper p-3 text-sm text-indigo-ink placeholder:text-indigo-ink/50 focus-visible:border-coral focus-visible:ring-2 focus-visible:ring-coral/30";

const PERSIAN_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

/** Renders Latin digits as Persian ones, with the Persian decimal separator. */
function toPersianDigits(value: string | number) {
  return String(value)
    .replace(/\d/g, (digit) => PERSIAN_DIGITS[Number(digit)])
    .replace(/\./g, "٫");
}

/** Hex colours and font stacks stay machine-readable; everything else reads in Persian. */
function displayValue(value: string) {
  return /^#/.test(value) ? value : toPersianDigits(value);
}

/**
 * The theme hand-off has four presentation states: a real custom theme, the
 * studio's untouched default combination, no studio visit at all, and the
 * “choose the visual direction for me” delegation. They are told apart by the
 * card's border and badge — there is exactly one theme card on the form, so no
 * state is ever repeated in two places.
 */
type ThemeTone = "custom" | "default" | "none" | "delegated";

const THEME_CARD_TONE: Record<
  ThemeTone,
  { card: string; title: string }
> = {
  custom: { card: "border-teal-craft", title: "text-teal-craft" },
  default: { card: "border-indigo-ink", title: "text-indigo-ink" },
  none: { card: "border-indigo-ink", title: "text-indigo-ink" },
  delegated: { card: "border-coral", title: "text-coral" },
};

const STUDIO_BADGE: Record<StudioThemeStatus | "delegated", string> = {
  customized: "border-teal-craft bg-teal-light text-teal-craft",
  defaults: "border-indigo-ink bg-mustard/20 text-indigo-ink",
  none: "border-indigo-ink bg-paper-dim text-indigo-light",
  delegated: "border-coral bg-coral/10 text-coral",
};

const STUDIO_BADGE_LABEL: Record<StudioThemeStatus | "delegated", string> = {
  ...STUDIO_STATUS_LABELS,
  delegated: "انتخاب با من",
};

export function ContactSection() {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [attachStudioConfig, setAttachStudioConfig] = useState(true);
  const [delegateDesign, setDelegateDesign] = useState(false);
  const estimate = useEstimate();

  // The studio persists its configuration in localStorage; this hook paints
  // the summary after hydration and stays `null` when nobody used it yet.
  const studioConfig = useStudioConfig();
  // Uploaded faces live in IndexedDB; the server snapshot is empty, exactly
  // like on `/create`, so the prerender never mismatches.
  const customFonts = useSyncExternalStore(
    subscribeCustomFonts,
    getCustomFontsSnapshot,
    getCustomFontsServerSnapshot,
  );

  const status = studioConfigStatus(studioConfig);
  const badgeState = delegateDesign ? "delegated" : status;
  const themeTone: ThemeTone = delegateDesign
    ? "delegated"
    : status === "customized"
      ? "custom"
      : status === "defaults"
        ? "default"
        : "none";

  const studioSummary = useMemo(
    () => (studioConfig ? describeStudioConfig(studioConfig, customFonts) : []),
    [studioConfig, customFonts],
  );
  const studioOptions = useMemo(
    () => (studioConfig ? describeStudioOptions(studioConfig, customFonts) : []),
    [studioConfig, customFonts],
  );
  const optionCount = studioOptions.reduce(
    (total, group) => total + group.items.length,
    0,
  );
  // The exact payload the form carries: config + labels + resolved tokens + CSS.
  const studioHandoff = useMemo(
    () => (studioConfig ? buildStudioHandoff(studioConfig, customFonts) : null),
    [studioConfig, customFonts],
  );
  const studioSummaryText = useMemo(
    () =>
      studioOptions
        .map((group) =>
          [
            `## ${group.label}`,
            ...group.items.map((item) => `${item.label}: ${item.value}`),
          ].join("\n"),
        )
        .join("\n\n"),
    [studioOptions],
  );
  const roleSwatches =
    studioOptions.find((group) => group.id === "colors")?.items.slice(0, 5) ?? [];

  const attachSummary = Boolean(
    studioConfig && attachStudioConfig && !delegateDesign,
  );
  const attachedStyle =
    studioSummary.find((item) => item.label === "سبک")?.value ?? "";
  const attachedPalette =
    studioSummary.find((item) => item.label === "پالت")?.value ?? "";
  const attachedFont =
    studioSummary.find((item) => item.label === "فونت")?.value ?? "";

  /**
   * One sentence per state — the card never repeats “which theme is this?” in a
   * second place. The attach checkbox right below says whether it travels with
   * the message, so the sentence describes the theme, not the submission.
   */
  const themeStatusText =
    themeTone === "delegated"
      ? "انتخاب ظاهر را به من سپرده‌اید؛ پیکربندی استودیو ارسال نمی‌شود و ظاهر را بر اساس ایده و برند شما انتخاب می‌کنم."
      : status === "customized"
        ? `تم سفارشی شما از استودیو ثبت شده است: سبک «${attachedStyle}» با پالت «${attachedPalette}» و فونت «${attachedFont}».`
        : status === "defaults"
          ? `استودیو را دیده‌اید ولی ترکیب پیش‌فرض آن را نگه داشته‌اید: سبک «${attachedStyle}» با پالت «${attachedPalette}».`
          : "هنوز تمی در استودیو نساخته‌اید؛ می‌توانید خودتان بسازید یا انتخاب ظاهر را به من بسپارید.";

  const canSubmit = name.trim().length > 0 && contact.trim().length > 0;

  // The studio CTA navigates to `/#contact-section`; scroll once the home page
  // has painted so the visitor lands on the form, not the hero.
  useEffect(() => {
    if (window.location.hash !== "#contact-section") return;
    const timer = window.setTimeout(() => {
      document
        .getElementById("contact-section")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);
    return () => window.clearTimeout(timer);
  }, []);

  const scrollToEstimator = () => {
    document
      .getElementById("estimator-section")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit || sending) return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    const text = (key: string) => String(formData.get(key) ?? "").trim();
    const parseJson = (key: string): Record<string, unknown> | null => {
      const raw = formData.get(key);
      if (typeof raw !== "string" || !raw.trim()) return null;
      try {
        const parsed: unknown = JSON.parse(raw);
        return parsed && typeof parsed === "object"
          ? (parsed as Record<string, unknown>)
          : null;
      } catch {
        return null;
      }
    };

    setSending(true);
    setError(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: text("name"),
          contact: text("contact"),
          business: text("business"),
          message: text("message"),
          estimate: parseJson("estimate"),
          studioConfig: parseJson("studio-config"),
          studioSummary: text("studio-summary"),
          studioStatus: text("studio-status"),
          designChoice: text("design-choice"),
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(payload?.error || "ارسال پیام ناموفق بود.");
      }

      setSent(true);
      setName("");
      setContact("");
      // The optional fields are uncontrolled. Clearing them individually (instead
      // of `form.reset()`) keeps the controlled hidden hand-off fields intact for
      // a follow-up submission.
      const business = form.elements.namedItem("business");
      const message = form.elements.namedItem("message");
      if (business instanceof HTMLInputElement) business.value = "";
      if (message instanceof HTMLTextAreaElement) message.value = "";
      window.setTimeout(() => setSent(false), 8000);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "ارسال پیام ناموفق بود؛ لطفاً دوباره تلاش کنید.",
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <section
      id="contact-section"
      className="w-full scroll-mt-16 bg-paper px-4 py-12 sm:px-8 lg:px-12"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-10">
        <div className="flex flex-col justify-between gap-4 border-b-[2px] border-indigo-ink pb-6 sm:flex-row sm:items-end">
          <h2 className="text-[26px] font-black text-indigo-ink sm:text-[34px]">
            شروع گفتگو و هماهنگی جلسه مشاوره رایگان
          </h2>
          <div className="riso-stamp self-start text-xs font-bold sm:self-auto">
            پاسخگویی سریع در کمتر از ۲ ساعت
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="flex flex-col gap-5 lg:col-span-5">
            <p className="text-base leading-relaxed font-medium text-indigo-light">
              ایده شما در چه مرحله‌ای است؟ فرقی نمی‌کند یک ایده خام روی کاغذ باشد
              یا محصولی آماده راه‌اندازی؛ مستقیماً پیام دهید تا کم‌هزینه‌ترین و
              سریع‌ترین مسیر فنی را رایگان با هم مرور کنیم.
            </p>

            <Button
              type="button"
              variant="outline"
              onClick={scrollToEstimator}
              className="craft-btn flex h-auto w-full items-center justify-center gap-2 rounded-sm border-[2.5px] border-indigo-ink bg-paper py-3 text-sm font-black text-indigo-ink hover:bg-indigo-ink hover:text-paper"
            >
              <Calculator className="size-4" />
              <span>برآورد هزینه پروژه</span>
            </Button>

            <div className="flex flex-col gap-3">
              <Link href="https://t.me" target="_blank" rel="noopener noreferrer">
                <Card className="craft-card flex flex-row items-center justify-between gap-0 rounded-sm bg-paper-light p-3.5">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-sm bg-indigo-ink text-paper">
                      <Send className="size-5" />
                    </span>
                    <div className="flex flex-col text-right">
                      <span className="text-sm font-bold text-indigo-ink">
                        پیام مستقیم در تلگرام
                      </span>
                      <span className="text-[11px] text-indigo-light">
                        پاسخگویی سریع روزانه
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-black text-coral">پیام دهید ←</span>
                </Card>
              </Link>

              <Link href="mailto:hello@code-ecology.dev">
                <Card className="craft-card flex flex-row items-center justify-between gap-0 rounded-sm bg-paper-light p-3.5">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-sm bg-coral text-white">
                      <Mail className="size-5" />
                    </span>
                    <div className="flex flex-col text-right">
                      <span className="text-sm font-bold text-indigo-ink">
                        ارسال ایمیل مستقیم
                      </span>
                      <span className="font-mono text-[11px] text-indigo-light">
                        hello@code-ecology.dev
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-black text-indigo-ink">
                    ارسال نامه ←
                  </span>
                </Card>
              </Link>
            </div>

            <div className="pt-2">
              <span className="mb-2 block text-xs font-bold text-indigo-light">
                شبکه‌های تخصصی و دفترچه کدها:
              </span>
              <div className="grid grid-cols-3 gap-2" dir="ltr">
                {SOCIALS.map((social) => (
                  <Link
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      buttonVariants({ variant: "outline", size: "sm" }),
                      "h-auto rounded-sm border-[2px] border-indigo-ink bg-paper p-2 text-center font-mono text-xs font-bold text-indigo-ink hover:bg-indigo-ink hover:text-paper",
                    )}
                  >
                    {social.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <Card className="craft-card gap-0 rounded-sm bg-paper-light p-6 sm:p-8 lg:col-span-7">
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="form-name" className="text-[13px] font-bold text-indigo-ink">
                    نام و نام خانوادگی شما *
                  </Label>
                  <Input
                    id="form-name"
                    name="name"
                    type="text"
                    required
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="مثال: مریم راد"
                    className={FIELD_CLASS}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="form-contact" className="text-[13px] font-bold text-indigo-ink">
                    شماره تماس یا آیدی تلگرام *
                  </Label>
                  <Input
                    id="form-contact"
                    name="contact"
                    type="text"
                    required
                    value={contact}
                    onChange={(event) => setContact(event.target.value)}
                    placeholder="۰۹۱۲... یا @username"
                    className={FIELD_CLASS}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="form-biz" className="text-[13px] font-bold text-indigo-ink">
                  نام کسب‌وکار یا ایده
                </Label>
                <Input
                  id="form-biz"
                  name="business"
                  type="text"
                  placeholder="مثال: کافه کارگاه هنر"
                  className={FIELD_CLASS}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="form-msg" className="text-[13px] font-bold text-indigo-ink">
                  توضیح کوتاه درباره نیازمندی‌های پروژه
                </Label>
                <Textarea
                  id="form-msg"
                  name="message"
                  rows={4}
                  placeholder="خلاصه‌ای از آنچه در ذهن دارید، سلیقه بصری یا سایت‌هایی که می‌پسندید..."
                  className={cn(FIELD_CLASS, "resize-none font-medium")}
                />
              </div>

              {/* One theme card: status, scope, palette, options and the mode
                  choice live here — never in a second strip above the fields. */}
              <div
                className={cn(
                  "rounded-sm border-[2px] bg-paper p-3",
                  THEME_CARD_TONE[themeTone].card,
                )}
              >
                <div className="mb-2 flex flex-wrap items-center justify-between gap-1.5 border-b border-indigo-ink/20 pb-1.5">
                  <span
                    className={cn(
                      "flex items-center gap-1.5 text-[13px] font-black",
                      THEME_CARD_TONE[themeTone].title,
                    )}
                  >
                    <Palette className="size-4 text-coral" />
                    ظاهر و تم سایت
                  </span>
                  <span
                    aria-live="polite"
                    className={cn(
                      "rounded-sm border px-1.5 py-0.5 text-[10px] font-black",
                      STUDIO_BADGE[badgeState],
                    )}
                  >
                    {STUDIO_BADGE_LABEL[badgeState]}
                  </span>
                </div>

                <p className="mb-2 text-[11px] leading-relaxed font-bold text-indigo-ink">
                  {themeStatusText}
                </p>

                {/* Scope alert: this studio builds a theme, never a layout. A
                    solid mustard block with a hard ink edge so it reads as a
                    warning, not as fine print. */}
                <div className="mb-3 rounded-sm border-[2px] border-indigo-ink bg-mustard p-2.5 shadow-craft-sm">
                  <p className="flex items-start gap-1.5 text-[13px] leading-tight font-black text-indigo-ink">
                    <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-full border-[1.5px] border-indigo-ink bg-coral text-white">
                      <Info aria-hidden="true" className="size-3.5" />
                    </span>
                    این تم، چیدمان و عملکرد سایت را تغییر نمی‌دهد
                  </p>
                  <p className="mt-1.5 text-[12px] leading-relaxed font-bold text-indigo-ink">
                    استودیو فقط رنگ، پالت، فونت و سبک بصری را می‌سازد؛ چیدمان،
                    بخش‌ها و عملکرد سایت کاملاً سفارشی و از صفر بر اساس نیاز شما
                    طراحی می‌شود.
                  </p>
                </div>

                {studioConfig ? (
                  <>
                    <div className="mb-2 flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] font-bold text-indigo-light">
                        رنگ‌های پالت شما:
                      </span>
                      {roleSwatches.map((item) => (
                        <span
                          key={item.label}
                          role="img"
                          title={`${item.label} — ${item.value}`}
                          aria-label={`${item.label}: ${item.value}`}
                          className="size-4 rounded-full border border-indigo-ink/40"
                          style={{ backgroundColor: item.swatch }}
                        />
                      ))}
                      <span className="text-[10px] font-black text-indigo-ink">
                        «{attachedPalette}»
                      </span>
                    </div>
                    <div className="mb-2 flex flex-wrap gap-1">
                      {studioSummary.map((item) => (
                        <span
                          key={item.label}
                          className="rounded-sm border border-indigo-ink/30 bg-paper-light px-1.5 py-0.5 text-[10px] font-bold text-indigo-ink"
                        >
                          <span className="text-indigo-light">{item.label}:</span>{" "}
                          {displayValue(item.value)}
                        </span>
                      ))}
                    </div>
                    <details className="mb-2 rounded-sm border border-dashed border-indigo-ink/50 bg-paper-light p-2">
                      <summary className="cursor-pointer text-[11px] font-black text-indigo-ink">
                        همهٔ {toPersianDigits(optionCount)} گزینهٔ انتخاب‌شده را
                        ببینید
                      </summary>
                      <div className="mt-2 flex flex-col gap-2">
                        {studioOptions.map((group) => (
                          <div key={group.id}>
                            <span className="text-[10px] font-black text-coral">
                              {group.label}
                            </span>
                            <dl className="mt-1 grid grid-cols-1 gap-1 sm:grid-cols-2">
                              {group.items.map((item) => (
                                <div
                                  key={`${group.id}-${item.label}`}
                                  className="flex items-center justify-between gap-2 rounded-sm bg-paper px-1.5 py-1 text-[10px]"
                                >
                                  <dt className="font-bold text-indigo-light">
                                    {item.label}
                                  </dt>
                                  <dd className="flex min-w-0 items-center gap-1 font-black text-indigo-ink">
                                    {item.swatch ? (
                                      <span
                                        aria-hidden="true"
                                        className="size-3 shrink-0 rounded-full border border-indigo-ink/40"
                                        style={{ backgroundColor: item.swatch }}
                                      />
                                    ) : null}
                                    <span className="truncate" dir="auto">
                                      {displayValue(item.value)}
                                    </span>
                                  </dd>
                                </div>
                              ))}
                            </dl>
                          </div>
                        ))}
                      </div>
                    </details>
                  </>
                ) : null}

                {/* Mode choice, not navigation: the own-theme button only paints
                    its state; the small link below is the only path to /create. */}
                <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setDelegateDesign(false)}
                    aria-pressed={!delegateDesign}
                    className={cn(
                      "flex items-center justify-center gap-1.5 rounded-sm border-[2px] border-indigo-ink px-2 py-2 text-[11px] font-black transition-colors",
                      delegateDesign
                        ? "bg-paper text-indigo-ink hover:bg-mustard/30"
                        : "bg-indigo-ink text-paper",
                    )}
                  >
                    <Check className="size-3.5" />
                    {studioConfig ? "خودم انتخاب کرده‌ام" : "خودم می‌سازم"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setDelegateDesign(true)}
                    aria-pressed={delegateDesign}
                    className={cn(
                      "flex items-center justify-center gap-1.5 rounded-sm border-[2px] border-indigo-ink px-2 py-2 text-[11px] font-black transition-colors",
                      delegateDesign
                        ? "bg-teal-craft text-white"
                        : "bg-paper text-indigo-ink hover:bg-teal-light",
                    )}
                  >
                    <Check className="size-3.5" />
                    انتخاب ظاهر را به شما می‌سپارم
                  </button>
                </div>

                <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                  {studioConfig && !delegateDesign ? (
                    <label className="flex cursor-pointer items-center gap-1.5 text-[11px] font-bold text-indigo-ink">
                      <input
                        type="checkbox"
                        checked={attachStudioConfig}
                        onChange={(event) =>
                          setAttachStudioConfig(event.target.checked)
                        }
                        className="size-3.5 accent-coral"
                      />
                      پیکربندی کامل ({toPersianDigits(optionCount)} گزینه) همراه
                      پیام ارسال شود
                    </label>
                  ) : null}
                  <Link
                    href="/create"
                    className="ms-auto text-[11px] font-black text-coral underline underline-offset-4 hover:text-coral-dark"
                  >
                    {studioConfig ? "ویرایش در استودیو ←" : "ساخت تم در استودیو ←"}
                  </Link>
                </div>
              </div>

              {/* Full hand-off: the human-readable summary, the complete JSON
                  (configuration + labels + resolved `--cc-*` tokens + CSS) and
                  one flat field per choice, so any form handler can read the
                  theme without parsing JSON. Everything is gated by the attach
                  checkbox, and delegation sends nothing at all. */}
              <input
                type="hidden"
                name="studio-config"
                value={
                  attachSummary && studioHandoff
                    ? JSON.stringify(studioHandoff)
                    : ""
                }
              />
              <input
                type="hidden"
                name="studio-summary"
                value={attachSummary ? studioSummaryText : ""}
              />
              <input type="hidden" name="studio-status" value={status} />
              <input
                type="hidden"
                name="design-choice"
                value={
                  delegateDesign ? "delegated" : attachSummary ? "studio" : "none"
                }
              />
              {attachSummary && studioConfig ? (
                <>
                  <input
                    type="hidden"
                    name="studio-scenario"
                    value={studioConfig.archetype}
                  />
                  <input
                    type="hidden"
                    name="studio-style"
                    value={studioConfig.styleId}
                  />
                  <input
                    type="hidden"
                    name="studio-palette"
                    value={studioConfig.palette.base}
                  />
                  <input
                    type="hidden"
                    name="studio-palette-colors"
                    value={JSON.stringify(studioConfig.palette.colors)}
                  />
                  <input
                    type="hidden"
                    name="studio-radius"
                    value={String(studioConfig.radius)}
                  />
                  <input
                    type="hidden"
                    name="studio-shadow"
                    value={studioConfig.shadow}
                  />
                  <input
                    type="hidden"
                    name="studio-font"
                    value={studioConfig.font}
                  />
                  <input
                    type="hidden"
                    name="studio-icon-library"
                    value={studioConfig.iconLibrary}
                  />
                  <input
                    type="hidden"
                    name="studio-icon-size"
                    value={studioConfig.iconStyle.size}
                  />
                  <input
                    type="hidden"
                    name="studio-icon-weight"
                    value={studioConfig.iconStyle.weight}
                  />
                  <input
                    type="hidden"
                    name="studio-icon-tone"
                    value={studioConfig.iconStyle.tone}
                  />
                </>
              ) : null}
              <input
                type="hidden"
                name="estimate"
                value={estimate ? JSON.stringify(estimate) : ""}
              />

              {estimate ? (
                <div className="rounded-sm border-[2px] border-indigo-ink bg-mustard/20 p-3">
                  <div className="mb-2 flex items-center justify-between border-b border-indigo-ink/20 pb-1.5">
                    <span className="text-[13px] font-black text-indigo-ink">
                      برآورد انتخابی شما
                    </span>
                    <button
                      type="button"
                      onClick={scrollToEstimator}
                      className="text-[11px] font-black text-coral underline underline-offset-4 hover:text-coral-dark"
                    >
                      تغییر برآورد ←
                    </button>
                  </div>
                  <div className="flex flex-col gap-1 text-xs text-indigo-light">
                    <div className="flex items-center justify-between">
                      <span>پروژه:</span>
                      <span className="font-bold text-indigo-ink">
                        {estimate.typeTitle}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>زمان‌بندی:</span>
                      <span className="font-bold text-teal-craft">
                        {estimate.timeline}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>محدوده هزینه:</span>
                      <span className="font-bold text-coral">
                        {toPersianDigits(estimate.min)} تا{" "}
                        {toPersianDigits(estimate.max)} میلیون تومان
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 rounded-sm border-[2px] border-dashed border-indigo-ink/40 bg-paper p-3 text-center">
                  <span className="text-xs font-medium text-indigo-light">
                    هنوز برآوردی ثبت نشده است. برای مشخص شدن محدوده قیمت، از
                    برآوردگر استفاده کنید.
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={scrollToEstimator}
                    className="flex h-auto items-center justify-center gap-1.5 rounded-sm border-[2px] border-indigo-ink bg-paper px-3 py-1.5 text-xs font-black text-indigo-ink hover:bg-indigo-ink hover:text-paper"
                  >
                    <Calculator className="size-3.5" />
                    <span>برآورد هزینه پروژه</span>
                  </Button>
                </div>
              )}

              <Button
                type="submit"
                variant="default"
                disabled={!canSubmit || sending}
                className="craft-btn flex h-auto w-full items-center justify-center gap-2 rounded-sm border-[2.5px] border-indigo-ink py-3.5 text-base font-black disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span>
                  {sending
                    ? "در حال ارسال و ثبت در کارگاه…"
                    : "ارسال پیام و هماهنگی گفتگوی رایگان"}
                </span>
                <Send className={sending ? "size-5 animate-pulse" : "size-5"} />
              </Button>

              {error ? (
                <p
                  role="alert"
                  aria-live="assertive"
                  className="rounded-sm border-[2px] border-coral bg-coral/10 p-3 text-center text-xs font-bold text-coral-dark"
                >
                  {error} اگر تکرار شد، مستقیم در تلگرام پیام دهید.
                </p>
              ) : null}

              {!canSubmit ? (
                <p className="text-center text-[11px] font-bold text-coral">
                  برای فعال شدن دکمه ارسال، فیلدهای ستاره‌دار (نام و راه
                  ارتباطی) را تکمیل کنید.
                </p>
              ) : null}

              {sent ? (
                <div className="rounded-sm border-[2px] border-teal-craft bg-teal-light p-3 text-center text-sm font-bold text-teal-craft">
                  ✓ پیام شما با مهر کارگاه دریافت شد و در صندوق درخواست‌های
                  کنسول ثبت شد. ظرف ۲ ساعت آینده جهت هماهنگی جلسه با شما تماس
                  می‌گیرم.
                  {attachSummary ? (
                    <span className="mt-1 block text-[11px] font-black">
                      {themeTone === "custom"
                        ? `تم سفارشی «${attachedStyle}» با پالت «${attachedPalette}»، ${toPersianDigits(optionCount)} گزینه و کد CSS کامل ضمیمه شد.`
                        : `ترکیب پیش‌فرض «${attachedStyle}» با پالت «${attachedPalette}» و ${toPersianDigits(optionCount)} گزینه ضمیمه شد.`}
                    </span>
                  ) : null}
                  {!attachSummary && !delegateDesign ? (
                    <span className="mt-1 block text-[11px] font-black">
                      بدون پیکربندی استودیو ارسال شد؛ می‌توانید هر وقت خواستید
                      تم بسازید و دوباره بفرستید.
                    </span>
                  ) : null}
                  {delegateDesign ? (
                    <span className="mt-1 block text-[11px] font-black">
                      درخواست «انتخاب ظاهر با شما» ثبت شد؛ پیشنهاد بصری را من
                      آماده می‌کنم.
                    </span>
                  ) : null}
                </div>
              ) : null}
            </form>
          </Card>
        </div>
      </div>
    </section>
  );
}
