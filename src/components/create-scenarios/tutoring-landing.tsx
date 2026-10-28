"use client";

import { useState, type CSSProperties, type ReactNode } from "react";
import { motion } from "motion/react";
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
  monoType,
} from "@/components/create-components";
import { cn } from "@/lib/utils";
import { Portrait } from "./art/portraits";
import { Ornament, StarRating } from "./art/shared";
import {
  ClassroomScene,
  CourseArt,
  CtaPattern,
  FeatureVignette,
  HeroOrbit,
  ScoreChart,
  Sparkline,
  StepPath,
} from "./art/tutoring-art";
import {
  COMPARISON,
  HERO_POINTS,
  NAV_ITEMS,
  PLANS,
  STEPS,
  SUBJECTS,
  SUBJECT_TICKER,
  TESTIMONIALS,
  TUTORS,
  TUTORING_FAQ,
  TUTORING_FEATURES,
  TUTORING_STATS,
  WEEKDAYS,
  type SubjectId,
} from "./data/tutoring";
import { formatNumber, formatToman } from "./format";
import { Lift, Reveal, Swap } from "./motion-primitives";
import { sc as styles } from "./scenes";

const SUBJECT_IDS = Object.keys(SUBJECTS) as SubjectId[];

const eyebrowType = cn(
  "text-[0.6875rem] font-bold text-[color:var(--cc-primary)]",
  labelType,
);

