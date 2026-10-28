"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
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
  Checkbox,
  CheckboxField,
  Field,
  Icon,
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
  bodyType,
  headingType,
  labelType,
  monoType,
  useIconLibrary,
  type IconLibraryId,
} from "@/components/create-components";
import { Reveal } from "./motion-primitives";
import { formatNumber } from "./format";

/* --------------------------------------------------------------- the catalog */

/**
 * Every primitive the studio ships, in the order the page renders them. The
 * header/footer counters read this list instead of a hand-typed number, so
 * adding a stop to the sheet cannot leave the "۲۵ المان" chip lying.
 */
const PRIMITIVES = [
  "Button",
  "Badge",
  "Avatar",
  "Separator",
  "Input",
  "Textarea",
  "Select",
  "Slider",
  "Switch",
  "Checkbox",
  "RadioGroup",
  "Alert",
  "Progress",
  "Skeleton",
  "Tabs",
  "Table",
  "Accordion",
  "Card",
  "ChartFrame",
  "AreaTrend",
  "Sparkline",
  "Stat",
  "Calendar",
  "Stepper",
  "Timeline",
];

/** Section index: the jump bar and the numbered headings share this order. */
const SECTIONS = [
  { id: "el-type", label: "تایپوگرافی", index: "۰۱" },
  { id: "el-actions", label: "اکشن‌ها", index: "۰۲" },
  { id: "el-forms", label: "فرم", index: "۰۳" },
  { id: "el-selection", label: "انتخاب", index: "۰۴" },
  { id: "el-feedback", label: "بازخورد", index: "۰۵" },
  { id: "el-data", label: "داده", index: "۰۶" },
  { id: "el-time", label: "زمان‌بندی", index: "۰۷" },
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

const DEMO_STEPS = [
  { id: "pick", label: "خدمت", hint: "انتخاب" },
  { id: "time", label: "زمان", hint: "روز و ساعت" },
  { id: "info", label: "مشخصات", hint: "اطلاعات" },
  { id: "pay", label: "تأیید", hint: "پرداخت" },
];

const DEMO_STATS = [
  { label: "کاربران فعال", value: 1842, unit: "", delta: "۶٫۲" },
  { label: "میانگین لتنسی", value: 18, unit: "ms", delta: "۲٫۴" },
  { label: "نرخ موفقیت", value: 99.4, unit: "٪", delta: "۰٫۳" },
];

const DEMO_INVOICES = [
  {
    id: "INV-1042",
    client: "استودیو نورث‌ویند",
    amount: 3850000,
    status: "پرداخت‌شده",
    tone: "success" as const,
  },
  {
    id: "INV-1043",
    client: "کارگاه کسترل",
    amount: 1200000,
    status: "در انتظار",
    tone: "warning" as const,
  },
  {
    id: "INV-1044",
    client: "غذای مداری",
    amount: 7410000,
    status: "معوق",
    tone: "danger" as const,
  },
];

const DEMO_FAQ = [
  {
    value: "theme",
    question: "یک تم تا کجا در همهٔ المان‌ها نفوذ می‌کند؟",
    answer:
      "شعاع گوشه، سایه، فونت نمایشی و متن، پالت نقش‌ها و رنگ نمودارها همه از توکن می‌آیند؛ با عوض کردن سبک، همین صفحه بدون یک خط کد دوباره رنگ می‌گیرد.",
  },
  {
    value: "icons",
    question: "کتابخانهٔ آیکون چطور عوض می‌شود؟",
    answer:
      "هر المان از یک نام معنایی آیکون استفاده می‌کند؛ پنل کنار همان نام را به گلیف‌های Lucide، Tabler یا Material نگاشت می‌کند و اندازه و ضخامت هم توکن جدا دارند.",
  },
  {
    value: "handoff",
    question: "خروجی این کاتالوگ چیست؟",
    answer:
      "توکن‌های CSS و اسنیپت Tailwind از پنل کنار گرفته می‌شود؛ همان متغیرهایی که این المان‌ها مصرف می‌کنند در پروژهٔ شما هم قابل استفاده‌اند.",
  },
];

const DEMO_TREND = [
  { label: "شنبه", value: 24 },
  { label: "یکشنبه", value: 31 },
  { label: "دوشنبه", value: 28 },
  { label: "سه‌شنبه", value: 38 },
  { label: "چهارشنبه", value: 35 },
  { label: "پنجشنبه", value: 44 },
  { label: "جمعه", value: 41 },
];

const DEMO_AVAILABILITY = {
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

/* ------------------------------------------------------------------ helpers */

const eyebrowType = cn(
  "text-[length:calc(var(--cc-font-size)*0.72)] font-bold text-[color:var(--cc-primary)]",
  labelType,
);

/** Small `--cc-*` chip so a visitor can see which token drives the block. */
function TokenChip({ token }: { token: string }) {
  return (
    <span
      dir='ltr'
      className={cn(
        "inline-flex items-center rounded-[var(--cc-badge-radius)] border-[length:var(--cc-border-width)] border-[color:var(--cc-border)] px-1.5 py-0.5 text-[0.625rem] text-[color:var(--cc-muted-foreground)]",
        monoType,
      )}
    >
      {token}
    </span>
  );
}

/**
 * One numbered stop on the specimen sheet: an index, an eyebrow, the display
 * line, an optional description and the tokens the block consumes. Every stop
 * shares this heading scale, so the catalog reads as one document.
 */
function Specimen({
  id,
  index,
  eyebrow,
  title,
  description,
  tokens,
  trailing,
  children,
}: {
  id: string;
  index: string;
  eyebrow: string;
  title: string;
  description?: string;
  tokens?: string[];
  trailing?: ReactNode;
  children: ReactNode;
}) {
  return (
    <Reveal>
      <section
        id={id}
        aria-labelledby={`${id}-title`}
        className='flex scroll-mt-2 flex-col gap-3'
      >
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div className='flex items-start gap-2.5'>
            <span
              aria-hidden='true'
              className={cn(
                "mt-0.5 text-[length:calc(var(--cc-font-size)*0.8)] font-black text-[color:var(--cc-primary)]",
                monoType,
              )}
            >
              {index}
            </span>
            <div className='flex flex-col gap-0.5'>
              <span className={eyebrowType}>{eyebrow}</span>
              <h3
                id={`${id}-title`}
                className={cn(
                  "text-lg leading-tight text-[color:var(--cc-surface-foreground)] @2xl:text-xl",
                  headingType,
                )}
              >
                {title}
              </h3>
            </div>
          </div>
          {trailing}
        </div>

        {description ? (
          <p className='max-w-xl text-[length:calc(var(--cc-font-size)*0.86)] text-[color:var(--cc-muted-foreground)]'>
            {description}
          </p>
        ) : null}

        {tokens && tokens.length > 0 ? (
          <div className='flex flex-wrap items-center gap-1'>
            <span className='text-[0.625rem] text-[color:var(--cc-muted-foreground)]'>
              توکن‌ها:
            </span>
            {tokens.map((token) => (
              <TokenChip key={token} token={token} />
            ))}
          </div>
        ) : null}

        {children}
      </section>
    </Reveal>
  );
}

/* ------------------------------------------------------------------- the view */

const ICON_LIBRARY_LABELS: Record<IconLibraryId, string> = {
  lucide: "Lucide",
  tabler: "Tabler",
  google: "Material",
};

export function ElementsGalleryView() {
  const iconLibrary = useIconLibrary();
  const [projectType, setProjectType] = useState("landing");
  const [budget, setBudget] = useState(40);
  const [priority, setPriority] = useState("normal");
  const [newsletter, setNewsletter] = useState(true);
  const [support, setSupport] = useState(false);
  const [progress, setProgress] = useState(65);
  const [alerts, setAlerts] = useState(true);
  const [tab, setTab] = useState("overview");
  const [demoDate, setDemoDate] = useState("2026-10-07");
  const [demoStep, setDemoStep] = useState(1);

  /** Jump inside the preview viewport; never touches the studio's URL hash. */
  const jumpTo = (id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      block: "start",
    });
  };

  return (
    <div className='@container flex flex-col gap-6'>
      {/* ------------------------------------------------------------- header */}
      <header className='flex flex-wrap items-start justify-between gap-4'>
        <div className='flex flex-col gap-1.5'>
          <span className={eyebrowType}>کاتالوگ المان‌ها · وب دیزاین فیل</span>
          <h2
            className={cn(
              "text-2xl leading-tight text-[color:var(--cc-surface-foreground)] @2xl:text-3xl",
              headingType,
            )}
          >
            المان‌های خام
          </h2>
          <p className='max-w-xl text-[length:calc(var(--cc-font-size)*0.9)] text-[color:var(--cc-muted-foreground)]'>
            هر المان پایهٔ یک سایت واقعی است؛ از صداهای نوشتاری و دکمه‌ها تا
            جدول، نمودار و تقویم. رنگ، شعاع، سایه، فونت و کتابخانهٔ آیکون از پنل
            کنار می‌آید و همین صفحه را دوباره می‌سازد.
          </p>
          <div className='flex flex-wrap items-center gap-1.5 pt-0.5'>
            <Badge variant='soft' className='gap-1'>
              <Icon name='boxes' className='size-3' />
              {formatNumber(PRIMITIVES.length)} المان
            </Badge>
            <Badge variant='outline' className='gap-1'>
              <Icon name='sparkles' className='size-3' />
              کتابخانهٔ {ICON_LIBRARY_LABELS[iconLibrary]}
            </Badge>
            <Badge variant='outline'>
              {formatNumber(SECTIONS.length)} ایستگاه
            </Badge>
          </div>
        </div>

        <div className='flex items-center gap-2'>
          <Avatar alt='تیم طراحی' size='sm' />
          <Avatar alt='تیم فرانت‌اند' size='sm' />
          <Avatar fallback='+۳' size='sm' />
        </div>
      </header>

      {/* -------------------------------------------------------- jump index */}
      <nav
        aria-label='فهرست المان‌ها'
        className='flex flex-wrap items-center gap-1 rounded-[var(--cc-radius)] border-[length:var(--cc-border-width)] border-[color:var(--cc-border)] bg-[var(--cc-muted)] p-1.5'
      >
        {SECTIONS.map((section) => (
          <button
            key={section.id}
            type='button'
            onClick={() => jumpTo(section.id)}
            className={cn(
              "flex items-center gap-1.5 rounded-[var(--cc-radius-sm)] px-2 py-1 text-[0.6875rem] text-[color:var(--cc-muted-foreground)] transition-colors duration-[var(--cc-duration)]",
              "hover:bg-[var(--cc-surface)] hover:text-[color:var(--cc-surface-foreground)]",
              "focus-visible:ring-[length:var(--cc-focus-ring-width)] focus-visible:ring-[color:var(--cc-ring)] focus-visible:outline-none",
            )}
          >
            <span className={cn("text-[0.625rem] font-bold", monoType)}>
              {section.index}
            </span>
            {section.label}
          </button>
        ))}
      </nav>

      {/* ------------------------------------------------------- ۰۱ typography */}
      <Specimen
        id='el-type'
        index='۰۱'
        eyebrow='صداهای نوشتاری'
        title='تایپوگرافی و نشانه‌ها'
        description='سه صدای تم — نمایشی، متن و عدد — روی یک کارت، همراه با نشان‌ها و آواتارهایی که همان توکن‌ها را مصرف می‌کنند.'
        tokens={[
          "--cc-heading-font-family",
          "--cc-font-family",
          "--cc-mono-font-family",
          "--cc-badge-radius",
        ]}
        trailing={<Badge variant='accent'>نمایشی + متن + عدد</Badge>}
      >
        <Card>
          <CardContent className='grid gap-5 @2xl:grid-cols-[1.25fr_1fr]'>
            <div className='flex flex-col gap-3'>
              <div className='flex flex-col gap-1'>
                <span className='text-[0.625rem] text-[color:var(--cc-muted-foreground)]'>
                  نمایشی
                </span>
                <p
                  className={cn(
                    "text-2xl leading-tight text-[color:var(--cc-surface-foreground)] @2xl:text-3xl",
                    headingType,
                  )}
                >
                  سفری از ایده تا انتشار
                </p>
                <p
                  className={cn(
                    "text-lg leading-snug text-[color:var(--cc-surface-foreground)]",
                    headingType,
                  )}
                >
                  تیتر سطح دوم داخل یک کارت
                </p>
              </div>

              <Separator />

              <div className='flex flex-col gap-1'>
                <span className='text-[0.625rem] text-[color:var(--cc-muted-foreground)]'>
                  متن
                </span>
                <p
                  className={cn(
                    "text-[length:calc(var(--cc-font-size)*0.95)] text-[color:var(--cc-muted-foreground)]",
                    bodyType,
                  )}
                >
                  یک تم خوب پیش از آنکه دیده شود، خوانده می‌شود: فاصلهٔ سطرها،
                  وزن متن و ریتم پاراگراف باید در هر سه دستگاه یکسان بمانند.
                </p>
                <span
                  className={cn(
                    "text-[length:calc(var(--cc-font-size)*0.7)] text-[color:var(--cc-muted-foreground)]",
                    labelType,
                  )}
                >
                  برچسب فیلد و ریزنویس
                </span>
              </div>

              <Separator />

              <div className='flex flex-wrap items-baseline gap-3'>
                <span
                  className={cn(
                    "text-xl font-black text-[color:var(--cc-surface-foreground)]",
                    monoType,
                  )}
                >
                  {formatNumber(12480)}
                </span>
                <span
                  dir='ltr'
                  className={cn(
                    "text-[length:calc(var(--cc-font-size)*0.8)] text-[color:var(--cc-muted-foreground)]",
                    monoType,
                  )}
                >
                  ۱۴۰۵/۰۷/۱۲
                </span>
                <span
                  dir='ltr'
                  className={cn(
                    "text-[length:calc(var(--cc-font-size)*0.8)] text-[color:var(--cc-muted-foreground)]",
                    monoType,
                  )}
                >
                  ۱۸۲ms
                </span>
                <span
                  className={cn(
                    "text-[length:calc(var(--cc-font-size)*0.8)] text-[color:var(--cc-muted-foreground)]",
                    monoType,
                  )}
                >
                  ۹۹٫۴٪
                </span>
              </div>
            </div>

            <div className='flex flex-col gap-3'>
              <div className='flex flex-wrap items-center gap-1.5'>
                <Badge variant='solid'>اصلی</Badge>
                <Badge variant='soft'>نرم</Badge>
                <Badge variant='outline'>دورخط</Badge>
                <Badge variant='accent'>تأکیدی</Badge>
                <Badge variant='success'>موفق</Badge>
                <Badge variant='warning'>هشدار</Badge>
                <Badge variant='danger'>خطر</Badge>
              </div>

              <Separator label='آواتارها' />

              <div className='flex flex-wrap items-center gap-2'>
                <Avatar alt='سارا مهر' size='md' />
                <Avatar alt='کاوه راد' size='md' />
                <Avatar alt='نگار توس' size='md' />
                <Avatar fallback='+۵' size='md' />
                <span className='text-[length:calc(var(--cc-font-size)*0.76)] text-[color:var(--cc-muted-foreground)]'>
                  {formatNumber(8)} نفر آنلاین
                </span>
              </div>

              <Separator label='وضعیت‌ها' />

              <div className='flex flex-col gap-1.5'>
                <span className='flex items-center gap-1.5 text-[length:calc(var(--cc-font-size)*0.8)] text-[color:var(--cc-success)]'>
                  <Icon name='check-circle' className='size-3.5' />
                  آمادهٔ انتشار
                </span>
                <span className='flex items-center gap-1.5 text-[length:calc(var(--cc-font-size)*0.8)] text-[color:var(--cc-warning)]'>
                  <Icon name='clock' className='size-3.5' />
                  در انتظار بازبینی
                </span>
                <span className='flex items-center gap-1.5 text-[length:calc(var(--cc-font-size)*0.8)] text-[color:var(--cc-danger)]'>
                  <Icon name='alert-triangle' className='size-3.5' />
                  نیازمند اصلاح
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </Specimen>

      {/* ---------------------------------------------------------- ۰۲ actions */}
      <Specimen
        id='el-actions'
        index='۰۲'
        eyebrow='اکشن‌ها'
        title='دکمه‌ها'
        description='هفت واریانت، چهار اندازه و حالت غیرفعال؛ همه از یک توکن شعاع و یک توکن سایه.'
        tokens={["--cc-radius", "--cc-shadow", "--cc-hover-rotate"]}
        trailing={<Badge variant='outline'>{formatNumber(7)} واریانت</Badge>}
      >
        <Card>
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
                <Icon name='plus' className='size-4' />
              </Button>
              <Button size='icon' variant='outline' aria-label='جلوهٔ ویژه'>
                <Icon name='sparkles' className='size-4' />
              </Button>
              <Button size='icon' variant='ghost' aria-label='حذف'>
                <Icon name='trash' className='size-4' />
              </Button>
              <Button disabled>غیرفعال</Button>
            </div>

            <Separator label='با آیکون' />

            <div className='flex flex-wrap items-center gap-2'>
              <Button variant='outline'>
                <Icon name='download' className='size-4' />
                دریافت فایل
              </Button>
              <Button variant='outline'>
                <Icon name='filter' className='size-4' />
                فیلترها
              </Button>
              <Button>
                ادامه
                <Icon name='arrow-left' className='size-4' />
              </Button>
            </div>
          </CardContent>
        </Card>
      </Specimen>


      {/* ----------------------------------------------------- ۰۳/۰۴ form block */}
      <div className='grid gap-5 @2xl:grid-cols-2'>
        <Specimen
          id='el-forms'
          index='۰۳'
          eyebrow='ورودی'
          title='فرم و فیلدها'
          description='هر فیلد از یک برچسب، یک کنترل و یک راهنمای کوتاه ساخته می‌شود؛ حالت فوکوس هم توکن خودش را دارد.'
          tokens={["--cc-radius", "--cc-border-width", "--cc-ring"]}
          trailing={<Badge variant='outline'>{formatNumber(5)} کنترل</Badge>}
        >
          <Card>
            <CardContent>
              <div className='grid gap-3 @xl:grid-cols-2'>
                <Field label='نام و نام خانوادگی' htmlFor='el-name'>
                  <Input id='el-name' placeholder='مثلاً سهراب دیبا' />
                </Field>
                <Field
                  label='ایمیل کاری'
                  htmlFor='el-email'
                  hint='هیچ‌وقت منتشر نمی‌شود.'
                >
                  <Input
                    id='el-email'
                    type='email'
                    dir='ltr'
                    placeholder='you@studio.dev'
                  />
                </Field>
                <Field label='نوع پروژه' htmlFor='el-project'>
                  <Select
                    id='el-project'
                    options={PROJECT_TYPES}
                    value={projectType}
                    onValueChange={setProjectType}
                  />
                </Field>
                <div className='flex flex-col gap-1.5'>
                  <div className='flex items-center justify-between text-[length:calc(var(--cc-font-size)*0.9)] font-medium text-[color:var(--cc-surface-foreground)]'>
                    <label htmlFor='el-budget'>بودجه (میلیون تومان)</label>
                    <span
                      className={cn(
                        "text-[color:var(--cc-muted-foreground)]",
                        monoType,
                      )}
                    >
                      {formatNumber(budget)}
                    </span>
                  </div>
                  <Slider
                    id='el-budget'
                    min={0}
                    max={100}
                    step={5}
                    value={budget}
                    onChange={(event) => setBudget(Number(event.target.value))}
                  />
                </div>
                <Field
                  label='توضیحات پروژه'
                  htmlFor='el-notes'
                  className='@xl:col-span-2'
                  hint='حداکثر ۵۰۰ کاراکتر.'
                >
                  <Textarea
                    id='el-notes'
                    placeholder='دربارهٔ اهداف، مخاطب و زمان‌بندی بنویسید…'
                  />
                </Field>
              </div>
            </CardContent>
          </Card>
        </Specimen>


        <Specimen
          id='el-selection'
          index='۰۴'
          eyebrow='انتخاب'
          title='کلیدها و انتخابگرها'
          description='سوییچ برای روشن/خاموش فوری، چک‌باکس برای فهرست چندگانه و رادیو برای انتخاب یکتا.'
          tokens={["--cc-primary", "--cc-radius-sm", "--cc-duration"]}
          trailing={<Badge variant='outline'>{formatNumber(3)} الگو</Badge>}
        >
          <Card>
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

              <div className='flex items-center justify-between gap-4'>
                <div className='flex flex-col gap-0.5'>
                  <span className='text-[length:var(--cc-font-size)] font-medium text-[color:var(--cc-surface-foreground)]'>
                    هشدارهای فوری
                  </span>
                  <span className='text-[length:calc(var(--cc-font-size)*0.8)] text-[color:var(--cc-muted-foreground)]'>
                    فقط رویدادهای نیازمند اقدام
                  </span>
                </div>
                <Switch
                  checked={alerts}
                  onCheckedChange={setAlerts}
                  aria-label='هشدارهای فوری'
                />
              </div>

              <Separator />

              <CheckboxField
                label='ارسال خبرنامه'
                description='جدیدترین مقاله‌ها و پشت‌صحنهٔ کارگاه'
                checked={newsletter}
                onCheckedChange={setNewsletter}
              />

              <label className='flex items-center gap-2 text-[length:calc(var(--cc-font-size)*0.82)] text-[color:var(--cc-muted-foreground)]'>
                <Checkbox aria-label='پذیرش قوانین' defaultChecked />
                قوانین کارگاه را می‌پذیرم
              </label>

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
        </Specimen>
      </div>


      {/* -------------------------------------------------------- ۰۵ feedback */}
      <Specimen
        id='el-feedback'
        index='۰۵'
        eyebrow='وضعیت'
        title='بازخورد و بارگذاری'
        description='چهار لحن هشدار، نوار پیشرفت و اسکلت بارگذاری؛ رنگ‌ها از نقش‌های پالت می‌آیند نه از کلاس‌های ثابت.'
        tokens={[
          "--cc-success",
          "--cc-warning",
          "--cc-danger",
          "--cc-progress-height",
        ]}
        trailing={
          <Badge variant='success' className='gap-1'>
            <Icon name='shield-check' className='size-3' />
            نقش‌های پالت
          </Badge>
        }
      >
        <div className='grid gap-3 @2xl:grid-cols-2'>
          <Card>
            <CardContent>
              <Alert
                variant='success'
                title='تغییرات ذخیره شد'
                icon={<Icon name='check-circle' className='size-4' />}
              >
                ترکیب تم فعلی در حافظهٔ مرورگر نگه داشته شد.
              </Alert>
              <Alert
                variant='info'
                title='این صفحه از توکن‌ها می‌خواند'
                icon={<Icon name='info' className='size-4' />}
              >
                هر تغییر در پنل کنار، همین کارت را بدون بارگذاری دوباره
                بازرنگ می‌کند.
              </Alert>
              <Alert
                variant='warning'
                title='نزدیک به سقف مصرف'
                icon={<Icon name='alert-triangle' className='size-4' />}
              >
                پیش از رسیدن به محدودیت، پلن را ارتقا دهید.
              </Alert>
              <Alert
                variant='danger'
                title='اتصال درگاه قطع شد'
                icon={<Icon name='alert-circle' className='size-4' />}
              >
                تلاش دوباره در ۳۰ ثانیهٔ آینده انجام می‌شود.
              </Alert>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <div className='flex flex-col gap-1.5'>
                <div className='flex items-center justify-between text-[length:calc(var(--cc-font-size)*0.9)] font-medium text-[color:var(--cc-surface-foreground)]'>
                  <label htmlFor='el-progress'>تکمیل‌شده</label>
                  <span
                    className={cn(
                      "text-[color:var(--cc-muted-foreground)]",
                      monoType,
                    )}
                  >
                    {formatNumber(progress)}٪
                  </span>
                </div>
                <Progress value={progress} />
                <Slider
                  id='el-progress'
                  min={0}
                  max={100}
                  step={5}
                  value={progress}
                  onChange={(event) =>
                    setProgress(Number(event.target.value))
                  }
                />
              </div>

              <Separator label='در حال بارگذاری' />

              <div className='flex items-center gap-2'>
                <Skeleton className='size-9 rounded-full' />
                <div className='flex flex-1 flex-col gap-1.5'>
                  <Skeleton className='h-3 w-2/3' />
                  <Skeleton className='h-3 w-1/3' />
                </div>
              </div>
              <div className='flex flex-col gap-1.5'>
                <Skeleton className='h-3 w-full' />
                <Skeleton className='h-3 w-4/5' />
                <Skeleton className='h-3 w-3/5' />
              </div>
            </CardContent>
          </Card>
        </div>
      </Specimen>


      {/* ------------------------------------------------------------ ۰۶ data */}
      <Specimen
        id='el-data'
        index='۰۶'
        eyebrow='ساختار'
        title='داده و ناوبری'
        description='تب برای جابه‌جایی بین نماهای یک کارت، جدول برای دادهٔ واقعی و آکاردئون برای پرسش‌های باز؛ هر سه با یک صدا.'
        tokens={["--cc-card-radius", "--cc-muted", "--cc-border-width"]}
        trailing={<Badge variant='soft'>{formatNumber(3)} الگو</Badge>}
      >
        <div className='grid gap-3 @2xl:grid-cols-[1.4fr_1fr]'>
          <Card>
            <CardHeader>
              <div className='flex flex-wrap items-center justify-between gap-2'>
                <div className='flex flex-col gap-1'>
                  <CardTitle>کارت با تب</CardTitle>
                  <CardDescription>
                    هر تب یک نمای مستقل داخل همان کارت است.
                  </CardDescription>
                </div>
                <Badge variant='soft' className='gap-1'>
                  <Icon name='activity' className='size-3' />
                  دادهٔ نمونه
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={tab} onValueChange={setTab}>
                <TabsList>
                  <TabsTrigger value='overview'>نمای کلی</TabsTrigger>
                  <TabsTrigger value='invoices'>فاکتورها</TabsTrigger>
                </TabsList>

                <TabsContent value='overview'>
                  <div className='grid gap-2 @xl:grid-cols-3'>
                    {DEMO_STATS.map((stat, index) => (
                      <Stat
                        key={stat.label}
                        label={stat.label}
                        value={`${formatNumber(stat.value)}${stat.unit}`}
                        delta={{ value: `${stat.delta}٪`, direction: "up" }}
                      >
                        <Sparkline
                          points={[24, 28, 26, 34, 31, 39, 44].map(
                            (point) => point + index * 2,
                          )}
                        />
                      </Stat>
                    ))}
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
                      {DEMO_INVOICES.map((invoice) => (
                        <TableRow key={invoice.id}>
                          <TableCell className={monoType}>
                            {invoice.id}
                          </TableCell>
                          <TableCell>{invoice.client}</TableCell>
                          <TableCell className={monoType}>
                            {formatNumber(invoice.amount)}
                          </TableCell>
                          <TableCell>
                            <Badge variant={invoice.tone}>
                              {invoice.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>آکاردئون پرسش‌ها</CardTitle>
              <CardDescription>
                باز و بسته شدن با صفحه‌کلید؛ ارتفاع نرم و بدون جهش چیدمان.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type='single' defaultValue={["theme"]}>
                {DEMO_FAQ.map((item) => (
                  <AccordionItem key={item.value} value={item.value}>
                    <AccordionTrigger>{item.question}</AccordionTrigger>
                    <AccordionContent>{item.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </Specimen>


      {/* ------------------------------------------------------- ۰۷ chart/time */}
      <Specimen
        id='el-time'
        index='۰۷'
        eyebrow='نمودار و زمان'
        title='نمودار و زمان‌بندی'
        description='نمودار از پالت سری‌های تم تغذیه می‌شود؛ تقویم، گام‌شمار و تایم‌لاین همان توکن‌های هندسی و تایپوگرافی را مصرف می‌کنند.'
        tokens={["--cc-chart-1", "--cc-chart-2", "--cc-radius", "--cc-line-height"]}
        trailing={
          <Badge variant='outline' className='gap-1'>
            <Icon name='chart-area' className='size-3' />
            SVG + Recharts
          </Badge>
        }
      >
        <div className='grid gap-3 @2xl:grid-cols-[1.15fr_1fr]'>
          <ChartFrame
            eyebrow='روند'
            title='درآمد هفته'
            description='میلیون تومان · میانگین متحرک'
            legend={
              <ChartLegend
                items={[
                  { label: "درآمد", color: "var(--cc-chart-1)" },
                  {
                    label: "میانگین",
                    color: "var(--cc-chart-2)",
                    dashed: true,
                  },
                ]}
              />
            }
            footer={
              <span>
                اوج هفته:{" "}
                {formatNumber(Math.max(...DEMO_TREND.map((row) => row.value)))}{" "}
                میلیون تومان
              </span>
            }
          >
            <AreaTrend
              data={DEMO_TREND}
              xKey='label'
              height={196}
              series={[{ key: "value", label: "درآمد" }]}
              formatValue={(value) => formatNumber(value)}
            />
          </ChartFrame>

          <Card>
            <CardHeader>
              <CardTitle>تقویم، گام‌ها و رویدادها</CardTitle>
              <CardDescription>
                مرحلهٔ {formatNumber(demoStep + 1)} از{" "}
                {formatNumber(DEMO_STEPS.length)} · روز انتخاب‌شده
              </CardDescription>
            </CardHeader>
            <CardContent className='grid gap-3 @xl:grid-cols-[auto_1fr]'>
              <Calendar
                today='2026-10-05'
                value={demoDate}
                availability={DEMO_AVAILABILITY}
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
                    title='رزرو تأیید شد'
                    description='۱۰:۳۰ · شعبهٔ مرکزی'
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
                    title='پرونده به‌روزرسانی شد'
                    description='نتیجهٔ آزمایش بارگذاری شد'
                    meta='۲ روز پیش'
                    tone='muted'
                  />
                </Timeline>
              </div>
            </CardContent>
          </Card>
        </div>
      </Specimen>

      {/* ------------------------------------------------------------- footer */}
      <footer className='flex flex-wrap items-center justify-between gap-2 border-t-[length:var(--cc-border-width)] border-[color:var(--cc-border)] pt-3'>
        <span className='text-[length:calc(var(--cc-font-size)*0.8)] text-[color:var(--cc-muted-foreground)]'>
          {formatNumber(PRIMITIVES.length)} المان پایه در {formatNumber(SECTIONS.length)}{" "}
          ایستگاه؛ رنگ، شعاع، سایه، فونت و آیکون همه از پنل کنار می‌آید.
        </span>
        <div className='flex flex-wrap items-center gap-1.5'>
          <Badge variant='outline'>توکن‌محور</Badge>
          <Badge variant='outline'>RTL</Badge>
          <Badge variant='outline'>بدون رنگ ثابت</Badge>
        </div>
      </footer>
    </div>
  );
}

