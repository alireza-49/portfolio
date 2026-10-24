import type { IconName } from "@/components/create-components";
import type { CourseArtVariant, FeatureVariant } from "../art/tutoring-art";

/** Header anchors — they jump inside the preview's own scroll viewport. */
export const NAV_ITEMS = [
  { label: "دوره‌ها", href: "#courses" },
  { label: "مدرسان", href: "#tutors" },
  { label: "قیمت‌ها", href: "#pricing" },
  { label: "پرسش‌ها", href: "#faq" },
] as const;

/** Three promises under the hero CTA, each with a semantic icon name. */
export const HERO_POINTS: { icon: IconName; label: string }[] = [
  { icon: "video", label: "کلاس زنده و ضبط‌شده" },
  { icon: "users", label: "مدرس اختصاصی" },
  { icon: "calendar-check", label: "برنامهٔ هفتگی" },
];

/** Marquee between the hero and the features. */
export const SUBJECT_TICKER = [
  "ریاضی دوازدهم",
  "حسابان",
  "هندسه",
  "فیزیک",
  "شیمی",
  "زیست‌شناسی",
  "مکالمهٔ انگلیسی",
  "آیلتس",
  "نگارش",
  "ادبیات",
];

export const TUTORING_STATS: {
  label: string;
  value: string;
  note: string;
  spark: number[];
}[] = [
  {
    label: "دانش‌آموز فعال",
    value: "۱۲٬۴۰۰+",
    note: "در ۳۱ استان",
    spark: [8, 12, 10, 16, 14, 20, 22, 26],
  },
  {
    label: "مدرس تأییدشده",
    value: "۳۲۰",
    note: "با مصاحبهٔ تخصصی",
    spark: [14, 13, 15, 18, 17, 19, 21, 23],
  },
  {
    label: "رضایت دانش‌آموز",
    value: "۹۴٪",
    note: "نظرسنجی ترم قبل",
    spark: [16, 15, 17, 16, 19, 20, 19, 22],
  },
  {
    label: "امتیاز کلاس‌ها",
    value: "۴.۹/۵",
    note: "از ۲٬۸۰۰ نظر",
    spark: [12, 15, 14, 17, 18, 18, 20, 21],
  },
];

export const TUTORING_FEATURES: {
  art: FeatureVariant;
  icon: IconName;
  title: string;
  body: string;
  meta: string;
}[] = [
  {
    art: "live",
    icon: "video",
    title: "کلاس زندهٔ تعاملی",
    body: "تختهٔ دیجیتال، اشتراک فایل و ضبط جلسه؛ همان تجربهٔ کلاس حضوری روی مرورگر.",
    meta: "روی مرورگر، بدون نصب",
  },
  {
    art: "path",
    icon: "calendar-check",
    title: "مسیر یادگیری شخصی",
    body: "تعیین سطح رایگان و برنامهٔ هفتگی که با سرعت و هدف شما هماهنگ می‌شود.",
    meta: "بازبینی هر دو هفته",
  },
  {
    art: "feedback",
    icon: "check-circle",
    title: "تمرین و بازخورد",
    body: "تمرین هدفمند بعد از هر جلسه، تصحیح انسانی و گزارش پیشرفت برای خانواده.",
    meta: "بازخورد تا ۲۴ ساعت",
  },
];

