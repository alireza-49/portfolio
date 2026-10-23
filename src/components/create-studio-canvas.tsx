"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Maximize2,
  Minimize2,
  Sparkles,
  TriangleAlert,
} from "lucide-react";
import {
  ARCHETYPES,
  ICON_LIBRARIES,
  mixWithWhite,
  type ArchetypeId,
  type IconLibraryId,
  type StyleId,
} from "@/components/create-studio-config";
import { AnalyticsDashboardView } from "@/components/create-scenarios/analytics-dashboard";
import { ClinicReservationView } from "@/components/create-scenarios/clinic-reservation";
import { ClothingShopView } from "@/components/create-scenarios/clothing-shop";
import { LIBRARY_ICONS } from "@/components/create-scenarios/icons";
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
  type CreateComponentTheme,
  createThemePresets,
  headingType,
  mixHex,
  readableForeground,
} from "@/components/create-components";

type CanvasProps = {
  archetype: ArchetypeId;
  primary: string;
  primarySubtle: string;
  radius: number;
  styleId: StyleId;
  /** Fully resolved CSS stack, built-ins and uploaded fonts alike. */
  fontFamily: string;
  iconLibrary: IconLibraryId;
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

type ComponentsViewProps = {
  iconLibrary: IconLibraryId;
};

export function CreateStudioCanvas({
  archetype,
  primary,
  primarySubtle,
  radius,
  styleId,
  fontFamily,
  iconLibrary,
}: CanvasProps) {
  const presetDefinition = createThemePresets[styleId];
  const isDark = presetDefinition.tone === "dark";
  const presetSurface = presetDefinition.tokens.surface ?? "#ffffff";
  const effectiveRadius = radius;

  const ChromeIcon = LIBRARY_ICONS[iconLibrary];
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

  // The sidebar owns the brand colour, radius and body font; everything else
  // (palette, geometry, typography voice, texture) comes from the preset.
  const theme: Partial<CreateComponentTheme> = {
    primary,
    primaryForeground: readableForeground(primary),
    primaryHover: mixHex(primary, isDark ? "#ffffff" : "#000000", 0.14),
    secondary: isDark
      ? `color-mix(in srgb, ${primary} 22%, ${presetSurface})`
      : primarySubtle,
    secondaryForeground: isDark ? mixHex(primary, "#ffffff", 0.4) : primary,
    secondaryHover: isDark
      ? `color-mix(in srgb, ${primary} 32%, ${presetSurface})`
      : mixWithWhite(primarySubtle, 0.1),
    ring: primary,
    radius: effectiveRadius,
    fontFamily,
  };

  return (
    <section
      id='studio-canvas'
      role='tabpanel'
      aria-labelledby={`scenario-tab-${archetype}`}
      className={`studio-desk order-1 flex w-full shrink-0 flex-col gap-4 overflow-x-clip p-3 sm:p-5 lg:order-2 lg:min-h-0 lg:shrink lg:flex-1 lg:overflow-y-auto lg:p-8 xl:p-10 ${
        expanded ? "fixed inset-0 z-[60] overflow-y-auto" : ""
      }`}
    >
      <CreateComponentsThemeProvider
        preset={styleId}
        theme={theme}
        className={`paper-pattern relative flex w-full flex-col overflow-x-clip overflow-y-visible scroll-pt-14 rounded-sm transition-all lg:overflow-auto ${
          expanded
            ? "min-h-[calc(100dvh-1.5rem)] sm:min-h-[calc(100dvh-2.5rem)] lg:min-h-0 lg:flex-1"
            : "min-h-[560px] sm:min-h-[660px] lg:min-h-0 lg:flex-1"
        }`}
        style={{
          borderStyle: "var(--cc-border-style)",
          borderWidth: "var(--cc-border-width)",
          borderColor: "var(--cc-border)",
          boxShadow: "var(--cc-shadow)",
        }}
      >
        <div
          className='sticky top-0 z-20 flex w-full flex-wrap select-none items-center justify-between gap-2 rounded-t-[2px] border-b-[length:var(--cc-border-width)] border-[color:var(--cc-border)] px-3 py-2.5 sm:px-5 sm:py-3'
          style={{
            backgroundColor:
              "color-mix(in srgb, var(--cc-muted) 82%, var(--cc-background))",
            boxShadow:
              "0 8px 16px -16px color-mix(in srgb, var(--cc-surface-foreground) 55%, transparent)",
          }}
        >
          <div className='flex min-w-0 items-center gap-2.5'>
            <div className='flex items-center gap-1.5'>
              <span className='size-3 rounded-full border-[length:var(--cc-border-width)] border-[color:var(--cc-border)] bg-[var(--cc-primary)]' />
              <span className='size-3 rounded-full border-[length:var(--cc-border-width)] border-[color:var(--cc-border)] bg-[var(--cc-accent)]' />
              <span className='size-3 rounded-full border-[length:var(--cc-border-width)] border-[color:var(--cc-border)] bg-[var(--cc-success)]' />
            </div>
            <span className='mx-0.5 h-4 w-px bg-[var(--cc-border)]' />
            <div className='flex min-w-0 items-center gap-1.5 text-xs font-black text-[color:var(--cc-surface-foreground)] sm:text-[13px]'>
              <ChromeIcon className='size-4 shrink-0 text-[color:var(--cc-primary)]' />
              <span className='truncate'>{activeScenario.label}</span>
            </div>
          </div>
          <div className='flex items-center gap-1.5 sm:gap-2'>
            <span className='hidden items-center gap-1 rounded-[var(--cc-radius-sm)] border-[length:var(--cc-border-width)] border-[color:var(--cc-border)] bg-[var(--cc-surface)] px-2 py-0.5 font-mono text-[10px] font-bold text-[color:var(--cc-surface-foreground)] [box-shadow:var(--cc-shadow)] lg:inline-flex'>
              STYLE: <span dir='ltr'>{styleId.toUpperCase()}</span>
            </span>
            <button
              type='button'
              onClick={() => setExpanded((value) => !value)}
              aria-pressed={expanded}
              aria-label={expanded ? "بستن بزرگ‌نمایی بوم" : "بزرگ‌نمایی بوم"}
              title={expanded ? "بستن بزرگ‌نمایی بوم" : "بزرگ‌نمایی بوم"}
              className='flex items-center gap-1 rounded-[var(--cc-radius-sm)] border-[length:var(--cc-border-width)] border-[color:var(--cc-border)] bg-[var(--cc-primary)] px-2 py-0.5 font-mono text-[10px] font-bold text-[color:var(--cc-primary-foreground)] transition-transform [box-shadow:var(--cc-shadow)] hover:-translate-y-px'
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
          </div>
        </div>

        <div className='flex flex-col gap-6 p-5 sm:p-7'>
          {archetype === "components" ? (
            <ComponentsView iconLibrary={iconLibrary} />
          ) : null}
          {archetype === "landing" ? (
            <TutoringLandingView iconLibrary={iconLibrary} />
          ) : null}
          {archetype === "ecommerce" ? (
            <ClothingShopView iconLibrary={iconLibrary} />
          ) : null}
          {archetype === "clinic" ? (
            <ClinicReservationView iconLibrary={iconLibrary} />
          ) : null}
          {archetype === "dashboard" ? (
            <AnalyticsDashboardView iconLibrary={iconLibrary} />
          ) : null}
        </div>
      </CreateComponentsThemeProvider>
    </section>
  );
}

function ComponentsView({ iconLibrary }: ComponentsViewProps) {
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

  const Icon = LIBRARY_ICONS[iconLibrary];
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
            چیدمان منطقی همهٔ کامپوننت‌ها روی بوم؛ رنگ، شعاع گوشه، سبک، فونت و
            کتابخانهٔ آیکون از پنل تنظیمات استودیو اعمال می‌شود.
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
              <Icon className='size-4' />
            </Button>
            <Button size='icon' variant='outline' aria-label='جلوهٔ ویژه'>
              <Sparkles className='size-4' />
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
            <Icon className='size-4' />
            پیش‌نمایش
          </Button>
          <Button size='sm'>ذخیرهٔ ترکیب</Button>
        </div>
      </div>
    </div>
  );
}


