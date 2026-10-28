import Image from "next/image";
import { ArrowUpLeft, Circle, Plus } from "lucide-react";
import { cn } from "cn";

type Tone = "coral" | "teal" | "mustard";

type Project = {
  id: string;
  /** Persian ordinal, kept in the data so the grid never renumbers on filter. */
  index: string;
  name: string;
  kind: string;
  stamp: { label: string; tone: Tone };
  body: string;
  features: string[];
  stack: string[];
  url: string;
  host: string;
  shot: { src: string; alt: string };
  /** Second product surface, painted as an offset print on the featured card. */
  inset?: { src: string; alt: string };
  /** Every public door into the product; the featured card links them all. */
  surfaces?: { label: string; href: string; host: string }[];
};

const TONE_RING: Record<Tone, string> = {
  coral: "riso-stamp",
  teal: "riso-stamp-teal",
  mustard: "riso-stamp-mustard",
};

const TONE_BAR: Record<Tone, string> = {
  coral: "bg-coral",
  teal: "bg-teal-craft",
  mustard: "bg-mustard-deep",
};

const PROJECTS: Project[] = [
  {
    id: "site-builder",
    index: "۰۱",
    name: "سایت‌ساز متنو",
    kind: "محصول SaaS",
    stamp: { label: "خودش سایت می‌سازد", tone: "coral" },
    body: "پلتفرم ساخت سایت بدون کدنویسی: قالب را انتخاب می‌کنی، بلوک‌ها را با درگ‌اند‌دراپ می‌چینی و همان‌جا منتشر می‌کنی. هم لندینگ محصول را ساختم، هم خود اپلیکیشن را.",
    features: [
      "درگ‌اند‌دراپ بلوک‌ها",
      "قالب‌های آمادهٔ فارسی",
      "پیش‌نمایش زندهٔ موبایل",
      "انتشار روی دامنهٔ اختصاصی",
      "ورود با شمارهٔ موبایل",
    ],
    stack: ["Next.js", "Design System"],
    url: "https://app.site-builder.ir/",
    host: "app.site-builder.ir",
    shot: {
      src: "/projects/sitebuilder-landing.webp",
      alt: "لندینگ سایت‌ساز متنو با هیروی تیره و اسلایدر نمونه‌کارها",
    },
    inset: {
      src: "/projects/sitebuilder-app.webp",
      alt: "صفحهٔ ورود اپلیکیشن سایت‌ساز متنو",
    },
    surfaces: [
      {
        label: "لندینگ محصول",
        href: "https://site-builder.ir/",
        host: "site-builder.ir",
      },
      {
        label: "اپلیکیشن درگ‌اند‌دراپ",
        href: "https://app.site-builder.ir/",
        host: "app.site-builder.ir",
      },
    ],
  },
  {
    id: "matno",
    index: "۰۲",
    name: "متنو",
    kind: "سایت شرکتی",
    stamp: { label: "برند + ویدیو", tone: "teal" },
    body: "سایت شرکت مهندسی متنو: هیرو ویدیویی، مسیر سه‌مرحله‌ای همکاری و صفحات راهکار، محصول، پروژه و موقعیت شغلی — همه با یک زبان بصری آرام و سازمانی.",
    features: [
      "هیرو ویدیویی اختصاصی",
      "مسیر همکاری سه‌مرحله‌ای",
      "صفحات راهکار و محصول",
      "فرم تماس و جذب نیرو",
    ],
    stack: ["Next.js", "Brand UI"],
    url: "https://matnoco.ir/",
    host: "matnoco.ir",
    shot: {
      src: "/projects/matnoco.webp",
      alt: "هیروی سایت شرکت متنو با ویدیو و مسیر همکاری",
    },
  },
  {
    id: "sajad-nursing",
    index: "۰۳",
    name: "نرس سجاد",
    kind: "آموزش و محتوا",
    stamp: { label: "بلاگ + لندینگ", tone: "coral" },
    body: "آکادمی پرستاری نرس سجاد: لندینگ دوره، بانک مقالات، منابع PDF رایگان و پخش زندهٔ یوتیوب، همه در یک مسیر یادگیری روشن برای دانشجوهای پرستاری.",
    features: [
      "لندینگ دوره و پخش زنده",
      "بانک مقالات و درسنامه",
      "دانلود رایگان منابع PDF",
      "نظرات و آمار دانشجوها",
    ],
    stack: ["Next.js", "Vercel"],
    url: "https://sajad-nursing.vercel.app/",
    host: "sajad-nursing.vercel.app",
    shot: {
      src: "/projects/sajad-nursing.webp",
      alt: "لندینگ آکادمی پرستاری نرس سجاد با آمار و بخش مقالات",
    },
  },
  {
    id: "phillweb",
    index: "۰۴",
    name: "فیلوب",
    kind: "پورتفولیو + پنل",
    stamp: { label: "همین سایت", tone: "teal" },
    body: "همین صفحه‌ای که در آن هستی: لندینگ، بلاگ با ادیتور متن غنی، پنل مدیریت پروژه و درآمد، ردیاب پروژه با کد رهگیری و صندوق درخواست‌ها با پیامک وضعیت.",
    features: [
      "استودیوی تم زنده",
      "بلاگ با ادیتور متن غنی",
      "پنل پروژه، درآمد و تقویم",
      "ردیاب پروژه با کد رهگیری",
    ],
    stack: ["Next.js", "Postgres", "Tiptap"],
    url: "https://phillweb.ir/",
    host: "phillweb.ir",
    shot: {
      src: "/projects/phillweb.webp",
      alt: "داشبورد پنل مدیریت فیلوب با نمودار درخواست‌ها و پروژه‌های در جریان",
    },
  },
];

