"use client";

import { useEffect, useMemo, useState, type MouseEvent } from "react";
import { cn } from "cn";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { setEstimate } from "@/components/estimate-store";
import {
  activeProjectTypes,
  buildEstimate,
  formatPrice,
  optionsForType,
  timingsForType,
  type EstimatorConfig,
} from "@/lib/estimator";

/**
 * The estimator is rendered from the config the console owns
 * (`estimator_settings`), never from a hardcoded catalogue: adding, removing or
 * repricing a type, a timing or an extra here changes the page, the invoice and
 * the `estimate` payload the contact form posts in the same pass. The price
 * itself comes from `buildEstimate` in `@/lib/estimator`, which is also what the
 * console previews call.
 */

/**
 * Base UI draws each control as a `<span role="checkbox|radio">` beside a
 * visually hidden native input, and a `<label>` around that pair forwards label
 * taps (plus the focus that tags along) to the clipped input — on mobile the
 * browser scrolls the page to it, which lands on the top of the estimator. So
 * the row handles its own tap: a tap on the control arrives with
 * `defaultPrevented` already set (Base UI toggled it), every other tap is
 * cancelled here and applied by hand. Click-anywhere and the label's accessible
 * name stay intact.
 */
const rowClick =
  (activate: () => void) => (event: MouseEvent<HTMLLabelElement>) => {
    if (event.defaultPrevented) return;
    event.preventDefault();
    activate();
  };

const PERSIAN_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

/** Renders Latin digits as Persian ones, with the Persian decimal separator. */
function toPersianDigits(value: string | number) {
  return String(value)
    .replace(/\d/g, (digit) => PERSIAN_DIGITS[Number(digit)])
    .replace(/\./g, "٫");
}

