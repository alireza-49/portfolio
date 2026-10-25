/**
 * Content model for the clinic reservation scenario.
 *
 * Availability is generated from a deterministic hash instead of a random
 * number, so the server and the client always agree on which slots are free.
 */

/** Fixed anchor date so the calendar is identical on every render. */
export const CLINIC_TODAY = "2026-10-05";

const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";

/** Persian digits without grouping, for booking codes and short labels. */
export function toPersian(value: string | number): string {
  return String(value).replace(/\d/g, (digit) => PERSIAN_DIGITS[Number(digit)]);
}

/**
 * Copy that used to be retyped in five sections. Every place that mentions the
 * cancellation window, the opening hours or the price list reads it from here.
 */
export const CLINIC_STATUS = {
  openUntil: "۲۱:۰۰",
  pricingUpdated: "مهر ۱۴۰۵",
  supportPhone: "۰۲۱-۸۸۷۷۰۰۰۰",
} as const;

export const CANCEL_WINDOW_HOURS = 12;

export const CLINIC_PRICING = {
  /** Online visits cost a quarter less than in-person ones. */
  onlineRatio: 0.75,
  firstVisitFee: 80_000,
  taxRate: 0.09,
  firstVisitMinutes: 30,
  followVisitMinutes: 20,
} as const;

export type SpecialtyId =
  | "cardio"
  | "derma"
  | "pediatric"
  | "ortho"
  | "neuro"
  | "women";

export type ClinicSpecialty = {
  id: SpecialtyId;
  label: string;
  note: string;
};

export const SPECIALTIES: ClinicSpecialty[] = [
  { id: "cardio", label: "قلب و عروق", note: "نوار قلب و اکو" },
  { id: "derma", label: "پوست و مو", note: "لیزر و درمان" },
  { id: "pediatric", label: "اطفال", note: "معاینه و واکسن" },
  { id: "ortho", label: "ارتوپدی", note: "مفاصل و شکستگی" },
  { id: "neuro", label: "مغز و اعصاب", note: "سردرد و خواب" },
  { id: "women", label: "زنان و زایمان", note: "مراقبت بارداری" },
];

export type ClinicDoctor = {
  id: string;
  name: string;
  specialty: SpecialtyId;
  title: string;
  rating: number;
  reviews: number;
  fee: number;
  years: number;
  portrait: number;
  online: boolean;
  insurances: string[];
  tags: string[];
  bio: string;
};