/**
 * One heading scale for every section: an eyebrow, a display line and an
 * optional description plus a trailing slot (badge, switch, ornament).
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
        <span className={eyebrowType}>{eyebrow}</span>
        <h3
          id={id}
          className={cn(
            "text-xl leading-tight text-[color:var(--cc-surface-foreground)] @2xl:text-2xl",
            headingType,
          )}
        >
          {title}
        </h3>
        {description ? (
          <p className='max-w-xl text-sm text-[color:var(--cc-muted-foreground)]'>
            {description}
          </p>
        ) : null}
      </div>
      {trailing}
    </div>
  );
}

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
  const seatsTaken = day.capacity - day.seatsLeft;
  const students = TUTORING_STATS[0];

  const moveTestimonial = (direction: 1 | -1) =>
    setTestimonial(
      (previous) =>
        (previous + direction + TESTIMONIALS.length) % TESTIMONIALS.length,
    );

  return (
    <div className='@container flex flex-col gap-8'>
      {/* 1 — Site header: a slim bar, not a card, so it reads as navigation. */}
      <header className='flex flex-wrap items-center justify-between gap-3 rounded-[var(--cc-radius)] border-[length:var(--cc-border-width)] border-[color:var(--cc-border)] bg-[var(--cc-surface)] px-3 py-2 [box-shadow:var(--cc-shadow)]'>
        <a href='#landing-hero' className='flex items-center gap-2.5'>
          <span className='flex size-9 items-center justify-center rounded-[var(--cc-radius)] bg-[var(--cc-primary)] text-[color:var(--cc-primary-foreground)]'>
            <Icon name='brand' className='size-5' />
          </span>
          <span className='flex flex-col'>
            <span className='text-sm font-bold text-[color:var(--cc-surface-foreground)]'>
              آکادمی روشنا
            </span>
            <span className='text-[0.6875rem] text-[color:var(--cc-muted-foreground)]'>
              تدریس آنلاین · کلاس زنده
            </span>
          </span>
        </a>

        <nav aria-label='بخش‌های صفحه' className='hidden items-center gap-0.5 @3xl:flex'>
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
          <Badge variant='success' className='hidden @xl:inline-flex'>
            ترم پاییز ۱۴۰۴
          </Badge>
          <Button variant='outline' size='sm'>
            ورود
          </Button>
          <Button size='sm'>کلاس آزمایشی رایگان</Button>
        </div>
      </header>

      {/* Narrow previews get the anchors as a scrollable row under the bar. */}
      <nav
        aria-label='بخش‌های صفحه'
        className='-mt-4 flex items-center gap-1 overflow-x-auto @3xl:hidden'
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

      {/* 2 — Hero: copy and the animated live-class illustration. */}
      <section
        id='landing-hero'
        aria-labelledby='landing-hero-title'
        className='relative overflow-hidden rounded-[var(--cc-radius-lg)] border-[length:var(--cc-border-width)] border-[color:var(--cc-border)] bg-[var(--cc-surface)] [box-shadow:var(--cc-shadow)]'
      >
        {/* Decorative rings, kept in a wrapper so `hidden` isn't overridden by
            the `.sc-art { display: block }` rule in scenes.css. */}
        <div className='pointer-events-none absolute -top-20 start-[2%] hidden @xl:block'>
          <HeroOrbit className='h-[20rem] w-[20rem] opacity-55 @2xl:h-[21.25rem] @2xl:w-[21.25rem]' />
        </div>

        <div className='relative grid @3xl:grid-cols-[1.04fr_0.96fr]'>
          <div className='flex flex-col gap-4 p-5 @2xl:p-7'>
            <div className='flex flex-wrap items-center gap-2'>
              <Badge variant='success'>ثبت‌نام ترم پاییز باز است</Badge>
              <Ornament />
            </div>

            <h2
              id='landing-hero-title'
              className={cn(
                "text-2xl leading-tight text-[color:var(--cc-surface-foreground)] @2xl:text-3xl",
                headingType,
              )}
            >
              هر درس، با یک{" "}
              <span className='relative inline-block'>
                مدرس اختصاصی
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

            <p className='max-w-xl text-sm leading-relaxed text-[color:var(--cc-muted-foreground)]'>
              از پایه تا کنکور؛ برنامهٔ شخصی‌سازی‌شده، تمرین هوشمند و بازخورد
              هفتگی. اولین جلسه رایگان است تا قبل از تصمیم، تجربه‌اش کنید.
            </p>

            <div className='flex flex-wrap items-center gap-2'>
              <Lift>
                <Button size='lg'>
                  شروع کلاس آزمایشی
                  <Icon name='arrow-left' className='size-4' />
                </Button>
              </Lift>
              <Button size='lg' variant='outline'>
                مشاهدهٔ دوره‌ها
              </Button>
            </div>

            <ul className='flex flex-wrap items-center gap-x-4 gap-y-2'>
              {HERO_POINTS.map((point) => (
                <li
                  key={point.label}
                  className='flex items-center gap-1.5 text-xs text-[color:var(--cc-surface-foreground)]'
                >
                  <Icon
                    name={point.icon}
                    className='size-3.5 text-[color:var(--cc-primary)]'
                  />
                  {point.label}
                </li>
              ))}
            </ul>

            <div className='mt-auto flex flex-wrap items-center gap-3 border-t-[length:var(--cc-border-width)] border-[color:var(--cc-border)] pt-3'>
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
                {students.value} دانش‌آموز در حال یادگیری
              </span>
            </div>
          </div>

          <div className='relative min-h-[20rem] overflow-hidden border-t-[length:var(--cc-border-width)] border-[color:var(--cc-border)] bg-[var(--cc-muted)] @3xl:min-h-[26.875rem] @3xl:border-s @3xl:border-t-0'>
            <ClassroomScene className='absolute inset-0 size-full' />
            <div className='absolute start-3 top-3'>
              <Badge variant='danger' className='gap-1'>
                <span className='size-1.5 animate-pulse rounded-full bg-current' />
                پخش زنده
              </Badge>
            </div>
          </div>
        </div>
      </section>


      {/* 3 — Trust strip: the only place the numbers live. */}
      <section
        aria-label='آکادمی روشنا در یک نگاه'
        className='grid grid-cols-2 gap-x-4 gap-y-5 border-y-[length:var(--cc-border-width)] border-[color:var(--cc-border)] py-4 @2xl:grid-cols-4'
      >
        {TUTORING_STATS.map((stat) => (
          <div key={stat.label} className='flex flex-col gap-1'>
            <span
              className={cn(
                "text-[0.6875rem] text-[color:var(--cc-muted-foreground)]",
                labelType,
              )}
            >
              {stat.label}
            </span>
            <span
              className={cn(
                "text-xl text-[color:var(--cc-surface-foreground)]",
                headingType,
                monoType,
              )}
            >
              {stat.value}
            </span>
            <Sparkline points={stat.spark} className='h-8 w-full' />
            <span className='text-[0.6875rem] text-[color:var(--cc-muted-foreground)]'>
              {stat.note}
            </span>
          </div>
        ))}
      </section>

      {/* Subject marquee — pure CSS, pauses on hover. */}
      <div className={styles.ticker} aria-hidden='true'>
        <div
          className={styles.tickerTrack}
          style={{ "--sc-duration": "46s" } as CSSProperties}
        >
          {[...SUBJECT_TICKER, ...SUBJECT_TICKER].map((label, index) => (
            <span
              key={`${label}-${index}`}
              className='flex shrink-0 items-center gap-2 pe-6 text-xs text-[color:var(--cc-muted-foreground)]'
            >
              <Icon
                name='sparkles'
                className='size-3 text-[color:var(--cc-accent)]'
              />
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* 4 — Features */}
      <Reveal>
        <section
          id='features'
          aria-labelledby='features-title'
          className='flex flex-col gap-4'
        >
          <SectionHeading
            id='features-title'
            eyebrow='چرا روشنا'
            title='سه چیزی که کلاس را متفاوت می‌کند'
            description='زیرساخت کلاس زنده، مسیر شخصی و بازخورد انسانی؛ هر سه در یک اشتراک.'
            trailing={<Ornament />}
          />

          <div className='grid gap-4 @xl:grid-cols-3'>
            {TUTORING_FEATURES.map((feature) => (
              <Lift key={feature.title} className='h-full'>
                <Card className='h-full gap-3'>
                  <FeatureVignette
                    variant={feature.art}
                    className='h-28 w-full rounded-[var(--cc-radius)] border-[length:var(--cc-border-width)] border-[color:var(--cc-border)]'
                  />
                  <CardHeader>
                    <span className='flex items-center gap-1.5 text-[0.6875rem] font-bold text-[color:var(--cc-primary)]'>
                      <Icon name={feature.icon} className='size-3.5' />
                      {feature.meta}
                    </span>
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription>{feature.body}</CardDescription>
                  </CardHeader>
                </Card>
              </Lift>
            ))}
          </div>
        </section>
      </Reveal>


      {/* 5 — Live week */}
      <Reveal>
        <Card>
          <div className='grid gap-4 @3xl:grid-cols-[0.9fr_1.1fr]'>
            <div className='flex flex-col gap-3'>
              <SectionHeading
                id='week-title'
                eyebrow='برنامهٔ این هفته'
                title='یک روز را انتخاب کن'
                description='جلسه‌های نمونهٔ همین هفته؛ بعد از تعیین سطح، برنامهٔ اختصاصی خودت ساخته می‌شود.'
              />

              <div
                role='group'
                aria-label='روزهای هفته'
                className='flex flex-wrap gap-1'
              >
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

            <div aria-live='polite'>
              <Swap swapKey={weekday}>
                <div className='flex flex-col gap-2 rounded-[var(--cc-radius)] border-[length:var(--cc-border-width)] border-[color:var(--cc-border)] bg-[var(--cc-muted)] p-3'>
                  <div className='flex items-center justify-between gap-2'>
                    <Badge variant='success'>{day.label}</Badge>
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 text-xs text-[color:var(--cc-muted-foreground)]",
                        monoType,
                      )}
                    >
                      <Icon name='clock' className='size-3' />
                      <span dir='ltr'>{day.time}</span>
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
                    <Badge variant='outline' className='ms-auto gap-1'>
                      {formatNumber(day.seatsLeft)} جای خالی
                    </Badge>
                  </div>

                  <Progress value={seatsTaken} max={day.capacity} />
                  <span className='text-[0.6875rem] text-[color:var(--cc-muted-foreground)]'>
                    {formatNumber(seatsTaken)} از{" "}
                    {formatNumber(day.capacity)} صندلی پر شده
                  </span>

                  <Button size='sm' fullWidth>
                    <Icon name='video' className='size-3.5' />
                    رزرو جایگاه
                  </Button>
                </div>
              </Swap>
            </div>
          </div>
        </Card>
      </Reveal>


      {/* 6 — Courses */}
      <Reveal>
        <section
          id='courses'
          aria-labelledby='courses-title'
          className='flex flex-col gap-4'
        >
          <SectionHeading
            id='courses-title'
            eyebrow='دوره‌ها'
            title='دوره‌های پرطرفدار'
            description='کلاس‌های گروهی و خصوصی با برنامهٔ مشخص و مدرس ثابت.'
            trailing={<Badge variant='soft'>{currentSubject.label}</Badge>}
          />

          <Card className='gap-3'>
            <Tabs
              value={subject}
              onValueChange={(value) => setSubject(value as SubjectId)}
            >
              <TabsList className='flex-wrap'>
                {SUBJECT_IDS.map((id) => (
                  <TabsTrigger key={id} value={id}>
                    {SUBJECTS[id].label}
                  </TabsTrigger>
                ))}
              </TabsList>

              {SUBJECT_IDS.map((id) => (
                <TabsContent key={id} value={id}>
                  <div className='flex flex-col'>
                    {SUBJECTS[id].courses.map((course, index) => {
                      const seatsPercent =
                        (course.seats.taken / course.seats.total) * 100;

                      return (
                        <div key={course.title} className='flex flex-col'>
                          {index > 0 ? <Separator /> : null}
                          <div className='flex flex-wrap items-center gap-3 py-3'>
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
                              <span className='text-[0.6875rem] text-[color:var(--cc-muted-foreground)]'>
                                {course.tutor} ·{" "}
                                {formatNumber(course.sessions)} جلسه ·{" "}
                                {formatToman(course.price)}
                              </span>
                              <div className='flex max-w-56 items-center gap-2'>
                                <Progress value={seatsPercent} />
                                <span
                                  dir='ltr'
                                  className={cn(
                                    "shrink-0 text-[0.6875rem] text-[color:var(--cc-muted-foreground)]",
                                    monoType,
                                  )}
                                >
                                  {formatNumber(course.seats.taken)}/
                                  {formatNumber(course.seats.total)}
                                </span>
                              </div>
                            </div>
                            <Button size='sm' variant='outline'>
                              مشاهده
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </Card>
        </section>
      </Reveal>


      {/* 7 — Tutors */}
      <Reveal>
        <section
          id='tutors'
          aria-labelledby='tutors-title'
          className='flex flex-col gap-4'
        >
          <SectionHeading
            id='tutors-title'
            eyebrow='تیم مدرسان'
            title='آدم‌هایی که پای تخته می‌ایستند'
            trailing={<Ornament />}
          />

          <div className='grid gap-3 @xl:grid-cols-3'>
            {TUTORS.map((tutor) => (
              <Lift key={tutor.name} className='h-full'>
                <Card className='h-full gap-3'>
                  <div className='flex items-start gap-2.5'>
                    <Portrait
                      variant={tutor.portrait}
                      className='size-16 shrink-0 overflow-hidden rounded-[var(--cc-radius)] border-[length:var(--cc-border-width)] border-[color:var(--cc-border)]'
                    />
                    <div className='flex min-w-0 flex-col gap-0.5'>
                      <span className='text-sm font-bold text-[color:var(--cc-surface-foreground)]'>
                        {tutor.name}
                      </span>
                      <span className='text-[0.6875rem] text-[color:var(--cc-muted-foreground)]'>
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

                  <Button
                    variant='outline'
                    size='sm'
                    fullWidth
                    className='mt-auto'
                  >
                    رزرو جلسه
                    <Icon name='calendar' className='size-3.5' />
                  </Button>
                </Card>
              </Lift>
            ))}
          </div>
        </section>
      </Reveal>


      {/* 8 — Result story: a full-bleed band so the page has a breath here. */}
      <Reveal>
        <section
          aria-labelledby='story-title'
          className='-mx-5 border-y-[length:var(--cc-border-width)] border-[color:var(--cc-border)] bg-[var(--cc-muted)] px-5 py-5 sm:-mx-7 sm:px-7 sm:py-6'
        >
          <div className='grid gap-4 @3xl:grid-cols-[1.05fr_0.95fr]'>
            <div className='flex flex-col gap-3'>
              <span className={eyebrowType}>نتیجهٔ واقعی</span>
              <h3
                id='story-title'
                className={cn(
                  "text-lg leading-tight text-[color:var(--cc-surface-foreground)] @2xl:text-xl",
                  headingType,
                )}
              >
                از ترس ریاضی تا رتبهٔ سه‌رقمی
              </h3>

              <div aria-live='polite'>
                <Swap swapKey={testimonial}>
                  <p className='text-sm leading-relaxed text-[color:var(--cc-surface-foreground)]'>
                    «{story.quote}»
                  </p>

                  <div className='mt-3 flex flex-wrap items-center gap-2'>
                    <Portrait
                      variant={story.portrait}
                      className='size-10 overflow-hidden rounded-full border-[length:var(--cc-border-width)] border-[color:var(--cc-border)]'
                    />
                    <div className='flex flex-col'>
                      <span className='text-xs font-bold text-[color:var(--cc-surface-foreground)]'>
                        {story.name}
                      </span>
                      <span className='text-[0.6875rem] text-[color:var(--cc-muted-foreground)]'>
                        {story.exam}
                      </span>
                    </div>
                    <Badge variant='success' className='ms-auto'>
                      +{formatNumber(story.scores[1] - story.scores[0])} نمره
                    </Badge>
                  </div>
                </Swap>
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
                <span className='ms-1 text-[0.6875rem] text-[color:var(--cc-muted-foreground)]'>
                  {formatNumber(testimonial + 1)} از{" "}
                  {formatNumber(TESTIMONIALS.length)}
                </span>

                <div className='ms-auto flex items-center gap-1.5'>
                  {TESTIMONIALS.map((entry, index) => (
                    <button
                      key={entry.name}
                      type='button'
                      onClick={() => setTestimonial(index)}
                      aria-label={`روایت ${entry.name}`}
                      aria-pressed={index === testimonial}
                      className='relative size-2.5 rounded-full border-[length:var(--cc-border-width)] border-[color:var(--cc-border)] bg-[var(--cc-muted)]'
                    >
                      {index === testimonial ? (
                        <motion.span
                          layoutId='landing-story-dot'
                          className='absolute inset-0 rounded-full bg-[var(--cc-primary)]'
                          transition={{
                            type: "spring",
                            stiffness: 320,
                            damping: 26,
                          }}
                        />
                      ) : null}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className='flex flex-col gap-2 rounded-[var(--cc-radius)] border-[length:var(--cc-border-width)] border-[color:var(--cc-border)] bg-[var(--cc-surface)] p-3'>
              <div className='flex items-center justify-between text-[0.6875rem] text-[color:var(--cc-muted-foreground)]'>
                <span>آزمون قبل از روشنا</span>
                <span>بعد از یک ترم</span>
              </div>
              <ScoreChart className='h-40 w-full' />
              <div className='flex items-center justify-between'>
                <Badge variant='outline'>
                  نمرهٔ {formatNumber(story.scores[0])}
                </Badge>
                <Icon
                  name='arrow-left'
                  className='size-4 text-[color:var(--cc-muted-foreground)]'
                />
                <Badge variant='success'>
                  نمرهٔ {formatNumber(story.scores[1])}
                </Badge>
              </div>
            </div>
          </div>
        </section>
      </Reveal>


      {/* 9 — Pricing */}
      <Reveal>
        <section
          id='pricing'
          aria-labelledby='pricing-title'
          className='flex flex-col gap-4'
        >
          <SectionHeading
            id='pricing-title'
            eyebrow='قیمت‌ها'
            title='پلن مناسب خودت را انتخاب کن'
            description='هر زمان بخواهی می‌توانی ارتقا بدهی؛ اختلاف هزینه محاسبه می‌شود.'
            trailing={
              <div className='flex flex-wrap items-center gap-2 rounded-[var(--cc-radius)] border-[length:var(--cc-border-width)] border-[color:var(--cc-border)] bg-[var(--cc-muted)] px-2 py-1'>
                <span
                  className={cn(
                    "text-[0.6875rem]",
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
                    "text-[0.6875rem]",
                    annual
                      ? "font-bold text-[color:var(--cc-primary)]"
                      : "text-[color:var(--cc-muted-foreground)]",
                  )}
                >
                  سالانه
                </span>
                <Badge variant='success'>۲ ماه هدیه</Badge>
              </div>
            }
          />

          <div className='grid gap-3 @xl:grid-cols-3'>
            {PLANS.map((plan) => {
              const price = annual ? plan.yearly : plan.monthly;

              return (
                <Lift key={plan.name} className='h-full' hover={false}>
                  <Card
                    className={cn(
                      "h-full gap-3",
                      plan.badge &&
                        "border-[color:var(--cc-primary)] ring-1 ring-[color:var(--cc-primary)]",
                    )}
                  >
                    <div className='flex items-center justify-between gap-2'>
                      <span className='text-sm font-bold text-[color:var(--cc-surface-foreground)]'>
                        {plan.name}
                      </span>
                      {plan.badge ? (
                        <Badge variant='success' className='gap-1'>
                          <Icon name='sparkles' className='size-3' />
                          {plan.badge}
                        </Badge>
                      ) : null}
                    </div>

                    <div className='flex flex-col gap-0.5'>
                      <div className='flex items-end gap-1'>
                        <span
                          className={cn(
                            "whitespace-nowrap text-lg font-black text-[color:var(--cc-surface-foreground)]",
                            monoType,
                            headingType,
                          )}
                        >
                          {formatToman(price)}
                        </span>
                        <span className='pb-0.5 text-[0.6875rem] text-[color:var(--cc-muted-foreground)]'>
                          / {annual ? "سال" : "ماه"}
                        </span>
                      </div>
                      <span className='text-[0.6875rem] text-[color:var(--cc-muted-foreground)]'>
                        {annual
                          ? `معادل ${formatToman(Math.round(plan.yearly / 12))} در ماه`
                          : "بدون قرارداد بلندمدت"}
                      </span>
                    </div>

                    <Separator />

                    <ul className='flex flex-col gap-1.5'>
                      {plan.features.map((feature) => (
                        <li
                          key={feature}
                          className='flex items-start gap-1.5 text-xs text-[color:var(--cc-surface-foreground)]'
                        >
                          <Icon
                            name='check'
                            className='mt-0.5 size-3.5 shrink-0 text-[color:var(--cc-primary)]'
                          />
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
                </Lift>
              );
            })}
          </div>
        </section>
      </Reveal>


      {/* Comparison + onboarding steps */}
      <Reveal>
        <div className='grid gap-4 @3xl:grid-cols-[1.15fr_0.85fr]'>
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

          <Card>
            <CardHeader>
              <span className={eyebrowType}>مسیر شروع</span>
              <CardTitle>سه قدم تا اولین جلسه</CardTitle>
              <CardDescription>
                بدون قرارداد بلندمدت؛ بعد از جلسهٔ اول تصمیم می‌گیری.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='hidden @xl:block'>
                <StepPath className='h-8 w-full' />
              </div>
              <ol className='flex flex-col gap-3'>
                {STEPS.map((step, index) => (
                  <li key={step.title} className='flex items-start gap-2.5'>
                    <span
                      className={cn(
                        "flex size-7 shrink-0 items-center justify-center rounded-full bg-[var(--cc-primary)] text-xs font-bold text-[color:var(--cc-primary-foreground)]",
                        monoType,
                      )}
                    >
                      {formatNumber(index + 1)}
                    </span>
                    <span className='flex flex-col gap-0.5'>
                      <span className='text-xs font-bold text-[color:var(--cc-surface-foreground)]'>
                        {step.title}
                      </span>
                      <span className='text-[0.6875rem] leading-relaxed text-[color:var(--cc-muted-foreground)]'>
                        {step.body}
                      </span>
                    </span>
                    <Badge variant='outline' className='ms-auto shrink-0'>
                      {step.meta}
                    </Badge>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>
      </Reveal>


      {/* FAQ + support */}
      <Reveal>
        <div id='faq' className='grid gap-4 @2xl:grid-cols-[1.4fr_0.8fr]'>
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
                <span className='text-[0.6875rem] text-[color:var(--cc-muted-foreground)]'>
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
                  className='flex items-center gap-1.5 text-[0.6875rem] text-[color:var(--cc-muted-foreground)]'
                >
                  <Icon
                    name='check-circle'
                    className='size-3 text-[color:var(--cc-primary)]'
                  />
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
      </Reveal>


      {/* CTA — a plain section: no card hover on a full-width band. */}
      <Reveal>
        <section
          aria-labelledby='cta-title'
          className='relative overflow-hidden rounded-[var(--cc-radius-lg)] border-[length:var(--cc-border-width)] border-[color:var(--cc-border)] bg-[var(--cc-surface)] [box-shadow:var(--cc-shadow)]'
        >
          <CtaPattern className='pointer-events-none absolute inset-0 size-full opacity-70' />

          <div className='relative grid gap-4 p-5 @3xl:grid-cols-2'>
            <div className='flex flex-col gap-3'>
              <Badge variant='accent' className='self-start'>
                تعیین سطح رایگان
              </Badge>
              <h3
                id='cta-title'
                className={cn(
                  "text-xl leading-tight text-[color:var(--cc-surface-foreground)]",
                  headingType,
                )}
              >
                هنوز مطمئن نیستی؟
              </h3>
              <p className='max-w-md text-xs leading-relaxed text-[color:var(--cc-muted-foreground)]'>
                ایمیلت را بگذار؛ مشاور آموزشی برای یک جلسهٔ ۳۰ دقیقه‌ای تعیین
                سطح تماس می‌گیرد و برنامهٔ پیشنهادی را می‌فرستد. بدون تعهد.
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
              <RadioGroup
                value={goal}
                onValueChange={setGoal}
                className='gap-1.5'
              >
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
        </section>
      </Reveal>


      {/* Footer */}
      <footer className='flex flex-col gap-3'>
        <Separator />
        <div className='grid gap-4 @2xl:grid-cols-[1.3fr_0.7fr_0.7fr_0.7fr]'>
          <div className='flex flex-col gap-1.5'>
            <div className='flex items-center gap-2'>
              <span className='flex size-7 items-center justify-center rounded-[var(--cc-radius-sm)] bg-[var(--cc-primary)] text-[color:var(--cc-primary-foreground)]'>
                <Icon name='brand' className='size-4' />
              </span>
              <span className='text-sm font-black text-[color:var(--cc-surface-foreground)]'>
                آکادمی روشنا
              </span>
            </div>
            <p className='max-w-xs text-[0.6875rem] leading-relaxed text-[color:var(--cc-muted-foreground)]'>
              کلاس زنده، مدرس اختصاصی و برنامهٔ شخصی برای دانش‌آموزان ایران. ترم
              پاییز ۱۴۰۴.
            </p>
            <div className='flex flex-wrap gap-1'>
              <Badge variant='outline'>اینستاگرام</Badge>
              <Badge variant='outline'>تلگرام</Badge>
              <Badge variant='outline'>یوتیوب</Badge>
            </div>
          </div>

          <nav aria-label='دوره‌ها' className='flex flex-col gap-1.5'>
            <span className={eyebrowType}>دوره‌ها</span>
            {SUBJECT_IDS.map((id) => (
              <button
                key={id}
                type='button'
                onClick={() => setSubject(id)}
                className='text-start text-[0.6875rem] text-[color:var(--cc-muted-foreground)] transition-colors hover:text-[color:var(--cc-surface-foreground)]'
              >
                {SUBJECTS[id].label}
              </button>
            ))}
          </nav>

          <nav aria-label='مدرسان' className='flex flex-col gap-1.5'>
            <span className={eyebrowType}>مدرسان</span>
            {TUTORS.map((tutor) => (
              <a
                key={tutor.name}
                href='#tutors'
                className='text-start text-[0.6875rem] text-[color:var(--cc-muted-foreground)] transition-colors hover:text-[color:var(--cc-surface-foreground)]'
              >
                {tutor.name}
              </a>
            ))}
          </nav>

          <nav aria-label='دربارهٔ روشنا' className='flex flex-col gap-1.5'>
            <span className={eyebrowType}>روشنا</span>
            {[
              { label: "دربارهٔ ما", href: "#landing-hero" },
              { label: "وبلاگ آموزشی", href: "#features" },
              { label: "قوانین و حریم خصوصی", href: "#faq" },
              { label: "تماس با ما", href: "#faq" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className='text-start text-[0.6875rem] text-[color:var(--cc-muted-foreground)] transition-colors hover:text-[color:var(--cc-surface-foreground)]'
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        <div className='flex flex-wrap items-center justify-between gap-2 border-t-[length:var(--cc-border-width)] border-[color:var(--cc-border)] pt-2'>
          <span className='text-[0.6875rem] text-[color:var(--cc-muted-foreground)]'>
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