const FEATURED = PROJECTS[0];
const REST = PROJECTS.slice(1);

/** Inside-out ink frame that makes a screenshot read as a printed window. */
function BrowserChrome({
  host,
  compact = false,
  className,
}: {
  host: string;
  compact?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 border-b-[2.5px] border-indigo-ink bg-paper-dim px-3 py-2",
        className,
      )}
    >
      <span aria-hidden className='flex items-center gap-1'>
        <span className='size-[0.5rem] rounded-full border-[1.5px] border-indigo-ink bg-coral' />
        <span className='size-[0.5rem] rounded-full border-[1.5px] border-indigo-ink bg-mustard' />
        <span className='size-[0.5rem] rounded-full border-[1.5px] border-indigo-ink bg-teal-craft' />
      </span>
      <span
        dir='ltr'
        className='min-w-0 flex-1 truncate rounded-full border-[1.5px] border-indigo-ink/25 bg-paper-light px-2.5 py-0.5 font-mono text-[0.625rem] font-bold text-indigo-light'
      >
        {host}
      </span>
      {compact ? null : (
        <span className='flex items-center gap-1 font-mono text-[0.5625rem] font-black tracking-wide text-teal-craft'>
          <span className='size-[0.3125rem] animate-pulse rounded-full bg-teal-craft' />
          LIVE
        </span>
      )}
    </div>
  );
}

function FeatureList({ items }: { items: string[] }) {
  return (
    <ul className='flex flex-wrap gap-1.5'>
      {items.map((item) => (
        <li
          key={item}
          className='inline-flex items-center gap-1 rounded-full border-[1.5px] border-indigo-ink/20 bg-paper-dim px-2.5 py-1 text-[0.6875rem] font-bold text-indigo-ink'
        >
          <Circle aria-hidden className='size-[0.3125rem] fill-coral text-coral' />
          {item}
        </li>
      ))}
    </ul>
  );
}

function LiveLink({
  url,
  label,
  tone,
  className,
}: {
  url: string;
  label: string;
  tone: Tone;
  className?: string;
}) {
  return (
    <a
      href={url}
      target='_blank'
      rel='noopener noreferrer'
      className={cn(
        "group/link inline-flex shrink-0 items-center gap-1.5 rounded-full border-[2px] border-indigo-ink px-3 py-1 text-[0.6875rem] font-extrabold text-white shadow-craft-sm transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5",
        TONE_BAR[tone],
        className,
      )}
    >
      {label}
      <ArrowUpLeft className='size-[0.875rem] transition-transform group-hover/link:-translate-x-0.5 group-hover/link:-translate-y-0.5' />
    </a>
  );
}