export const DOCTORS: ClinicDoctor[] = [
  {
    id: "diba",
    name: "دکتر سهراب دیبا",
    specialty: "cardio",
    title: "فوق تخصص قلب و عروق",
    rating: 4.9,
    reviews: 412,
    fee: 420000,
    years: 18,
    portrait: 1,
    online: true,
    insurances: ["tamin", "salamat", "nezami"],
    tags: ["اکوکاردیوگرافی", "فشار خون", "آریتمی"],
    bio: "عضو انجمن قلب ایران؛ تمرکز روی پیشگیری از سکته و مدیریت فشار خون مقاوم.",
  },
  {
    id: "farahani",
    name: "دکتر نیلوفر فراهانی",
    specialty: "derma",
    title: "متخصص پوست، مو و زیبایی",
    rating: 4.8,
    reviews: 356,
    fee: 350000,
    years: 12,
    portrait: 2,
    online: true,
    insurances: ["tamin", "salamat"],
    tags: ["آکنه", "لیزر", "ریزش مو"],
    bio: "درمان آکنهٔ مقاوم و پروتکل‌های لیزر با کمترین دورهٔ بهبود.",
  },
  {
    id: "kaviani",
    name: "دکتر امیر کاویانی",
    specialty: "pediatric",
    title: "متخصص کودکان و نوزادان",
    rating: 4.9,
    reviews: 508,
    fee: 320000,
    years: 15,
    portrait: 0,
    online: true,
    insurances: ["tamin", "salamat", "nezami"],
    tags: ["واکسیناسیون", "رشد کودک", "شیر مادر"],
    bio: "پیگیری رشد و تغذیهٔ کودک؛ ویزیت آرام و توضیح کامل برای والدین.",
  },
  {
    id: "rahmani",
    name: "دکتر پویا رحمانی",
    specialty: "ortho",
    title: "متخصص ارتوپدی و جراحی استخوان",
    rating: 4.7,
    reviews: 289,
    fee: 450000,
    years: 14,
    portrait: 3,
    online: false,
    insurances: ["tamin", "salamat"],
    tags: ["زانو", "شانه", "آرتروسکوپی"],
    bio: "جراحی کم‌تهاجمی زانو و شانه؛ بازتوانی همراه با تیم فیزیوتراپی کلینیک.",
  },
  {
    id: "sharifi",
    name: "دکتر مینا شریفی",
    specialty: "neuro",
    title: "متخصص مغز و اعصاب",
    rating: 4.8,
    reviews: 331,
    fee: 400000,
    years: 11,
    portrait: 2,
    online: true,
    insurances: ["tamin", "salamat", "nezami"],
    tags: ["میگرن", "خواب", "ام‌اس"],
    bio: "درمان میگرن مزمن و اختلالات خواب با رویکرد دارویی و رفتاری.",
  },
  {
    id: "hosseini",
    name: "دکتر آیدا حسینی",
    specialty: "women",
    title: "متخصص زنان، زایمان و نازایی",
    rating: 5,
    reviews: 402,
    fee: 380000,
    years: 16,
    portrait: 0,
    online: false,
    insurances: ["tamin", "salamat"],
    tags: ["بارداری", "سونوگرافی", "نازایی"],
    bio: "مراقبت بارداری پرخطر و مشاورهٔ نازایی با تیم آزمایشگاه داخلی.",
  },
  {
    id: "amini",
    name: "دکتر رها امینی",
    specialty: "cardio",
    title: "متخصص قلب و عروق",
    rating: 4.7,
    reviews: 214,
    fee: 380000,
    years: 9,
    portrait: 0,
    online: true,
    insurances: ["tamin", "salamat"],
    tags: ["چربی خون", "تست ورزش", "هولتر"],
    bio: "پایش ریتم قلب و تست ورزش؛ مناسب مراجعان با سابقهٔ خانوادگی بیماری قلبی.",
  },
  {
    id: "nejad",
    name: "دکتر کامران نژاد",
    specialty: "derma",
    title: "متخصص پوست و مو",
    rating: 4.6,
    reviews: 178,
    fee: 320000,
    years: 8,
    portrait: 3,
    online: false,
    insurances: ["tamin", "salamat", "nezami"],
    tags: ["پسوریازیس", "زخم", "مو"],
    bio: "درمان بیماری‌های التهابی پوست و پیگیری زخم‌های مزمن.",
  },
  {
    id: "vala",
    name: "دکتر شیرین والا",
    specialty: "pediatric",
    title: "فوق تخصص نوزادان",
    rating: 4.8,
    reviews: 266,
    fee: 360000,
    years: 13,
    portrait: 2,
    online: true,
    insurances: ["tamin", "salamat"],
    tags: ["نوزاد", "شیردهی", "زردی"],
    bio: "ویزیت نوزاد، مشاورهٔ شیردهی و پیگیری زردی با دستگاه خانگی.",
  },
];

export type InsuranceId = "tamin" | "salamat" | "nezami" | "azad";

export const INSURANCES: {
  id: InsuranceId;
  label: string;
  coverage: number;
}[] = [
  { id: "tamin", label: "تأمین اجتماعی", coverage: 0.7 },
  { id: "salamat", label: "بیمه سلامت", coverage: 0.6 },
  { id: "nezami", label: "نیروهای مسلح", coverage: 0.5 },
  { id: "azad", label: "آزاد (بدون بیمه)", coverage: 0 },
];

export type SlotPeriod = "morning" | "afternoon" | "evening";

export type ClinicSlot = {
  id: string;
  time: string;
  period: SlotPeriod;
  taken: boolean;
};

export const PERIOD_LABELS: Record<SlotPeriod, string> = {
  morning: "صبح",
  afternoon: "بعدازظهر",
  evening: "عصر",
};

const SLOT_TIMES: { time: string; period: SlotPeriod }[] = [
  { time: "۰۹:۰۰", period: "morning" },
  { time: "۰۹:۳۰", period: "morning" },
  { time: "۱۰:۰۰", period: "morning" },
  { time: "۱۰:۳۰", period: "morning" },
  { time: "۱۱:۰۰", period: "morning" },
  { time: "۱۱:۳۰", period: "morning" },
  { time: "۱۴:۰۰", period: "afternoon" },
  { time: "۱۴:۳۰", period: "afternoon" },
  { time: "۱۵:۰۰", period: "afternoon" },
  { time: "۱۵:۳۰", period: "afternoon" },
  { time: "۱۶:۰۰", period: "afternoon" },
  { time: "۱۶:۳۰", period: "afternoon" },
  { time: "۱۸:۰۰", period: "evening" },
  { time: "۱۸:۳۰", period: "evening" },
  { time: "۱۹:۰۰", period: "evening" },
  { time: "۱۹:۳۰", period: "evening" },
];

