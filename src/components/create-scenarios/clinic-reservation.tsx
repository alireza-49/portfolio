"use client";

import { useMemo, useState, type ReactNode } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Alert,
  Badge,
  Button,
  Calendar,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CheckboxField,
  Field,
  Icon,
  Input,
  Progress,
  RadioGroup,
  RadioGroupField,
  Select,
  Separator,
  Stepper,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Textarea,
  buttonVariants,
  formatJalali,
  formatWeekday,
  headingType,
  labelType,
  monoType,
  toPersianDigits,
} from "@/components/create-components";
import { cn } from "@/lib/utils";
import { BookingSlip, ClinicMap, ClinicScene } from "./art/clinic-art";
import { Portrait } from "./art/portraits";
import { Ornament, StarRating } from "./art/shared";
import { Bump, Lift, Reveal, Swap } from "./motion-primitives";
import {
  CANCEL_WINDOW_HOURS,
  CLINIC_FAQ,
  CLINIC_GUARANTEES,
  CLINIC_HOURS,
  CLINIC_PRICING,
  CLINIC_SERVICES,
  CLINIC_STATUS,
  CLINIC_TESTIMONIALS,
  CLINIC_TODAY,
  CLINIC_TRUST,
  DOCTORS,
  INSURANCES,
  PERIOD_LABELS,
  SLOT_CAPACITY,
  SPECIALTIES,
  bookingCode,
  buildAvailability,
  nextFreeDate,
  slotsFor,
  type ClinicGuarantee,
  type InsuranceId,
  type SpecialtyId,
} from "./data/clinic";
import { formatNumber, formatToman } from "./format";

const STEPS = [
  { id: "doctor", label: "پزشک", hint: "تخصص" },
  { id: "time", label: "زمان", hint: "روز و ساعت" },
  { id: "patient", label: "بیمار", hint: "اطلاعات" },
  { id: "review", label: "تأیید", hint: "پرداخت" },
];

const NAV_ITEMS = [
  { label: "رزرو آنلاین", href: "#reserve" },
  { label: "پزشکان", href: "#specialists" },
  { label: "خدمات", href: "#services" },
  { label: "نظرات", href: "#reviews" },
];

const GUARANTEE_ICONS: Record<ClinicGuarantee["id"], ReactNode> = {
  cancel: <Icon name='calendar-check' className='size-3.5' />,
  payment: <Icon name='wallet' className='size-3.5' />,
  records: <Icon name='shield-check' className='size-3.5' />,
  support: <Icon name='phone' className='size-3.5' />,
};

const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
const ARABIC_DIGITS = "٠١٢٣٤٥٦٧٨٩";