function FeaturedCard() {
  return (
    <article className='group relative'>
      <div className='craft-card grid grid-cols-1 overflow-hidden rounded-sm bg-paper-light lg:grid-cols-[1.2fr_1fr]'>
        <a
          href={FEATURED.url}
          target='_blank'
          rel='noopener noreferrer'
          aria-label={`مشاهدهٔ ${FEATURED.name}`}
          className='relative block border-b-[2.5px] border-indigo-ink bg-paper-dim lg:border-b-0 lg:border-e-[2.5px]'
        >
          <BrowserChrome host={FEATURED.host} />
          <div className='relative aspect-[16/9] overflow-hidden'>
            <Image
              src={FEATURED.shot.src}
              alt={FEATURED.shot.alt}
              fill
              priority
              sizes='(min-width: 1024px) 46rem, 100vw'
              className='object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]'
            />
          </div>

          {FEATURED.inset ? (
            <div className='pointer-events-none absolute bottom-3 start-3 w-[36%] rotate-[-3deg] overflow-hidden rounded-sm border-[2.5px] border-indigo-ink bg-paper-light shadow-craft-lg transition-transform duration-300 group-hover:rotate-0 sm:bottom-4 sm:start-4'>
              <BrowserChrome host={FEATURED.host} compact className='px-2 py-1' />
              <div className='relative aspect-[16/10]'>
                <Image
                  src={FEATURED.inset.src}
                  alt={FEATURED.inset.alt}
                  fill
                  sizes='(min-width: 1024px) 16rem, 36vw'
                  className='object-cover object-top'
                />
              </div>
            </div>
          ) : null}
        </a>

        <div className='flex flex-col p-5 sm:p-7'>
          <div className='flex flex-wrap items-center justify-between gap-2'>
            {/* Persian digits and words stay in the body face — mono breaks the joins. */}
            <span className='text-[0.6875rem] font-bold text-indigo-light'>
              <span className='font-black text-indigo-ink'>{FEATURED.index}</span>
              {" / "}
              {FEATURED.kind}
            </span>
            <span
              className={cn(
                "riso-stamp rotate-[-2deg] px-2.5 py-0.5 text-[0.625rem]",
                TONE_RING[FEATURED.stamp.tone],
              )}
            >
              {FEATURED.stamp.label}
            </span>
          </div>

          <h3 className='mt-3 text-[1.5rem] leading-tight font-black text-indigo-ink sm:text-[1.75rem]'>
            {FEATURED.name}
          </h3>
          <p className='mt-2 text-sm leading-relaxed text-indigo-light'>
            {FEATURED.body}
          </p>

          <div className='mt-4 mb-5'>
            <FeatureList items={FEATURED.features} />
          </div>

          {/* The product has two public doors — both get a real link. */}
          <ul className='mb-6 grid grid-cols-1 gap-2 sm:grid-cols-2'>
            {(FEATURED.surfaces ?? []).map((surface) => (
              <li key={surface.href}>
                <a
                  href={surface.href}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='group/surf flex h-full items-center justify-between gap-2 rounded-sm border-[2px] border-indigo-ink/25 bg-paper-dim px-3 py-2 transition-colors hover:border-indigo-ink hover:bg-mustard/25'
                >
                  <span className='flex min-w-0 flex-col gap-0.5'>
                    <span className='text-[0.75rem] font-extrabold text-indigo-ink'>
                      {surface.label}
                    </span>
                    <span
                      dir='ltr'
                      className='truncate text-right font-mono text-[0.5625rem] font-bold text-indigo-ink/50'
                    >
                      {surface.host}
                    </span>
                  </span>
                  <ArrowUpLeft
                    aria-hidden
                    className='size-4 shrink-0 text-indigo-ink/40 transition-colors group-hover/surf:text-coral'
                  />
                </a>
              </li>
            ))}
          </ul>

          <div className='mt-auto flex flex-wrap items-center justify-between gap-3 border-t-2 border-dashed border-indigo-ink/20 pt-4'>
            <span
              dir='ltr'
              className='font-mono text-[0.625rem] font-bold text-indigo-ink/60'
            >
              {FEATURED.stack.join(" · ")}
            </span>
            <LiveLink
              url={FEATURED.url}
              label='مشاهدهٔ سایت'
              tone={FEATURED.stamp.tone}
            />
          </div>
        </div>
      </div>
    </article>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <article className='group relative'>
      <div className='craft-card flex h-full flex-col overflow-hidden rounded-sm bg-paper-light'>
        <a
          href={project.url}
          target='_blank'
          rel='noopener noreferrer'
          aria-label={`مشاهدهٔ ${project.name}`}
          className='block'
        >
          <BrowserChrome host={project.host} />
          <div className='relative aspect-[16/10] overflow-hidden bg-paper-dim'>
            <Image
              src={project.shot.src}
              alt={project.shot.alt}
              fill
              sizes='(min-width: 768px) 38rem, 100vw'
              className='object-cover object-top transition-transform duration-500 group-hover:scale-[1.04]'
            />
            <span
              aria-hidden
              className='pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-indigo-ink/25 to-transparent'
            />
          </div>
        </a>

        <div className='flex flex-1 flex-col p-5'>
          <div className='flex items-start justify-between gap-2'>
            <span className='text-[0.6875rem] font-bold text-indigo-light'>
              <span className='font-black text-indigo-ink'>{project.index}</span>
              {" / "}
              {project.kind}
            </span>
            <span
              className={cn(
                "riso-stamp -mt-1 shrink-0 px-2.5 py-0.5 text-[0.625rem]",
                TONE_RING[project.stamp.tone],
              )}
            >
              {project.stamp.label}
            </span>
          </div>

          <h3 className='mt-2.5 text-[1.25rem] leading-snug font-black text-indigo-ink'>
            {project.name}
          </h3>
          <p className='mt-2 text-sm leading-relaxed text-indigo-light'>
            {project.body}
          </p>

          <div className='mt-4 mb-5'>
            <FeatureList items={project.features} />
          </div>

          <div className='mt-auto flex flex-wrap items-center justify-between gap-3 border-t-2 border-dashed border-indigo-ink/20 pt-4'>
            <span
              dir='ltr'
              className='font-mono text-[0.625rem] font-bold text-indigo-ink/50'
            >
              {project.stack.join(" · ")}
            </span>
            <LiveLink
              url={project.url}
              label='مشاهده سایت'
              tone={project.stamp.tone}
            />
          </div>
        </div>
      </div>
    </article>
  );
}

