"use client";

import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Field,
  Icon,
  Input,
  Progress,
  RadioGroup,
  RadioGroupField,
  Separator,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  headingType,
  labelType,
} from "@/components/create-components";
import { cn } from "@/lib/utils";
import { Portrait } from "./art/portraits";
import { Ornament, StarRating } from "./art/shared";
import {
  ClassroomScene,
  CourseArt,
  CtaPattern,
  FeatureVignette,
  ScoreChart,
  Sparkline,
  StepPath,
} from "./art/tutoring-art";
import {
  COMPARISON,
  PLANS,
  STEPS,
  SUBJECTS,
  TESTIMONIALS,
  TUTORS,
  TUTORING_FAQ,
  TUTORING_FEATURES,
  TUTORING_STATS,
  WEEKDAYS,
  type SubjectId,
} from "./data/tutoring";
import { formatNumber, formatToman } from "./format";
import { sc as styles } from "./scenes";

export function TutoringLandingView() {
  const [subject, setSubject] = useState<SubjectId>("math");
  const [annual, setAnnual] = useState(false);
  const [weekday, setWeekday] = useState(WEEKDAYS[0].id);
  const [goal, setGoal] = useState("konkur");
  const [testimonial, setTestimonial] = useState(0);
  const [subscribed, setSubscribed] = useState(false);

  const day = WEEKDAYS.find((entry) => entry.id === weekday) ?? WEEKDAYS[0];
  const story = TESTIMONIALS[testimonial];
  const currentSubject = SUBJECTS[subject];

  const moveTestimonial = (direction: 1 | -1) =>
    setTestimonial(
      (previous) =>
        (previous + direction + TESTIMONIALS.length) % TESTIMONIALS.length,
    );

  return (
    <div className='@container flex flex-col gap-6'>
      <header>
        <Card>
          <div className='flex flex-wrap items-center justify-between gap-3'>
            <div className='flex items-center gap-2.5'>
              <span className='flex size-9 items-center justify-center rounded-[var(--cc-radius)] border-[length:var(--cc-border-width)] border-[color:var(--cc-border)] bg-[var(--cc-primary)] text-[color:var(--cc-primary-foreground)] [box-shadow:var(--cc-shadow)]'>
                <Icon name='brand' className='size-5' />
              </span>
              <div className='flex flex-col'>
                <span className='text-sm font-bold text-[color:var(--cc-surface-foreground)]'>
                  آکادمی روشنا
                </span>
                <span className='text-[10px] text-[color:var(--cc-muted-foreground)]'>
                  تدریس آنلاین · کلاس زنده
                </span>
              </div>
            </div>

            <nav className='hidden items-center gap-0.5 @3xl:flex'>
              {["دوره‌ها", "مدرسان", "قیمت‌ها", "پرسش‌ها"].map((item) => (
                <Button key={item} variant='ghost' size='sm'>
                  {item}
                </Button>
              ))}
            </nav>

            <div className='flex items-center gap-2'>
              <Badge variant='success' className='hidden @xl:inline-flex'>
                ترم پاییز ۱۴۰۴
              </Badge>
              <Button variant='outline' size='sm'>
                ورود
              </Button>
              <Button size='sm'>کلاس آزمایشی رایگان</Button>
            </div>
          </div>
        </Card>
      </header>

      <section className='relative overflow-hidden rounded-[var(--cc-radius-lg)] border-[length:var(--cc-border-width)] border-[color:var(--cc-border)] bg-[var(--cc-surface)] [box-shadow:var(--cc-shadow)]'>
        <div className='grid @3xl:grid-cols-[1.02fr_0.98fr]'>
          <div className='flex flex-col gap-4 p-5 @2xl:p-7'>
            <div className='flex flex-wrap items-center gap-2'>
              <Badge variant='success'>ثبت‌نام ترم پاییز باز است</Badge>
              <Ornament />
            </div>

            <h2
              className={`text-2xl leading-tight text-[color:var(--cc-surface-foreground)] @2xl:text-3xl ${headingType}`}
            >
              هر درس، با یک{" "}
              <span className='relative inline-block'>
                معلم اختصاصی
                <svg
                  viewBox='0 0 200 10'
                  preserveAspectRatio='none'
                  className='absolute -bottom-1 start-0 h-2 w-full'
                  aria-hidden='true'
                >
                  <path
                    d='M3 7c48-5 96-5 194 0'
                    className={styles.brandLine}
                    strokeWidth={3}
                    fill='none'
                  />
                </svg>
              </span>{" "}
              و کلاس زنده
            </h2>

            <p className='max-w-xl text-sm text-[color:var(--cc-muted-foreground)]'>
              از پایه تا کنکور؛ برنامهٔ شخصی‌سازی‌شده، تمرین هوشمند و بازخورد
              هفتگی. اولین جلسه رایگان است تا قبل از تصمیم، تجربه‌اش کنید.
            </p>

            <div className='flex flex-wrap items-center gap-2'>
              <Button size='lg'>
                شروع کلاس آزمایشی
                <Icon name='arrow-left' className='size-4' />
              </Button>
              <Button size='lg' variant='outline'>
                مشاهدهٔ دوره‌ها
              </Button>
            </div>

            <div className='flex flex-wrap items-center gap-3'>
              <div className='flex items-center gap-1'>
                {TUTORS.map((tutor) => (
                  <Portrait
                    key={tutor.name}
                    variant={tutor.portrait}
                    className='-ms-1 size-8 overflow-hidden rounded-full border-2 border-[color:var(--cc-surface)] first:ms-0'
                  />
                ))}
              </div>
              <StarRating value={4.9} />
              <span className='text-xs text-[color:var(--cc-muted-foreground)]'>
                +۱۲٬۰۰۰ دانش‌آموز در حال یادگیری
              </span>
            </div>

            <div className='grid grid-cols-3 gap-2 border-t-[length:var(--cc-border-width)] border-[color:var(--cc-border)] pt-3'>
              {[
                { value: "۳۲۰", label: "مدرس تأییدشده" },
                { value: "۳۱", label: "استان" },
                { value: "۹۴٪", label: "رضایت" },
              ].map((stat) => (
                <div key={stat.label} className='flex flex-col gap-0.5'>
                  <span className='font-mono text-sm font-bold text-[color:var(--cc-surface-foreground)]'>
                    {stat.value}
                  </span>
                  <span className='text-[10px] text-[color:var(--cc-muted-foreground)]'>
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className='relative min-h-[320px] overflow-hidden border-t-[length:var(--cc-border-width)] border-[color:var(--cc-border)] bg-[var(--cc-muted)] @3xl:min-h-[430px] @3xl:border-s @3xl:border-t-0'>
            <ClassroomScene className='absolute inset-0 size-full' />
            <div className='absolute start-3 top-3'>
              <Badge variant='danger' className='gap-1'>
                <span className='size-1.5 rounded-full bg-current' />
                پخش زنده
              </Badge>
            </div>
          </div>
        </div>
      </section>


      <Card>
        <div className='grid gap-4 @3xl:grid-cols-[0.9fr_1.1fr]'>
          <div className='flex flex-col gap-3'>
            <div className='flex flex-col gap-1'>
              <span className='text-[10px] font-bold tracking-wide text-[color:var(--cc-primary)]'>
                برنامهٔ این هفته
              </span>
              <h3
                className={`text-lg text-[color:var(--cc-surface-foreground)] ${headingType}`}
              >
                یک روز را انتخاب کن
              </h3>
              <p className='text-xs text-[color:var(--cc-muted-foreground)]'>
                جلسه‌های نمونهٔ همین هفته؛ بعد از تعیین سطح، برنامهٔ اختصاصی خودت
                ساخته می‌شود.
              </p>
            </div>
            <div className='flex flex-wrap gap-1'>
              {WEEKDAYS.map((entry) => (
                <Button
                  key={entry.id}
                  size='sm'
                  variant={weekday === entry.id ? "solid" : "outline"}
                  aria-pressed={weekday === entry.id}
                  onClick={() => setWeekday(entry.id)}
                >
                  {entry.label}
                </Button>
              ))}
            </div>
          </div>

          <div className='flex flex-col gap-2 rounded-[var(--cc-radius)] border-[length:var(--cc-border-width)] border-[color:var(--cc-border)] bg-[var(--cc-muted)] p-3'>
            <div className='flex items-center justify-between gap-2'>
              <Badge variant='success'>{day.label}</Badge>
              <span className='inline-flex items-center gap-1 font-mono text-xs text-[color:var(--cc-muted-foreground)]'>
                <Icon name='clock' className='size-3' />
                {day.time}
              </span>
            </div>
            <div className='flex flex-col gap-0.5'>
              <span className='text-sm font-bold text-[color:var(--cc-surface-foreground)]'>
                {day.subject}
              </span>
              <span className='text-xs text-[color:var(--cc-muted-foreground)]'>
                {day.topic}
              </span>
            </div>
            <div className='flex items-center gap-2'>
              <Portrait
                variant={
                  TUTORS.find((tutor) => tutor.name === day.tutor)
                    ?.portrait ?? 0
                }
                className='size-8 overflow-hidden rounded-full border-[length:var(--cc-border-width)] border-[color:var(--cc-border)]'
              />
              <span className='text-xs text-[color:var(--cc-surface-foreground)]'>
                {day.tutor}
              </span>
              <Badge variant='outline' className='ms-auto'>
                {formatNumber(day.seatsLeft)} جای خالی
              </Badge>
            </div>
            <Progress value={((12 - day.seatsLeft) / 12) * 100} showValue />
            <Button size='sm' fullWidth>
              <Icon name='video' className='size-3.5' />
              رزرو جایگاه
            </Button>
          </div>
        </div>
      </Card>


      <Card>
        <CardContent>
          <div className='grid grid-cols-2 gap-4 @2xl:grid-cols-4'>
            {TUTORING_STATS.map((stat) => (
              <div key={stat.label} className='flex flex-col gap-1'>
                <span
                  className={`text-[10px] text-[color:var(--cc-muted-foreground)] ${labelType}`}
                >
                  {stat.label}
                </span>
                <span
                  className={`text-xl text-[color:var(--cc-surface-foreground)] ${headingType}`}
                >
                  {stat.value}
                </span>
                <Sparkline points={stat.spark} className='h-7 w-full' />
                <span className='text-[10px] text-[color:var(--cc-muted-foreground)]'>
                  {stat.note}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className='grid gap-4 @xl:grid-cols-3'>
        {TUTORING_FEATURES.map((feature) => (
          <Card key={feature.title} className='gap-3'>
            <FeatureVignette
              variant={feature.art}
              className='h-28 w-full rounded-[var(--cc-radius)] border-[length:var(--cc-border-width)] border-[color:var(--cc-border)]'
            />
            <CardHeader>
              <CardTitle>{feature.title}</CardTitle>
              <CardDescription>{feature.body}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>


      <Card>
        <CardHeader>
          <span className='text-[10px] font-bold tracking-wide text-[color:var(--cc-primary)]'>
            مسیر شروع
          </span>
          <CardTitle>سه قدم تا اولین جلسه</CardTitle>
          <CardDescription>
            بدون قرارداد بلندمدت؛ بعد از جلسهٔ اول تصمیم می‌گیری.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <StepPath className='hidden h-8 w-full @2xl:block' />
          <div className='grid gap-3 @2xl:grid-cols-3'>
            {STEPS.map((step, index) => (
              <div
                key={step.title}
                className='flex flex-col gap-1.5 rounded-[var(--cc-radius)] border-[length:var(--cc-border-width)] border-[color:var(--cc-border)] p-3'
              >
                <span className='flex size-8 items-center justify-center rounded-full bg-[var(--cc-primary)] font-mono text-xs font-bold text-[color:var(--cc-primary-foreground)]'>
                  {formatNumber(index + 1)}
                </span>
                <span className='text-xs font-bold text-[color:var(--cc-surface-foreground)]'>
                  {step.title}
                </span>
                <span className='text-[10px] leading-relaxed text-[color:var(--cc-muted-foreground)]'>
                  {step.body}
                </span>
                <Badge variant='outline' className='self-start'>
                  {step.meta}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className='flex flex-wrap items-start justify-between gap-2'>
            <div className='flex flex-col gap-1'>
              <span className='text-[10px] font-bold tracking-wide text-[color:var(--cc-primary)]'>
                دوره‌ها
              </span>
              <CardTitle>دوره‌های پرطرفدار</CardTitle>
              <CardDescription>
                کلاس‌های گروهی و خصوصی با برنامهٔ مشخص و مدرس ثابت.
              </CardDescription>
            </div>
            <Badge variant='soft'>{currentSubject.label}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs
            value={subject}
            onValueChange={(value) => setSubject(value as SubjectId)}
          >
            <TabsList className='flex-wrap'>
              {(Object.keys(SUBJECTS) as SubjectId[]).map((id) => (
                <TabsTrigger key={id} value={id}>
                  {SUBJECTS[id].label}
                </TabsTrigger>
              ))}
            </TabsList>
            {(Object.keys(SUBJECTS) as SubjectId[]).map((id) => (
              <TabsContent key={id} value={id}>
                <div className='flex flex-col gap-2'>
                  {SUBJECTS[id].courses.map((course) => {
                    const seatsPercent =
                      (course.seats.taken / course.seats.total) * 100;
                    return (
                      <div
                        key={course.title}
                        className='flex flex-wrap items-center gap-3 rounded-[var(--cc-radius)] border-[length:var(--cc-border-width)] border-[color:var(--cc-border)] p-2'
                      >
                        <CourseArt
                          variant={course.art}
                          className='size-14 shrink-0 rounded-[var(--cc-radius-sm)] border-[length:var(--cc-border-width)] border-[color:var(--cc-border)]'
                        />
                        <div className='flex min-w-0 flex-1 flex-col gap-1'>
                          <div className='flex flex-wrap items-center gap-2'>
                            <span className='text-xs font-bold text-[color:var(--cc-surface-foreground)]'>
                              {course.title}
                            </span>
                            <Badge variant='outline'>{course.level}</Badge>
                            <StarRating value={course.rating} />
                          </div>
                          <span className='text-[10px] text-[color:var(--cc-muted-foreground)]'>
                            {course.tutor} · {formatNumber(course.sessions)} جلسه ·{" "}
                            {formatToman(course.price)}
                          </span>
                          <div className='flex max-w-56 items-center gap-2'>
                            <Progress value={seatsPercent} />
                            <span className='shrink-0 text-[9px] text-[color:var(--cc-muted-foreground)]'>
                              {formatNumber(course.seats.taken)}/
                              {formatNumber(course.seats.total)}
                            </span>
                          </div>
                        </div>
                        <Button size='sm' variant='outline'>
                          مشاهده
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>


      <section className='flex flex-col gap-3'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div className='flex flex-col gap-1'>
            <span className='text-[10px] font-bold tracking-wide text-[color:var(--cc-primary)]'>
              تیم مدرسان
            </span>
            <h3
              className={`text-lg text-[color:var(--cc-surface-foreground)] ${headingType}`}
            >
              آدم‌هایی که پای تخته می‌ایستند
            </h3>
          </div>
          <Ornament />
        </div>

        <div className='grid gap-3 @xl:grid-cols-3'>
          {TUTORS.map((tutor) => (
            <Card key={tutor.name} className='gap-3'>
              <div className='flex items-start gap-2.5'>
                <Portrait
                  variant={tutor.portrait}
                  className='size-16 shrink-0 overflow-hidden rounded-[var(--cc-radius)] border-[length:var(--cc-border-width)] border-[color:var(--cc-border)]'
                />
                <div className='flex min-w-0 flex-col gap-0.5'>
                  <span className='text-sm font-bold text-[color:var(--cc-surface-foreground)]'>
                    {tutor.name}
                  </span>
                  <span className='text-[10px] text-[color:var(--cc-muted-foreground)]'>
                    {tutor.subject} · {formatNumber(tutor.sessions)} جلسه
                  </span>
                  <StarRating value={tutor.rating} />
                </div>
                <Badge variant='success' className='ms-auto shrink-0'>
                  تأییدشده
                </Badge>
              </div>
              <p className='text-xs leading-relaxed text-[color:var(--cc-muted-foreground)]'>
                {tutor.bio}
              </p>
              <div className='flex flex-wrap gap-1'>
                {tutor.specialties.map((item) => (
                  <Badge key={item} variant='outline'>
                    {item}
                  </Badge>
                ))}
              </div>
              <Button variant='outline' size='sm' fullWidth className='mt-auto'>
                رزرو جلسه
                <Icon name='calendar' className='size-3.5' />
              </Button>
            </Card>
          ))}
        </div>
      </section>


      <Card className='gap-0 overflow-hidden p-0'>
        <div className='grid @3xl:grid-cols-[1.05fr_0.95fr]'>
          <div className='flex flex-col gap-3 p-5'>
            <span className='text-[10px] font-bold tracking-wide text-[color:var(--cc-primary)]'>
              نتیجهٔ واقعی
            </span>
            <h3
              className={`text-lg text-[color:var(--cc-surface-foreground)] ${headingType}`}
            >
              از ترس ریاضی تا رتبهٔ سه‌رقمی
            </h3>
            <p className='text-sm leading-relaxed text-[color:var(--cc-surface-foreground)]'>
              «{story.quote}»
            </p>

            <div className='flex flex-wrap items-center gap-2'>
              <Portrait
                variant={story.portrait}
                className='size-10 overflow-hidden rounded-full border-[length:var(--cc-border-width)] border-[color:var(--cc-border)]'
              />
              <div className='flex flex-col'>
                <span className='text-xs font-bold text-[color:var(--cc-surface-foreground)]'>
                  {story.name}
                </span>
                <span className='text-[10px] text-[color:var(--cc-muted-foreground)]'>
                  {story.exam}
                </span>
              </div>
              <Badge variant='success' className='ms-auto'>
                +{story.scores[1] - story.scores[0]} نمره
              </Badge>
            </div>

            <div className='mt-auto flex items-center gap-1'>
              <Button
                size='icon'
                variant='outline'
                aria-label='روایت قبلی'
                onClick={() => moveTestimonial(-1)}
              >
                <Icon name='chevron-right' className='size-4' />
              </Button>
              <Button
                size='icon'
                variant='outline'
                aria-label='روایت بعدی'
                onClick={() => moveTestimonial(1)}
              >
                <Icon name='chevron-left' className='size-4' />
              </Button>
              <span className='ms-1 text-[10px] text-[color:var(--cc-muted-foreground)]'>
                {formatNumber(testimonial + 1)} از{" "}
                {formatNumber(TESTIMONIALS.length)}
              </span>
              <div className='ms-auto flex items-center gap-1'>
                {TESTIMONIALS.map((entry, index) => (
                  <button
                    key={entry.name}
                    type='button'
                    onClick={() => setTestimonial(index)}
                    aria-label={`روایت ${entry.name}`}
                    aria-pressed={index === testimonial}
                    className={cn(
                      "size-2 rounded-full border border-[color:var(--cc-border)] transition-colors",
                      index === testimonial
                        ? "bg-[var(--cc-primary)]"
                        : "bg-[var(--cc-muted)]",
                    )}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className='flex flex-col gap-2 border-t-[length:var(--cc-border-width)] border-[color:var(--cc-border)] bg-[var(--cc-muted)] p-4 @3xl:border-s @3xl:border-t-0'>
            <div className='flex items-center justify-between text-[10px] text-[color:var(--cc-muted-foreground)]'>
              <span>آزمون قبل از روشنا</span>
              <span>بعد از یک ترم</span>
            </div>
            <ScoreChart className='h-40 w-full' />
            <div className='flex items-center justify-between'>
              <Badge variant='outline'>نمرهٔ {story.scores[0]}</Badge>
              <Icon name='arrow-left' className='size-4 text-[color:var(--cc-muted-foreground)]' />
              <Badge variant='success'>نمرهٔ {story.scores[1]}</Badge>
            </div>
          </div>
        </div>
      </Card>


      <section className='flex flex-col gap-3'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div className='flex flex-col gap-1'>
            <span className='text-[10px] font-bold tracking-wide text-[color:var(--cc-primary)]'>
              قیمت‌ها
            </span>
            <h3
              className={`text-lg text-[color:var(--cc-surface-foreground)] ${headingType}`}
            >
              پلن مناسب خودت را انتخاب کن
            </h3>
            <p className='text-xs text-[color:var(--cc-muted-foreground)]'>
              هر زمان بخواهی می‌توانی ارتقا بدهی؛ اختلاف هزینه محاسبه می‌شود.
            </p>
          </div>
          <div className='flex items-center gap-2 rounded-[var(--cc-radius)] border-[length:var(--cc-border-width)] border-[color:var(--cc-border)] bg-[var(--cc-muted)] px-2 py-1'>
            <span
              className={cn(
                "text-xs",
                annual
                  ? "text-[color:var(--cc-muted-foreground)]"
                  : "font-bold text-[color:var(--cc-primary)]",
              )}
            >
              ماهانه
            </span>
            <Switch
              checked={annual}
              onCheckedChange={setAnnual}
              aria-label='پرداخت سالانه'
            />
            <span
              className={cn(
                "text-xs",
                annual
                  ? "font-bold text-[color:var(--cc-primary)]"
                  : "text-[color:var(--cc-muted-foreground)]",
              )}
            >
              سالانه
            </span>
            <Badge variant='success'>۲ ماه هدیه</Badge>
          </div>
        </div>

        <div className='grid gap-3 @xl:grid-cols-3'>
          {PLANS.map((plan) => {
            const price = annual ? plan.yearly : plan.monthly;
            return (
              <Card
                key={plan.name}
                className={cn(
                  "gap-3",
                  plan.badge &&
                    "border-[color:var(--cc-primary)] ring-1 ring-[color:var(--cc-primary)]",
                )}
              >
                <div className='flex items-center justify-between gap-2'>
                  <span className='text-sm font-bold text-[color:var(--cc-surface-foreground)]'>
                    {plan.name}
                  </span>
                  {plan.badge ? (
                    <Badge variant='success'>{plan.badge}</Badge>
                  ) : null}
                </div>

                <div className='flex flex-col gap-0.5'>
                  <div className='flex items-end gap-1'>
                    <span
                      className={`whitespace-nowrap font-mono text-lg font-black text-[color:var(--cc-surface-foreground)] ${headingType}`}
                    >
                      {formatToman(price)}
                    </span>
                    <span className='pb-0.5 text-[10px] text-[color:var(--cc-muted-foreground)]'>
                      / {annual ? "سال" : "ماه"}
                    </span>
                  </div>
                  {annual ? (
                    <span className='text-[10px] text-[color:var(--cc-muted-foreground)]'>
                      معادل {formatToman(Math.round(plan.yearly / 12))} در ماه
                    </span>
                  ) : (
                    <span className='text-[10px] text-[color:var(--cc-muted-foreground)]'>
                      بدون قرارداد بلندمدت
                    </span>
                  )}
                </div>

                <Separator />

                <ul className='flex flex-col gap-1.5'>
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className='flex items-start gap-1.5 text-xs text-[color:var(--cc-surface-foreground)]'
                    >
                      <Icon name='check' className='mt-0.5 size-3.5 shrink-0 text-[color:var(--cc-primary)]' />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  variant={plan.badge ? "solid" : "outline"}
                  fullWidth
                  className='mt-auto'
                >
                  انتخاب پلن {plan.name}
                </Button>
              </Card>
            );
          })}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>مقایسهٔ پلن‌ها</CardTitle>
            <CardDescription>
              جزئیاتی که در صفحهٔ قیمت‌گذاری معمولاً پنهان می‌شود.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table className='text-right'>
              <TableHeader>
                <TableRow>
                  <TableHead className='text-right'>ویژگی</TableHead>
                  {PLANS.map((plan) => (
                    <TableHead key={plan.name} className='text-right'>
                      {plan.name}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {COMPARISON.map((row) => (
                  <TableRow key={row.label}>
                    <TableCell className='text-xs'>{row.label}</TableCell>
                    {row.values.map((value, index) => (
                      <TableCell
                        key={`${row.label}-${PLANS[index].name}`}
                        className={cn(
                          "text-xs",
                          value === "—" &&
                            "text-[color:var(--cc-muted-foreground)]",
                        )}
                      >
                        {value}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>


      <div className='grid gap-4 @2xl:grid-cols-[1.4fr_0.8fr]'>
        <Card>
          <CardHeader>
            <CardTitle>پرسش‌های پرتکرار</CardTitle>
            <CardDescription>
              اگر پاسخ سوالت را پیدا نکردی، پشتیبانی در دسترس است.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type='single' defaultValue={["trial"]}>
              {TUTORING_FAQ.map((item) => (
                <AccordionItem key={item.value} value={item.value}>
                  <AccordionTrigger>{item.question}</AccordionTrigger>
                  <AccordionContent>{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        <Card className='justify-between gap-3'>
          <div className='flex items-center gap-2'>
            <Avatar alt='پشتیبانی روشنا' size='lg' />
            <div className='flex flex-col'>
              <span className='text-sm font-bold text-[color:var(--cc-surface-foreground)]'>
                پشتیبانی روشنا
              </span>
              <span className='text-[10px] text-[color:var(--cc-muted-foreground)]'>
                پاسخ انسانی در کمتر از ۵ دقیقه
              </span>
            </div>
            <Badge variant='success' className='ms-auto'>
              آنلاین
            </Badge>
          </div>

          <CardDescription>
            برای انتخاب مدرس، تغییر برنامه یا سوال دربارهٔ پرداخت، مستقیم پیام
            بده؛ بدون صف و ربات.
          </CardDescription>

          <div className='flex flex-col gap-1.5'>
            {[
              "۹ صبح تا ۱۰ شب، هر روز",
              "تغییر مدرس تا جلسهٔ سوم",
              "پرداخت ماهانه یا ترمی",
            ].map((item) => (
              <span
                key={item}
                className='flex items-center gap-1.5 text-[10px] text-[color:var(--cc-muted-foreground)]'
              >
                <Icon name='check-circle' className='size-3 text-[color:var(--cc-primary)]' />
                {item}
              </span>
            ))}
          </div>

          <Button variant='outline' fullWidth>
            گفتگو با پشتیبانی
            <Icon name='arrow-left' className='size-3.5' />
          </Button>
        </Card>
      </div>

      <Card className='relative gap-0 overflow-hidden p-0'>
        <CtaPattern className='pointer-events-none absolute inset-0 size-full opacity-70' />
        <div className='relative grid gap-4 p-5 @3xl:grid-cols-[1fr_1fr]'>
          <div className='flex flex-col gap-3'>
            <Badge variant='accent' className='self-start'>
              تعیین سطح رایگان
            </Badge>
            <h3
              className={`text-xl text-[color:var(--cc-surface-foreground)] ${headingType}`}
            >
              هنوز مطمئن نیستی؟
            </h3>
            <p className='max-w-md text-xs leading-relaxed text-[color:var(--cc-muted-foreground)]'>
              ایمیلت را بگذار؛ مشاور آموزشی برای یک جلسهٔ ۳۰ دقیقه‌ای تعیین سطح
              تماس می‌گیرد و برنامهٔ پیشنهادی را می‌فرستد. بدون تعهد.
            </p>
            <div className='flex flex-col gap-1.5'>
              {[
                "۳۰ دقیقه با مدرس هم‌تخصص",
                "گزارش کوتاه نقاط قوت و ضعف",
                "پیشنهاد برنامهٔ هفتگی",
              ].map((item) => (
                <span
                  key={item}
                  className='flex items-center gap-1.5 text-xs text-[color:var(--cc-surface-foreground)]'
                >
                  <span className='flex size-4 items-center justify-center rounded-full bg-[var(--cc-primary)] text-[color:var(--cc-primary-foreground)]'>
                    <Icon name='check' className='size-2.5' />
                  </span>
                  {item}
                </span>
              ))}
            </div>
          </div>

          <form
            className='flex flex-col gap-2 rounded-[var(--cc-radius)] border-[length:var(--cc-border-width)] border-[color:var(--cc-border)] bg-[var(--cc-surface)] p-3'
            onSubmit={(event) => {
              event.preventDefault();
              setSubscribed(true);
            }}
          >
            <span className='text-xs font-bold text-[color:var(--cc-surface-foreground)]'>
              هدفت چیست؟
            </span>
            <RadioGroup value={goal} onValueChange={setGoal} className='gap-1.5'>
              <RadioGroupField
                value='konkur'
                label='آمادگی کنکور'
                description='برنامهٔ فشرده تا روز آزمون'
              />
              <RadioGroupField
                value='school'
                label='تقویت مدرسه'
                description='هماهنگ با امتحانات ترم'
              />
              <RadioGroupField
                value='skill'
                label='مهارت و زبان'
                description='مکالمه، آیلتس یا نگارش'
              />
            </RadioGroup>
            <Field label='ایمیل' htmlFor='roshana-email'>
              <Input
                id='roshana-email'
                type='email'
                required
                dir='ltr'
                placeholder='you@example.com'
              />
            </Field>
            <Button type='submit'>رزرو تعیین سطح رایگان</Button>
          </form>
        </div>
        {subscribed ? (
          <div className='relative px-5 pb-5'>
            <Alert variant='success' title='درخواست ثبت شد'>
              در اولین فرصت برای هماهنگی جلسهٔ تعیین سطح تماس می‌گیریم.
            </Alert>
          </div>
        ) : null}
      </Card>


      <footer className='flex flex-col gap-3'>
        <Separator />
        <div className='grid gap-4 @2xl:grid-cols-4'>
          <div className='flex flex-col gap-1.5'>
            <div className='flex items-center gap-2'>
              <span className='flex size-7 items-center justify-center rounded-[var(--cc-radius-sm)] border-[length:var(--cc-border-width)] border-[color:var(--cc-border)] bg-[var(--cc-primary)] text-[color:var(--cc-primary-foreground)]'>
                <Icon name='brand' className='size-4' />
              </span>
              <span className='text-sm font-black text-[color:var(--cc-surface-foreground)]'>
                آکادمی روشنا
              </span>
            </div>
            <p className='text-[10px] leading-relaxed text-[color:var(--cc-muted-foreground)]'>
              کلاس زنده، مدرس اختصاصی و برنامهٔ شخصی برای دانش‌آموزان ایران. ترم
              پاییز ۱۴۰۴.
            </p>
            <div className='flex flex-wrap gap-1'>
              <Badge variant='outline'>اینستاگرام</Badge>
              <Badge variant='outline'>تلگرام</Badge>
              <Badge variant='outline'>یوتیوب</Badge>
            </div>
          </div>

          <div className='flex flex-col gap-1.5'>
            <span className='text-xs font-bold text-[color:var(--cc-surface-foreground)]'>
              دوره‌ها
            </span>
            {(
              [
                { id: "math", label: "ریاضی" },
                { id: "science", label: "علوم" },
                { id: "language", label: "زبان" },
                { id: "literature", label: "ادبیات" },
              ] as { id: SubjectId; label: string }[]
            ).map((item) => (
              <button
                key={item.id}
                type='button'
                onClick={() => setSubject(item.id)}
                className='text-start text-[10px] text-[color:var(--cc-muted-foreground)] transition-colors hover:text-[color:var(--cc-surface-foreground)]'
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className='flex flex-col gap-1.5'>
            <span className='text-xs font-bold text-[color:var(--cc-surface-foreground)]'>
              مدرسان
            </span>
            {TUTORS.map((tutor) => (
              <button
                key={tutor.name}
                type='button'
                className='text-start text-[10px] text-[color:var(--cc-muted-foreground)] transition-colors hover:text-[color:var(--cc-surface-foreground)]'
              >
                {tutor.name}
              </button>
            ))}
          </div>

          <div className='flex flex-col gap-1.5'>
            <span className='text-xs font-bold text-[color:var(--cc-surface-foreground)]'>
              روشنا
            </span>
            {["دربارهٔ ما", "وبلاگ آموزشی", "قوانین و حریم خصوصی", "تماس با ما"].map(
              (item) => (
                <button
                  key={item}
                  type='button'
                  className='text-start text-[10px] text-[color:var(--cc-muted-foreground)] transition-colors hover:text-[color:var(--cc-surface-foreground)]'
                >
                  {item}
                </button>
              ),
            )}
          </div>
        </div>

        <div className='flex flex-wrap items-center justify-between gap-2 border-t-[length:var(--cc-border-width)] border-[color:var(--cc-border)] pt-2'>
          <span className='text-[10px] text-[color:var(--cc-muted-foreground)]'>
            © ۱۴۰۴ آکادمی روشنا · ساخته‌شده با کامپوننت‌های استودیو
          </span>
          <div className='flex flex-wrap items-center gap-1'>
            <Badge variant='outline'>پرداخت امن</Badge>
            <Badge variant='outline'>ضبط جلسات</Badge>
            <Badge variant='outline'>پشتیبانی انسانی</Badge>
          </div>
        </div>
      </footer>
    </div>
  );
}