/** Accept Persian and Arabic-Indic digits in the numeric inputs. */
const latinDigits = (value: string) =>
  value
    .replace(/[۰-۹]/g, (digit) => String(PERSIAN_DIGITS.indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String(ARABIC_DIGITS.indexOf(digit)));

/** Smooth scroll inside the studio's preview viewport (its only scroller). */
const scrollToSection = (id: string) => {
  document
    .getElementById(id)
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
};

/**
 * One heading scale for the clinic sections — eyebrow, display line and a
 * trailing slot. Same contract as the landing and the storefront.
 */
function SectionHeading({
  id,
  eyebrow,
  title,
  description,
  trailing,
}: {
  id: string;
  eyebrow: string;
  title: string;
  description?: string;
  trailing?: ReactNode;
}) {
  return (
    <div className='flex flex-wrap items-end justify-between gap-3'>
      <div className='flex flex-col gap-1.5'>
        <span className={cn("text-[0.6875rem] font-bold text-[color:var(--cc-primary)]", labelType)}>
          {eyebrow}
        </span>
        <h2
          id={id}
          className={cn(
            "text-xl leading-tight text-[color:var(--cc-surface-foreground)] @2xl:text-2xl",
            headingType,
          )}
        >
          {title}
        </h2>
        {description ? (
          <p className='max-w-xl text-xs leading-relaxed text-[color:var(--cc-muted-foreground)]'>
            {description}
          </p>
        ) : null}
      </div>
      {trailing}
    </div>
  );
}

type PatientForm = {
  name: string;
  phone: string;
  nationalId: string;
  insurance: InsuranceId;
  reason: string;
  consent: boolean;
  reminder: boolean;
};

const EMPTY_PATIENT: PatientForm = {
  name: "",
  phone: "",
  nationalId: "",
  insurance: "tamin",
  reason: "",
  consent: false,
  reminder: true,
};

export function ClinicReservationView() {
  const [specialty, setSpecialty] = useState<SpecialtyId>("cardio");
  const [doctorId, setDoctorId] = useState(DOCTORS[0].id);
  const [date, setDate] = useState(CLINIC_TODAY);
  const [slotId, setSlotId] = useState<string | null>(null);
  const [mode, setMode] = useState<"in-person" | "online">("in-person");
  const [firstVisit, setFirstVisit] = useState(true);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<PatientForm>(EMPTY_PATIENT);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [payment, setPayment] = useState("gateway");
  const [booking, setBooking] = useState<{ code: string } | null>(null);
  const [testimonial, setTestimonial] = useState(0);

  const doctor = DOCTORS.find((entry) => entry.id === doctorId) ?? DOCTORS[0];
  const filteredDoctors = DOCTORS.filter(
    (entry) => entry.specialty === specialty,
  );
  const availability = useMemo(() => buildAvailability(doctorId), [doctorId]);
  const slots = useMemo(() => slotsFor(doctorId, date), [doctorId, date]);
  const selectedSlot = slots.find((slot) => slot.id === slotId) ?? null;
  const freeSlots = slots.filter((slot) => !slot.taken).length;
  const insurance = INSURANCES.find((entry) => entry.id === form.insurance)!;

  const base =
    mode === "online"
      ? Math.round(doctor.fee * CLINIC_PRICING.onlineRatio)
      : doctor.fee;
  const surcharge = firstVisit ? CLINIC_PRICING.firstVisitFee : 0;
  const subtotal = base + surcharge;
  const covered = Math.round(subtotal * insurance.coverage);
  const tax = Math.round((subtotal - covered) * CLINIC_PRICING.taxRate);
  const total = subtotal - covered + tax;

  const story = CLINIC_TESTIMONIALS[testimonial];
  const dayLabel = `${formatWeekday(date)} ${formatJalali(date)}`;
  const onlineDiscount = toPersianDigits(
    Math.round((1 - CLINIC_PRICING.onlineRatio) * 100),
  );
  const nearestFree = nextFreeDate(doctor.id, date);
  const filledFields = [form.name, form.phone, form.nationalId].filter(
    (value) => value.trim().length > 0,
  ).length;
  const completion = Math.round(
    ((filledFields + (form.consent ? 1 : 0)) / 4) * 100,
  );

  const updateForm = <Key extends keyof PatientForm>(
    key: Key,
    value: PatientForm[Key],
  ) => {
    setForm((previous) => ({ ...previous, [key]: value }));
    setErrors((previous) => {
      if (!previous[key as string]) return previous;
      const next = { ...previous };
      delete next[key as string];
      return next;
    });
  };

  const validatePatient = () => {
    const next: Record<string, string> = {};
    if (form.name.trim().length < 3)
      next.name = "نام و نام خانوادگی را کامل بنویسید.";
    if (!/^09\d{9}$/.test(latinDigits(form.phone)))
      next.phone = "شمارهٔ موبایل باید با ۰۹ شروع شود و ۱۱ رقم باشد.";
    if (!/^\d{10}$/.test(latinDigits(form.nationalId)))
      next.nationalId = "کد ملی باید ۱۰ رقم باشد.";
    if (!form.consent) next.consent = "برای ادامه، تأیید قوانین لازم است.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const next = () => {
    if (step === 2 && !validatePatient()) return;
    setStep((previous) => Math.min(STEPS.length - 1, previous + 1));
  };

  /** Selecting a doctor never leaves an online visit on a non-online doctor. */
  const selectDoctor = (id: string) => {
    const entry = DOCTORS.find((item) => item.id === id);
    if (!entry) return;
    setDoctorId(entry.id);
    if (!entry.online) setMode("in-person");
    setSlotId(null);
  };

  const pickSpecialty = (id: SpecialtyId) => {
    setSpecialty(id);
    const first = DOCTORS.find((entry) => entry.specialty === id);
    if (first) selectDoctor(first.id);
  };

  const pickDate = (iso: string) => {
    setDate(iso);
    setSlotId(null);
  };

  const startBooking = () => {
    setBooking(null);
    setStep(0);
    setSlotId(null);
    setErrors({});
    scrollToSection("reserve");
  };

  const bookDoctor = (id: string) => {
    const entry = DOCTORS.find((item) => item.id === id);
    if (!entry) return;
    setSpecialty(entry.specialty);
    selectDoctor(entry.id);
    setStep(1);
    scrollToSection("reserve");
  };

  const bookOnline = (id: string) => {
    const entry = DOCTORS.find((item) => item.id === id);
    if (!entry?.online) return;
    setSpecialty(entry.specialty);
    selectDoctor(entry.id);
    setMode("online");
    setStep(1);
    scrollToSection("reserve");
  };

  const startOnline = () => {
    const target = doctor.online
      ? doctor
      : (DOCTORS.find((entry) => entry.online) ?? doctor);
    bookOnline(target.id);
  };

  const confirmBooking = () => {
    setBooking({ code: bookingCode(doctor.id, date, slotId) });
  };

  const resetBooking = () => {
    setBooking(null);
    setStep(0);
    setSlotId(null);
    setForm(EMPTY_PATIENT);
    setErrors({});
  };

  const modeLabel = mode === "online" ? "آنلاین" : "حضوری در درمانگاه";
  const visitMinutes = firstVisit
    ? CLINIC_PRICING.firstVisitMinutes
    : CLINIC_PRICING.followVisitMinutes;

  return (
    <div className='@container flex flex-col gap-6'>
      {/* ------------------------------------------------------------- header */}
      <header className='flex flex-col gap-2'>
        <div className='flex flex-wrap items-center justify-between gap-3 rounded-[var(--cc-radius)] border-[length:var(--cc-border-width)] border-[color:var(--cc-border)] bg-[var(--cc-surface)] px-3 py-2 [box-shadow:var(--cc-shadow)]'>
          <a href='#clinic-hero' className='flex items-center gap-2.5'>
            <span className='flex size-9 items-center justify-center rounded-[var(--cc-radius)] bg-[var(--cc-primary)] text-[color:var(--cc-primary-foreground)]'>
              <Icon name='brand' className='size-5' />
            </span>
            <span className='flex flex-col'>
              <span className='text-sm font-bold text-[color:var(--cc-surface-foreground)]'>
                درمانگاه تخصصی حکیم
              </span>
              <span className='text-[0.625rem] text-[color:var(--cc-muted-foreground)]'>
                نوبت‌دهی آنلاین · شبانه‌روزی
              </span>
            </span>
          </a>

          <nav
            aria-label='بخش‌های صفحه'
            className='hidden items-center gap-0.5 @3xl:flex'
          >
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className='rounded-[var(--cc-radius-sm)] px-2.5 py-1.5 text-xs font-medium text-[color:var(--cc-surface-foreground)] transition-colors hover:bg-[var(--cc-muted)]'
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className='flex items-center gap-2'>
            <Badge variant='success' className='hidden gap-1 @xl:inline-flex'>
              <span className='size-1.5 rounded-full bg-current' />
              باز است تا {CLINIC_STATUS.openUntil}
            </Badge>
            <a
              href='tel:+982188770000'
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "gap-1.5",
              )}
            >
              <Icon name='phone' className='size-3.5' />
              <span dir='ltr' className={monoType}>
                {CLINIC_STATUS.supportPhone}
              </span>
            </a>
            <Button size='sm' onClick={startBooking}>
              رزرو نوبت
            </Button>
          </div>
        </div>

        {/* Narrow previews get the anchors as a scrollable row under the bar. */}
        <nav
          aria-label='بخش‌های صفحه'
          className='-mt-2 flex items-center gap-1 overflow-x-auto pb-0.5 @3xl:hidden'
        >
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className='shrink-0 rounded-[var(--cc-radius-sm)] border-[length:var(--cc-border-width)] border-[color:var(--cc-border)] px-2.5 py-1 text-[0.6875rem] text-[color:var(--cc-muted-foreground)]'
            >
              {item.label}
            </a>
          ))}
        </nav>
      </header>

      {/* --------------------------------------------------------------- hero */}
      <section
        id='clinic-hero'
        aria-labelledby='clinic-hero-title'
        className='relative overflow-hidden rounded-[var(--cc-radius-lg)] border-[length:var(--cc-border-width)] border-[color:var(--cc-border)] bg-[var(--cc-surface)] [box-shadow:var(--cc-shadow)]'
      >
        <div className='grid items-stretch @3xl:grid-cols-[1.05fr_0.95fr]'>
          <div className='flex flex-col gap-4 p-5 @2xl:p-7'>
            <div className='flex flex-wrap items-center gap-2'>
              <Badge variant='soft' className='gap-1'>
                <Icon name='sparkles' className='size-3' />
                نوبت‌دهی هوشمند
              </Badge>
              <Ornament />
            </div>

            <h1
              id='clinic-hero-title'
              className={`text-2xl leading-tight text-[color:var(--cc-surface-foreground)] @2xl:text-3xl ${headingType}`}
            >
              نوبت ویزیت، بدون صف و تماس تلفنی
            </h1>

            <p className='max-w-xl text-sm leading-relaxed text-[color:var(--cc-muted-foreground)]'>
              پزشک، روز و ساعت را خودت انتخاب کن؛ بیمه به‌صورت خودکار محاسبه
              می‌شود و یادآوری پیامکی می‌رسد. برای ویزیت حضوری یا آنلاین، فقط سه
              دقیقه وقت لازم است.
            </p>

            <div className='flex flex-wrap items-center gap-2'>
              <Button size='lg' onClick={startBooking}>
                شروع رزرو نوبت
                <Icon name='arrow-left' className='size-4' />
              </Button>
              <Button size='lg' variant='outline' onClick={startOnline}>
                <Icon name='video' className='size-4' />
                ویزیت آنلاین
              </Button>
            </div>

            <div className='flex flex-wrap items-center gap-3 rounded-[var(--cc-radius)] border-[length:var(--cc-border-width)] border-[color:var(--cc-border)] bg-[var(--cc-muted)] p-2.5'>
              <span className='flex items-center gap-1.5 text-[0.625rem] text-[color:var(--cc-surface-foreground)]'>
                <Icon name='shield-check' className='size-3.5 text-[color:var(--cc-primary)]' />
                بیمهٔ تأمین اجتماعی و سلامت
              </span>
              <span className='flex items-center gap-1.5 text-[0.625rem] text-[color:var(--cc-surface-foreground)]'>
                <Icon name='clock' className='size-3.5 text-[color:var(--cc-primary)]' />
                لغو رایگان تا {formatNumber(CANCEL_WINDOW_HOURS)} ساعت قبل
              </span>
              <span className='flex items-center gap-1.5 text-[0.625rem] text-[color:var(--cc-surface-foreground)]'>
                <Icon name='wallet' className='size-3.5 text-[color:var(--cc-primary)]' />
                پرداخت در محل یا آنلاین
              </span>
            </div>

            <div className='grid grid-cols-2 gap-3 border-t-[length:var(--cc-border-width)] border-[color:var(--cc-border)] pt-3 @xl:grid-cols-4'>
              {CLINIC_TRUST.map((item) => (
                <div key={item.label} className='flex flex-col gap-0.5'>
                  <span
                    className={cn(
                      "text-sm font-black text-[color:var(--cc-surface-foreground)]",
                      monoType,
                    )}
                  >
                    {item.value}
                  </span>
                  <span className='text-[0.625rem] text-[color:var(--cc-muted-foreground)]'>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className='relative min-h-[20rem] overflow-hidden border-t-[length:var(--cc-border-width)] border-[color:var(--cc-border)] bg-[var(--cc-muted)] @3xl:min-h-[26.875rem] @3xl:border-s @3xl:border-t-0'>
            <ClinicScene className='absolute inset-0 size-full' />
            <div className='absolute start-3 top-3'>
              <Badge variant='success' className='gap-1'>
                <span className='size-1.5 rounded-full bg-current' />
                پذیرش فعال
              </Badge>
            </div>
            <div className='absolute bottom-3 end-3'>
              <Badge
                variant='outline'
                className='gap-1 bg-[var(--cc-surface)]'
                aria-live='polite'
              >
                <Icon name='calendar-check' className='size-3' />
                اولین نوبت آزاد:{" "}
                {nearestFree ? formatJalali(nearestFree) : "تماس بگیرید"}
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- reservation */}
      <section
        id='reserve'
        aria-labelledby='reserve-title'
        className='flex flex-col gap-3'
      >
        <SectionHeading
          id='reserve-title'
          eyebrow='رزرو آنلاین'
          title='چهار قدم تا نوبت ویزیت'
          description='اطلاعات را مرحله‌به‌مرحله کامل کن؛ هر زمان خواستی می‌توانی به مرحلهٔ قبل برگردی.'
          trailing={
            <Badge
              variant={
                freeSlots > 2 ? "success" : freeSlots > 0 ? "warning" : "danger"
              }
              aria-live='polite'
            >
              {freeSlots > 0
                ? `${formatNumber(freeSlots)} نوبت آزاد در ${formatWeekday(date)}`
                : `${formatWeekday(date)} بدون نوبت آزاد`}
            </Badge>
          }
        />

        <div className='grid gap-4 @3xl:grid-cols-[1.4fr_0.6fr]'>
          <Card className='gap-4'>
            <Stepper steps={STEPS} current={step} onStepClick={setStep} />
            <Swap
              swapKey={booking ? "done" : `step-${step}`}
              className='flex flex-col gap-3'
            >
              {booking ? (
                <div className='flex flex-col gap-3'>
                  <Alert variant='success' title='نوبت شما ثبت شد'>
                    کد پیگیری{" "}
                    <span className={cn("font-bold", monoType)} dir='ltr'>
                      {booking.code}
                    </span>{" "}
                    به شمارهٔ {form.phone || "موبایل شما"} پیامک شد.
                  </Alert>
                  <div className='grid gap-3 @xl:grid-cols-[0.9fr_1.1fr]'>
                    <BookingSlip code={booking.code} />
                    <div className='flex flex-col gap-2'>
                      {[
                        { label: "پزشک", value: doctor.name },
                        { label: "تاریخ", value: dayLabel },
                        {
                          label: "ساعت",
                          value: selectedSlot?.time ?? "—",
                          mono: true,
                        },
                        { label: "نوع ویزیت", value: modeLabel },
                        { label: "بیمه", value: insurance.label },
                        {
                          label: "مبلغ پرداختی",
                          value: formatToman(total),
                          mono: true,
                        },
                      ].map((row) => (
                        <div
                          key={row.label}
                          className='flex items-center justify-between gap-2 border-b-[length:var(--cc-border-width)] border-[color:var(--cc-border)] pb-1 last:border-b-0'
                        >
                          <span className='text-[0.625rem] text-[color:var(--cc-muted-foreground)]'>
                            {row.label}
                          </span>
                          <span
                            className={cn(
                              "text-xs font-bold text-[color:var(--cc-surface-foreground)]",
                              row.mono && monoType,
                            )}
                          >
                            {row.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className='flex flex-wrap gap-2'>
                    <Button onClick={resetBooking}>رزرو نوبت دیگر</Button>
                    <Button variant='outline'>
                      <Icon name='calendar' className='size-3.5' />
                      افزودن به تقویم
                    </Button>
                    <a
                      href='tel:+982188770000'
                      className={buttonVariants({ variant: "outline" })}
                    >
                      <Icon name='phone' className='size-3.5' />
                      تماس با پذیرش
                    </a>
                  </div>
                </div>
              ) : (
                <>
                  {step === 0 ? (
                    <div className='flex flex-col gap-3'>
                      <div className='flex flex-wrap gap-1'>
                        {SPECIALTIES.map((item) => (
                          <Button
                            key={item.id}
                            size='sm'
                            variant={specialty === item.id ? "solid" : "outline"}
                            aria-pressed={specialty === item.id}
                            onClick={() => pickSpecialty(item.id)}
                          >
                            {item.label}
                          </Button>
                        ))}
                      </div>

                      <Separator />

                      <div className='grid grid-cols-1 gap-2 @xl:grid-cols-2'>
                        {filteredDoctors.map((entry) => {
                          const selected = entry.id === doctorId;
                          const firstFree = Object.entries(
                            buildAvailability(entry.id),
                          ).find(([, count]) => count > 0);
                          return (
                            <button
                              key={entry.id}
                              type='button'
                              data-cc-doctor={entry.id}
                              onClick={() => selectDoctor(entry.id)}
                              aria-pressed={selected}
                              className={cn(
                                "flex flex-col gap-2 rounded-[var(--cc-radius)] border-[length:var(--cc-border-width)] p-2.5 text-start transition-[box-shadow,translate,background-color] duration-[var(--cc-duration)]",
                                selected
                                  ? "border-[color:var(--cc-primary)] bg-[color:color-mix(in_srgb,var(--cc-primary)_7%,var(--cc-surface))] [box-shadow:var(--cc-shadow)]"
                                  : "border-[color:var(--cc-border)] bg-[var(--cc-surface)] hover:bg-[var(--cc-muted)]",
                              )}
                            >
                              <div className='flex items-start gap-2.5'>
                                <Portrait
                                  variant={entry.portrait}
                                  className='size-12 shrink-0 overflow-hidden rounded-[var(--cc-radius)] border-[length:var(--cc-border-width)] border-[color:var(--cc-border)]'
                                />
                                <div className='flex min-w-0 flex-1 flex-col gap-0.5'>
                                  <span className='text-xs font-bold text-[color:var(--cc-surface-foreground)]'>
                                    {entry.name}
                                  </span>
                                  <span className='text-[0.625rem] text-[color:var(--cc-muted-foreground)]'>
                                    {entry.title} · {toPersianDigits(entry.years)}{" "}
                                    سال تجربه
                                  </span>
                                  <div className='flex flex-wrap items-center gap-x-2 gap-y-0.5'>
                                    <StarRating value={entry.rating} />
                                    <span className='whitespace-nowrap text-[0.5625rem] text-[color:var(--cc-muted-foreground)]'>
                                      ({formatNumber(entry.reviews)} نظر)
                                    </span>
                                  </div>
                                </div>
                                {selected ? (
                                  <span className='flex size-5 shrink-0 items-center justify-center rounded-full bg-[var(--cc-primary)] text-[color:var(--cc-primary-foreground)]'>
                                    <Icon name='check' className='size-3' />
                                  </span>
                                ) : null}
                              </div>

                              <div className='flex flex-wrap items-center gap-1'>
                                {entry.tags.map((tag) => (
                                  <Badge key={tag} variant='outline'>
                                    {tag}
                                  </Badge>
                                ))}
                                {entry.online ? (
                                  <Badge variant='soft' className='gap-1'>
                                    <Icon name='video' className='size-2.5' />
                                    آنلاین
                                  </Badge>
                                ) : null}
                              </div>

                              <div className='mt-auto flex items-center justify-between gap-2 border-t-[length:var(--cc-border-width)] border-[color:var(--cc-border)] pt-1.5'>
                                <span
                                  className={cn(
                                    "text-[0.6875rem] font-bold text-[color:var(--cc-surface-foreground)]",
                                    monoType,
                                  )}
                                >
                                  {formatToman(entry.fee)}
                                </span>
                                <span className='text-[0.5625rem] text-[color:var(--cc-muted-foreground)]'>
                                  {firstFree
                                    ? `اولین نوبت: ${formatJalali(firstFree[0])}`
                                    : "ظرفیت تکمیل"}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : null}

                  {step === 1 ? (
                    <div className='flex flex-col gap-3'>
                      <div className='grid gap-3 @2xl:grid-cols-[auto_1fr]'>
                        <div className='flex flex-col gap-1.5'>
                          <span
                            className={cn(
                              "text-[0.625rem] text-[color:var(--cc-muted-foreground)]",
                              labelType,
                            )}
                          >
                            تاریخ ویزیت
                          </span>
                          <Calendar
                            value={date}
                            today={CLINIC_TODAY}
                            availability={availability}
                            onValueChange={pickDate}
                          />
                        </div>

                        <div className='flex flex-col gap-2.5'>
                          <span
                            className={cn(
                              "text-[0.625rem] text-[color:var(--cc-muted-foreground)]",
                              labelType,
                            )}
                          >
                            نوع ویزیت
                          </span>
                          <RadioGroup
                            value={mode}
                            onValueChange={(value) =>
                              setMode(value as "in-person" | "online")
                            }
                            className='gap-2 rounded-[var(--cc-radius)] border-[length:var(--cc-border-width)] border-[color:var(--cc-border)] p-2'
                          >
                            <RadioGroupField
                              value='in-person'
                              label='حضوری در درمانگاه'
                              description='معاینه، نوار قلب و نمونه‌گیری در محل'
                            />
                            <RadioGroupField
                              value='online'
                              label={`ویزیت آنلاین (${onlineDiscount}٪ کمتر)`}
                              description={
                                doctor.online
                                  ? "تماس تصویری امن؛ نسخهٔ الکترونیک"
                                  : "این پزشک ویزیت آنلاین ندارد"
                              }
                              disabled={!doctor.online}
                            />
                          </RadioGroup>

                          <div
                            onClick={() => setFirstVisit((previous) => !previous)}
                            className='flex cursor-pointer items-center justify-between gap-2 rounded-[var(--cc-radius)] border-[length:var(--cc-border-width)] border-[color:var(--cc-border)] p-2'
                          >
                            <div className='flex flex-col'>
                              <span className='text-xs font-bold text-[color:var(--cc-surface-foreground)]'>
                                نوبت اول من است
                              </span>
                              <span className='text-[0.625rem] text-[color:var(--cc-muted-foreground)]'>
                                ویزیت {formatNumber(CLINIC_PRICING.firstVisitMinutes)} دقیقه‌ای + بررسی سوابق
                              </span>
                            </div>
                            <span onClick={(event) => event.stopPropagation()}>
                              <Switch
                                checked={firstVisit}
                                onCheckedChange={setFirstVisit}
                                aria-label='نوبت اول'
                              />
                            </span>
                          </div>

                          <div
                            className='flex flex-col gap-1 rounded-[var(--cc-radius)] bg-[var(--cc-muted)] p-2'
                            aria-live='polite'
                          >
                            <div className='flex items-center justify-between gap-2'>
                              <span className='text-[0.625rem] text-[color:var(--cc-muted-foreground)]'>
                                {dayLabel}
                              </span>
                              <Badge
                                variant={
                                  freeSlots > 2
                                    ? "success"
                                    : freeSlots > 0
                                      ? "warning"
                                      : "danger"
                                }
                              >
                                {formatNumber(freeSlots)} نوبت آزاد
                              </Badge>
                            </div>
                            <Progress
                              value={((SLOT_CAPACITY - freeSlots) / SLOT_CAPACITY) * 100}
                            />
                            <span className='text-[0.5625rem] text-[color:var(--cc-muted-foreground)]'>
                              ظرفیت روز {formatNumber(SLOT_CAPACITY)} نوبت است
                            </span>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {freeSlots === 0 ? (
                        <div className='flex flex-col items-start gap-2 rounded-[var(--cc-radius)] border-[length:var(--cc-border-width)] border-[color:var(--cc-border)] bg-[var(--cc-muted)] p-3'>
                          <span className='flex items-center gap-1.5 text-xs font-bold text-[color:var(--cc-surface-foreground)]'>
                            <Icon
                              name='alert-circle'
                              className='size-4 text-[color:var(--cc-warning)]'
                            />
                            این روز نوبت آزاد ندارد
                          </span>
                          <span className='text-[0.625rem] leading-relaxed text-[color:var(--cc-muted-foreground)]'>
                            {nearestFree
                              ? `نزدیک‌ترین روز آزاد ${formatWeekday(nearestFree)} ${formatJalali(nearestFree)} است.`
                              : "برای روزهای بعد با پذیرش تماس بگیر."}
                          </span>
                          {nearestFree ? (
                            <Button
                              size='sm'
                              variant='outline'
                              onClick={() => pickDate(nearestFree)}
                            >
                              <Icon name='calendar-check' className='size-3.5' />
                              رفتن به نزدیک‌ترین روز آزاد
                            </Button>
                          ) : null}
                        </div>
                      ) : (
                        <Swap
                          swapKey={`${doctorId}-${date}`}
                          className='flex flex-col gap-2'
                        >
                          {(["morning", "afternoon", "evening"] as const).map(
                            (period) => {
                              const group = slots.filter(
                                (slot) => slot.period === period,
                              );
                              return (
                                <div key={period} className='flex flex-col gap-1'>
                                  <div className='flex items-center justify-between'>
                                    <span
                                      className={cn(
                                        "text-[0.625rem] text-[color:var(--cc-surface-foreground)]",
                                        labelType,
                                      )}
                                    >
                                      {PERIOD_LABELS[period]}
                                    </span>
                                    <span className='text-[0.5625rem] text-[color:var(--cc-muted-foreground)]'>
                                      {formatNumber(
                                        group.filter((slot) => !slot.taken).length,
                                      )}{" "}
                                      نوبت آزاد
                                    </span>
                                  </div>
                                  <div className='grid grid-cols-3 gap-1 @xl:grid-cols-6'>
                                    {group.map((slot) => (
                                      <Button
                                        key={slot.id}
                                        size='sm'
                                        data-cc-slot={slot.id}
                                        disabled={slot.taken}
                                        aria-pressed={slotId === slot.id}
                                        variant={
                                          slotId === slot.id ? "solid" : "outline"
                                        }
                                        onClick={() => setSlotId(slot.id)}
                                        className='flex flex-col gap-0 py-1 leading-none'
                                      >
                                        <span className={cn("text-[0.6875rem]", monoType)}>
                                          {slot.time}
                                        </span>
                                        <span className='text-[0.5rem] opacity-70'>
                                          {slot.taken ? "تکمیل" : "آزاد"}
                                        </span>
                                      </Button>
                                    ))}
                                  </div>
                                </div>
                              );
                            },
                          )}
                        </Swap>
                      )}
                    </div>
                  ) : null}

                  {step === 2 ? (
                    <div className='flex flex-col gap-3'>
                      <div className='grid gap-2.5 @xl:grid-cols-2'>
                        <Field
                          label='نام و نام خانوادگی'
                          htmlFor='clinic-name'
                          hint={errors.name}
                        >
                          <Input
                            id='clinic-name'
                            value={form.name}
                            placeholder='مثلاً سارا محمدی'
                            aria-invalid={Boolean(errors.name)}
                            onChange={(event) =>
                              updateForm("name", event.target.value)
                            }
                          />
                        </Field>

                        <Field
                          label='شمارهٔ موبایل'
                          htmlFor='clinic-phone'
                          hint={errors.phone}
                        >
                          <Input
                            id='clinic-phone'
                            dir='ltr'
                            inputMode='tel'
                            value={form.phone}
                            placeholder='09121234567'
                            aria-invalid={Boolean(errors.phone)}
                            onChange={(event) =>
                              updateForm("phone", event.target.value)
                            }
                          />
                        </Field>

                        <Field
                          label='کد ملی'
                          htmlFor='clinic-nid'
                          hint={errors.nationalId ?? "۱۰ رقم، بدون خط تیره"}
                        >
                          <Input
                            id='clinic-nid'
                            dir='ltr'
                            inputMode='numeric'
                            value={form.nationalId}
                            placeholder='0012345678'
                            aria-invalid={Boolean(errors.nationalId)}
                            onChange={(event) =>
                              updateForm("nationalId", event.target.value)
                            }
                          />
                        </Field>

                        <Field label='بیمه' htmlFor='clinic-insurance'>
                          <Select
                            id='clinic-insurance'
                            value={form.insurance}
                            onValueChange={(value) =>
                              updateForm("insurance", value as InsuranceId)
                            }
                            options={INSURANCES.map((entry) => ({
                              value: entry.id,
                              label: `${entry.label} — پوشش ${Math.round(
                                entry.coverage * 100,
                              )}٪`,
                            }))}
                          />
                        </Field>
                      </div>

                      <Field
                        label='علت مراجعه'
                        htmlFor='clinic-reason'
                        hint='هرچه دقیق‌تر بنویسی، پزشک بهتر آماده می‌شود.'
                      >
                        <Textarea
                          id='clinic-reason'
                          rows={3}
                          value={form.reason}
                          placeholder='مثلاً درد قفسهٔ سینه هنگام فعالیت از دو هفته پیش…'
                          onChange={(event) =>
                            updateForm("reason", event.target.value)
                          }
                        />
                      </Field>

                      <div className='flex flex-col gap-2 rounded-[var(--cc-radius)] border-[length:var(--cc-border-width)] border-[color:var(--cc-border)] p-2.5'>
                        <CheckboxField
                          label='قوانین لغو و حریم خصوصی را می‌پذیرم'
                          description={`لغو رایگان تا ${formatNumber(CANCEL_WINDOW_HOURS)} ساعت قبل از ویزیت.`}
                          checked={form.consent}
                          onCheckedChange={(checked) =>
                            updateForm("consent", Boolean(checked))
                          }
                        />
                        <CheckboxField
                          label='یادآوری پیامکی بفرست'
                          description='۲۴ ساعت و ۲ ساعت قبل از نوبت.'
                          checked={form.reminder}
                          onCheckedChange={(checked) =>
                            updateForm("reminder", Boolean(checked))
                          }
                        />
                        {errors.consent ? (
                          <span className='text-[0.625rem] font-bold text-[color:var(--cc-danger)]'>
                            {errors.consent}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  ) : null}

                  {step === 3 ? (
                    <div className='flex flex-col gap-3'>
                      <div className='grid gap-3 @xl:grid-cols-2'>
                        <div className='flex flex-col gap-2 rounded-[var(--cc-radius)] border-[length:var(--cc-border-width)] border-[color:var(--cc-border)] p-2.5'>
                          <span
                            className={cn(
                              "text-[0.625rem] text-[color:var(--cc-muted-foreground)]",
                              labelType,
                            )}
                          >
                            مشخصات نوبت
                          </span>
                          {[
                            ["پزشک", `${doctor.name} — ${doctor.title}`],
                            ["تاریخ", dayLabel],
                            ["ساعت", selectedSlot?.time ?? "—"],
                            ["نوع ویزیت", modeLabel],
                            [
                              "مدت ویزیت",
                              `${formatNumber(visitMinutes)} دقیقه${firstVisit ? " (نوبت اول)" : ""}`,
                            ],
                          ].map(([label, value]) => (
                            <div
                              key={label}
                              className='flex items-start justify-between gap-2 border-b-[length:var(--cc-border-width)] border-[color:var(--cc-border)] pb-1 last:border-b-0 last:pb-0'
                            >
                              <span className='text-[0.625rem] text-[color:var(--cc-muted-foreground)]'>
                                {label}
                              </span>
                              <span className='text-xs font-bold text-[color:var(--cc-surface-foreground)]'>
                                {value}
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className='flex flex-col gap-2 rounded-[var(--cc-radius)] border-[length:var(--cc-border-width)] border-[color:var(--cc-border)] p-2.5'>
                          <span
                            className={cn(
                              "text-[0.625rem] text-[color:var(--cc-muted-foreground)]",
                              labelType,
                            )}
                          >
                            بیمار
                          </span>
                          {[
                            ["نام", form.name || "—"],
                            ["موبایل", form.phone || "—"],
                            ["بیمه", insurance.label],
                          ].map(([label, value]) => (
                            <div
                              key={label}
                              className='flex items-center justify-between gap-2 border-b-[length:var(--cc-border-width)] border-[color:var(--cc-border)] pb-1 last:border-b-0'
                            >
                              <span className='text-[0.625rem] text-[color:var(--cc-muted-foreground)]'>
                                {label}
                              </span>
                              <span
                                className='text-xs font-bold text-[color:var(--cc-surface-foreground)]'
                                dir={label === "موبایل" ? "ltr" : undefined}
                              >
                                {value}
                              </span>
                            </div>
                          ))}
                          <Progress value={completion} />
                          <span className='text-[0.5625rem] text-[color:var(--cc-muted-foreground)]'>
                            {completion === 100
                              ? "اطلاعات کامل است"
                              : `${formatNumber(completion)}٪ اطلاعات کامل است`}
                          </span>
                        </div>
                      </div>

                      <div className='flex flex-col gap-2 rounded-[var(--cc-radius)] border-[length:var(--cc-border-width)] border-[color:var(--cc-border)] p-2.5'>
                        <span
                          className={cn(
                            "text-[0.625rem] text-[color:var(--cc-muted-foreground)]",
                            labelType,
                          )}
                        >
                          پرداخت
                        </span>
                        <RadioGroup value={payment} onValueChange={setPayment}>
                          <RadioGroupField
                            value='gateway'
                            label='پرداخت آنلاین با درگاه بانکی'
                            description='رسید بلافاصله صادر می‌شود.'
                          />
                          <RadioGroupField
                            value='onsite'
                            label='پرداخت در محل'
                            description='کارت‌خوان پذیرش؛ رزرو تا ۱۵ دقیقه نگه داشته می‌شود.'
                          />
                        </RadioGroup>
                      </div>

                      <Alert variant='info' title='پیش از تأیید'>
                        با تأیید نوبت، مبلغ بالا از طریق درگاه کسر می‌شود و سهم بیمه
                        در صورت داشتن دفترچه، در محل بازپرداخت می‌گردد.
                      </Alert>
                    </div>
                  ) : null}
                </>
              )}
            </Swap>

            {booking ? null : (
              <div className='flex flex-wrap items-center justify-between gap-2 border-t-[length:var(--cc-border-width)] border-[color:var(--cc-border)] pt-2'>
                <Button
                  variant='outline'
                  size='sm'
                  disabled={step === 0}
                  onClick={() =>
                    setStep((previous) => Math.max(0, previous - 1))
                  }
                >
                  <Icon name='chevron-right' className='size-3.5' />
                  مرحلهٔ قبل
                </Button>
  
                <span className='text-[0.5625rem] text-[color:var(--cc-muted-foreground)]'>
                  {step === 1 && !selectedSlot
                    ? freeSlots === 0
                      ? "این روز پر است؛ روز دیگری را انتخاب کن"
                      : "یک ساعت را انتخاب کن"
                    : step === 2
                      ? "اطلاعات بیمار را کامل کن"
                      : `مرحلهٔ ${toPersianDigits(step + 1)} از ${toPersianDigits(STEPS.length)}`}
                </span>
  
                {step < 3 ? (
                  <Button
                    size='sm'
                    onClick={next}
                    disabled={step === 1 && !selectedSlot}
                  >
                    ادامه
                    <Icon name='chevron-left' className='size-3.5' />
                  </Button>
                ) : (
                  <Button size='sm' onClick={confirmBooking}>
                    <Icon name='credit-card' className='size-3.5' />
                    تأیید و پرداخت{" "}
                    <span className={monoType}>{formatToman(total)}</span>
                  </Button>
                )}
              </div>
            )}
          </Card>

          <aside className='flex flex-col gap-3'>
            <Card className='gap-2.5'>
              <div className='flex items-center justify-between gap-2'>
                <span
                  className={cn(
                    "text-[0.625rem] text-[color:var(--cc-muted-foreground)]",
                    labelType,
                  )}
                >
                  خلاصهٔ نوبت
                </span>
                <Badge variant={selectedSlot ? "success" : "outline"}>
                  {selectedSlot ? "آماده" : "ناقص"}
                </Badge>
              </div>

              <div className='flex items-center gap-2'>
                <Portrait
                  variant={doctor.portrait}
                  className='size-10 shrink-0 overflow-hidden rounded-full border-[length:var(--cc-border-width)] border-[color:var(--cc-border)]'
                />
                <div className='flex min-w-0 flex-col'>
                  <span className='text-xs font-bold text-[color:var(--cc-surface-foreground)]'>
                    {doctor.name}
                  </span>
                  <span className='text-[0.5625rem] text-[color:var(--cc-muted-foreground)]'>
                    {doctor.title}
                  </span>
                </div>
              </div>

              <Separator />

              <div className='flex flex-col gap-1.5'>
                {[
                  {
                    icon: <Icon name='calendar-check' className='size-3.5' />,
                    label: dayLabel,
                  },
                  {
                    icon: <Icon name='clock' className='size-3.5' />,
                    label: selectedSlot ? selectedSlot.time : "ساعت انتخاب نشده",
                  },
                  {
                    icon:
                      mode === "online" ? (
                        <Icon name='video' className='size-3.5' />
                      ) : (
                        <Icon name='stethoscope' className='size-3.5' />
                      ),
                    label: mode === "online" ? "ویزیت آنلاین" : "ویزیت حضوری",
                  },
                ].map((row) => (
                  <span
                    key={row.label}
                    className='flex items-center gap-1.5 text-[0.625rem] text-[color:var(--cc-surface-foreground)]'
                  >
                    <span className='text-[color:var(--cc-primary)]'>
                      {row.icon}
                    </span>
                    {row.label}
                  </span>
                ))}
              </div>

              <Separator />

              <div className='flex flex-col gap-1'>
                {[
                  ["ویزیت", formatToman(base)],
                  ["نوبت اول", formatToman(surcharge)],
                  [
                    `بیمهٔ ${insurance.label}`,
                    covered > 0 ? `− ${formatToman(covered)}` : "—",
                  ],
                  ["مالیات", formatToman(tax)],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className='flex items-center justify-between gap-2 text-[0.625rem] text-[color:var(--cc-muted-foreground)]'
                  >
                    <span>{label}</span>
                    <span className={monoType}>{value}</span>
                  </div>
                ))}
              </div>

              <div
                className='flex items-baseline justify-between gap-2 border-t-[length:var(--cc-border-width)] border-[color:var(--cc-border)] pt-1.5'
                aria-live='polite'
              >
                <span className='text-[0.625rem] text-[color:var(--cc-muted-foreground)]'>
                  مبلغ نهایی
                </span>
                <Bump
                  trigger={total}
                  className={cn(
                    "whitespace-nowrap text-sm font-black text-[color:var(--cc-surface-foreground)]",
                    monoType,
                    headingType,
                  )}
                >
                  {formatToman(total)}
                </Bump>
              </div>

              <Progress value={(step / (STEPS.length - 1)) * 100} />
            </Card>

            <Card className='gap-2'>
              <div className='flex items-center gap-2'>
                <span className='flex size-8 items-center justify-center rounded-full bg-[var(--cc-muted)] text-[color:var(--cc-primary)]'>
                  <Icon name='badge-check' className='size-4' />
                </span>
                <div className='flex flex-col'>
                  <span className='text-xs font-bold text-[color:var(--cc-surface-foreground)]'>
                    تضمین خدمات
                  </span>
                  <span className='text-[0.5625rem] text-[color:var(--cc-muted-foreground)]'>
                    لغو رایگان تا {formatNumber(CANCEL_WINDOW_HOURS)} ساعت قبل
                  </span>
                </div>
              </div>
              <p className='text-[0.625rem] leading-relaxed text-[color:var(--cc-muted-foreground)]'>
                اگر پزشک در زمان مقرر حاضر نشود، هزینه به‌صورت کامل بازگردانده
                می‌شود.
              </p>
              <a
                href='tel:+982188770000'
                className={buttonVariants({
                  variant: "outline",
                  size: "sm",
                  fullWidth: true,
                })}
              >
                <Icon name='phone' className='size-3.5' />
                پشتیبانی ۲۴ ساعته
              </a>
            </Card>
          </aside>
        </div>
      </section>

      {/* ----------------------------------------------------------- specialists */}
      <Reveal>
        <section
          id='specialists'
          aria-labelledby='specialists-title'
          className='flex flex-col gap-3'
        >
          <SectionHeading
            id='specialists-title'
            eyebrow='تیم درمان'
            title='پزشکان و تخصص‌ها'
            description='برای هر تخصص یک پزشک معتمد؛ ظرفیت و تعرفه به‌روز است.'
            trailing={<Ornament />}
          />

          <div className='grid grid-cols-1 gap-3 @xl:grid-cols-3'>
            {DOCTORS.map((entry) => (
              <Lift key={entry.id} className='h-full'>
                <Card className='h-full gap-2.5'>
                  <div className='flex flex-wrap items-start gap-x-2.5 gap-y-2'>
                    <Portrait
                      variant={entry.portrait}
                      className='size-14 shrink-0 overflow-hidden rounded-[var(--cc-radius)] border-[length:var(--cc-border-width)] border-[color:var(--cc-border)]'
                    />
                    <div className='flex min-w-0 flex-1 basis-[6.5rem] flex-col gap-0.5'>
                      <span className='text-sm font-bold text-[color:var(--cc-surface-foreground)]'>
                        {entry.name}
                      </span>
                      <span className='text-[0.625rem] text-[color:var(--cc-muted-foreground)]'>
                        {entry.title}
                      </span>
                    </div>
                    <Badge variant='outline' className='shrink-0'>
                      <span className={monoType}>{formatToman(entry.fee)}</span>
                    </Badge>
                  </div>

                  <div className='flex flex-wrap items-center gap-x-2 gap-y-0.5'>
                    <StarRating value={entry.rating} />
                    <span className='whitespace-nowrap text-[0.5625rem] text-[color:var(--cc-muted-foreground)]'>
                      {formatNumber(entry.reviews)} نظر
                    </span>
                  </div>

                  <p className='text-[0.625rem] leading-relaxed text-[color:var(--cc-muted-foreground)]'>
                    {entry.bio}
                  </p>

                  <div className='flex flex-wrap gap-1'>
                    {entry.tags.map((tag) => (
                      <Badge key={tag} variant='soft'>
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className='mt-auto flex items-center gap-1.5'>
                    <Button
                      size='sm'
                      fullWidth
                      onClick={() => bookDoctor(entry.id)}
                    >
                      رزرو نوبت
                      <Icon name='calendar' className='size-3.5' />
                    </Button>
                    {entry.online ? (
                      <Button
                        size='sm'
                        variant='outline'
                        aria-label={`ویزیت آنلاین ${entry.name}`}
                        onClick={() => bookOnline(entry.id)}
                      >
                        <Icon name='video' className='size-3.5' />
                      </Button>
                    ) : null}
                  </div>
                </Card>
              </Lift>
            ))}
          </div>
        </section>
      </Reveal>

      {/* -------------------------------------------------------------- services */}
      <Reveal>
        <section id='services' aria-labelledby='services-title'>
          <Card>
            <CardHeader>
              <SectionHeading
                id='services-title'
                eyebrow='تعرفه‌ها'
                title='خدمات و هزینه‌ها'
                description='تعرفه‌ها مصوب وزارت بهداشت است؛ سهم بیمه در زمان پرداخت کسر می‌شود.'
                trailing={
                  <Badge variant='success'>
                    به‌روزرسانی: {CLINIC_STATUS.pricingUpdated}
                  </Badge>
                }
              />
            </CardHeader>
            <CardContent>
              {/* Narrow canvases read this as stacked rows; a five-column
                  tariff table only starts to breathe from @xl up. */}
              <ul className='flex flex-col gap-2 @xl:hidden'>
                {CLINIC_SERVICES.map((service) => (
                  <li
                    key={service.name}
                    className='flex flex-col gap-1 rounded-[var(--cc-radius-sm)] border-[length:var(--cc-border-width)] border-[color:var(--cc-border)] bg-[var(--cc-surface)] p-2.5'
                  >
                    <div className='flex items-start justify-between gap-2'>
                      <span className='text-xs font-bold text-[color:var(--cc-surface-foreground)]'>
                        {service.name}
                      </span>
                      <span
                        className={cn(
                          "shrink-0 whitespace-nowrap text-[0.625rem] text-[color:var(--cc-surface-foreground)]",
                          monoType,
                        )}
                      >
                        {formatToman(service.price)}
                      </span>
                    </div>
                    <div className='flex items-center justify-between gap-2'>
                      <p className='text-[0.625rem] leading-relaxed text-[color:var(--cc-muted-foreground)]'>
                        <span className={monoType}>{service.duration}</span>
                        {" · "}
                        {service.note}
                      </p>
                      <Button
                        size='sm'
                        variant='outline'
                        className='shrink-0'
                        onClick={startBooking}
                      >
                        رزرو
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
              <div className='hidden @xl:block'>
                <Table className='text-right'>
                  <TableHeader>
                    <TableRow>
                      <TableHead className='text-right'>خدمت</TableHead>
                      <TableHead className='text-right'>مدت</TableHead>
                      <TableHead className='text-right'>تعرفه</TableHead>
                      <TableHead className='text-right'>توضیح</TableHead>
                      <TableHead className='text-right'>اقدام</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {CLINIC_SERVICES.map((service) => (
                      <TableRow key={service.name}>
                        <TableCell className='text-xs font-bold'>
                          {service.name}
                        </TableCell>
                        <TableCell
                          className={cn("text-[0.625rem]", monoType)}
                        >
                          {service.duration}
                        </TableCell>
                        <TableCell
                          className={cn(
                            "whitespace-nowrap text-[0.625rem]",
                            monoType,
                          )}
                        >
                          {formatToman(service.price)}
                        </TableCell>
                        <TableCell className='text-[0.625rem] text-[color:var(--cc-muted-foreground)]'>
                          {service.note}
                        </TableCell>
                        <TableCell className='text-end'>
                          <Button
                            size='sm'
                            variant='outline'
                            onClick={startBooking}
                          >
                            رزرو
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </section>
      </Reveal>

      {/* ----------------------------------------------------------- testimonials */}
      <Reveal>
        <section
          id='reviews'
          aria-labelledby='reviews-title'
          className='flex flex-col gap-3'
        >
          <SectionHeading
            id='reviews-title'
            eyebrow='تجربهٔ مراجعان'
            title='بیماران چه می‌گویند'
            description='روایت کوتاه چند مراجعهٔ واقعی؛ بدون ویرایش و با امتیاز خودشان.'
            trailing={<Ornament />}
          />

          <Card className='gap-0 overflow-hidden p-0'>
            <div className='grid @3xl:grid-cols-[1.1fr_0.9fr]'>
              <div className='flex flex-col gap-3 p-5'>
                <Swap
                  swapKey={testimonial}
                  className='flex flex-1 flex-col gap-3'
                >
                  <div className='flex items-center gap-2'>
                    <Portrait
                      variant={story.portrait}
                      className='size-10 overflow-hidden rounded-full border-[length:var(--cc-border-width)] border-[color:var(--cc-border)]'
                    />
                    <div className='flex flex-col'>
                      <span className='text-xs font-bold text-[color:var(--cc-surface-foreground)]'>
                        {story.name}
                      </span>
                      <span className='text-[0.625rem] text-[color:var(--cc-muted-foreground)]'>
                        {story.subject}
                      </span>
                    </div>
                    <StarRating value={story.rating} className='ms-auto' />
                  </div>

                  <p className='text-sm leading-relaxed text-[color:var(--cc-surface-foreground)]'>
                    «{story.text}»
                  </p>
                </Swap>

                <div className='flex items-center gap-1'>
                  <Button
                    size='icon'
                    variant='outline'
                    aria-label='نظر قبلی'
                    onClick={() =>
                      setTestimonial(
                        (previous) =>
                          (previous - 1 + CLINIC_TESTIMONIALS.length) %
                          CLINIC_TESTIMONIALS.length,
                      )
                    }
                  >
                    <Icon name='chevron-right' className='size-4' />
                  </Button>
                  <Button
                    size='icon'
                    variant='outline'
                    aria-label='نظر بعدی'
                    onClick={() =>
                      setTestimonial(
                        (previous) =>
                          (previous + 1) % CLINIC_TESTIMONIALS.length,
                      )
                    }
                  >
                    <Icon name='chevron-left' className='size-4' />
                  </Button>
                  <span
                    className='ms-1 text-[0.625rem] text-[color:var(--cc-muted-foreground)]'
                    aria-live='polite'
                  >
                    {toPersianDigits(testimonial + 1)} از{" "}
                    {toPersianDigits(CLINIC_TESTIMONIALS.length)}
                  </span>
                </div>
              </div>

              <div className='grid grid-cols-2 gap-2 border-t-[length:var(--cc-border-width)] border-[color:var(--cc-border)] bg-[var(--cc-muted)] p-4 @3xl:border-s @3xl:border-t-0'>
                {CLINIC_GUARANTEES.map((item) => (
                  <div
                    key={item.id}
                    className='flex flex-col gap-1 rounded-[var(--cc-radius)] border-[length:var(--cc-border-width)] border-[color:var(--cc-border)] bg-[var(--cc-surface)] p-2'
                  >
                    <span className='flex size-6 items-center justify-center rounded-full bg-[var(--cc-muted)] text-[color:var(--cc-primary)]'>
                      {GUARANTEE_ICONS[item.id]}
                    </span>
                    <span className='text-[0.625rem] font-bold text-[color:var(--cc-surface-foreground)]'>
                      {item.title}
                    </span>
                    <span className='text-[0.5625rem] leading-relaxed text-[color:var(--cc-muted-foreground)]'>
                      {item.note}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </section>
      </Reveal>

      {/* ------------------------------------------------------- insurance + faq */}
      <Reveal>
        <section
          id='faq'
          aria-labelledby='faq-title'
          className='grid gap-4 @2xl:grid-cols-[1.25fr_0.75fr]'
        >
          <Card>
            <CardHeader>
              <div className='flex flex-wrap items-center justify-between gap-2'>
                <div className='flex flex-col gap-1'>
                  <CardTitle>بیمه‌های طرف قرارداد</CardTitle>
                  <CardDescription>
                    سهم بیمه هنگام پرداخت به‌صورت خودکار کسر می‌شود؛ تعرفهٔ
                    پاراکلینیک جداگانه محاسبه می‌شود.
                  </CardDescription>
                </div>
                <Badge variant='success'>تسویهٔ مستقیم</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className='flex flex-col gap-2'>
                {INSURANCES.map((entry) => (
                  <div
                    key={entry.id}
                    className='flex items-center justify-between gap-2 border-b-[length:var(--cc-border-width)] border-[color:var(--cc-border)] pb-1.5 last:border-b-0 last:pb-0'
                  >
                    <span className='flex items-center gap-2'>
                      <span className='flex size-6 items-center justify-center rounded-full bg-[var(--cc-muted)] text-[color:var(--cc-primary)]'>
                        <Icon name='shield-check' className='size-3.5' />
                      </span>
                      <span className='text-xs font-bold text-[color:var(--cc-surface-foreground)]'>
                        {entry.label}
                      </span>
                    </span>
                    <span className='flex items-center gap-2'>
                      <span className='hidden h-1.5 w-20 overflow-hidden rounded-full bg-[var(--cc-muted)] @xl:block'>
                        <span
                          className='block h-full rounded-full bg-[var(--cc-primary)]'
                          style={{ width: `${entry.coverage * 100}%` }}
                        />
                      </span>
                      <span
                        className={cn(
                          "min-w-14 text-end text-[0.625rem] text-[color:var(--cc-muted-foreground)]",
                          monoType,
                        )}
                      >
                        {entry.coverage > 0
                          ? `${formatNumber(Math.round(entry.coverage * 100))}٪ پوشش`
                          : "بدون بیمه"}
                      </span>
                    </span>
                  </div>
                ))}
              </div>

              <div className='mt-3 flex flex-col gap-2 rounded-[var(--cc-radius)] bg-[var(--cc-muted)] p-2.5'>
                <span className='text-[0.625rem] leading-relaxed text-[color:var(--cc-muted-foreground)]'>
                  بیمهٔ آزاد تعرفهٔ کامل را پرداخت می‌کند؛ برای خدمات پاراکلینیک
                  تعرفهٔ مصوب به‌صورت جداگانه محاسبه می‌شود.
                </span>
                <div className='flex flex-wrap gap-2'>
                  <a
                    href='tel:+982188770000'
                    className={buttonVariants({ variant: "outline", size: "sm" })}
                  >
                    <Icon name='phone' className='size-3.5' />
                    <span dir='ltr' className={monoType}>
                      {CLINIC_STATUS.supportPhone}
                    </span>
                  </a>
                  <Button
                    size='sm'
                    variant='outline'
                    onClick={() => scrollToSection("faq-title")}
                  >
                    پرسش‌های بیمه
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle id='faq-title'>پرسش‌های پرتکرار</CardTitle>
              <CardDescription>
                اگر پاسخ سوالت نبود، پذیرش ۲۴ ساعته پاسخ می‌دهد.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type='single' defaultValue={["insurance"]}>
                {CLINIC_FAQ.map((item) => (
                  <AccordionItem key={item.value} value={item.value}>
                    <AccordionTrigger>{item.question}</AccordionTrigger>
                    <AccordionContent>{item.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </section>
      </Reveal>

      {/* ---------------------------------------------------------- location */}
      <Reveal>
        <section id='location' aria-label='آدرس و ساعات کاری'>
          <Card className='gap-0 overflow-hidden p-0'>
            <div className='grid @2xl:grid-cols-[1.1fr_0.9fr]'>
              <div className='flex flex-col gap-3 p-4'>
                <span className={cn("text-[0.6875rem] font-bold text-[color:var(--cc-primary)]", labelType)}>
                  آدرس و ساعات کاری
                </span>
                <div className='flex items-start gap-2'>
                  <span className='mt-0.5 text-[color:var(--cc-primary)]'>
                    <Icon name='map-pin' className='size-4' />
                  </span>
                  <p className='text-xs leading-relaxed text-[color:var(--cc-surface-foreground)]'>
                    تهران، خیابان ولیعصر، نرسیده به میدان ونک، مجتمع پزشکی حکیم، طبقهٔ
                    سوم — پارکینگ اختصاصی دارد.
                  </p>
                </div>

                <div className='flex flex-col gap-1.5'>
                  {CLINIC_HOURS.map((row) => (
                    <div
                      key={row.day}
                      className='flex items-center justify-between gap-2 border-b-[length:var(--cc-border-width)] border-[color:var(--cc-border)] pb-1 text-[0.625rem] last:border-b-0'
                    >
                      <span className='text-[color:var(--cc-surface-foreground)]'>
                        {row.day}
                      </span>
                      <span className={cn("text-[color:var(--cc-muted-foreground)]", monoType)}>
                        {row.hours}
                      </span>
                    </div>
                  ))}
                </div>

                <div className='flex flex-wrap gap-2'>
                  <a
                    href='https://www.google.com/maps/search/?api=1&query=Valiasr+Street+Vanak+Tehran'
                    target='_blank'
                    rel='noreferrer'
                    className={buttonVariants({ variant: "outline", size: "sm" })}
                  >
                    <Icon name='map-pin' className='size-3.5' />
                    مسیریابی
                  </a>
                  <a
                    href='tel:+982188770000'
                    className={buttonVariants({ variant: "outline", size: "sm" })}
                  >
                    <Icon name='phone' className='size-3.5' />
                    <span dir='ltr' className={monoType}>
                      {CLINIC_STATUS.supportPhone}
                    </span>
                  </a>
                </div>
              </div>

              <div className='relative min-h-40 overflow-hidden border-t-[length:var(--cc-border-width)] border-[color:var(--cc-border)] bg-[var(--cc-muted)] @2xl:border-s @2xl:border-t-0'>
                <ClinicMap className='absolute inset-0 size-full' />
                <div className='absolute bottom-2 end-2'>
                  <Badge variant='outline' className='bg-[var(--cc-surface)]'>
                    ونک · ۵ دقیقه از مترو
                  </Badge>
                </div>
              </div>
            </div>
          </Card>
        </section>
      </Reveal>

      <footer className='flex flex-col gap-3'>
        <Separator />
        <div className='grid gap-4 @2xl:grid-cols-4'>
          <div className='flex flex-col gap-1.5'>
            <div className='flex items-center gap-2'>
              <span className='flex size-7 items-center justify-center rounded-[var(--cc-radius-sm)] border-[length:var(--cc-border-width)] border-[color:var(--cc-border)] bg-[var(--cc-primary)] text-[color:var(--cc-primary-foreground)]'>
                <Icon name='heart-pulse' className='size-4' />
              </span>
              <span className='text-sm font-black text-[color:var(--cc-surface-foreground)]'>
                درمانگاه حکیم
              </span>
            </div>
            <p className='text-[0.625rem] leading-relaxed text-[color:var(--cc-muted-foreground)]'>
              مرکز تخصصی چند‌تخصصی با نوبت‌دهی آنلاین، پذیرش شبانه‌روزی و پروندهٔ
              الکترونیک.
            </p>
            <div className='flex flex-wrap gap-1'>
              <Badge variant='outline'>اینستاگرام</Badge>
              <Badge variant='outline'>تلگرام</Badge>
            </div>
          </div>

          {[
            {
              title: "تخصص‌ها",
              links: SPECIALTIES.slice(0, 4).map((specialty) => ({
                label: specialty.label,
                href: "#specialists",
              })),
            },
            {
              title: "خدمات",
              links: ["ویزیت تخصصی", "نوار قلب", "اکو", "واکسیناسیون"].map(
                (label) => ({ label, href: "#services" }),
              ),
            },
            {
              title: "درمانگاه",
              links: [
                { label: "دربارهٔ ما", href: "#clinic-hero" },
                { label: "پزشکان", href: "#specialists" },
                { label: "بیمه‌ها", href: "#faq" },
                { label: "تماس با ما", href: "tel:+982188770000" },
              ],
            },
          ].map((column) => (
            <div key={column.title} className='flex flex-col gap-1.5'>
              <span className='text-xs font-bold text-[color:var(--cc-surface-foreground)]'>
                {column.title}
              </span>
              {column.links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className='text-[0.625rem] text-[color:var(--cc-muted-foreground)] transition-colors hover:text-[color:var(--cc-primary)]'
                >
                  {link.label}
                </a>
              ))}
            </div>
          ))}
        </div>

        <div className='flex flex-wrap items-center justify-between gap-2 border-t-[length:var(--cc-border-width)] border-[color:var(--cc-border)] pt-2'>
          <span className='text-[0.625rem] text-[color:var(--cc-muted-foreground)]'>
            © ۱۴۰۵ درمانگاه حکیم · ساخته‌شده با کامپوننت‌های استودیو
          </span>
          <div className='flex flex-wrap items-center gap-1'>
            <Badge variant='outline'>پروانهٔ وزارت بهداشت</Badge>
            <Badge variant='outline'>پرداخت امن</Badge>
            <Badge variant='outline'>پروندهٔ الکترونیک</Badge>
          </div>
        </div>
      </footer>
    </div>
  );
}

