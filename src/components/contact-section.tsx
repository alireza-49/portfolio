"use client";

import { useEffect, useRef, useState } from "react";
import { Mail, Send } from "lucide-react";
import { cn } from "cn";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type EstimateDetail = {
  typeTitle: string;
  timeline: string;
  min: string;
  max: string;
};

const SOCIALS = [
  { href: "https://github.com", label: "GitHub" },
  { href: "https://linkedin.com", label: "LinkedIn" },
  { href: "https://instagram.com", label: "Instagram" },
];

const BUDGET_OPTIONS: { value: string; label: string }[] = [
  { value: "4-7", label: "۴ تا ۷ میلیون تومان (پروژه سریع)" },
  { value: "7-12", label: "۷ تا ۱۲ میلیون تومان (سایت شرکتی کامل)" },
  { value: "12-20", label: "۱۲ تا ۲۰ میلیون تومان (فروشگاه / اپلیکیشن)" },
  { value: "undecided", label: "هنوز مطمئن نیستم (نیاز به راهنمایی)" },
];

const FIELD_CLASS =
  "h-auto rounded-sm border-[2px] border-indigo-ink bg-paper p-3 text-sm text-indigo-ink placeholder:text-indigo-ink/50 focus-visible:border-coral focus-visible:ring-2 focus-visible:ring-coral/30";

export function ContactSection() {
  const [sent, setSent] = useState(false);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const handleEstimate = (event: Event) => {
      const detail = (event as CustomEvent<EstimateDetail>).detail;
      if (!detail || !messageRef.current) return;
      messageRef.current.value = `سلام، من در برآوردگر آنلاین شما پروژه "${detail.typeTitle}" با زمان‌بندی "${detail.timeline}" و محدوده تخمینی ${detail.min} الی ${detail.max} میلیون تومان را مشخص کردم. مایل به گفتگوی ۳۰ دقیقه‌ای رایگان هستم.`;
    };

    window.addEventListener("codology:estimate", handleEstimate);
    return () => window.removeEventListener("codology:estimate", handleEstimate);
  }, []);

  return (
    <section id="contact-section" className="w-full bg-paper px-4 py-20 sm:px-8 lg:px-12">
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

            <div className="flex flex-col gap-3">
              <a href="https://t.me" target="_blank" rel="noopener noreferrer">
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
              </a>

              <a href="mailto:hello@code-ecology.dev">
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
              </a>
            </div>

            <div className="pt-2">
              <span className="mb-2 block text-xs font-bold text-indigo-light">
                شبکه‌های تخصصی و دفترچه کدها:
              </span>
              <div className="grid grid-cols-3 gap-2" dir="ltr">
                {SOCIALS.map((social) => (
                  <a
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
                  </a>
                ))}
              </div>
            </div>
          </div>

          <Card className="craft-card gap-0 rounded-sm bg-paper-light p-6 sm:p-8 lg:col-span-7">
            <form
              className="flex flex-col gap-4"
              onSubmit={(event) => {
                event.preventDefault();
                const form = event.currentTarget;
                setSent(true);
                form.reset();
                window.setTimeout(() => setSent(false), 6000);
              }}
            >
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
                    placeholder="۰۹۱۲... یا @username"
                    className={FIELD_CLASS}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                  <Label htmlFor="form-budget" className="text-[13px] font-bold text-indigo-ink">
                    محدوده بودجه مدنظر
                  </Label>
                  <Select name="budget" items={BUDGET_OPTIONS} defaultValue="4-7">
                    <SelectTrigger
                      id="form-budget"
                      className="h-auto w-full rounded-sm border-[2px] border-indigo-ink bg-paper p-3 text-sm font-medium text-indigo-ink"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-sm border-[2px] border-indigo-ink bg-paper-light">
                      {BUDGET_OPTIONS.map((option) => (
                        <SelectItem
                          key={option.value}
                          value={option.value}
                          className="text-sm font-medium text-indigo-ink focus:bg-mustard/30"
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="form-msg" className="text-[13px] font-bold text-indigo-ink">
                  توضیح کوتاه درباره نیازمندی‌های پروژه
                </Label>
                <Textarea
                  id="form-msg"
                  name="message"
                  rows={4}
                  ref={messageRef}
                  placeholder="خلاصه‌ای از آنچه در ذهن دارید، سلیقه بصری یا سایت‌هایی که می‌پسندید..."
                  className={cn(FIELD_CLASS, "resize-none font-medium")}
                />
              </div>

              <Button
                type="submit"
                variant="outline"
                className="craft-btn flex h-auto w-full items-center justify-center gap-2 rounded-sm border-[2.5px] border-indigo-ink bg-coral py-3.5 text-base font-black text-white"
              >
                <span>ارسال پیام و هماهنگی گفتگوی رایگان</span>
                <Send className="size-5" />
              </Button>

              {sent ? (
                <div className="rounded-sm border-[2px] border-teal-craft bg-teal-light p-3 text-center text-sm font-bold text-teal-craft">
                  ✓ پیام شما با مهر کارگاه دریافت شد! ظرف ۲ ساعت آینده جهت
                  هماهنگی جلسه با شما تماس می‌گیرم.
                </div>
              ) : null}
            </form>
          </Card>
        </div>
      </div>
    </section>
  );
}
