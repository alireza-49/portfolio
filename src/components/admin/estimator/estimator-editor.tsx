"use client";

import { useMemo, useState, useTransition } from "react";
import {
  CheckCircle2,
  LoaderCircle,
  Plus,
  RotateCcw,
  Save,
  Trash2,
  TriangleAlert,
} from "lucide-react";
import { cn } from "cn";
import {
  BTN_GHOST,
  BTN_PRIMARY,
  BTN_SECONDARY,
  FIELD_CLASS,
  LABEL_CLASS,
  PageHeader,
  Panel,
  PanelHeading,
} from "@/components/admin/ui";
import { faNumber } from "@/lib/fa";
import {
  DEFAULT_ESTIMATOR,
  activeProjectTypes,
  buildEstimate,
  cloneEstimatorConfig,
  optionsForType,
  timingsForType,
  validateEstimatorDraft,
  type EstimatorConfig,
  type EstimatorOption,
  type EstimatorProjectType,
  type EstimatorTiming,
} from "@/lib/estimator";
import { saveEstimatorConfigAction } from "@/app/admin/(console)/estimator/actions";

/**
 * The console owns the home-page estimator. This editor is a draft: nothing is
 * written until «ذخیرهٔ برآوردگر» is pressed, and the server validates and
 * sanitizes the draft again before storing it. Every preview below is computed
 * with the same `buildEstimate` the public page uses, so the numbers here are
 * exactly the numbers the visitor and the contact form will see.
 */

type Notice = { ok: boolean; message: string } | null;

function newId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

function amount(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

function ActiveToggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <label className='flex shrink-0 items-center gap-1.5 pb-1 text-[0.6875rem] font-bold text-indigo-ink'>
      <input
        type='checkbox'
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className='size-3.5 accent-coral'
      />
      فعال
    </label>
  );
}

/**
 * Which project types a timing or an extra is offered for. An empty selection
 * means "every type", which is why a newly added type still gets the shared
 * options without editing each row.
 */
function ScopeChips({
  types,
  value,
  onChange,
}: {
  types: EstimatorProjectType[];
  value: string[];
  onChange: (next: string[]) => void;
}) {
  return (
    <div className='flex flex-col gap-1'>
      <span className='text-[0.625rem] font-bold text-indigo-light'>
        برای کدام نوع پروژه‌ها؟
      </span>
      <div className='flex flex-wrap gap-1'>
        {types.map((type) => {
          const on = value.includes(type.id);
          return (
            <button
              key={type.id}
              type='button'
              aria-pressed={on}
              onClick={() =>
                onChange(
                  on
                    ? value.filter((id) => id !== type.id)
                    : [...value, type.id],
                )
              }
              className={cn(
                "rounded-sm border px-1.5 py-0.5 text-[0.625rem] font-bold transition-colors",
                on
                  ? "border-coral bg-coral/10 text-coral"
                  : "border-indigo-ink/30 bg-paper text-indigo-light hover:border-indigo-ink",
              )}
            >
              {type.label || "بدون نام"}
            </button>
          );
        })}
      </div>
      <span className='text-[0.5625rem] leading-relaxed font-medium text-indigo-light'>
        اگر هیچ نوعی انتخاب نشود، برای همهٔ انواع پروژه نمایش داده می‌شود.
      </span>
    </div>
  );
}

