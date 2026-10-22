"use client";

import { useState, type CSSProperties } from "react";
import {
  Bolt,
  CheckCircle2,
  Clock,
  Coffee,
  Cookie,
  Croissant,
  Handshake,
  LayoutDashboard,
  LayoutGrid,
  PanelsTopLeft,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  TriangleAlert,
} from "lucide-react";
import {
  FONT_STACKS,
  ICON_LIBRARIES,
  mixWithWhite,
  type ArchetypeId,
  type FontId,
  type IconLibraryId,
  type StyleId,
} from "@/components/create-studio-config";
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
  font: FontId;
  iconLibrary: IconLibraryId;
};

type ViewProps = {
  primary: string;
  primarySubtle: string;
  radius: number;
  itemStyle: CSSProperties;
  accentStyle: CSSProperties;
  accentText: CSSProperties;
  subtleStyle: CSSProperties;
  headingClass: string;
};

const LIBRARY_ICONS: Record<IconLibraryId, typeof LayoutDashboard> = {
  google: LayoutDashboard,
  lucide: LayoutGrid,
  tabler: PanelsTopLeft,
};

const LANDING_FEATURES = [
  {
    icon: Bolt,
    title: "کد سبک و بهینه‌سازی شده",
    body: "بدون کتابخانه‌های حجیم جانبی؛ خالص‌ترین کد ممکن با بالاترین سرعت رندر.",
    tone: "text-coral",
  },
  {
    icon: ShieldCheck,
    title: "امنیت و پایداری سازمانی",
    body: "رعایت آخرین استانداردهای OWASP و ایزولاسیون کامل کامپوننت‌های فرانت‌اند.",
    tone: "text-indigo-ink",
  },
  {
    icon: Handshake,
    title: "پشتیبانی کارگاهی مستقیم",
    body: "ارتباط بدون واسطه با مهندس طراح و برنامه‌نویس اصلی در تمام فازها.",
    tone: "text-teal-craft",
  },
];

const PRODUCTS = [
  {
    icon: Croissant,
    title: "نان سوخاری چاودار روستیک",
    body: "آرد سبوس‌دار سنگک، بدون مخمر صنعتی و سرشار از فیبر",
    price: "۶۸,۰۰۰ تومان",
    badge: "داغ و تازه",
    note: "تخمیر طولانی ۴۸ ساعته",
    tone: "text-coral",
  },
  {
    icon: Coffee,
    title: "دانه قهوه تخصصی ۲۵۰ گرمی",
    body: "اسیدیته گلی مرکباتی، نوت‌های یاسمن و برشته‌کاری ملایم",
    price: "۳۴۰,۰۰۰ تومان",
    badge: "اتیوپی یرگاچف",
    note: "رست تازه تخصصی",
    tone: "text-indigo-ink",
  },
  {
    icon: Cookie,
    title: "کوکی شکلات دست‌ساز بلژیکی",
    body: "تکه‌های شکلات تلخ ۷۴ درصد با دانه‌های نمک دریا مالدون",
    price: "۴۵,۰۰۰ تومان",
    badge: null,
    note: "دست‌پخت روز",
    tone: "text-teal-craft",
  },
];

const STATS = [
  { label: "کاربران همزمان", value: "۱,۸۴۲", note: "+۱۲٪ نسبت به دیروز" },
  { label: "میانگین لتنسی سرور", value: "۱۸ ms", note: "عملکرد عالی" },
  { label: "نرخ کشینگ لبه (Edge)", value: "۹۹.۴٪", note: "بهینه شده" },
  { label: "خطاهای ۵۰۰ (Error)", value: "۰.۰۰٪", note: "بدون خطا" },
];

