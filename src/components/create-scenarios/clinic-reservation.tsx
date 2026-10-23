"use client";

import { useMemo, useState } from "react";
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
  formatJalali,
  formatWeekday,
  headingType,
  labelType,
  toPersianDigits,
} from "@/components/create-components";
import { cn } from "@/lib/utils";
import { BookingSlip, ClinicMap, ClinicScene } from "./art/clinic-art";
import { Portrait } from "./art/portraits";
import { Ornament, StarRating } from "./art/shared";
import {
  CLINIC_FAQ,
  CLINIC_HOURS,
  CLINIC_SERVICES,
  CLINIC_TESTIMONIALS,
  CLINIC_TODAY,
  CLINIC_TRUST,
  DOCTORS,
  INSURANCES,
  PERIOD_LABELS,
  SEED_APPOINTMENTS,
  SPECIALTIES,
  buildAvailability,
  slotsFor,
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

const TAX_RATE = 0.09;
const FIRST_VISIT_FEE = 80000;
const ONLINE_RATIO = 0.75;

const latinDigits = (value: string) =>
  value.replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)));


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
  const [appointments, setAppointments] = useState(SEED_APPOINTMENTS);
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
    mode === "online" ? Math.round(doctor.fee * ONLINE_RATIO) : doctor.fee;
  const surcharge = firstVisit ? FIRST_VISIT_FEE : 0;
  const subtotal = base + surcharge;
  const covered = Math.round(subtotal * insurance.coverage);
  const tax = Math.round((subtotal - covered) * TAX_RATE);
  const total = subtotal - covered + tax;

  const story = CLINIC_TESTIMONIALS[testimonial];
  const dayLabel = `${formatWeekday(date)} ${formatJalali(date)}`;

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

  const confirmBooking = () => {
    const code = `HK-${24000 + appointments.length * 7}`;
    setBooking({ code });
    setAppointments((previous) => [
      {
        code,
        doctor: doctor.name,
        specialty:
          SPECIALTIES.find((entry) => entry.id === doctor.specialty)?.label ??
          "",
        date: formatJalali(date),
        time: selectedSlot?.time ?? "—",
        mode: mode === "online" ? "آنلاین" : "حضوری",
        status: "در انتظار تأیید",
        tone: "warning" as const,
      },
      ...previous,
    ]);
  };

  const resetBooking = () => {
    setBooking(null);
    setStep(0);
    setSlotId(null);
    setForm(EMPTY_PATIENT);
    setErrors({});
  };


  return (
    <div className='@container flex flex-col gap-6'>
      {/* ------------------------------------------------------------- header */}
      <header>
        <Card>
          <div className='flex flex-wrap items-center justify-between gap-3'>
            <div className='flex items-center gap-2.5'>
              <span className='flex size-9 items-center justify-center rounded-[var(--cc-radius)] border-[length:var(--cc-border-width)] border-[color:var(--cc-border)] bg-[var(--cc-primary)] text-[color:var(--cc-primary-foreground)] [box-shadow:var(--cc-shadow)]'>
                <Icon name='brand' className='size-5' />
              </span>
              <div className='flex flex-col'>
                <span className='text-sm font-bold text-[color:var(--cc-surface-foreground)]'>
                  درمانگاه تخصصی حکیم
                </span>
                <span className='text-[10px] text-[color:var(--cc-muted-foreground)]'>
                  نوبت‌دهی آنلاین · شبانه‌روزی
                </span>
              </div>
            </div>

            <nav className='hidden items-center gap-0.5 @3xl:flex'>
              {["تخصص‌ها", "پزشکان", "خدمات", "نظرات"].map((item) => (
                <Button key={item} variant='ghost' size='sm'>
                  {item}
                </Button>
              ))}
            </nav>

            <div className='flex items-center gap-2'>
              <Badge variant='success' className='hidden gap-1 @xl:inline-flex'>
                <span className='size-1.5 rounded-full bg-current' />
                باز است تا ۲۱:۰۰
              </Badge>
              <Button variant='outline' size='sm'>
                <Icon name='phone' className='size-3.5' />
                ۰۲۱-۸۸۷۷
              </Button>
              <Button size='sm'>رزرو نوبت</Button>
            </div>
          </div>
        </Card>
      </header>

      {/* --------------------------------------------------------------- hero */}
      <section className='relative overflow-hidden rounded-[var(--cc-radius-lg)] border-[length:var(--cc-border-width)] border-[color:var(--cc-border)] bg-[var(--cc-surface)] [box-shadow:var(--cc-shadow)]'>
        <div className='grid @3xl:grid-cols-[1.05fr_0.95fr]'>
          <div className='flex flex-col gap-4 p-5 @2xl:p-7'>
            <div className='flex flex-wrap items-center gap-2'>
              <Badge variant='soft' className='gap-1'>
                <Icon name='sparkles' className='size-3' />
                نوبت‌دهی هوشمند
              </Badge>
              <Ornament />
            </div>

            <h1
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
              <Button size='lg' onClick={() => setStep(0)}>
                شروع رزرو نوبت
                <Icon name='arrow-left' className='size-4' />
              </Button>
              <Button size='lg' variant='outline'>
                <Icon name='video' className='size-4' />
                ویزیت آنلاین
              </Button>
            </div>

            <div className='flex flex-wrap items-center gap-3 rounded-[var(--cc-radius)] border-[length:var(--cc-border-width)] border-[color:var(--cc-border)] bg-[var(--cc-muted)] p-2.5'>
              <span className='flex items-center gap-1.5 text-[10px] text-[color:var(--cc-surface-foreground)]'>
                <Icon name='shield-check' className='size-3.5 text-[color:var(--cc-primary)]' />
                بیمهٔ تأمین اجتماعی و سلامت
              </span>
              <span className='flex items-center gap-1.5 text-[10px] text-[color:var(--cc-surface-foreground)]'>
                <Icon name='clock' className='size-3.5 text-[color:var(--cc-primary)]' />
                لغو رایگان تا ۱۲ ساعت قبل
              </span>
              <span className='flex items-center gap-1.5 text-[10px] text-[color:var(--cc-surface-foreground)]'>
                <Icon name='wallet' className='size-3.5 text-[color:var(--cc-primary)]' />
                پرداخت در محل یا آنلاین
              </span>
            </div>

            <div className='grid grid-cols-2 gap-3 border-t-[length:var(--cc-border-width)] border-[color:var(--cc-border)] pt-3 @xl:grid-cols-4'>
              {CLINIC_TRUST.map((item) => (
                <div key={item.label} className='flex flex-col gap-0.5'>
                  <span className='font-mono text-sm font-black text-[color:var(--cc-surface-foreground)]'>
                    {item.value}
                  </span>
                  <span className='text-[10px] text-[color:var(--cc-muted-foreground)]'>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className='relative min-h-[320px] overflow-hidden border-t-[length:var(--cc-border-width)] border-[color:var(--cc-border)] bg-[var(--cc-muted)] @3xl:min-h-[430px] @3xl:border-s @3xl:border-t-0'>
            <ClinicScene className='absolute inset-0 size-full' />
            <div className='absolute start-3 top-3'>
              <Badge variant='success' className='gap-1'>
                <span className='size-1.5 rounded-full bg-current' />
                پذیرش فعال
              </Badge>
            </div>
            <div className='absolute bottom-3 end-3'>
              <Badge variant='outline' className='bg-[var(--cc-surface)]'>
                میانگین انتظار: ۹ دقیقه
              </Badge>
            </div>
          </div>
        </div>
      </section>



      {/* ---------------------------------------------------------- reservation */}
      <section id='reserve' className='flex flex-col gap-3'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div className='flex flex-col gap-1'>
            <span className='text-[10px] font-bold tracking-wide text-[color:var(--cc-primary)]'>
              رزرو آنلاین
            </span>
            <h2
              className={`text-lg text-[color:var(--cc-surface-foreground)] ${headingType}`}
            >
              چهار قدم تا نوبت ویزیت
            </h2>
            <p className='text-xs text-[color:var(--cc-muted-foreground)]'>
              اطلاعات را مرحله‌به‌مرحله کامل کن؛ هر زمان خواستی می‌توانی به
              مرحلهٔ قبل برگردی.
            </p>
          </div>
          <Badge variant='success'>
            {formatNumber(freeSlots)} نوبت آزاد در {formatWeekday(date)}
          </Badge>
        </div>

        <div className='grid gap-4 @3xl:grid-cols-[1.4fr_0.6fr]'>
          <Card className='gap-4'>
            <Stepper steps={STEPS} current={step} onStepClick={setStep} />
            {booking ? (
              <div className='flex flex-col gap-3'>
                <Alert variant='success' title='نوبت شما ثبت شد'>
                  کد پیگیری{" "}
                  <span className='font-mono font-bold'>{booking.code}</span> به
                  شمارهٔ {form.phone || "موبایل شما"} پیامک شد.
                </Alert>
                <div className='grid gap-3 @xl:grid-cols-[0.9fr_1.1fr]'>
                  <BookingSlip code={booking.code} />
                  <div className='flex flex-col gap-2'>
                    {[
                      ["پزشک", doctor.name],
                      ["تاریخ", dayLabel],
                      ["ساعت", selectedSlot?.time ?? "—"],
                      ["نوع ویزیت", mode === "online" ? "آنلاین" : "حضوری"],
                      ["بیمه", insurance.label],
                      ["مبلغ پرداختی", formatToman(total)],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className='flex items-center justify-between gap-2 border-b-[length:var(--cc-border-width)] border-[color:var(--cc-border)] pb-1 last:border-b-0'
                      >
                        <span className='text-[10px] text-[color:var(--cc-muted-foreground)]'>
                          {label}
                        </span>
                        <span className='text-xs font-bold text-[color:var(--cc-surface-foreground)]'>
                          {value}
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
                  <Button variant='outline'>
                    <Icon name='phone' className='size-3.5' />
                    تماس با پذیرش
                  </Button>
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
                          onClick={() => {
                            setSpecialty(item.id);
                            const first = DOCTORS.find(
                              (entry) => entry.specialty === item.id,
                            );
                            if (first) setDoctorId(first.id);
                            setSlotId(null);
                          }}
                        >
                          {item.label}
                        </Button>
                      ))}
                    </div>

            <Separator />


                    <div className='grid gap-2 @xl:grid-cols-2'>
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
                            onClick={() => {
                              setDoctorId(entry.id);
                              setSlotId(null);
                            }}
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
                                <span className='text-[10px] text-[color:var(--cc-muted-foreground)]'>
                                  {entry.title} · {toPersianDigits(entry.years)}{" "}
                                  سال تجربه
                                </span>
                                <div className='flex items-center gap-2'>
                                  <StarRating value={entry.rating} />
                                  <span className='text-[9px] text-[color:var(--cc-muted-foreground)]'>
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
                              <span className='font-mono text-[11px] font-bold text-[color:var(--cc-surface-foreground)]'>
                                {formatToman(entry.fee)}
                              </span>
                              <span className='text-[9px] text-[color:var(--cc-muted-foreground)]'>
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
                            "text-[10px] text-[color:var(--cc-muted-foreground)]",
                            labelType,
                          )}
                        >
                          تاریخ ویزیت
                        </span>
                        <Calendar
                          value={date}
                          today={CLINIC_TODAY}
                          availability={availability}
                          onValueChange={(iso) => {
                            setDate(iso);
                            setSlotId(null);
                          }}
                        />
                      </div>

                      <div className='flex flex-col gap-2.5'>
                        <span
                          className={cn(
                            "text-[10px] text-[color:var(--cc-muted-foreground)]",
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
                            label='ویزیت آنلاین (۲۵٪ کمتر)'
                            description={
                              doctor.online
                                ? "تماس تصویری امن؛ نسخهٔ الکترونیک"
                                : "این پزشک ویزیت آنلاین ندارد"
                            }
                            disabled={!doctor.online}
                          />
                        </RadioGroup>

                        <div className='flex items-center justify-between gap-2 rounded-[var(--cc-radius)] border-[length:var(--cc-border-width)] border-[color:var(--cc-border)] p-2'>
                          <div className='flex flex-col'>
                            <span className='text-xs font-bold text-[color:var(--cc-surface-foreground)]'>
                              نوبت اول من است
                            </span>
                            <span className='text-[10px] text-[color:var(--cc-muted-foreground)]'>
                              ویزیت ۳۰ دقیقه‌ای + بررسی سوابق
                            </span>
                          </div>
                          <Switch
                            checked={firstVisit}
                            onCheckedChange={setFirstVisit}
                            aria-label='نوبت اول'
                          />
                        </div>

                        <div className='flex flex-col gap-1 rounded-[var(--cc-radius)] bg-[var(--cc-muted)] p-2'>
                          <div className='flex items-center justify-between gap-2'>
                            <span className='text-[10px] text-[color:var(--cc-muted-foreground)]'>
                              {dayLabel}
                            </span>
                            <Badge
                              variant={freeSlots > 2 ? "success" : "warning"}
                            >
                              {formatNumber(freeSlots)} نوبت آزاد
                            </Badge>
                          </div>
                          <Progress value={((16 - freeSlots) / 16) * 100} />
                          <span className='text-[9px] text-[color:var(--cc-muted-foreground)]'>
                            ظرفیت روز {formatNumber(16)} نوبت است
                          </span>
                        </div>
                      </div>
                    </div>


                    <Separator />

                    <div className='flex flex-col gap-2'>
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
                                    "text-[10px] text-[color:var(--cc-surface-foreground)]",
                                    labelType,
                                  )}
                                >
                                  {PERIOD_LABELS[period]}
                                </span>
                                <span className='text-[9px] text-[color:var(--cc-muted-foreground)]'>
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
                                    <span className='font-mono text-[11px]'>
                                      {slot.time}
                                    </span>
                                    <span className='text-[8px] opacity-70'>
                                      {slot.taken ? "تکمیل" : "آزاد"}
                                    </span>
                                  </Button>
                                ))}
                              </div>
                            </div>
                          );
                        },
                      )}
                    </div>
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
                        description='لغو رایگان تا ۱۲ ساعت قبل از ویزیت.'
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
                        <span className='text-[10px] font-bold text-[color:var(--cc-danger)]'>
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
                            "text-[10px] text-[color:var(--cc-muted-foreground)]",
                            labelType,
                          )}
                        >
                          مشخصات نوبت
                        </span>
                        {[
                          ["پزشک", `${doctor.name} — ${doctor.title}`],
                          ["تاریخ", dayLabel],
                          ["ساعت", selectedSlot?.time ?? "—"],
                          [
                            "نوع ویزیت",
                            mode === "online" ? "آنلاین" : "حضوری در درمانگاه",
                          ],
                          [
                            "مدت ویزیت",
                            firstVisit ? "۳۰ دقیقه (نوبت اول)" : "۲۰ دقیقه",
                          ],
                        ].map(([label, value]) => (
                          <div
                            key={label}
                            className='flex items-start justify-between gap-2 border-b-[length:var(--cc-border-width)] border-[color:var(--cc-border)] pb-1 last:border-b-0 last:pb-0'
                          >
                            <span className='text-[10px] text-[color:var(--cc-muted-foreground)]'>
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
                            "text-[10px] text-[color:var(--cc-muted-foreground)]",
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
                            <span className='text-[10px] text-[color:var(--cc-muted-foreground)]'>
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
                        <Progress value={100} />
                        <span className='text-[9px] text-[color:var(--cc-muted-foreground)]'>
                          اطلاعات کامل است
                        </span>
                      </div>
                    </div>

                    <div className='flex flex-col gap-2 rounded-[var(--cc-radius)] border-[length:var(--cc-border-width)] border-[color:var(--cc-border)] p-2.5'>
                      <span
                        className={cn(
                          "text-[10px] text-[color:var(--cc-muted-foreground)]",
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

                  <span className='text-[9px] text-[color:var(--cc-muted-foreground)]'>
                    {step === 1 && !selectedSlot
                      ? "یک ساعت را انتخاب کن"
                      : step === 2
                        ? "اطلاعات بیمار را کامل کن"
                        : `مرحلهٔ ${toPersianDigits(step + 1)} از ۴`}
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
                      تأیید و پرداخت {formatToman(total)}
                    </Button>
                  )}
                </div>
              </>
            )}
          </Card>


          <aside className='flex flex-col gap-3'>
            <Card className='gap-2.5'>
              <div className='flex items-center justify-between gap-2'>
                <span
                  className={cn(
                    "text-[10px] text-[color:var(--cc-muted-foreground)]",
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
                  <span className='text-[9px] text-[color:var(--cc-muted-foreground)]'>
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
                    className='flex items-center gap-1.5 text-[10px] text-[color:var(--cc-surface-foreground)]'
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
                    className='flex items-center justify-between gap-2 text-[10px] text-[color:var(--cc-muted-foreground)]'
                  >
                    <span>{label}</span>
                    <span className='font-mono'>{value}</span>
                  </div>
                ))}
              </div>

              <div className='flex items-baseline justify-between gap-2 border-t-[length:var(--cc-border-width)] border-[color:var(--cc-border)] pt-1.5'>
                <span className='text-[10px] text-[color:var(--cc-muted-foreground)]'>
                  مبلغ نهایی
                </span>
                <span
                  className={`whitespace-nowrap font-mono text-sm font-black text-[color:var(--cc-surface-foreground)] ${headingType}`}
                >
                  {formatToman(total)}
                </span>
              </div>

              <Progress value={(step / 3) * 100} />
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
                  <span className='text-[9px] text-[color:var(--cc-muted-foreground)]'>
                    لغو رایگان تا ۱۲ ساعت قبل
                  </span>
                </div>
              </div>
              <p className='text-[10px] leading-relaxed text-[color:var(--cc-muted-foreground)]'>
                اگر پزشک در زمان مقرر حاضر نشود، هزینه به‌صورت کامل بازگردانده
                می‌شود.
              </p>
              <Button variant='outline' size='sm' fullWidth>
                <Icon name='phone' className='size-3.5' />
                پشتیبانی ۲۴ ساعته
              </Button>
            </Card>
          </aside>
        </div>
      </section>

      {/* ----------------------------------------------------------- specialists */}
      <section className='flex flex-col gap-3'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div className='flex flex-col gap-1'>
            <span className='text-[10px] font-bold tracking-wide text-[color:var(--cc-primary)]'>
              تیم درمان
            </span>
            <h2
              className={`text-lg text-[color:var(--cc-surface-foreground)] ${headingType}`}
            >
              پزشکان و تخصص‌ها
            </h2>
          </div>
          <Ornament />
        </div>

        <div className='grid gap-3 @xl:grid-cols-3'>
          {DOCTORS.map((entry) => (
            <Card key={entry.id} className='gap-2.5'>
              <div className='flex items-start gap-2.5'>
                <Portrait
                  variant={entry.portrait}
                  className='size-14 shrink-0 overflow-hidden rounded-[var(--cc-radius)] border-[length:var(--cc-border-width)] border-[color:var(--cc-border)]'
                />
                <div className='flex min-w-0 flex-col gap-0.5'>
                  <span className='text-sm font-bold text-[color:var(--cc-surface-foreground)]'>
                    {entry.name}
                  </span>
                  <span className='text-[10px] text-[color:var(--cc-muted-foreground)]'>
                    {entry.title}
                  </span>
                  <div className='flex items-center gap-2'>
                    <StarRating value={entry.rating} />
                    <span className='text-[9px] text-[color:var(--cc-muted-foreground)]'>
                      {formatNumber(entry.reviews)} نظر
                    </span>
                  </div>
                </div>
                <Badge variant='outline' className='ms-auto shrink-0'>
                  {formatToman(entry.fee)}
                </Badge>
              </div>

              <p className='text-[10px] leading-relaxed text-[color:var(--cc-muted-foreground)]'>
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
                  onClick={() => {
                    setSpecialty(entry.specialty);
                    setDoctorId(entry.id);
                    setSlotId(null);
                    setStep(1);
                  }}
                >
                  رزرو نوبت
                  <Icon name='calendar' className='size-3.5' />
                </Button>
                {entry.online ? (
                  <Button size='sm' variant='outline' aria-label='ویزیت آنلاین'>
                    <Icon name='video' className='size-3.5' />
                  </Button>
                ) : null}
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* -------------------------------------------------------------- services */}
      <Card>
        <CardHeader>
          <div className='flex flex-wrap items-start justify-between gap-2'>
            <div className='flex flex-col gap-1'>
              <span className='text-[10px] font-bold tracking-wide text-[color:var(--cc-primary)]'>
                تعرفه‌ها
              </span>
              <CardTitle>خدمات و هزینه‌ها</CardTitle>
              <CardDescription>
                تعرفه‌ها مصوب وزارت بهداشت است؛ سهم بیمه در زمان پرداخت کسر
                می‌شود.
              </CardDescription>
            </div>
            <Badge variant='success'>به‌روزرسانی: مهر ۱۴۰۵</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Table className='text-right'>
            <TableHeader>
              <TableRow>
                <TableHead className='text-right'>خدمت</TableHead>
                <TableHead className='text-right'>مدت</TableHead>
                <TableHead className='text-right'>تعرفه</TableHead>
                <TableHead className='text-right'>توضیح</TableHead>
                <TableHead className='text-right'> </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {CLINIC_SERVICES.map((service) => (
                <TableRow key={service.name}>
                  <TableCell className='text-xs font-bold'>
                    {service.name}
                  </TableCell>
                  <TableCell className='font-mono text-[10px]'>
                    {service.duration}
                  </TableCell>
                  <TableCell className='whitespace-nowrap font-mono text-[10px]'>
                    {formatToman(service.price)}
                  </TableCell>
                  <TableCell className='text-[10px] text-[color:var(--cc-muted-foreground)]'>
                    {service.note}
                  </TableCell>
                  <TableCell className='text-end'>
                    <Button
                      size='sm'
                      variant='outline'
                      onClick={() => setStep(0)}
                    >
                      رزرو
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>



      {/* ----------------------------------------------------------- testimonials */}
      <Card className='gap-0 overflow-hidden p-0'>
        <div className='grid @3xl:grid-cols-[1.1fr_0.9fr]'>
          <div className='flex flex-col gap-3 p-5'>
            <span className='text-[10px] font-bold tracking-wide text-[color:var(--cc-primary)]'>
              تجربهٔ مراجعان
            </span>
            <div className='flex items-center gap-2'>
              <Portrait
                variant={story.portrait}
                className='size-10 overflow-hidden rounded-full border-[length:var(--cc-border-width)] border-[color:var(--cc-border)]'
              />
              <div className='flex flex-col'>
                <span className='text-xs font-bold text-[color:var(--cc-surface-foreground)]'>
                  {story.name}
                </span>
                <span className='text-[10px] text-[color:var(--cc-muted-foreground)]'>
                  {story.subject}
                </span>
              </div>
              <StarRating value={story.rating} className='ms-auto' />
            </div>

            <p className='text-sm leading-relaxed text-[color:var(--cc-surface-foreground)]'>
              «{story.text}»
            </p>

            <div className='mt-auto flex items-center gap-1'>
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
                    (previous) => (previous + 1) % CLINIC_TESTIMONIALS.length,
                  )
                }
              >
                <Icon name='chevron-left' className='size-4' />
              </Button>
              <span className='ms-1 text-[10px] text-[color:var(--cc-muted-foreground)]'>
                {toPersianDigits(testimonial + 1)} از{" "}
                {toPersianDigits(CLINIC_TESTIMONIALS.length)}
              </span>
            </div>
          </div>

          <div className='grid grid-cols-2 gap-2 border-t-[length:var(--cc-border-width)] border-[color:var(--cc-border)] bg-[var(--cc-muted)] p-4 @3xl:border-s @3xl:border-t-0'>
            {[
              {
                value: "۹ دقیقه",
                label: "میانگین انتظار",
                icon: <Icon name='clock' className='size-3.5' />,
              },
              {
                value: "۴.۹/۵",
                label: "امتیاز مراجعان",
                icon: <Icon name='sparkles' className='size-3.5' />,
              },
              {
                value: "۲۴",
                label: "پزشک متخصص",
                icon: <Icon name='stethoscope' className='size-3.5' />,
              },
              {
                value: "۹۸٪",
                label: "رزرو بدون لغو",
                icon: <Icon name='badge-check' className='size-3.5' />,
              },
            ].map((item) => (
              <div
                key={item.label}
                className='flex flex-col gap-1 rounded-[var(--cc-radius)] border-[length:var(--cc-border-width)] border-[color:var(--cc-border)] bg-[var(--cc-surface)] p-2'
              >
                <span className='flex items-center gap-1 text-[color:var(--cc-primary)]'>
                  {item.icon}
                </span>
                <span className='font-mono text-sm font-black text-[color:var(--cc-surface-foreground)]'>
                  {item.value}
                </span>
                <span className='text-[9px] text-[color:var(--cc-muted-foreground)]'>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Card>


      {/* ------------------------------------------------------ appointments + faq */}
      <div className='grid gap-4 @2xl:grid-cols-[1.25fr_0.75fr]'>
        <Card>
          <CardHeader>
            <div className='flex flex-wrap items-center justify-between gap-2'>
              <div className='flex flex-col gap-1'>
                <CardTitle>نوبت‌های من</CardTitle>
                <CardDescription>رزروهای فعال و گذشتهٔ این حساب.</CardDescription>
              </div>
              <Badge variant='soft'>
                {formatNumber(appointments.length)} نوبت
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Table className='text-right'>
              <TableHeader>
                <TableRow>
                  <TableHead className='text-right'>کد</TableHead>
                  <TableHead className='text-right'>پزشک</TableHead>
                  <TableHead className='text-right'>تاریخ</TableHead>
                  <TableHead className='text-right'>ساعت</TableHead>
                  <TableHead className='text-right'>نوع</TableHead>
                  <TableHead className='text-right'>وضعیت</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.map((appointment) => (
                  <TableRow
                    key={appointment.code}
                    data-cc-appointment={appointment.code}
                  >
                    <TableCell className='font-mono text-[10px]'>
                      {appointment.code}
                    </TableCell>
                    <TableCell>
                      <div className='flex flex-col'>
                        <span className='text-[10px] font-bold'>
                          {appointment.doctor}
                        </span>
                        <span className='text-[9px] text-[color:var(--cc-muted-foreground)]'>
                          {appointment.specialty}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className='text-[10px]'>
                      {appointment.date}
                    </TableCell>
                    <TableCell className='font-mono text-[10px]'>
                      {appointment.time}
                    </TableCell>
                    <TableCell className='text-[10px]'>
                      {appointment.mode}
                    </TableCell>
                    <TableCell>
                      <Badge variant={appointment.tone}>
                        {appointment.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>پرسش‌های پرتکرار</CardTitle>
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
      </div>


      {/* ---------------------------------------------------------- location */}
      <Card className='gap-0 overflow-hidden p-0'>
        <div className='grid @2xl:grid-cols-[1.1fr_0.9fr]'>
          <div className='flex flex-col gap-3 p-4'>
            <span className='text-[10px] font-bold tracking-wide text-[color:var(--cc-primary)]'>
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
                  className='flex items-center justify-between gap-2 border-b-[length:var(--cc-border-width)] border-[color:var(--cc-border)] pb-1 text-[10px] last:border-b-0'
                >
                  <span className='text-[color:var(--cc-surface-foreground)]'>
                    {row.day}
                  </span>
                  <span className='font-mono text-[color:var(--cc-muted-foreground)]'>
                    {row.hours}
                  </span>
                </div>
              ))}
            </div>

            <div className='flex flex-wrap gap-2'>
              <Button size='sm' variant='outline'>
                <Icon name='map-pin' className='size-3.5' />
                مسیریابی
              </Button>
              <Button size='sm' variant='outline'>
                <Icon name='phone' className='size-3.5' />
                ۰۲۱-۸۸۷۷۰۰۰۰
              </Button>
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
            <p className='text-[10px] leading-relaxed text-[color:var(--cc-muted-foreground)]'>
              مرکز تخصصی چند‌تخصصی با نوبت‌دهی آنلاین، پذیرش شبانه‌روزی و پروندهٔ
              الکترونیک.
            </p>
            <div className='flex flex-wrap gap-1'>
              <Badge variant='outline'>اینستاگرام</Badge>
              <Badge variant='outline'>تلگرام</Badge>
            </div>
          </div>

          {[
            { title: "تخصص‌ها", links: SPECIALTIES.slice(0, 4).map((s) => s.label) },
            {
              title: "خدمات",
              links: ["ویزیت تخصصی", "نوار قلب", "اکو", "واکسیناسیون"],
            },
            {
              title: "درمانگاه",
              links: ["دربارهٔ ما", "پزشکان", "بیمه‌ها", "تماس با ما"],
            },
          ].map((column) => (
            <div key={column.title} className='flex flex-col gap-1.5'>
              <span className='text-xs font-bold text-[color:var(--cc-surface-foreground)]'>
                {column.title}
              </span>
              {column.links.map((link) => (
                <span
                  key={link}
                  className='text-[10px] text-[color:var(--cc-muted-foreground)]'
                >
                  {link}
                </span>
              ))}
            </div>
          ))}
        </div>

        <div className='flex flex-wrap items-center justify-between gap-2 border-t-[length:var(--cc-border-width)] border-[color:var(--cc-border)] pt-2'>
          <span className='text-[10px] text-[color:var(--cc-muted-foreground)]'>
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