export const SUBJECTS = {
  math: {
    label: "ریاضی",
    courses: [
      {
        title: "ریاضی دوازدهم — آمادگی کنکور",
        level: "پیشرفته",
        sessions: 24,
        price: 1800000,
        art: "formula" as CourseArtVariant,
        tutor: "سارا مهدوی",
        rating: 4.9,
        seats: { taken: 9, total: 12 },
      },
      {
        title: "حسابان یازدهم",
        level: "متوسط",
        sessions: 20,
        price: 1400000,
        art: "formula" as CourseArtVariant,
        tutor: "سارا مهدوی",
        rating: 4.8,
        seats: { taken: 7, total: 10 },
      },
      {
        title: "هندسهٔ دهم",
        level: "مقدماتی",
        sessions: 16,
        price: 1200000,
        art: "formula" as CourseArtVariant,
        tutor: "امیر کاویانی",
        rating: 4.7,
        seats: { taken: 5, total: 12 },
      },
    ],
  },
  science: {
    label: "علوم",
    courses: [
      {
        title: "فیزیک دوازدهم — حرکت و دینامیک",
        level: "پیشرفته",
        sessions: 22,
        price: 1700000,
        art: "atom" as CourseArtVariant,
        tutor: "امیر کاویانی",
        rating: 4.9,
        seats: { taken: 10, total: 12 },
      },
      {
        title: "شیمی یازدهم",
        level: "متوسط",
        sessions: 18,
        price: 1350000,
        art: "atom" as CourseArtVariant,
        tutor: "امیر کاویانی",
        rating: 4.7,
        seats: { taken: 6, total: 10 },
      },
      {
        title: "زیست‌شناسی دهم",
        level: "مقدماتی",
        sessions: 16,
        price: 1250000,
        art: "atom" as CourseArtVariant,
        tutor: "نگار رستمی",
        rating: 4.8,
        seats: { taken: 8, total: 12 },
      },
    ],
  },
  language: {
    label: "زبان",
    courses: [
      {
        title: "مکالمهٔ انگلیسی — سطح B2",
        level: "متوسط",
        sessions: 20,
        price: 1600000,
        art: "globe" as CourseArtVariant,
        tutor: "نگار رستمی",
        rating: 4.9,
        seats: { taken: 9, total: 10 },
      },
      {
        title: "آیلتس آکادمیک",
        level: "پیشرفته",
        sessions: 24,
        price: 2100000,
        art: "globe" as CourseArtVariant,
        tutor: "نگار رستمی",
        rating: 5,
        seats: { taken: 11, total: 12 },
      },
      {
        title: "زبان فرانسهٔ مقدماتی",
        level: "مقدماتی",
        sessions: 16,
        price: 1300000,
        art: "globe" as CourseArtVariant,
        tutor: "نگار رستمی",
        rating: 4.6,
        seats: { taken: 4, total: 10 },
      },
    ],
  },
  literature: {
    label: "ادبیات",
    courses: [
      {
        title: "فارسی دوازدهم — آرایه و قرابت",
        level: "پیشرفته",
        sessions: 18,
        price: 1200000,
        art: "book" as CourseArtVariant,
        tutor: "سارا مهدوی",
        rating: 4.8,
        seats: { taken: 7, total: 12 },
      },
      {
        title: "عربی یازدهم",
        level: "متوسط",
        sessions: 16,
        price: 1100000,
        art: "book" as CourseArtVariant,
        tutor: "سارا مهدوی",
        rating: 4.6,
        seats: { taken: 5, total: 10 },
      },
      {
        title: "کارگاه نگارش خلاق",
        level: "مقدماتی",
        sessions: 12,
        price: 950000,
        art: "book" as CourseArtVariant,
        tutor: "نگار رستمی",
        rating: 4.9,
        seats: { taken: 8, total: 14 },
      },
    ],
  },
} as const;

export type SubjectId = keyof typeof SUBJECTS;

export const TUTORS = [
  {
    name: "سارا مهدوی",
    subject: "ریاضی",
    portrait: 0,
    rating: 4.9,
    sessions: 320,
    bio: "۱۲ سال تدریس حسابان و هندسه؛ تمرکز روی شهود ریاضی پیش از فرمول.",
    specialties: ["حسابان", "هندسه", "کنکور"],
  },
  {
    name: "امیر کاویانی",
    subject: "فیزیک",
    portrait: 1,
    rating: 4.8,
    sessions: 280,
    bio: "دانشجوی دکتری فیزیک؛ مسائل را با شبیه‌سازی و آزمایش ذهنی توضیح می‌دهد.",
    specialties: ["دینامیک", "الکتریسیته", "آزمایش"],
  },
  {
    name: "نگار رستمی",
    subject: "زبان انگلیسی",
    portrait: 2,
    rating: 5,
    sessions: 410,
    bio: "مدرس آیلتس با تمرکز روی مکالمهٔ موقعیتی و بازخورد هفتگی نوشتاری.",
    specialties: ["آیلتس", "مکالمه", "نگارش"],
  },
];

export const WEEKDAYS = [
  {
    id: "sat",
    label: "شنبه",
    subject: "ریاضی دوازدهم",
    topic: "مشتق و کاربردهای آن",
    time: "۱۸:۳۰",
    tutor: "سارا مهدوی",
    seatsLeft: 3,
    capacity: 12,
  },
  {
    id: "sun",
    label: "یکشنبه",
    subject: "فیزیک دوازدهم",
    topic: "حرکت دایره‌ای و نیرو",
    time: "۱۷:۰۰",
    tutor: "امیر کاویانی",
    seatsLeft: 2,
    capacity: 12,
  },
  {
    id: "mon",
    label: "دوشنبه",
    subject: "مکالمهٔ انگلیسی",
    topic: "بحث آزاد سطح B2",
    time: "۱۹:۳۰",
    tutor: "نگار رستمی",
    seatsLeft: 5,
    capacity: 12,
  },
  {
    id: "tue",
    label: "سه‌شنبه",
    subject: "شیمی یازدهم",
    topic: "استوکیومتری و محلول‌ها",
    time: "۱۸:۰۰",
    tutor: "امیر کاویانی",
    seatsLeft: 4,
    capacity: 12,
  },
  {
    id: "wed",
    label: "چهارشنبه",
    subject: "فارسی دوازدهم",
    topic: "آرایه‌های ادبی در کنکور",
    time: "۱۷:۳۰",
    tutor: "سارا مهدوی",
    seatsLeft: 6,
    capacity: 12,
  },
];