const NODES = [
  { name: "نود فرانکفورت (EU-Central)", load: "لود مصرفی: ۳۲٪ | ۲.۴ GB" },
  { name: "نود استانبول (TR-Edge)", load: "لود مصرفی: ۴۱٪ | ۳.۱ GB" },
  { name: "نود تهران (IR-Tehran IXP)", load: "لود مصرفی: ۵۵٪ | ۴.۸ GB" },
];

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
  font,
  iconLibrary,
}: CanvasProps) {
  const presetDefinition = createThemePresets[styleId];
  const isDark = presetDefinition.tone === "dark";
  const presetSurface = presetDefinition.tokens.surface ?? "#ffffff";
  const effectiveRadius = radius;

  const itemStyle: CSSProperties = { borderRadius: effectiveRadius };
  const accentStyle: CSSProperties = {
    backgroundColor: primary,
    color: readableForeground(primary),
    borderRadius: effectiveRadius,
  };
  const accentText: CSSProperties = { color: primary };
  const subtleBackground = isDark
    ? `color-mix(in srgb, ${primary} 20%, ${presetSurface})`
    : primarySubtle;
  const subtleStyle: CSSProperties = {
    backgroundColor: subtleBackground,
    borderRadius: effectiveRadius,
  };

  const ChromeIcon = LIBRARY_ICONS[iconLibrary];

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
    fontFamily: FONT_STACKS[font],
  };

  const viewProps: ViewProps = {
    primary,
    primarySubtle,
    radius: effectiveRadius,
    itemStyle,
    accentStyle,
    accentText,
    subtleStyle,
    headingClass: headingType,
  };

  return (
    <section className='dot-grid order-2 flex w-full flex-col gap-4 overflow-x-hidden bg-paper-shade p-4 sm:p-6 lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:p-8'>
      <CreateComponentsThemeProvider
        preset={styleId}
        theme={theme}
        className='paper-pattern relative flex min-h-[640px] w-full flex-col overflow-auto rounded-sm transition-all'
        style={{
          borderStyle: "var(--cc-border-style)",
          borderWidth: "var(--cc-border-width)",
          borderColor: "var(--cc-border)",
          boxShadow: "var(--cc-shadow)",
        }}
      >
        <div
          className='flex w-full select-none items-center justify-between border-b-[length:var(--cc-border-width)] border-[color:var(--cc-border)] px-4 py-2.5'
          style={{
            backgroundColor:
              "color-mix(in srgb, var(--cc-muted) 72%, var(--cc-background))",
          }}
        >
          <div className='flex items-center gap-2.5'>
            <div className='flex items-center gap-1.5'>
              <span className='size-3 rounded-full border-[length:var(--cc-border-width)] border-[color:var(--cc-border)] bg-[var(--cc-primary)]' />
              <span className='size-3 rounded-full border-[length:var(--cc-border-width)] border-[color:var(--cc-border)] bg-[var(--cc-accent)]' />
              <span className='size-3 rounded-full border-[length:var(--cc-border-width)] border-[color:var(--cc-border)] bg-[var(--cc-success)]' />
            </div>
            <span className='mx-1 h-4 w-px bg-[var(--cc-border)]' />
            <div className='flex items-center gap-1.5 text-xs font-black text-[color:var(--cc-surface-foreground)]'>
              <ChromeIcon className='size-4 text-[color:var(--cc-primary)]' />
              <span>میز کارگاه زنده // Live Artboard Canvas</span>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <span className='rounded-[var(--cc-radius-sm)] border-[length:var(--cc-border-width)] border-[color:var(--cc-border)] bg-[var(--cc-surface)] px-2 py-0.5 font-mono text-[10px] font-bold text-[color:var(--cc-surface-foreground)] [box-shadow:var(--cc-shadow)]'>
              VIEWPORT: 100%
            </span>
            <span className='flex items-center gap-1 rounded-[var(--cc-radius-sm)] border-[length:var(--cc-border-width)] border-[color:var(--cc-border)] bg-[var(--cc-surface-foreground)] px-2 py-0.5 font-mono text-[10px] font-bold text-[color:var(--cc-surface)]'>
              <span className='size-1.5 rounded-full bg-[var(--cc-success)]' />
              CANVAS OK
            </span>
          </div>
        </div>

        <div className='flex flex-col gap-6 p-5 sm:p-7'>
          {archetype === "components" ? (
            <ComponentsView iconLibrary={iconLibrary} />
          ) : null}
          {archetype === "landing" ? <LandingView {...viewProps} /> : null}
          {archetype === "ecommerce" ? <EcommerceView {...viewProps} /> : null}
          {archetype === "clinic" ? <ClinicView {...viewProps} /> : null}
          {archetype === "dashboard" ? <DashboardView {...viewProps} /> : null}
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

  const Icon = LIBRARY_ICONS[iconLibrary];
  const iconLibraryLabel =
    ICON_LIBRARIES.find((library) => library.id === iconLibrary)?.label ?? "";

  return (
    <div className='flex flex-col gap-6'>
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

function LandingView({
  primary,
  itemStyle,
  accentStyle,
  subtleStyle,
  headingClass,
}: ViewProps) {
  return (
    <div className='flex flex-col gap-6'>
      <div
        className='flex flex-col items-center justify-between gap-6 border border-[color:var(--cc-border)] bg-[var(--cc-surface)] p-6 [box-shadow:var(--cc-shadow)] sm:p-8 md:flex-row'
        style={itemStyle}
      >
        <div className='flex max-w-xl flex-col gap-3'>
          <div
            className='inline-flex items-center gap-2 self-start rounded-sm border border-[color:var(--cc-border)] bg-[var(--cc-muted)] px-2.5 py-1 font-mono text-xs font-bold text-[color:var(--cc-surface-foreground)]'
            style={itemStyle}
          >
            <span
              className='size-2 rounded-full'
              style={{ backgroundColor: primary }}
            />
            ARCHETYPE: SAAS &amp; STARTUP LANDING
          </div>
          <h2
            className={`text-xl leading-tight text-[color:var(--cc-surface-foreground)] sm:text-2xl ${headingClass}`}
          >
            زیرساخت مدرن برای تیم‌های توسعه محصول دیجیتال با رویکرد بدون کالبد
          </h2>
          <p className='text-xs leading-relaxed text-[color:var(--cc-muted-foreground)] sm:text-sm'>
            طراحی سفارشی فرانت‌اند با معماری بدون فریم‌ورک‌های سنگین، لایت‌هاوس
            ۱۰۰ و حس طبیعی چاپ ریسو بر صفحات نمایش.
          </p>
          <div className='flex items-center gap-3 pt-2'>
            <button
              type='button'
              className='border border-[color:var(--cc-border)] px-4 py-2 text-xs font-bold [box-shadow:var(--cc-shadow)] transition-all active:translate-x-0.5 active:translate-y-0.5'
              style={accentStyle}
            >
              شروع نسخه آزمایشی ۱۴ روزه
            </button>
            <button
              type='button'
              className='border border-[color:var(--cc-border)] bg-[var(--cc-muted)] px-4 py-2 text-xs font-bold text-[color:var(--cc-surface-foreground)] transition-all hover:bg-[var(--cc-surface)]'
              style={itemStyle}
            >
              مطالعه بنچمارک سرعت
            </button>
          </div>
        </div>

        <div
          className='flex w-full flex-col gap-3 rounded-sm border border-[color:var(--cc-border)] p-4 [box-shadow:var(--cc-shadow)] md:w-64'
          style={subtleStyle}
        >
          <div className='flex items-center justify-between text-xs font-bold text-[color:var(--cc-surface-foreground)]'>
            <span>امتیاز عملکرد لایت‌هاوس</span>
            <span className='font-mono text-emerald-700'>100/100</span>
          </div>
          <div className='h-3 w-full overflow-hidden rounded-full border border-[color:var(--cc-border)] bg-[var(--cc-surface)] p-0.5'>
            <div className='h-full w-full rounded-full bg-emerald-600' />
          </div>
          <div className='flex justify-between font-mono text-[11px] text-[color:var(--cc-muted-foreground)]'>
            <span>FCP: 0.4s</span>
            <span>TTI: 0.7s</span>
            <span>CO2: 0.12g</span>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
        {LANDING_FEATURES.map((feature) => (
          <div
            key={feature.title}
            className='flex flex-col gap-2 border border-[color:var(--cc-border)] bg-[var(--cc-surface)] p-4 [box-shadow:var(--cc-shadow)]'
            style={itemStyle}
          >
            <div
              className='flex size-8 items-center justify-center rounded-sm border border-[color:var(--cc-border)] bg-[var(--cc-muted)]'
              style={itemStyle}
            >
              <feature.icon className={`size-[18px] ${feature.tone}`} />
            </div>
            <h4 className={`text-sm text-[color:var(--cc-surface-foreground)] ${headingClass}`}>
              {feature.title}
            </h4>
            <p className='text-xs text-[color:var(--cc-muted-foreground)]'>{feature.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function EcommerceView({
  itemStyle,
  accentStyle,
  subtleStyle,
  headingClass,
}: ViewProps) {
  return (
    <div className='flex flex-col gap-6'>
      <div className='flex items-center justify-between border-b border-[color:color-mix(in_srgb,var(--cc-border)_30%,transparent)] pb-2'>
        <div>
          <span className='font-mono text-xs font-bold text-[color:var(--cc-primary)]'>
            ARCHETYPE: ARTISANAL BAKERY &amp; COFFEE
          </span>
          <h3 className={`text-base text-[color:var(--cc-surface-foreground)] ${headingClass}`}>
            فروشگاه آنلاین کارگاهی نان تخمیر طبیعی و قهوه تخصصی
          </h3>
        </div>
        <span className='rounded-sm border border-[color:var(--cc-border)] bg-[var(--cc-surface)] px-2.5 py-1 text-xs font-bold text-[color:var(--cc-surface-foreground)] [box-shadow:var(--cc-shadow)]'>
          سبد خرید (۳ قلم)
        </span>
      </div>

      <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3'>
        {PRODUCTS.map((product) => (
          <div
            key={product.title}
            className='flex flex-col justify-between gap-3 border border-[color:var(--cc-border)] bg-[var(--cc-surface)] p-4 [box-shadow:var(--cc-shadow)]'
            style={itemStyle}
          >
            <div
              className='relative flex h-36 w-full flex-col items-center justify-center overflow-hidden rounded-sm border border-[color:var(--cc-border)] text-[color:var(--cc-muted-foreground)]'
              style={subtleStyle}
            >
              <product.icon className={`size-[42px] ${product.tone}`} />
              <span className='mt-1 font-mono text-[11px] font-bold'>
                {product.note}
              </span>
              {product.badge ? (
                <span className='absolute top-2 right-2 rounded-sm border border-[color:var(--cc-border)] bg-[var(--cc-surface)] px-1.5 py-0.5 text-[10px] font-bold text-[color:var(--cc-primary)]'>
                  {product.badge}
                </span>
              ) : null}
            </div>
            <div>
              <h4 className={`text-sm text-[color:var(--cc-surface-foreground)] ${headingClass}`}>
                {product.title}
              </h4>
              <p className='mt-0.5 text-xs text-[color:var(--cc-muted-foreground)]'>{product.body}</p>
            </div>
            <div className='flex items-center justify-between border-t border-[color:var(--cc-border)]/15 pt-2'>
              <span className='font-mono text-sm font-black text-[color:var(--cc-surface-foreground)]'>
                {product.price}
              </span>
              <button
                type='button'
                className='border border-[color:var(--cc-border)] px-3 py-1.5 text-xs font-bold [box-shadow:var(--cc-shadow)] transition-all active:translate-x-0.5 active:translate-y-0.5'
                style={accentStyle}
              >
                + افزودن به سبد
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ClinicView({
  itemStyle,
  accentStyle,
  subtleStyle,
  headingClass,
}: ViewProps) {
  return (
    <div className='flex flex-col gap-6'>
      <div className='flex items-center justify-between border-b border-[color:color-mix(in_srgb,var(--cc-border)_30%,transparent)] pb-2'>
        <div>
          <span className='font-mono text-xs font-bold text-[color:var(--cc-primary)]'>
            ARCHETYPE: MEDICAL CLINIC &amp; BOOKING
          </span>
          <h3 className={`text-base text-[color:var(--cc-surface-foreground)] ${headingClass}`}>
            سامانه نوبت‌دهی آنلاین درمانگاه تخصصی حکیم
          </h3>
        </div>
        <span className='rounded-sm border border-[color:var(--cc-border)] bg-[var(--cc-success)] px-2.5 py-1 font-mono text-xs font-bold text-white'>
          درمانگاه شبانه‌روزی
        </span>
      </div>

      <div className='grid grid-cols-1 gap-5 md:grid-cols-12'>
        <div
          className='flex flex-col gap-4 border border-[color:var(--cc-border)] bg-[var(--cc-surface)] p-5 [box-shadow:var(--cc-shadow)] md:col-span-7'
          style={itemStyle}
        >
          <div className='flex items-center gap-3'>
            <div
              className='flex size-12 items-center justify-center rounded-sm border border-[color:var(--cc-border)] bg-[var(--cc-muted)] text-[color:var(--cc-primary)]'
              style={itemStyle}
            >
              <Stethoscope className='size-[26px]' />
            </div>
            <div>
              <h4 className={`text-sm text-[color:var(--cc-surface-foreground)] ${headingClass}`}>
                دکتر سهراب دیبا
              </h4>
              <span className='text-xs text-[color:var(--cc-muted-foreground)]'>
                متخصص قلب و عروق • نظام پزشکی: ۱۰۴۹۲۸
              </span>
            </div>
          </div>

          <div className='flex flex-col gap-1.5'>
            <label className='text-xs font-bold text-[color:var(--cc-surface-foreground)]'>
              انتخاب روز نوبت ویزیت
            </label>
            <div className='grid grid-cols-4 gap-2 text-center text-xs'>
              <button
                type='button'
                className='rounded-sm border border-[color:var(--cc-border)] bg-[var(--cc-muted)] p-2 font-mono text-[color:var(--cc-surface-foreground)] transition-all hover:bg-[var(--cc-surface)]'
                style={itemStyle}
              >
                شنبه ۲۴
              </button>
              <button
                type='button'
                className='rounded-sm border border-[color:var(--cc-border)] p-2 font-mono font-bold [box-shadow:var(--cc-shadow)]'
                style={accentStyle}
              >
                یکشنبه ۲۵
              </button>
              <button
                type='button'
                className='rounded-sm border border-[color:var(--cc-border)] bg-[var(--cc-muted)] p-2 font-mono text-[color:var(--cc-surface-foreground)] transition-all hover:bg-[var(--cc-surface)]'
                style={itemStyle}
              >
                دوشنبه ۲۶
              </button>
              <button
                type='button'
                disabled
                className='cursor-not-allowed rounded-sm border border-[color:var(--cc-border)] bg-[var(--cc-muted)] p-2 font-mono text-[color:var(--cc-surface-foreground)] opacity-40'
                style={itemStyle}
              >
                سه‌شنبه (تکمیل)
              </button>
            </div>
          </div>

          <div className='flex flex-col gap-1.5'>
            <label className='text-xs font-bold text-[color:var(--cc-surface-foreground)]'>
              انتخاب ساعت مراجعه
            </label>
            <div className='grid grid-cols-3 gap-2 text-center font-mono text-xs font-bold'>
              <button
                type='button'
                className='rounded-sm border border-[color:var(--cc-border)] bg-[var(--cc-surface)] p-2 text-[color:var(--cc-surface-foreground)] transition-all hover:bg-[var(--cc-muted)]'
                style={itemStyle}
              >
                ۱۶:۳۰ عصر
              </button>
              <button
                type='button'
                className='rounded-sm border border-[color:var(--cc-border)] p-2 [box-shadow:var(--cc-shadow)]'
                style={accentStyle}
              >
                ۱۷:۱۵ عصر
              </button>
              <button
                type='button'
                className='rounded-sm border border-[color:var(--cc-border)] bg-[var(--cc-surface)] p-2 text-[color:var(--cc-surface-foreground)] transition-all hover:bg-[var(--cc-muted)]'
                style={itemStyle}
              >
                ۱۸:۰۰ عصر
              </button>
            </div>
          </div>

          <div className='flex items-center justify-between border-t border-[color:var(--cc-border)]/15 pt-2'>
            <span className='text-xs text-[color:var(--cc-muted-foreground)]'>
              هزینه ویزیت طبق تعرفه مصوب:{" "}
              <b className='font-mono text-[color:var(--cc-surface-foreground)]'>۲۲۰,۰۰۰ تومان</b>
            </span>
            <button
              type='button'
              className='border border-[color:var(--cc-border)] px-4 py-2 text-xs font-bold [box-shadow:var(--cc-shadow)] transition-all active:translate-x-0.5 active:translate-y-0.5'
              style={accentStyle}
            >
              ثبت نهایی و پرداخت
            </button>
          </div>
        </div>

        <div
          className='flex flex-col justify-between gap-4 border border-[color:var(--cc-border)] bg-[var(--cc-surface)] p-5 [box-shadow:var(--cc-shadow)] md:col-span-5'
          style={itemStyle}
        >
          <div>
            <h4 className={`text-sm text-[color:var(--cc-surface-foreground)] ${headingClass}`}>
              مدارک و الزامات مراجعه
            </h4>
            <p className='mt-0.5 text-xs text-[color:var(--cc-muted-foreground)]'>
              لطفاً پیش از مراجعه حضوری نکات زیر را رعایت فرمایید:
            </p>
          </div>
          <div className='flex flex-col gap-2.5 text-xs text-[color:var(--cc-surface-foreground)]'>
            <div className='flex items-start gap-2'>
              <CheckCircle2 className='size-4 shrink-0 text-[color:var(--cc-primary)]' />
              <span>همراه داشتن کارت شناسایی ملی و دفترچه بیمه</span>
            </div>
            <div className='flex items-start gap-2'>
              <CheckCircle2 className='size-4 shrink-0 text-[color:var(--cc-primary)]' />
              <span>
                همراه داشتن کلیه نتایج آزمایشات و نوار قلب ۶ ماه گذشته
              </span>
            </div>
            <div className='flex items-start gap-2'>
              <Clock className='size-4 shrink-0 text-[color:var(--cc-primary)]' />
              <span>حضور در کلینیک دست‌کم ۱۵ دقیقه قبل از زمان رزرو</span>
            </div>
          </div>
          <div
            className='rounded-sm border border-[color:var(--cc-border)] p-3 text-xs'
            style={subtleStyle}
          >
            <span className='mb-0.5 block font-bold text-[color:var(--cc-surface-foreground)]'>
              نشانی درمانگاه:
            </span>
            <span className='text-[color:var(--cc-muted-foreground)]'>
              تهران، خیابان ولیعصر، نرسیده به میدان ونک، مجتمع پزشکی حکیم
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardView({
  primary,
  itemStyle,
  accentStyle,
  accentText,
  subtleStyle,
  headingClass,
}: ViewProps) {
  return (
    <div className='flex flex-col gap-6'>
      <div className='flex items-center justify-between border-b border-[color:color-mix(in_srgb,var(--cc-border)_30%,transparent)] pb-2'>
        <div>
          <span className='font-mono text-xs font-bold text-[color:var(--cc-primary)]'>
            ARCHETYPE: DATA MONITORING &amp; TELEMETRY
          </span>
          <h3 className={`text-base text-[color:var(--cc-surface-foreground)] ${headingClass}`}>
            میز کار پایش داده‌های سرور و ترافیک لحظه‌ای
          </h3>
        </div>
        <span className='rounded-sm border border-[color:var(--cc-border)] bg-[var(--cc-muted)] px-2 py-0.5 font-mono text-xs font-bold text-[color:var(--cc-surface-foreground)]'>
          LIVE TELEMETRY
        </span>
      </div>

      <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className='border border-[color:var(--cc-border)] bg-[var(--cc-surface)] p-4 [box-shadow:var(--cc-shadow)]'
            style={itemStyle}
          >
            <span className='block text-xs text-[color:var(--cc-muted-foreground)]'>
              {stat.label}
            </span>
            <span
              className='mt-1 block font-mono text-xl font-black'
              style={accentText}
            >
              {stat.value}
            </span>
            <span className='text-[10px] font-bold text-emerald-700'>
              {stat.note}
            </span>
          </div>
        ))}
      </div>

      <div
        className='flex flex-col gap-3 border border-[color:var(--cc-border)] bg-[var(--cc-surface)] p-5 [box-shadow:var(--cc-shadow)]'
        style={itemStyle}
      >
        <h4 className={`text-sm text-[color:var(--cc-surface-foreground)] ${headingClass}`}>
          وضعیت نودهای توزیع‌شده استودیو
        </h4>
        <div className='flex flex-col gap-2 text-xs'>
          {NODES.map((node) => (
            <div
              key={node.name}
              className='flex items-center justify-between rounded-sm border border-[color:var(--cc-border)] p-2.5'
              style={subtleStyle}
            >
              <div className='flex items-center gap-2'>
                <span
                  className='size-2 rounded-full'
                  style={{ backgroundColor: primary }}
                />
                <span className='font-bold text-[color:var(--cc-surface-foreground)]'>{node.name}</span>
              </div>
              <span className='font-mono text-[color:var(--cc-muted-foreground)]'>{node.load}</span>
            </div>
          ))}
        </div>
        <button
          type='button'
          className='self-start border border-[color:var(--cc-border)] px-3 py-1.5 text-xs font-bold [box-shadow:var(--cc-shadow)] transition-all active:translate-x-0.5 active:translate-y-0.5'
          style={accentStyle}
        >
          بروزرسانی داده‌های زنده
        </button>
      </div>
    </div>
  );
}