/** Daily capacity, derived from the slot table instead of retyped in the view. */
export const SLOT_CAPACITY = SLOT_TIMES.length;

/** FNV-1a — tiny, stable, and fast enough for a few hundred cells. */
function hashKey(key: string): number {
  let hash = 2166136261;
  for (let index = 0; index < key.length; index += 1) {
    hash ^= key.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash);
}

/**
 * Tracking code for a confirmed booking. Derived from the slot, so it stays
 * deterministic (no clock, no counter) and survives a reload of the demo.
 */
export function bookingCode(
  doctorId: string,
  iso: string,
  slotId: string | null,
): string {
  const seed = hashKey(`${doctorId}|${iso}|${slotId ?? "open"}`);
  return `HK-${toPersian(24000 + (seed % 9000))}`;
}

export function slotsFor(doctorId: string, iso: string): ClinicSlot[] {
  return SLOT_TIMES.map((slot) => {
    const seed = hashKey(`${doctorId}|${iso}|${slot.time}`);
    return {
      id: `${iso}-${slot.time}`,
      time: slot.time,
      period: slot.period,
      taken: seed % 3 === 0,
    };
  });
}

export function freeSlotCount(doctorId: string, iso: string): number {
  return slotsFor(doctorId, iso).filter((slot) => !slot.taken).length;
}

/**
 * Availability map for the calendar: 120 days of free-slot counts keyed by ISO
 * date. Fridays (weekend) are closed, mirroring the clinic schedule, and every
 * other day reports the *real* number of free slots from `slotsFor` — the
 * calendar and the slot grid can therefore never disagree.
 *
 * Results are cached per doctor: the grid asks for all eight doctors and the
 * map is 120 × 16 hashes, so recomputing it on every render would be wasteful
 * while still staying deterministic.
 */
const availabilityCache = new Map<string, Record<string, number>>();

export function buildAvailability(doctorId?: string): Record<string, number> {
  const key = doctorId ?? "clinic";
  const cached = availabilityCache.get(key);
  if (cached) return cached;

  const result: Record<string, number> = {};
  const [year, month, day] = CLINIC_TODAY.split("-").map(Number);
  const start = Date.UTC(year, month - 1, day);

  for (let offset = 0; offset < 120; offset += 1) {
    const date = new Date(start + offset * 86400000);
    const iso = date.toISOString().slice(0, 10);
    const weekday = date.getUTCDay(); // 5 = Friday
    result[iso] = weekday === 5 ? 0 : freeSlotCount(key, iso);
  }

  availabilityCache.set(key, result);
  return result;
}

/** First date with a free slot, used by the hero chip and the empty-day hint. */
export function nextFreeDate(
  doctorId: string,
  fromIso = CLINIC_TODAY,
): string | null {
  const availability = buildAvailability(doctorId);
  for (const iso of Object.keys(availability)) {
    if (iso >= fromIso && (availability[iso] ?? 0) > 0) return iso;
  }
  return null;
}

export const CLINIC_SERVICES = [
  {
    name: "ویزیت عمومی",
    duration: "۲۰ دقیقه",
    price: 220000,
    note: "معاینهٔ اولیه و ارجاع در صورت نیاز",
  },
  {
    name: "ویزیت تخصصی",
    duration: "۳۰ دقیقه",
    price: 420000,
    note: "شامل بررسی سوابق و برنامهٔ درمان",
  },
  {
    name: "نوار قلب (ECG)",
    duration: "۱۵ دقیقه",
    price: 180000,
    note: "تحویل نتیجه در همان روز",
  },
  {
    name: "اکوکاردیوگرافی",
    duration: "۳۵ دقیقه",
    price: 650000,
    note: "با گزارش متخصص قلب",
  },
  {
    name: "مشاورهٔ آنلاین",
    duration: "۲۵ دقیقه",
    price: 290000,
    note: "تماس تصویری امن + نسخهٔ الکترونیک",
  },
  {
    name: "واکسیناسیون کودک",
    duration: "۱۰ دقیقه",
    price: 150000,
    note: "ثبت در سامانهٔ واکسن",
  },
];

