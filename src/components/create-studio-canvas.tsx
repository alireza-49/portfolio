"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  ExternalLink,
  Maximize2,
  Minimize2,
  MonitorPlay,
  ShieldCheck,
  TriangleAlert,
} from "lucide-react";
import {
  ARCHETYPE_ICONS,
  ARCHETYPES,
  ICON_LIBRARIES,
  STYLES,
  resolveIconStyle,
  type ArchetypeId,
  type IconLibraryId,
  type IconStyle,
  type StyleId,
} from "@/components/create-studio-config";
import {
  paletteThemeOverrides,
  type StudioPalette,
} from "@/components/create-studio-palette";
import { AnalyticsDashboardView } from "@/components/create-scenarios/analytics-dashboard";
import { ClinicReservationView } from "@/components/create-scenarios/clinic-reservation";
import { ClothingShopView } from "@/components/create-scenarios/clothing-shop";
import { TutoringLandingView } from "@/components/create-scenarios/tutoring-landing";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Alert,
  AreaTrend,
  Avatar,
  Badge,
  Button,
  Calendar,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ChartFrame,
  ChartLegend,
  CheckboxField,
  CreateComponentsThemeProvider,
  Field,
  Icon,
  IconSetProvider,
  Input,
  Progress,
  RadioGroup,
  RadioGroupField,
  Select,
  Separator,
  Skeleton,
  Slider,
  Sparkline,
  Stat,
  Stepper,
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
  Textarea,
  Timeline,
  TimelineItem,
  useIconLibrary,
  type CreateComponentTheme,
  headingType,
} from "@/components/create-components";

type CanvasProps = {
  archetype: ArchetypeId;
  /** Studio palette: roles plus optional neutral/chart overrides. */
  palette: StudioPalette;
  radius: number;
  styleId: StyleId;
  /** Fully resolved CSS stack, built-ins and uploaded fonts alike. */
  fontFamily: string;
  iconLibrary: IconLibraryId;
  /** Size / weight / tone tokens shared by every glyph on the canvas. */
  iconStyle: IconStyle;
};

const PROJECT_TYPES = [
  { value: "landing", label: "لندینگ پیج" },
  { value: "ecommerce", label: "فروشگاه آنلاین" },
  { value: "dashboard", label: "داشبورد داده" },
  { value: "blog", label: "وبلاگ و محتوا" },
];

const PRIORITIES = [
  { value: "low", label: "کم", description: "بدون عجله" },
  { value: "normal", label: "معمولی", description: "زمان‌بندی استاندارد" },
  { value: "high", label: "فوری", description: "تحویل سریع" },
];

const DEMO_STEPS = [
  { id: "pick", label: "پزشک", hint: "تخصص" },
  { id: "time", label: "زمان", hint: "روز و ساعت" },
  { id: "info", label: "بیمار", hint: "اطلاعات" },
  { id: "pay", label: "تأیید", hint: "پرداخت" },
];

const COMPONENT_STATS = [
  { label: "کاربران فعال", value: "۱,۸۴۲" },
  { label: "میانگین لتنسی", value: "۱۸ms" },
  { label: "نرخ موفقیت", value: "۹۹.۴٪" },
];

const COMPONENT_INVOICES = [
  {
    id: "INV-1042",
    client: "استودیو نورث‌ویند",
    amount: "۳,۸۵۰,۰۰۰",
    status: "پرداخت‌شده",
    tone: "success",
  },
  {
    id: "INV-1043",
    client: "کارگاه کسترل",
    amount: "۱,۲۰۰,۰۰۰",
    status: "در انتظار",
    tone: "warning",
  },
  {
    id: "INV-1044",
    client: "غذای مداری",
    amount: "۷,۴۱۰,۰۰۰",
    status: "معوق",
    tone: "danger",
  },
] as const;