/** Fourth tile of the grid. It mirrors the anatomy of a project card — same
 *  chrome, same 16:10 window — but the window is empty, so the block closes on
 *  an invitation instead of a wall of screenshots. */
function NextProjectCard() {
  return (
    <article className='group relative'>
      <div className='flex h-full flex-col overflow-hidden rounded-sm border-[2.5px] border-dashed border-indigo-ink/40 bg-paper-dim transition-colors hover:border-indigo-ink'>
        <div className='flex items-center gap-2 border-b-[2.5px] border-dashed border-indigo-ink/30 px-3 py-2'>
          <span aria-hidden className='flex items-center gap-1 opacity-45'>
            <span className='size-[0.5rem] rounded-full border-[1.5px] border-indigo-ink bg-coral' />
            <span className='size-[0.5rem] rounded-full border-[1.5px] border-indigo-ink bg-mustard' />
            <span className='size-[0.5rem] rounded-full border-[1.5px] border-indigo-ink bg-teal-craft' />
          </span>
          <span
            dir='ltr'
            className='min-w-0 flex-1 truncate rounded-full border-[1.5px] border-dashed border-indigo-ink/30 bg-paper-light/60 px-2.5 py-0.5 font-mono text-[0.625rem] font-bold text-indigo-ink/45'
          >
            your-project.ir
          </span>
          <span
            dir='ltr'
            className='font-mono text-[0.5625rem] font-black tracking-widest text-indigo-ink/35'
          >
            VACANT
          </span>
        </div>

        <div className='dot-grid relative flex aspect-[16/10] flex-col items-center justify-center gap-2 bg-paper/70 px-6 text-center'>
          <span
            aria-hidden
            className='flex size-11 items-center justify-center rounded-full border-[2px] border-dashed border-indigo-ink/45 text-indigo-ink/60'
          >
            <Plus className='size-5' />
          </span>
          <p className='text-[0.8125rem] font-bold text-indigo-ink/70'>
            اینجا جای اسکرین‌شات پروژهٔ توست
          </p>
          <span
            dir='ltr'
            className='font-mono text-[0.5625rem] tracking-[0.25em] text-indigo-ink/30'
          >
            YOUR NEXT PROJECT
          </span>
        </div>

        <div className='flex flex-1 flex-col p-5'>
          <div className='flex items-start justify-between gap-2'>
            <span
              dir='ltr'
              className='font-mono text-[0.6875rem] font-bold text-indigo-light'
            >
              NEXT / VACANT
            </span>
            <span className='riso-stamp-mustard -mt-1 shrink-0 rotate-[2deg] px-2.5 py-0.5 text-[0.625rem]'>
              جای خالی
            </span>
          </div>

          <h3 className='mt-2.5 text-[1.25rem] leading-snug font-black text-indigo-ink'>
            پروژهٔ بعدی، مالِ توست
          </h3>
          <p className='mt-2 text-sm leading-relaxed text-indigo-light'>
            همین مسیر را برای کسب‌وکار خودت می‌سازم: لندینگ، فروشگاه یا یک وب‌اپ
            سفارشی — با کد تمیز، سرعت واقعی و ظاهری که فراموش نمی‌شود.
          </p>

          <div className='mt-auto flex flex-wrap items-center gap-2.5 border-t-2 border-dashed border-indigo-ink/20 pt-4'>
            <a
              href='#contact-section'
              className='inline-flex items-center gap-1.5 rounded-full border-[2px] border-indigo-ink bg-coral px-3.5 py-1.5 text-[0.6875rem] font-extrabold text-white shadow-craft-sm transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5'
            >
              گفتگو دربارهٔ پروژه
              <ArrowUpLeft className='size-[0.875rem]' />
            </a>
            <a
              href='#estimator-section'
              className='text-[0.6875rem] font-extrabold text-indigo-ink underline decoration-mustard-deep decoration-2 underline-offset-4 hover:text-coral'
            >
              برآورد هزینه
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}

export function ProjectsSection() {
  return (
    <section
      id='projects-container'
      className='w-full scroll-mt-16 border-b-[2.5px] border-indigo-ink bg-paper px-4 py-12 sm:px-8 lg:px-12'
    >
      <div className='mx-auto flex max-w-7xl flex-col gap-10'>
        <div className='flex flex-col justify-between gap-4 border-b-[2px] border-indigo-ink pb-6 md:flex-row md:items-end'>
          <div className='flex flex-col gap-2'>
            <span
              dir='ltr'
              className='w-fit font-mono text-[0.6875rem] font-black tracking-widest text-coral'
            >
              PORTFOLIO // 04 LIVE PRODUCTS
            </span>
            <h2 className='text-[1.625rem] font-black text-indigo-ink sm:text-[2.125rem]'>
              کارهایی که واقعاً آنلاین‌اند
            </h2>
          </div>

          <p className='max-w-xl text-sm leading-relaxed text-indigo-light md:text-end'>
            چهار محصول واقعی که از صفر طراحی و توسعه داده‌ام — از یک سایت‌ساز
            کامل تا آکادمی آموزشی. روی هرکدام بزن و زنده ببینش.
          </p>
        </div>

        <FeaturedCard />

        <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
          {REST.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
          <NextProjectCard />
        </div>
      </div>
    </section>
  );
}