export const CLINIC_TESTIMONIALS = [
  {
    name: "مریم ا.",
    subject: "قلب و عروق",
    portrait: 2,
    rating: 5,
    text: "ساعت ۹:۱۵ نوبت داشتم و ۹:۲۰ داخل اتاق بودم. توضیح دکتر دربارهٔ نوار قلب کامل بود و نسخه همان روز در پنل آمد.",
  },
  {
    name: "بابک ر.",
    subject: "اطفال",
    portrait: 1,
    rating: 5,
    text: "برای واکسن پسرم رزرو آنلاین گرفتم؛ بدون تماس تلفنی و بدون صف. یادآوری پیامکی هم آمد.",
  },
  {
    name: "نگار س.",
    subject: "پوست و مو",
    portrait: 0,
    rating: 4,
    text: "ویزیت آنلاین برای پیگیری آکنه کافی بود و دارو را الکترونیکی فرستادند. فقط دو دقیقه تأخیر داشت.",
  },
];

export const CLINIC_FAQ = [
  {
    value: "insurance",
    question: "با بیمهٔ تأمین اجتماعی چقدر از هزینه کم می‌شود؟",
    answer:
      "در ویزیت حضوری، سهم بیمه به‌صورت خودکار از مبلغ نهایی کسر می‌شود. برای خدمات پاراکلینیک مثل اکو، تعرفهٔ مصوب جداگانه محاسبه می‌شود.",
  },
  {
    value: "cancel",
    question: "تا چه زمانی می‌توانم نوبت را لغو کنم؟",
    answer:
      `تا ${toPersian(CANCEL_WINDOW_HOURS)} ساعت قبل از زمان ویزیت، لغو یا جابه‌جایی رایگان است. ` +
      "بعد از آن ۳۰٪ هزینهٔ ویزیت به‌عنوان رزرو محاسبه می‌شود.",
  },
  {
    value: "online",
    question: "ویزیت آنلاین چه تفاوتی با حضوری دارد؟",
    answer:
      "در ویزیت آنلاین نسخه و درخواست آزمایش الکترونیکی صادر می‌شود، اما معاینهٔ فیزیکی و نوار قلب نیاز به حضور دارد.",
  },
  {
    value: "children",
    question: "برای کودک چه سنی نوبت اطفال بگیرم؟",
    answer:
      "ویزیت کودکان تا ۱۴ سال در بخش اطفال انجام می‌شود؛ برای نوزادان زیر ۲۸ روز مسیر اورژانس را انتخاب کنید.",
  },
];

export const CLINIC_HOURS = [
  { day: "شنبه تا چهارشنبه", hours: `۸:۰۰ تا ${CLINIC_STATUS.openUntil}` },
  { day: "پنجشنبه", hours: "۸:۰۰ تا ۱۴:۰۰" },
  { day: "جمعه", hours: "تعطیل (اورژانس فعال)" },
];

export type ClinicGuarantee = {
  id: "cancel" | "payment" | "records" | "support";
  title: string;
  note: string;
};

/** The four promises shown next to a testimonial. No numbers: the hero owns those. */
export const CLINIC_GUARANTEES: ClinicGuarantee[] = [
  {
    id: "cancel",
    title: `لغو رایگان تا ${toPersian(CANCEL_WINDOW_HOURS)} ساعت قبل`,
    note: "جابه‌جایی زمان هم بدون جریمه انجام می‌شود.",
  },
  {
    id: "payment",
    title: "پرداخت آنلاین یا در محل",
    note: "درگاه بانکی، کارت‌خوان پذیرش یا پرداخت نقدی.",
  },
  {
    id: "records",
    title: "پروندهٔ الکترونیک",
    note: "نسخه، نتیجهٔ آزمایش و سوابق ویزیت در یک پنل.",
  },
  {
    id: "support",
    title: "پذیرش ۲۴ ساعته",
    note: "حتی روزهای تعطیل، اورژانس و پذیرش فعال است.",
  },
];

/** Hero figures. The doctor count is derived so it cannot drift from the team. */
export const CLINIC_TRUST = [
  { value: toPersian(DOCTORS.length), label: "پزشک متخصص" },
  { value: "۹ دقیقه", label: "میانگین انتظار" },
  { value: "۴.۹", label: "امتیاز مراجعان" },
  { value: "۱۸ سال", label: "سابقهٔ درمان" },
];

