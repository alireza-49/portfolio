"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { Calculator, Check, Mail, Palette, Send, Sparkles } from "lucide-react";
import { cn } from "cn";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useEstimate } from "@/components/estimate-store";
import {
  describeStudioConfig,
  useStudioConfig,
} from "@/components/create-studio-store";

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

export function ContactSection() {
  const [sent, setSent] = useState(false);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [attachStudioConfig, setAttachStudioConfig] = useState(true);
  const [delegateDesign, setDelegateDesign] = useState(false);
  const estimate = useEstimate();

  // The studio persists its configuration in localStorage; this hook paints
  // the summary after hydration and stays `null` when nobody used it yet.
  const studioConfig = useStudioConfig();
  const studioSummary = studioConfig ? describeStudioConfig(studioConfig) : [];
  const attachSummary = Boolean(
    studioConfig && attachStudioConfig && !delegateDesign,
  );
  const attachedStyle =
    studioSummary.find((item) => item.label === "سبک")?.value ?? "";
  const attachedPalette =
    studioSummary.find((item) => item.label === "پالت")?.value ?? "";

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

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;
    const form = event.currentTarget;
    setSent(true);
    form.reset();
    setName("");
    setContact("");
    window.setTimeout(() => setSent(false), 6000);
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

              {/* Studio hand-off: the exact theme the visitor built, or a
                  request to pick the visual direction on their behalf. */}
              <div className="rounded-sm border-[2px] border-indigo-ink bg-paper p-3">
                <div className="mb-2 flex flex-wrap items-center justify-between gap-1.5 border-b border-indigo-ink/20 pb-1.5">
                  <span className="flex items-center gap-1.5 text-[13px] font-black text-indigo-ink">
                    <Palette className="size-4 text-coral" />
                    ظاهر و تم سایت
                  </span>
                  <span className="rounded-sm border border-indigo-ink bg-paper-dim px-1.5 py-0.5 text-[10px] font-bold text-indigo-light">
                    {studioConfig ? "ساخته‌شده در استودیو" : "انتخاب با شما یا من"}
                  </span>
                </div>

                {studioConfig ? (
                  <>
                    <div className="mb-2 flex flex-wrap gap-1">
                      {studioSummary.map((item) => (
                        <span
                          key={item.label}
                          className="rounded-sm border border-indigo-ink/30 bg-paper-light px-1.5 py-0.5 text-[10px] font-bold text-indigo-ink"
                        >
                          <span className="text-indigo-light">{item.label}:</span>{" "}
                          {toPersianDigits(item.value)}
                        </span>
                      ))}
                    </div>
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                      <label className="flex cursor-pointer items-center gap-1.5 text-[11px] font-bold text-indigo-ink">
                        <input
                          type="checkbox"
                          checked={attachStudioConfig}
                          onChange={(event) =>
                            setAttachStudioConfig(event.target.checked)
                          }
                          className="size-3.5 accent-coral"
                        />
                        این ترکیب همراه پیام ارسال شود
                      </label>
                      <Link
                        href="/create"
                        className="text-[11px] font-black text-coral underline underline-offset-4 hover:text-coral-dark"
                      >
                        ویرایش در استودیو ←
                      </Link>
                    </div>
                  </>
                ) : (
                  <p className="mb-2 text-[11px] leading-relaxed font-medium text-indigo-light">
                    هنوز تمی نساخته‌اید. می‌توانید خودتان در استودیو ترکیب
                    دلخواه را بسازید یا انتخاب ظاهر را به من بسپارید.
                  </p>
                )}

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <Link
                    href="/create"
                    className="flex items-center justify-center gap-1.5 rounded-sm border-[2px] border-indigo-ink bg-paper px-2 py-2 text-[11px] font-black text-indigo-ink transition-colors hover:bg-mustard/30"
                  >
                    <Sparkles className="size-3.5 text-coral" />
                    خودم در استودیو می‌سازم
                  </Link>
                  <button
                    type="button"
                    onClick={() => setDelegateDesign((value) => !value)}
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

                {delegateDesign ? (
                  <p className="mt-2 rounded-sm border border-dashed border-teal-craft bg-teal-light px-2 py-1.5 text-[10px] font-bold text-teal-craft">
                    عالی؛ پیکربندی استودیو ارسال نمی‌شود و ظاهر را بر اساس ایده و
                    برند شما انتخاب می‌کنم.
                  </p>
                ) : null}
              </div>

              <input
                type="hidden"
                name="studio-config"
                value={attachSummary && studioConfig ? JSON.stringify(studioConfig) : ""}
              />
              <input
                type="hidden"
                name="design-choice"
                value={delegateDesign ? "delegated" : studioConfig ? "studio" : ""}
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
                disabled={!canSubmit}
                className="craft-btn flex h-auto w-full items-center justify-center gap-2 rounded-sm border-[2.5px] border-indigo-ink py-3.5 text-base font-black disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span>ارسال پیام و هماهنگی گفتگوی رایگان</span>
                <Send className="size-5" />
              </Button>

              {!canSubmit ? (
                <p className="text-center text-[11px] font-bold text-coral">
                  برای فعال شدن دکمه ارسال، فیلدهای ستاره‌دار (نام و راه
                  ارتباطی) را تکمیل کنید.
                </p>
              ) : null}

              {sent ? (
                <div className="rounded-sm border-[2px] border-teal-craft bg-teal-light p-3 text-center text-sm font-bold text-teal-craft">
                  ✓ پیام شما با مهر کارگاه دریافت شد! ظرف ۲ ساعت آینده جهت
                  هماهنگی جلسه با شما تماس می‌گیرم.
                  {attachSummary ? (
                    <span className="mt-1 block text-[11px] font-black">
                      پیکربندی استودیو «{attachedStyle}» با پالت «{attachedPalette}»
                      هم ضمیمه شد.
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