export function EstimatorEditor({ config }: { config: EstimatorConfig }) {
  const [draft, setDraft] = useState<EstimatorConfig>(() =>
    cloneEstimatorConfig(config),
  );
  const [saved, setSaved] = useState(() => JSON.stringify(config));
  const [notice, setNotice] = useState<Notice>(null);
  const [armed, setArmed] = useState(false);
  const [pending, startTransition] = useTransition();

  const problems = useMemo(() => validateEstimatorDraft(draft), [draft]);
  const dirty = JSON.stringify(draft) !== saved;

  const preview = useMemo(
    () =>
      activeProjectTypes(draft).map((type) => {
        const typeTimings = timingsForType(draft, type.id);
        return {
          type,
          timings: typeTimings.length,
          options: optionsForType(draft, type.id).length,
          estimate: buildEstimate(draft, {
            typeId: type.id,
            timingId: typeTimings[0]?.id ?? "",
            optionIds: [],
          }),
        };
      }),
    [draft],
  );

  const updateType = (id: string, patch: Partial<EstimatorProjectType>) =>
    setDraft((current) => ({
      ...current,
      projectTypes: current.projectTypes.map((type) =>
        type.id === id ? { ...type, ...patch } : type,
      ),
    }));

  const updateTiming = (id: string, patch: Partial<EstimatorTiming>) =>
    setDraft((current) => ({
      ...current,
      timings: current.timings.map((timing) =>
        timing.id === id ? { ...timing, ...patch } : timing,
      ),
    }));

  const updateOption = (id: string, patch: Partial<EstimatorOption>) =>
    setDraft((current) => ({
      ...current,
      options: current.options.map((option) =>
        option.id === id ? { ...option, ...patch } : option,
      ),
    }));

  /* Deleting a type also drops it from every scope, so no stale id is left. */
  const removeType = (id: string) =>
    setDraft((current) => ({
      projectTypes: current.projectTypes.filter((type) => type.id !== id),
      timings: current.timings.map((timing) => ({
        ...timing,
        appliesTo: timing.appliesTo.filter((scope) => scope !== id),
      })),
      options: current.options.map((option) => ({
        ...option,
        appliesTo: option.appliesTo.filter((scope) => scope !== id),
      })),
    }));

  const addType = () =>
    setDraft((current) => ({
      ...current,
      projectTypes: [
        ...current.projectTypes,
        { id: newId("type"), label: "", min: 1, max: 2, active: true },
      ],
    }));

  const addTiming = () =>
    setDraft((current) => ({
      ...current,
      timings: [
        ...current.timings,
        {
          id: newId("time"),
          label: "",
          timeline: "",
          surchargePercent: 0,
          waived: false,
          note: "",
          appliesTo: [],
          active: true,
        },
      ],
    }));

  const addOption = () =>
    setDraft((current) => ({
      ...current,
      options: [
        ...current.options,
        {
          id: newId("opt"),
          label: "",
          price: 1,
          struckPrice: 0,
          appliesTo: [],
          active: true,
        },
      ],
    }));

  const save = () => {
    startTransition(async () => {
      const result = await saveEstimatorConfigAction(draft);
      setNotice(result);
      if (result.ok) setSaved(JSON.stringify(draft));
    });
  };

  return (
    <div className='flex flex-col gap-5'>
      <PageHeader
        eyebrow='PRICING // HOME ESTIMATOR'
        title='برآورد قیمت صفحهٔ اصلی'
        description='هر چیزی که بازدیدکننده در بخش «برآورد رایگان» می‌بیند از همین‌جا خوانده می‌شود: نوع پروژه با کف و سقف قیمت، زمان‌بندی تحویل و امکانات اضافه. برآوردی که با فرم تماس ارسال می‌شود هم از همین اعداد ساخته می‌شود، پس افزودن یا حذف هر گزینه در صندوق درخواست‌ها هم همان‌طور دیده می‌شود.'
        actions={
          <>
            <button
              type='button'
              onClick={() => {
                if (!armed) {
                  setArmed(true);
                  return;
                }
                setArmed(false);
                setNotice(null);
                setDraft(cloneEstimatorConfig(DEFAULT_ESTIMATOR));
              }}
              onBlur={() => setArmed(false)}
              disabled={pending}
              className={BTN_SECONDARY}
            >
              <RotateCcw className='size-3.5' />
              <span>
                {armed ? "برای بازگردانی دوباره بزنید" : "بازگردانی به پیش‌فرض"}
              </span>
            </button>
            <button
              type='button'
              onClick={save}
              disabled={pending || !dirty || problems.length > 0}
              className={BTN_PRIMARY}
            >
              {pending ? (
                <LoaderCircle className='size-3.5 animate-spin' />
              ) : (
                <Save className='size-3.5' />
              )}
              <span>{pending ? "در حال ذخیره…" : "ذخیرهٔ برآوردگر"}</span>
            </button>
          </>
        }
      />

      {notice ? <NoticeBar notice={notice} /> : null}

      {problems.length > 0 ? (
        <div
          role='alert'
          className='flex flex-col gap-1 rounded-sm border-[2px] border-coral bg-coral/10 px-3 py-2.5'
        >
          <span className='flex items-center gap-1.5 text-xs font-black text-coral-dark'>
            <TriangleAlert className='size-3.5' />
            تا این موارد درست نشود ذخیره ممکن نیست
          </span>
          <ul className='flex list-disc flex-col gap-0.5 ps-5 text-[0.6875rem] leading-relaxed font-bold text-indigo-ink'>
            {problems.slice(0, 5).map((problem) => (
              <li key={problem}>{problem}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <Panel>
        <PanelHeading
          eyebrow='LIVE PREVIEW'
          title='پیش‌نمایش محدودهٔ قیمت'
          description='برای هر نوع پروژه با اولین زمان‌بندی و بدون هیچ امکان اضافه؛ همان محاسبه‌ای که صفحهٔ اصلی انجام می‌دهد.'
        />
        <div className='flex flex-col px-4 py-2 sm:px-5'>
          {preview.length === 0 ? (
            <p className='py-4 text-center text-xs font-bold text-indigo-light'>
              هنوز نوع پروژهٔ فعالی وجود ندارد؛ برآوردگر در صفحهٔ اصلی دیده
              نمی‌شود.
            </p>
          ) : (
            preview.map((row) => (
              <div
                key={row.type.id}
                className='flex flex-wrap items-center justify-between gap-2 border-b border-dashed border-indigo-ink/15 py-2 last:border-b-0'
              >
                <span className='min-w-0 text-[0.75rem] font-black text-indigo-ink'>
                  {row.type.label}
                </span>
                <span className='flex flex-wrap items-center gap-2 text-[0.6875rem] font-bold text-indigo-light'>
                  <span className='rounded-sm border border-indigo-ink/25 bg-paper px-1.5 py-0.5 font-mono text-[0.6875rem] text-indigo-ink'>
                    {row.estimate
                      ? `${faNumber(Number(row.estimate.min))} تا ${faNumber(Number(row.estimate.max))}`
                      : "—"}{" "}
                    م.ت
                  </span>
                  <span>{faNumber(row.timings)} زمان‌بندی</span>
                  <span>{faNumber(row.options)} امکان</span>
                </span>
              </div>
            ))
          )}
        </div>
      </Panel>

      <Panel>
        <PanelHeading
          eyebrow='PROJECT TYPES'
          title='نوع پروژه و قیمت پایه'
          description='کف و سقف قیمت به میلیون تومان. این بازه، مبنای همهٔ برآوردهاست و امکانات اضافه روی آن جمع می‌شوند.'
          actions={
            <button type='button' onClick={addType} className={BTN_SECONDARY}>
              <Plus className='size-3.5' />
              <span>افزودن نوع پروژه</span>
            </button>
          }
        />
        <div className='flex flex-col gap-3 p-4 sm:p-5'>
          {draft.projectTypes.length === 0 ? (
            <p className='rounded-sm border-[2px] border-dashed border-indigo-ink/30 bg-paper px-3 py-4 text-center text-xs font-bold text-indigo-light'>
              نوع پروژه‌ای وجود ندارد. با «افزودن نوع پروژه» شروع کنید؛ تا وقتی
              یکی فعال نشود برآوردگر در صفحهٔ اصلی نمایش داده نمی‌شود.
            </p>
          ) : (
            draft.projectTypes.map((type) => (
              <div
                key={type.id}
                className='rounded-sm border-[1.5px] border-indigo-ink/25 bg-paper p-3'
              >
                <div className='flex flex-wrap items-end gap-2'>
                  <label className='flex min-w-52 flex-1 flex-col gap-1'>
                    <span className={LABEL_CLASS}>نام نوع پروژه</span>
                    <input
                      value={type.label}
                      onChange={(event) =>
                        updateType(type.id, { label: event.target.value })
                      }
                      placeholder='مثال: فروشگاه آنلاین'
                      className={FIELD_CLASS}
                    />
                  </label>
                  <label className='flex w-24 flex-col gap-1'>
                    <span className={LABEL_CLASS}>کف (م.ت)</span>
                    <input
                      type='number'
                      min={0}
                      step={0.5}
                      dir='ltr'
                      value={type.min}
                      onChange={(event) =>
                        updateType(type.id, { min: amount(event.target.value) })
                      }
                      className={`${FIELD_CLASS} font-mono text-xs`}
                    />
                  </label>
                  <label className='flex w-24 flex-col gap-1'>
                    <span className={LABEL_CLASS}>سقف (م.ت)</span>
                    <input
                      type='number'
                      min={0}
                      step={0.5}
                      dir='ltr'
                      value={type.max}
                      onChange={(event) =>
                        updateType(type.id, { max: amount(event.target.value) })
                      }
                      className={`${FIELD_CLASS} font-mono text-xs`}
                    />
                  </label>
                  <div className='flex items-center gap-1'>
                    <ActiveToggle
                      checked={type.active}
                      onChange={(active) => updateType(type.id, { active })}
                    />
                    <button
                      type='button'
                      onClick={() => removeType(type.id)}
                      aria-label={`حذف ${type.label || "نوع پروژه"}`}
                      className={BTN_GHOST}
                    >
                      <Trash2 className='size-3.5' />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Panel>

      <div className='grid grid-cols-1 gap-4 xl:grid-cols-2'>
        <Panel>
          <PanelHeading
            eyebrow='TIMINGS'
            title='زمان‌بندی تحویل'
            description='بازهٔ تحویل در پیش‌فاکتور همین متن است. درصد اضافهٔ زمانی، روی کف و سقف قیمت اعمال می‌شود؛ اگر «رایگان» تیک بخورد خط‌خورده نمایش داده می‌شود و قیمت را بالا نمی‌برد.'
            actions={
              <button type='button' onClick={addTiming} className={BTN_SECONDARY}>
                <Plus className='size-3.5' />
                <span>افزودن</span>
              </button>
            }
          />
          <div className='flex flex-col gap-3 p-4 sm:p-5'>
            {draft.timings.length === 0 ? (
              <p className='rounded-sm border-[2px] border-dashed border-indigo-ink/30 bg-paper px-3 py-4 text-center text-xs font-bold text-indigo-light'>
                زمان‌بندی‌ای وجود ندارد؛ برآوردگر بدون این مرحله نمایش داده
                می‌شود.
              </p>
            ) : (
              draft.timings.map((timing) => (
                <div
                  key={timing.id}
                  className='flex flex-col gap-2 rounded-sm border-[1.5px] border-indigo-ink/25 bg-paper p-3'
                >
                  <div className='flex flex-wrap items-end gap-2'>
                    <label className='flex min-w-40 flex-1 flex-col gap-1'>
                      <span className={LABEL_CLASS}>عنوان کارت</span>
                      <input
                        value={timing.label}
                        onChange={(event) =>
                          updateTiming(timing.id, { label: event.target.value })
                        }
                        placeholder='سریع (۵ تا ۷ روز)'
                        className={FIELD_CLASS}
                      />
                    </label>
                    <label className='flex w-20 flex-col gap-1'>
                      <span className={LABEL_CLASS}>درصد +</span>
                      <input
                        type='number'
                        min={0}
                        max={100}
                        step={1}
                        dir='ltr'
                        value={timing.surchargePercent}
                        onChange={(event) =>
                          updateTiming(timing.id, {
                            surchargePercent: amount(event.target.value),
                          })
                        }
                        className={`${FIELD_CLASS} font-mono text-xs`}
                      />
                    </label>
                    <div className='flex items-center gap-1'>
                      <ActiveToggle
                        checked={timing.active}
                        onChange={(active) => updateTiming(timing.id, { active })}
                      />
                      <button
                        type='button'
                        onClick={() =>
                          setDraft((current) => ({
                            ...current,
                            timings: current.timings.filter(
                              (entry) => entry.id !== timing.id,
                            ),
                          }))
                        }
                        aria-label={`حذف ${timing.label || "زمان‌بندی"}`}
                        className={BTN_GHOST}
                      >
                        <Trash2 className='size-3.5' />
                      </button>
                    </div>
                  </div>

                  <div className='flex flex-wrap items-end gap-2'>
                    <label className='flex min-w-40 flex-1 flex-col gap-1'>
                      <span className={LABEL_CLASS}>متن بازهٔ تحویل</span>
                      <input
                        value={timing.timeline}
                        onChange={(event) =>
                          updateTiming(timing.id, {
                            timeline: event.target.value,
                          })
                        }
                        placeholder='۵ تا ۷ روز کاری (شتاب‌یافته)'
                        className={FIELD_CLASS}
                      />
                    </label>
                    <label className='flex min-w-32 flex-col gap-1'>
                      <span className={LABEL_CLASS}>یادداشت کارت</span>
                      <input
                        value={timing.note}
                        onChange={(event) =>
                          updateTiming(timing.id, { note: event.target.value })
                        }
                        placeholder='بدون هزینه اضافه'
                        className={FIELD_CLASS}
                      />
                    </label>
                  </div>

                  <label className='flex items-start gap-2 text-[0.6875rem] leading-relaxed font-bold text-indigo-ink'>
                    <input
                      type='checkbox'
                      checked={timing.waived}
                      onChange={(event) =>
                        updateTiming(timing.id, {
                          waived: event.target.checked,
                        })
                      }
                      className='mt-0.5 size-3.5 accent-coral'
                    />
                    <span>
                      درصد اضافه فعلاً رایگان باشد (خط‌خورده نمایش داده شود و در
                      قیمت حساب نشود)
                    </span>
                  </label>

                  <ScopeChips
                    types={draft.projectTypes}
                    value={timing.appliesTo}
                    onChange={(appliesTo) =>
                      updateTiming(timing.id, { appliesTo })
                    }
                  />
                </div>
              ))
            )}
          </div>
        </Panel>

        <Panel>
          <PanelHeading
            eyebrow='EXTRAS'
            title='امکانات اضافه'
            description='هر گزینه با قیمت خودش روی بازهٔ پروژه جمع می‌شود؛ صفر یعنی «رایگان» و قیمت خط‌خورده فقط برای نمایش تخفیف است.'
            actions={
              <button type='button' onClick={addOption} className={BTN_SECONDARY}>
                <Plus className='size-3.5' />
                <span>افزودن</span>
              </button>
            }
          />
          <div className='flex flex-col gap-3 p-4 sm:p-5'>
            {draft.options.length === 0 ? (
              <p className='rounded-sm border-[2px] border-dashed border-indigo-ink/30 bg-paper px-3 py-4 text-center text-xs font-bold text-indigo-light'>
                امکان اضافه‌ای وجود ندارد؛ مرحلهٔ سوم برآوردگر خالی می‌ماند.
              </p>
            ) : (
              draft.options.map((option) => (
                <div
                  key={option.id}
                  className='flex flex-col gap-2 rounded-sm border-[1.5px] border-indigo-ink/25 bg-paper p-3'
                >
                  <div className='flex flex-wrap items-end gap-2'>
                    <label className='flex min-w-44 flex-1 flex-col gap-1'>
                      <span className={LABEL_CLASS}>عنوان امکان</span>
                      <input
                        value={option.label}
                        onChange={(event) =>
                          updateOption(option.id, { label: event.target.value })
                        }
                        placeholder='پنل مدیریت محتوا'
                        className={FIELD_CLASS}
                      />
                    </label>
                    <label className='flex w-24 flex-col gap-1'>
                      <span className={LABEL_CLASS}>قیمت (م.ت)</span>
                      <input
                        type='number'
                        min={0}
                        step={0.5}
                        dir='ltr'
                        value={option.price}
                        onChange={(event) =>
                          updateOption(option.id, {
                            price: amount(event.target.value),
                          })
                        }
                        className={`${FIELD_CLASS} font-mono text-xs`}
                      />
                    </label>
                    <label className='flex w-24 flex-col gap-1'>
                      <span className={LABEL_CLASS}>خط‌خورده</span>
                      <input
                        type='number'
                        min={0}
                        step={0.5}
                        dir='ltr'
                        value={option.struckPrice}
                        onChange={(event) =>
                          updateOption(option.id, {
                            struckPrice: amount(event.target.value),
                          })
                        }
                        className={`${FIELD_CLASS} font-mono text-xs`}
                      />
                    </label>
                    <div className='flex items-center gap-1'>
                      <ActiveToggle
                        checked={option.active}
                        onChange={(active) => updateOption(option.id, { active })}
                      />
                      <button
                        type='button'
                        onClick={() =>
                          setDraft((current) => ({
                            ...current,
                            options: current.options.filter(
                              (entry) => entry.id !== option.id,
                            ),
                          }))
                        }
                        aria-label={`حذف ${option.label || "امکان"}`}
                        className={BTN_GHOST}
                      >
                        <Trash2 className='size-3.5' />
                      </button>
                    </div>
                  </div>

                  <ScopeChips
                    types={draft.projectTypes}
                    value={option.appliesTo}
                    onChange={(appliesTo) =>
                      updateOption(option.id, { appliesTo })
                    }
                  />
                </div>
              ))
            )}
          </div>
        </Panel>
      </div>

      <div className='flex flex-wrap items-center justify-between gap-2 rounded-sm border-[2px] border-dashed border-mustard-deep bg-mustard/20 px-4 py-3'>
        <p className='text-[0.6875rem] leading-relaxed font-bold text-indigo-ink'>
          تغییرات ذخیره‌نشده در صفحهٔ اصلی دیده نمی‌شود؛ برآوردهایی که قبلاً با
          فرم تماس ارسال شده‌اند با همان اعداد زمان خودشان می‌مانند.
        </p>
        <button
          type='button'
          onClick={save}
          disabled={pending || !dirty || problems.length > 0}
          className={BTN_PRIMARY}
        >
          <Save className='size-3.5' />
          <span>ذخیرهٔ برآوردگر</span>
        </button>
      </div>
    </div>
  );
}

function NoticeBar({ notice }: { notice: { ok: boolean; message: string } }) {
  return (
    <p
      role='status'
      aria-live='polite'
      className={
        notice.ok
          ? "flex items-start gap-1.5 rounded-sm border-[1.5px] border-teal-craft bg-teal-craft/10 px-3 py-2 text-xs font-bold text-teal-craft"
          : "flex items-start gap-1.5 rounded-sm border-[1.5px] border-coral bg-coral/10 px-3 py-2 text-xs font-bold text-coral-dark"
      }
    >
      {notice.ok ? (
        <CheckCircle2 className='mt-0.5 size-3.5 shrink-0' />
      ) : (
        <TriangleAlert className='mt-0.5 size-3.5 shrink-0' />
      )}
      <span>{notice.message}</span>
    </p>
  );
}