export function EstimatorSection({ config }: { config: EstimatorConfig }) {
  const types = useMemo(() => activeProjectTypes(config), [config]);
  const [typeId, setTypeId] = useState(() => types[0]?.id ?? "");
  const [timingId, setTimingId] = useState(
    () => timingsForType(config, types[0]?.id ?? "")[0]?.id ?? "",
  );
  const [optionIds, setOptionIds] = useState<string[]>([]);

  const timings = useMemo(() => timingsForType(config, typeId), [config, typeId]);
  const options = useMemo(() => optionsForType(config, typeId), [config, typeId]);

  const estimate = useMemo(
    () => buildEstimate(config, { typeId, timingId, optionIds }),
    [config, typeId, timingId, optionIds],
  );

  // The contact form reads this store: it carries the exact type, timing and
  // extras that were chosen, so the inbox sees what the visitor saw.
  useEffect(() => {
    setEstimate(estimate);
  }, [estimate]);

  /** Switching the project type drops choices that type cannot take. */
  const selectProjectType = (next: string) => {
    setTypeId(next);
    const nextTimings = timingsForType(config, next);
    setTimingId((current) =>
      nextTimings.some((timing) => timing.id === current)
        ? current
        : (nextTimings[0]?.id ?? ""),
    );
    const allowed = new Set(optionsForType(config, next).map((option) => option.id));
    setOptionIds((current) => current.filter((id) => allowed.has(id)));
  };

  const toggleOption = (optionId: string) => {
    if (!options.some((option) => option.id === optionId)) return;
    setOptionIds((current) =>
      current.includes(optionId)
        ? current.filter((item) => item !== optionId)
        : [...current, optionId],
    );
  };

  // Nothing active on the console side = the section is not part of the page.
  if (!estimate) return null;

  return (
    <section
      id='estimator-section'
      className='w-full scroll-mt-16 border-b-[2.5px] border-indigo-ink bg-paper-dim px-4 py-12 sm:px-8 lg:px-12'
    >
      <div className='mx-auto flex max-w-7xl flex-col gap-10'>
        <div className='border-b-[2px] border-indigo-ink pb-6 text-right'>
          <h2 className='text-[1.625rem] font-black text-indigo-ink sm:text-[2.125rem]'>
            برآورد رایگان زمان و هزینه پروژه شما
          </h2>
        </div>

        <div className='grid grid-cols-1 gap-8 lg:grid-cols-12'>
          <Card className='craft-card flex flex-col gap-6 rounded-sm bg-paper-light p-6 sm:p-8 lg:col-span-7'>
            <div>
              <span className='mb-3 flex items-center gap-2 text-[1rem] font-black text-indigo-ink'>
                <span className='flex h-6 w-6 items-center justify-center rounded-full bg-coral font-mono text-xs text-white'>
                  ۱
                </span>
                <span>نوع وب‌سایت یا پروژه مورد نیاز:</span>
              </span>
              <RadioGroup
                value={typeId}
                onValueChange={(value) => selectProjectType(value)}
                className='grid grid-cols-1 gap-3 sm:grid-cols-2'
              >
                {types.map((type) => {
                  const checked = typeId === type.id;
                  return (
                    <label
                      key={type.id}
                      onClick={rowClick(() => selectProjectType(type.id))}
                      className={cn(
                        "flex cursor-pointer items-center justify-between gap-2 rounded-sm border-[2px] p-3.5 transition-colors",
                        checked
                          ? "border-coral bg-coral/10"
                          : "border-indigo-ink bg-paper hover:bg-mustard/20",
                      )}
                    >
                      <div className='flex items-start gap-2.5'>
                        <RadioGroupItem
                          value={type.id}
                          className='mt-1 shrink-0'
                        />
                        <span className='text-sm font-bold text-indigo-ink'>
                          {type.label}
                        </span>
                      </div>
                      <span className='shrink-0 whitespace-nowrap font-mono text-[0.75rem] font-bold text-coral'>
                        پایه {toPersianDigits(formatPrice(type.min))} م.ت
                      </span>
                    </label>
                  );
                })}
              </RadioGroup>
            </div>

            <div>
              <span className='mb-3 flex items-center gap-2 text-[1rem] font-black text-indigo-ink'>
                <span className='flex h-6 w-6 items-center justify-center rounded-full bg-coral font-mono text-xs text-white'>
                  ۲
                </span>
                <span>اولویت زمان‌بندی و تحویل کار:</span>
              </span>
              {timings.length === 0 ? (
                <p className='rounded-sm border-[1.5px] border-dashed border-indigo-ink/30 bg-paper-dim p-3 text-xs font-bold text-indigo-light'>
                  برای این نوع پروژه زمان‌بندی جداگانه‌ای تعریف نشده است؛ بازهٔ
                  تحویل در گفتگو مشخص می‌شود.
                </p>
              ) : (
                <RadioGroup
                  value={timingId}
                  onValueChange={(value) => setTimingId(value)}
                  className='grid grid-cols-1 gap-3 sm:grid-cols-3'
                >
                  {timings.map((timing) => {
                    const checked = timingId === timing.id;
                    return (
                      <label
                        key={timing.id}
                        onClick={rowClick(() => setTimingId(timing.id))}
                        className={cn(
                          "flex cursor-pointer flex-col items-center justify-center gap-1 rounded-sm border-[2px] p-3 text-center transition-colors",
                          checked
                            ? "border-coral bg-coral/10"
                            : "border-indigo-ink bg-paper hover:bg-mustard/20",
                        )}
                      >
                        <RadioGroupItem
                          value={timing.id}
                          className='sr-only'
                        />
                        <div className='text-sm font-bold text-indigo-ink'>
                          {timing.label}
                        </div>
                        {timing.surchargePercent > 0 ? (
                          <div className='mt-0.5 flex items-center gap-1 font-mono text-[0.6875rem]'>
                            <span
                              className={cn(
                                "text-indigo-light",
                                timing.waived && "line-through",
                              )}
                            >
                              +{toPersianDigits(timing.surchargePercent)}٪
                            </span>
                            {timing.waived ? (
                              <span className='font-black text-coral'>۰٪</span>
                            ) : null}
                          </div>
                        ) : timing.note ? (
                          <div className='mt-0.5 font-mono text-[0.6875rem] text-indigo-light'>
                            {timing.note}
                          </div>
                        ) : null}
                      </label>
                    );
                  })}
                </RadioGroup>
              )}
            </div>

            <div>
              <span className='mb-3 flex items-center gap-2 text-[1rem] font-black text-indigo-ink'>
                <span className='flex h-6 w-6 items-center justify-center rounded-full bg-coral font-mono text-xs text-white'>
                  ۳
                </span>
                <span>امکانات اضافه:</span>
              </span>
              {options.length === 0 ? (
                <p className='rounded-sm border-[1.5px] border-dashed border-indigo-ink/30 bg-paper-dim p-3 text-xs font-bold text-indigo-light'>
                  برای این نوع پروژه امکان اضافه‌ای تعریف نشده است.
                </p>
              ) : (
                <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
                  {options.map((option) => {
                    const checked = optionIds.includes(option.id);
                    return (
                      <label
                        key={option.id}
                        onClick={rowClick(() => toggleOption(option.id))}
                        className={cn(
                          "flex cursor-pointer items-center gap-2.5 rounded-sm border-[1.5px] p-3",
                          checked
                            ? "border-coral bg-coral/10"
                            : "border-indigo-ink/40 bg-paper hover:border-indigo-ink",
                        )}
                      >
                        <Checkbox
                          checked={checked}
                          onCheckedChange={() => toggleOption(option.id)}
                        />
                        <span className='flex items-baseline gap-1.5'>
                          <span className='text-xs font-medium text-indigo-ink sm:text-sm'>
                            {option.label}
                          </span>
                          <span className='shrink-0 whitespace-nowrap font-mono text-[0.6875rem] font-bold text-coral'>
                            {option.struckPrice > 0 ? (
                              <s className='me-1 text-indigo-light'>
                                {toPersianDigits(formatPrice(option.struckPrice))} م.ت
                              </s>
                            ) : null}
                            {option.price > 0
                              ? `+${toPersianDigits(formatPrice(option.price))} م.ت`
                              : "رایگان"}
                          </span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          </Card>

          <Card className='craft-card relative flex flex-col justify-between gap-6 rounded-sm bg-paper-light p-6 sm:p-8 lg:col-span-5'>
            <div className='flex flex-col gap-5'>
              <div className='border-b-[2px] border-indigo-ink pb-3'>
                <h3 className='text-base font-black text-indigo-ink'>
                  پیش‌فاکتور
                </h3>
              </div>

              <div className='space-y-3 text-sm text-indigo-light'>
                <div className='flex items-center justify-between border-b border-indigo-ink/15 py-1.5'>
                  <span>پروژه انتخابی:</span>
                  <span className='font-extrabold text-indigo-ink'>
                    {estimate.typeTitle}
                  </span>
                </div>
                <div className='flex items-center justify-between border-b border-indigo-ink/15 py-1.5'>
                  <span>زمان‌بندی تحویل:</span>
                  <span className='font-extrabold text-teal-craft'>
                    {estimate.timeline || "در گفتگو مشخص می‌شود"}
                  </span>
                </div>
                <div className='flex items-start justify-between gap-3 border-b border-indigo-ink/15 py-1.5'>
                  <span className='shrink-0'>امکانات جانبی:</span>
                  <span className='text-left font-extrabold text-coral'>
                    {estimate.options.length > 0
                      ? estimate.options.map((option) => option.label).join("، ")
                      : "بدون امکان اضافه"}
                  </span>
                </div>
                <div className='flex items-center justify-between gap-3 border-b border-indigo-ink/15 py-1.5'>
                  <span className='shrink-0'>دامنه:</span>
                  <span className='text-left font-extrabold text-teal-craft'>
                    <span dir='ltr' className='font-mono'>
                      .ir
                    </span>{" "}
                    رایگان — <span dir='ltr' className='font-mono'>.com</span>{" "}
                    و بقیه به عهدهٔ خودتان
                  </span>
                </div>
                <div className='flex items-center justify-between gap-3 border-b border-indigo-ink/15 py-1.5'>
                  <span className='shrink-0'>هاست:</span>
                  <span className='text-left font-extrabold text-teal-craft'>
                    ماه اول رایگان، بعدش هزینهٔ پلن انتخابی شما
                  </span>
                </div>
              </div>

              <div className='my-2 flex flex-col items-center gap-2'>
                <span className='inline-flex items-center rounded-full border-[2px] border-indigo-ink bg-coral px-3 py-1 text-[0.6875rem] font-black text-white shadow-craft-sm'>
                  ۲۰٪ تخفیف — فقط برای مدت محدود
                </span>
                <Card className='flex w-full flex-col gap-1 rounded-sm border-[2px] border-indigo-ink bg-mustard/20 p-4 text-center shadow-craft-inset'>
                  <span className='text-xs font-bold text-indigo-ink'>
                    محدوده سرمایه‌گذاری تقریبی
                  </span>
                  <div className='flex items-baseline justify-center gap-1.5'>
                    <span className='font-display text-[2.125rem] font-black text-coral'>
                      {toPersianDigits(estimate.min)}
                    </span>
                    <span className='text-lg font-black text-indigo-ink'>
                      تا
                    </span>
                    <span className='font-display text-[2.125rem] font-black text-coral'>
                      {toPersianDigits(estimate.max)}
                    </span>
                    <span className='text-sm font-bold text-indigo-ink'>
                      میلیون تومان
                    </span>
                  </div>
                  <span className='text-[0.6875rem] text-indigo-light'>
                    شامل صفر تا صد کدنویسی، رسپانسیو و تحویل نهایی
                  </span>
                </Card>
              </div>
            </div>

            <div className='pt-4'>
              <a
                href='#contact-section'
                className='craft-btn flex w-full items-center justify-center gap-2 rounded-sm border-[2.5px] border-indigo-ink bg-coral px-4 py-3.5 text-base font-black text-white shadow-craft-sm transition-colors hover:bg-coral-dark'
              >
                ثبت در فرم تماس و ارسال پیام ←
              </a>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