const COMPONENT_FAQ = [
  {
    value: "timeline",
    question: "زمان تحویل پروژه چقدر است؟",
    answer:
      "بسته به دامنهٔ کار، نسخهٔ اولیه بین دو تا چهار هفته آماده می‌شود و هر هفته یک جلسهٔ بازبینی زنده داریم.",
  },
  {
    value: "handoff",
    question: "تحویل کد چگونه انجام می‌شود؟",
    answer:
      "مخزن گیت‌هاب به همراه مستندات کامپوننت‌ها، توکن‌های تم و راهنمای استقرار در اختیار تیم شما قرار می‌گیرد.",
  },
  {
    value: "support",
    question: "پشتیبانی بعد از تحویل چطور است؟",
    answer:
      "یک ماه پشتیبانی رایگان برای رفع باگ و پاسخ به پرسش‌های تیم فرانت‌اند شما در نظر گرفته شده است.",
  },
] as const;

export function CreateStudioCanvas({
  archetype,
  palette,
  radius,
  styleId,
  fontFamily,
  iconLibrary,
  iconStyle,
}: CanvasProps) {
  const effectiveRadius = radius;
  const icons = resolveIconStyle(iconStyle);

  const ChromeIcon = ARCHETYPE_ICONS[archetype];
  const [expanded, setExpanded] = useState(false);
  const activeScenario =
    ARCHETYPES.find((item) => item.id === archetype) ?? ARCHETYPES[0];

  // Full-screen preview: Escape leaves the stage without hunting for the button.
  useEffect(() => {
    if (!expanded) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setExpanded(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [expanded]);

  // The sidebar owns the colour layer (roles always, neutrals/charts when the
  // visitor edited them), radius and body font; the rest of the visual
  // identity — geometry, typography voice, texture — still comes from the
  // preset through the provider.
  const theme: Partial<CreateComponentTheme> = {
    ...paletteThemeOverrides(palette, styleId),
    radius: effectiveRadius,
    fontFamily,
    iconScale: icons.scale,
    iconStroke: icons.stroke,
    iconColor: icons.color,
  };

  return (
    <section
      id='studio-canvas'
      role='tabpanel'
      aria-labelledby={`scenario-tab-${archetype}`}
      className={`studio-desk order-1 flex w-full shrink-0 flex-col gap-3 overflow-x-clip p-3 sm:p-5 lg:order-2 lg:min-h-0 lg:shrink lg:flex-1 lg:gap-4 lg:overflow-hidden lg:p-8 xl:p-10 ${
        expanded ? "fixed inset-0 z-[60] overflow-hidden" : ""
      }`}
    >
      {/* The frame belongs to the studio: page tokens only. The preset's
          --cc-* scope starts at the content viewport below, so switching the
          style restyles the site inside the window and never the window. */}
      <div
        className={`shrink-0 items-center justify-between gap-2 px-1 text-[10px] font-bold text-paper/75 ${
          expanded ? "hidden" : "hidden sm:flex"
        }`}
      >
        <span className='flex items-center gap-1.5'>
          <MonitorPlay aria-hidden='true' className='size-3.5 text-mustard' />
          پنجرهٔ سایتِ مستقل
        </span>
        <span dir='ltr' className='font-mono text-[10px] text-paper/50'>
          {activeScenario.demoHost}
        </span>
      </div>

      <div
        data-preview-window=''
        className={`relative flex w-full flex-col overflow-hidden rounded-sm border-[2.5px] border-indigo-ink bg-paper-dim ${
          expanded
            ? "min-h-0 flex-1"
            : "h-[72dvh] min-h-[420px] sm:h-[76dvh] lg:h-auto lg:min-h-0 lg:flex-1"
        }`}
      >
        {/* One-line browser bar. Painted with the studio's mustard ink so it can
            never be confused with the preset's own page background inside. */}
        <div
          data-preview-chrome=''
          className='relative z-10 flex w-full shrink-0 flex-nowrap items-center gap-1.5 border-b-[2.5px] border-indigo-ink bg-mustard px-2 py-1.5 select-none sm:gap-2 sm:px-3'
        >
          <button
            type='button'
            onClick={() => setExpanded((value) => !value)}
            aria-pressed={expanded}
            aria-label={expanded ? "بستن بزرگ‌نمایی بوم" : "بزرگ‌نمایی بوم"}
            title={expanded ? "بستن بزرگ‌نمایی بوم" : "بزرگ‌نمایی بوم"}
            className='flex shrink-0 items-center gap-1 rounded-sm border-[1.5px] border-indigo-ink bg-indigo-ink px-2 py-1 text-[10px] font-bold whitespace-nowrap text-paper shadow-craft-sm transition-colors hover:bg-coral active:translate-x-px active:translate-y-px'
          >
            {expanded ? (
              <Minimize2 className='size-3.5' />
            ) : (
              <Maximize2 className='size-3.5' />
            )}
            <span className='hidden sm:inline'>
              {expanded ? "بستن" : "بزرگ‌نمایی"}
            </span>
          </button>

          <span className='h-4 w-px shrink-0 bg-indigo-ink/25' />

          <div className='flex shrink-0 items-center gap-1.5'>
            <span className='size-3 rounded-full border-[1.5px] border-indigo-ink bg-coral' />
            <span className='size-3 rounded-full border-[1.5px] border-indigo-ink bg-paper' />
            <span className='size-3 rounded-full border-[1.5px] border-indigo-ink bg-teal-craft' />
          </div>

          <div className='hidden min-w-0 shrink items-center gap-1.5 md:flex'>
            <ChromeIcon
              aria-hidden='true'
              className='size-4 shrink-0 text-coral'
            />
            <span className='truncate font-display text-[13px] font-black text-indigo-ink'>
              {activeScenario.label}
            </span>
          </div>

          <div
            dir='ltr'
            title='این پنجره یک سایت مستقل است'
            className='flex min-w-0 flex-1 items-center gap-1.5 rounded-sm border-[1.5px] border-indigo-ink bg-paper-light px-2 py-1 shadow-craft-sm sm:mx-auto sm:max-w-[20rem]'
          >
            <ShieldCheck
              aria-hidden='true'
              className='size-3.5 shrink-0 text-teal-craft'
            />
            <span className='truncate font-mono text-[10px] font-bold text-indigo-ink/80 sm:text-[11px]'>
              https://{activeScenario.demoHost}
            </span>
          </div>

          <div className='flex shrink-0 items-center gap-1.5 sm:gap-2'>
            <span className='hidden items-center gap-1 rounded-full border-[1.5px] border-indigo-ink bg-teal-light px-2 py-0.5 text-[10px] font-bold whitespace-nowrap text-indigo-ink xl:inline-flex'>
              <span className='size-1.5 animate-pulse rounded-full bg-teal-craft' />
              پیش‌نمایش زنده
            </span>
            <span
              title='سبک فعال استودیو'
              className='hidden items-center gap-1 rounded-sm border-[1.5px] border-indigo-ink bg-paper-light px-2 py-0.5 text-[10px] font-bold whitespace-nowrap text-indigo-ink shadow-craft-sm lg:inline-flex'
            >
              سبک: {STYLES.find((style) => style.id === styleId)?.label ?? styleId}
            </span>
          </div>
        </div>

        {/* The site viewport: the only scroller in the artboard. The tab strip,
            toolbar and status bar live outside it, so the header always stays. */}
        <div
          data-preview-viewport=''
          dir='ltr'
          className='studio-scroll relative flex min-h-0 w-full flex-1 flex-col overflow-x-clip overflow-y-auto'
        >
          <CreateComponentsThemeProvider
            preset={styleId}
            theme={theme}
            className='flex w-full flex-1 flex-col overflow-x-clip'
          >
            <IconSetProvider library={iconLibrary}>
              <div dir='rtl' className='flex flex-col gap-6 p-5 sm:p-7'>
                {archetype === "components" ? <ComponentsView /> : null}
                {archetype === "landing" ? <TutoringLandingView /> : null}
                {archetype === "ecommerce" ? <ClothingShopView /> : null}
                {archetype === "clinic" ? <ClinicReservationView /> : null}
                {archetype === "dashboard" ? (
                  <AnalyticsDashboardView />
                ) : null}
              </div>
            </IconSetProvider>
          </CreateComponentsThemeProvider>
        </div>

        {/* Browser status bar: repeats the "separate site" contract. */}
        <div className='flex shrink-0 items-center justify-between gap-2 border-t-[2.5px] border-indigo-ink bg-paper px-2.5 py-1 text-[9px] font-bold text-indigo-ink/65 sm:text-[10px]'>
          <span className='flex min-w-0 items-center gap-1.5'>
            <ExternalLink
              aria-hidden='true'
              className='size-3 shrink-0 text-coral'
            />
            <span className='truncate'>
              این محتوا یک سایت مستقل است، نه بخشی از این صفحه
            </span>
          </span>
          <span
            dir='ltr'
            className='hidden shrink-0 font-mono text-[9px] text-indigo-ink/45 sm:inline'
          >
            {activeScenario.demoHost}
          </span>
        </div>
      </div>
    </section>
  );
}

function ComponentsView() {
  const [projectType, setProjectType] = useState("landing");
  const [budget, setBudget] = useState(40);
  const [priority, setPriority] = useState("normal");
  const [newsletter, setNewsletter] = useState(true);
  const [support, setSupport] = useState(false);
  const [progress, setProgress] = useState(65);
  const [tab, setTab] = useState("overview");
  const [demoDate, setDemoDate] = useState("2026-10-07");
  const [demoStep, setDemoStep] = useState(1);

  const demoTrend = [
    { label: "شنبه", value: 24 },
    { label: "یکشنبه", value: 31 },
    { label: "دوشنبه", value: 28 },
    { label: "سه‌شنبه", value: 38 },
    { label: "چهارشنبه", value: 35 },
    { label: "پنجشنبه", value: 44 },
    { label: "جمعه", value: 41 },
  ];
  const demoAvailability = {
    "2026-10-05": 9,
    "2026-10-06": 6,
    "2026-10-07": 3,
    "2026-10-08": 8,
    "2026-10-10": 5,
    "2026-10-11": 7,
    "2026-10-12": 2,
    "2026-10-13": 6,
    "2026-10-14": 4,
    "2026-10-15": 8,
  };

  const iconLibrary = useIconLibrary();
  const iconLibraryLabel =
    ICON_LIBRARIES.find((library) => library.id === iconLibrary)?.label ?? "";

  return (
    <div className='@container flex flex-col gap-6'>
      {/* 1 — Header */}
      <div className='flex flex-wrap items-start justify-between gap-4'>
        <div className='flex flex-col gap-1'>
          <span className='font-mono text-[10px] font-bold text-[color:var(--cc-primary)]'>
            ARCHETYPE: COMPONENT LIBRARY
          </span>
          <h2
            className={`text-xl leading-tight text-[color:var(--cc-surface-foreground)] ${headingType}`}
          >
            کتابخانهٔ کامپوننت‌های پایه
          </h2>
          <p className='max-w-xl text-sm leading-relaxed text-[color:var(--cc-muted-foreground)]'>
            چیدمان منطقی همهٔ کامپوننت‌ها روی بوم؛ رنگ، شعاع گوشه، سبک، فونت،
            کتابخانه و استایل آیکون از پنل تنظیمات استودیو اعمال می‌شود.
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <Avatar alt='تیم طراحی' size='sm' />
          <Avatar alt='تیم فرانت‌اند' size='sm' />
          <Avatar fallback='+۳' size='sm' />
        </div>
      </div>

      {/* 2 — Actions */}
      <Card>
        <CardHeader>
          <div className='flex flex-wrap items-center justify-between gap-2'>
            <CardTitle>دکمه‌ها</CardTitle>
            <Badge variant='outline'>{iconLibraryLabel}</Badge>
          </div>
          <CardDescription>
            هفت واریانت، چهار اندازه و حالت غیرفعال؛ همه از یک توکن شعاع.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='flex flex-wrap items-center gap-2'>
            <Button>اصلی</Button>
            <Button variant='secondary'>ثانویه</Button>
            <Button variant='outline'>دورخط</Button>
            <Button variant='ghost'>شبح</Button>
            <Button variant='danger'>خطر</Button>
            <Button variant='success'>موفقیت</Button>
            <Button variant='link'>پیوند</Button>
          </div>
          <Separator />
          <div className='flex flex-wrap items-center gap-2'>
            <Button size='sm'>کوچک</Button>
            <Button size='md'>متوسط</Button>
            <Button size='lg'>بزرگ</Button>
            <Button size='icon' aria-label='افزودن آیتم'>
              <Icon name='brand' className='size-4' />
            </Button>
            <Button size='icon' variant='outline' aria-label='جلوهٔ ویژه'>
              <Icon name='sparkles' className='size-4' />
            </Button>
            <Button disabled>غیرفعال</Button>
          </div>
        </CardContent>
      </Card>

      {/* 3 — Forms + selection */}
      <div className='grid gap-6 xl:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle>فرم و ورودی‌ها</CardTitle>
            <CardDescription>
              فیلد متنی، ایمیل، انتخابگر، متن چندخطی و لغزندهٔ بودجه.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='grid gap-3 sm:grid-cols-2'>
              <Field label='نام و نام خانوادگی' htmlFor='cc-name'>
                <Input id='cc-name' placeholder='مثلاً سهراب دیبا' />
              </Field>
              <Field
                label='ایمیل کاری'
                htmlFor='cc-email'
                hint='هیچ‌وقت منتشر نمی‌شود.'
              >
                <Input
                  id='cc-email'
                  type='email'
                  dir='ltr'
                  placeholder='you@studio.dev'
                />
              </Field>
              <Field label='نوع پروژه' htmlFor='cc-project'>
                <Select
                  id='cc-project'
                  options={PROJECT_TYPES}
                  value={projectType}
                  onValueChange={setProjectType}
                />
              </Field>
              <div className='flex flex-col gap-1.5'>
                <div className='flex items-center justify-between text-[length:calc(var(--cc-font-size)*0.9)] font-medium text-[color:var(--cc-surface-foreground)]'>
                  <label htmlFor='cc-budget'>بودجه (میلیون تومان)</label>
                  <span className='font-mono text-[color:var(--cc-muted-foreground)]'>
                    {budget}
                  </span>
                </div>
                <Slider
                  id='cc-budget'
                  min={0}
                  max={100}
                  step={5}
                  value={budget}
                  onChange={(event) => setBudget(Number(event.target.value))}
                />
              </div>
              <Field
                label='توضیحات پروژه'
                htmlFor='cc-notes'
                className='sm:col-span-2'
                hint='حداکثر ۵۰۰ کاراکتر.'
              >
                <Textarea
                  id='cc-notes'
                  placeholder='دربارهٔ اهداف، مخاطب و زمان‌بندی بنویسید…'
                />
              </Field>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>انتخاب و کلیدها</CardTitle>
            <CardDescription>
              چک‌باکس، رادیو و سوییچ با وضعیت کنترل‌شده.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='flex items-center justify-between gap-4'>
              <div className='flex flex-col gap-0.5'>
                <span className='text-[length:var(--cc-font-size)] font-medium text-[color:var(--cc-surface-foreground)]'>
                  پشتیبانی ۲۴ ساعته
                </span>
                <span className='text-[length:calc(var(--cc-font-size)*0.8)] text-[color:var(--cc-muted-foreground)]'>
                  در تمام ساعات هفته
                </span>
              </div>
              <Switch
                checked={support}
                onCheckedChange={setSupport}
                aria-label='پشتیبانی ۲۴ ساعته'
              />
            </div>
            <Separator />
            <CheckboxField
              label='ارسال خبرنامه'
              description='جدیدترین مقاله‌ها و پشت‌صحنهٔ کارگاه'
              checked={newsletter}
              onCheckedChange={setNewsletter}
            />
            <Separator label='اولویت پروژه' />
            <RadioGroup value={priority} onValueChange={setPriority}>
              {PRIORITIES.map((item) => (
                <RadioGroupField
                  key={item.value}
                  value={item.value}
                  label={item.label}
                  description={item.description}
                />
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
      </div>

      {/* 4 — Feedback */}
      <Card>
        <CardHeader>
          <div className='flex flex-wrap items-center justify-between gap-2'>
            <CardTitle>بازخورد و وضعیت</CardTitle>
            <div className='flex flex-wrap gap-1.5'>
              <Badge variant='success'>فعال</Badge>
              <Badge variant='warning'>در انتظار</Badge>
              <Badge variant='danger'>خطا</Badge>
              <Badge variant='accent'>آزمایشی</Badge>
            </div>
          </div>
          <CardDescription>
            هشدارها، نوار پیشرفت، اسکلت بارگذاری و نشان‌ها.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='grid gap-3 sm:grid-cols-2'>
            <Alert
              variant='success'
              title='تغییرات ذخیره شد'
              icon={<CheckCircle2 className='size-4' />}
            >
              ترکیب تم فعلی در حافظهٔ مرورگر نگه داشته شد.
            </Alert>
            <Alert
              variant='warning'
              title='نزدیک به سقف مصرف'
              icon={<TriangleAlert className='size-4' />}
            >
              پیش از رسیدن به محدودیت، پلن را ارتقا دهید.
            </Alert>
          </div>
          <Separator label='پیشرفت پروژه' />
          <div className='flex flex-col gap-1.5'>
            <div className='flex items-center justify-between text-[length:calc(var(--cc-font-size)*0.9)] font-medium text-[color:var(--cc-surface-foreground)]'>
              <label htmlFor='cc-progress'>تکمیل‌شده</label>
              <span className='font-mono text-[color:var(--cc-muted-foreground)]'>
                {progress}%
              </span>
            </div>
            <Progress value={progress} showValue />
            <Slider
              id='cc-progress'
              min={0}
              max={100}
              step={5}
              value={progress}
              onChange={(event) => setProgress(Number(event.target.value))}
            />
          </div>
          <Separator />
          <div className='flex flex-col gap-2'>
            <Skeleton className='h-3 w-3/4' />
            <Skeleton className='h-3 w-1/2' />
          </div>
        </CardContent>
      </Card>

      {/* 5 — Data + navigation */}
      <Card>
        <CardHeader>
          <div className='flex flex-wrap items-center justify-between gap-2'>
            <CardTitle>داده‌ها و ناوبری</CardTitle>
            <Badge variant='soft'>Live data</Badge>
          </div>
          <CardDescription>
            تب‌ها، جدول فاکتورها، آکاردئون پرسش‌ها و آواتارهای تیم.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList>
              <TabsTrigger value='overview'>نمای کلی</TabsTrigger>
              <TabsTrigger value='invoices'>فاکتورها</TabsTrigger>
              <TabsTrigger value='settings'>تنظیمات</TabsTrigger>
            </TabsList>

            <TabsContent value='overview'>
              <div className='grid gap-3 sm:grid-cols-3'>
                {COMPONENT_STATS.map((stat) => (
                  <div
                    key={stat.label}
                    className='flex flex-col gap-1 rounded-[var(--cc-radius)] border-[length:var(--cc-border-width)] border-[color:var(--cc-border)] bg-[var(--cc-muted)] p-[calc(0.75rem*var(--cc-density))]'
                  >
                    <span className='text-[length:calc(var(--cc-font-size)*0.8)] text-[color:var(--cc-muted-foreground)]'>
                      {stat.label}
                    </span>
                    <span className='font-mono text-[length:calc(var(--cc-font-size)*1.2)] font-bold text-[color:var(--cc-primary)]'>
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>
              <div className='mt-3 flex flex-wrap items-center gap-2'>
                <Avatar alt='سارا مهر' size='md' />
                <Avatar alt='کاوه راد' size='md' />
                <Avatar alt='نگار توس' size='md' />
                <Avatar fallback='+۵' size='md' />
                <Separator orientation='vertical' className='h-8' />
                <span className='text-[length:calc(var(--cc-font-size)*0.8)] text-[color:var(--cc-muted-foreground)]'>
                  ۸ نفر آنلاین
                </span>
              </div>
            </TabsContent>

            <TabsContent value='invoices'>
              <Table className='text-right'>
                <TableHeader>
                  <TableRow>
                    <TableHead className='text-right'>شماره</TableHead>
                    <TableHead className='text-right'>مشتری</TableHead>
                    <TableHead className='text-right'>مبلغ (تومان)</TableHead>
                    <TableHead className='text-right'>وضعیت</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {COMPONENT_INVOICES.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className='font-mono'>{invoice.id}</TableCell>
                      <TableCell>{invoice.client}</TableCell>
                      <TableCell className='font-mono'>
                        {invoice.amount}
                      </TableCell>
                      <TableCell>
                        <Badge variant={invoice.tone}>{invoice.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value='settings'>
              <Accordion type='single' defaultValue={["timeline"]}>
                {COMPONENT_FAQ.map((item) => (
                  <AccordionItem key={item.value} value={item.value}>
                    <AccordionTrigger>{item.question}</AccordionTrigger>
                    <AccordionContent>{item.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* 6 — Charts + scheduling */}
      <Card>
        <CardHeader>
          <div className='flex flex-wrap items-center justify-between gap-2'>
            <CardTitle>نمودارها و زمان‌بندی</CardTitle>
            <Badge variant='soft'>Recharts + SVG</Badge>
          </div>
          <CardDescription>
            نمودارها از پالت سری‌های تم تغذیه می‌شوند؛ تقویم، گام‌شمار و
            تایم‌لاین همه از توکن‌های هندسی و تایپوگرافی استفاده می‌کنند.
          </CardDescription>
        </CardHeader>
        <CardContent className='grid gap-3 @2xl:grid-cols-[1.25fr_0.75fr]'>
          <ChartFrame
            eyebrow='روند'
            title='درآمد هفته'
            className='border-0 p-0 [box-shadow:none]'
            legend={
              <ChartLegend
                items={[
                  { label: "درآمد", color: "var(--cc-chart-1)" },
                  { label: "میانگین", color: "var(--cc-chart-2)", dashed: true },
                ]}
              />
            }
          >
            <AreaTrend
              data={demoTrend}
              xKey='label'
              height={172}
              series={[{ key: "value", label: "درآمد" }]}
              formatValue={(value) => String(value)}
            />
          </ChartFrame>

          <div className='grid grid-cols-2 gap-2'>
            <Stat
              label='تبدیل'
              value='۴.۱٪'
              delta={{ value: "۰.۳", direction: "up" }}
            >
              <Sparkline points={[3, 3.4, 3.1, 3.8, 4.2, 4.1]} />
            </Stat>
            <Stat
              label='ریزش'
              value='۳.۸٪'
              delta={{ value: "۰.۴", direction: "down" }}
            >
              <Sparkline points={[5.2, 4.9, 4.4, 4.1, 3.8]} tone='success' />
            </Stat>
            <Stat
              label='نوبت‌های امروز'
              value='۱۲'
              delta={{ value: "۳", direction: "up" }}
            >
              <Sparkline points={[6, 8, 7, 9, 11, 12]} />
            </Stat>
            <Stat
              label='میانگین انتظار'
              value='۹ د'
              delta={{ value: "۲", direction: "down" }}
            >
              <Sparkline points={[14, 13, 11, 12, 10, 9]} tone='success' />
            </Stat>
          </div>
        </CardContent>

        <CardContent className='grid gap-3 border-t-[length:var(--cc-border-width)] border-[color:var(--cc-border)] pt-3 @2xl:grid-cols-[auto_1fr]'>
          <Calendar
            today='2026-10-05'
            value={demoDate}
            availability={demoAvailability}
            onValueChange={setDemoDate}
          />

          <div className='flex flex-col gap-3'>
            <Stepper
              steps={DEMO_STEPS}
              current={demoStep}
              onStepClick={setDemoStep}
            />
            <Separator />
            <Timeline>
              <TimelineItem
                title='رزرو نوبت تأیید شد'
                description='دکتر دیبا · ۱۰:۳۰'
                meta='۰۹:۱۲'
                tone='success'
              />
              <TimelineItem
                title='یادآوری پیامکی ارسال شد'
                description='۲۴ ساعت پیش از ویزیت'
                meta='دیروز'
                tone='primary'
              />
              <TimelineItem
                title='نتیجهٔ آزمایش بارگذاری شد'
                description='پروندهٔ بیمار به‌روزرسانی شد'
                meta='۲ روز پیش'
                tone='muted'
              />
            </Timeline>
          </div>
        </CardContent>
      </Card>


      {/* 6 — Footer */}
      <div className='flex flex-wrap items-center justify-between gap-3 border-t-[length:var(--cc-border-width)] border-[color:var(--cc-border)] pt-4'>
        <span className='text-[length:calc(var(--cc-font-size)*0.8)] text-[color:var(--cc-muted-foreground)]'>
          رنگ، شعاع، فونت، سبک و کتابخانهٔ آیکون همه از پنل کنار می‌آیند.
        </span>
        <div className='flex flex-wrap items-center gap-2'>
          <Button variant='ghost' size='sm'>
            بازنشانی
          </Button>
          <Button variant='outline' size='sm'>
            <Icon name='brand' className='size-4' />
            پیش‌نمایش
          </Button>
          <Button size='sm'>ذخیرهٔ ترکیب</Button>
        </div>
      </div>
    </div>
  );
}