export const TESTIMONIALS = [
  {
    name: "آرمیتا صالحی",
    exam: "کنکور ریاضی ۱۴۰۴ · رتبهٔ ۸۴۰",
    portrait: 2,
    subject: "ریاضی",
    quote:
      "قبل از روشنا از ریاضی می‌ترسیدم. جلسهٔ اول سطحم را سنجیدند و برنامه را روی همان ضعف‌ها چیدند؛ بعد از سه ماه نمرهٔ آزمون‌های آزمایشی‌ام ۶ نمره بالا رفت.",
    scores: [11, 18],
  },
  {
    name: "سامان راد",
    exam: "پایهٔ یازدهم · تجربی",
    portrait: 1,
    subject: "فیزیک",
    quote:
      "کلاس‌ها ضبط می‌شوند و همین باعث شد بتوانم بخش دینامیک را دو بار مرور کنم. تمرین‌ها دقیقاً از همان جاهایی بود که اشتباه می‌کردم.",
    scores: [13, 17],
  },
  {
    name: "هستی کریمی",
    exam: "آیلتس آکادمیک · نمرهٔ ۷.۵",
    portrait: 0,
    subject: "زبان",
    quote:
      "بازخورد نوشتاری هفتگی سخت‌گیرانه بود، ولی همان چیزی بود که لازم داشتم. برای اولین بار توانستم بدون ترجمهٔ ذهنی صحبت کنم.",
    scores: [6, 7.5],
  },
];

export const STEPS = [
  {
    title: "تعیین سطح رایگان",
    body: "یک جلسهٔ ۳۰ دقیقه‌ای با مدرس هم‌تخصص؛ نقاط قوت و شکاف‌ها مشخص می‌شود.",
    meta: "۱۵ دقیقه",
  },
  {
    title: "برنامهٔ هفتگی",
    body: "مسیر جلسه‌ها، تمرین‌ها و آزمون‌های کوتاه روی یک تقویم روشن چیده می‌شود.",
    meta: "۴۸ ساعت",
  },
  {
    title: "کلاس و بازخورد",
    body: "جلسهٔ زنده، ضبط، تمرین هدفمند و گزارش پیشرفت برای دانش‌آموز و خانواده.",
    meta: "هر هفته",
  },
];

export const PLANS = [
  {
    name: "پایه",
    monthly: 490000,
    yearly: 4900000,
    badge: null as string | null,
    features: ["۴ جلسهٔ گروهی در ماه", "تمرین هفتگی", "گزارش پیشرفت ماهانه"],
  },
  {
    name: "حرفه‌ای",
    monthly: 890000,
    yearly: 8900000,
    badge: "پیشنهاد ما" as string | null,
    features: [
      "۸ جلسهٔ خصوصی در ماه",
      "مسیر یادگیری اختصاصی",
      "پاسخ معلم تا ۲۴ ساعت",
      "ضبط همهٔ جلسات",
    ],
  },
  {
    name: "ویژه",
    monthly: 1490000,
    yearly: 14900000,
    badge: null as string | null,
    features: [
      "جلسات نامحدود خصوصی",
      "مشاور تحصیلی اختصاصی",
      "پشتیبانی همیشه‌بیدار",
      "گزارش هفتگی برای خانواده",
    ],
  },
];

export const COMPARISON = [
  { label: "جلسهٔ خصوصی در ماه", values: ["۴", "۸", "نامحدود"] },
  { label: "ضبط جلسات", values: ["—", "همه", "همه"] },
  { label: "گزارش برای خانواده", values: ["ماهانه", "هفتگی", "هفتگی"] },
  { label: "پاسخ معلم", values: ["۷۲ ساعت", "۲۴ ساعت", "۲ ساعت"] },
  { label: "مشاور اختصاصی", values: ["—", "—", "دارد"] },
];

export const TUTORING_FAQ = [
  {
    value: "trial",
    question: "جلسهٔ آزمایشی رایگان چطور برگزار می‌شود؟",
    answer:
      "یک جلسهٔ ۳۰ دقیقه‌ای با مدرس منتخب شما؛ سطح فعلی بررسی می‌شود و برنامهٔ پیشنهادی همان‌جا مشخص می‌شود.",
  },
  {
    value: "switch",
    question: "اگر با مدرس هماهنگ نشدم، می‌توانم عوض کنم؟",
    answer:
      "بله. تا پایان جلسهٔ سوم می‌توانید بدون هزینه مدرس را تغییر دهید و تیم پشتیبانی گزینه‌های هم‌تخصص را پیشنهاد می‌دهد.",
  },
  {
    value: "record",
    question: "آیا جلسات ضبط می‌شوند؟",
    answer:
      "همهٔ جلسات ضبط می‌شوند و تا پایان ترم در پنل شما باقی می‌مانند تا هر زمان لازم بود مرور کنید.",
  },
  {
    value: "payment",
    question: "پرداخت به‌صورت ماهانه است؟",
    answer:
      "پرداخت ماهانه یا ترمی است. با انتخاب پرداخت سالانه، معادل دو ماه جلسه هدیه می‌گیرید.",
  },
];

