export type ShopCategory = "women" | "men" | "accessories";

export type GarmentVariant =
  | "coat"
  | "shirt"
  | "knit"
  | "cargo"
  | "hoodie"
  | "dress"
  | "tote"
  | "watch";

export type GarmentColour = { name: string; hex: string };
export type ShopSize = { label: string; inStock: boolean };

export type ShopProduct = {
  id: string;
  name: string;
  description: string;
  category: ShopCategory;
  art: GarmentVariant;
  price: number;
  oldPrice?: number;
  palette: GarmentColour[];
  sizes: ShopSize[];
  rating: number;
  reviews: number;
  badge?: "new" | "last";
  inStock: boolean;
};

export type ShopLook = {
  id: string;
  title: string;
  subtitle: string;
  items: string[];
  scene: "layered" | "stack" | "tray";
};

export const FREE_SHIPPING = 3_000_000;
export const SHIPPING_COST = 120_000;
export const COUPON_CODE = "MANO10";
export const COUPON_PERCENT = 10;

/** Anchors used by the storefront header, so labels live with the sections. */
export const SHOP_NAV = [
  { href: "#shop-collection", label: "کالکشن" },
  { href: "#shop-lookbook", label: "استایل‌ها" },
  { href: "#shop-guide", label: "راهنمای سایز" },
  { href: "#shop-bag", label: "سبد خرید" },
  { href: "#shop-faq", label: "پرسش‌ها" },
] as const;

export const SHOP_CATEGORIES: {
  value: "all" | ShopCategory;
  label: string;
  caption: string;
}[] = [
  { value: "all", label: "همه", caption: "تمام کالکشن" },
  { value: "women", label: "زنانه", caption: "برش‌های روان" },
  { value: "men", label: "مردانه", caption: "پارچه‌های مقاوم" },
  { value: "accessories", label: "اکسسوری", caption: "جزئیات آخر" },
];

export const SHOP_PRODUCTS: ShopProduct[] = [
  {
    id: "coat",
    name: "پالتو اورسایز بژ",
    description: "پشم مرینوس، آستر ساتن و برش اورسایز با کمربند پارچه‌ای",
    category: "women",
    art: "coat",
    price: 2450000,
    oldPrice: 3100000,
    palette: [
      { name: "شنی", hex: "#d6c7b0" },
      { name: "زغالی", hex: "#4b5563" },
      { name: "زیتونی", hex: "#6b7a5a" },
    ],
    sizes: [
      { label: "S", inStock: true },
      { label: "M", inStock: true },
      { label: "L", inStock: true },
      { label: "XL", inStock: false },
    ],
    rating: 4.9,
    reviews: 128,
    badge: "new",
    inStock: true,
  },
  {
    id: "shirt",
    name: "پیراهن کتان آبی",
    description: "کتان نرم با دکمهٔ صدفی و برش آزاد؛ مناسب لایه‌بندی",
    category: "women",
    art: "shirt",
    price: 890000,
    palette: [
      { name: "آبی یخی", hex: "#9cc3e5" },
      { name: "سفید", hex: "#f4f1ea" },
      { name: "رز", hex: "#d8a7a7" },
    ],
    sizes: [
      { label: "S", inStock: true },
      { label: "M", inStock: true },
      { label: "L", inStock: true },
      { label: "XL", inStock: true },
    ],
    rating: 4.7,
    reviews: 214,
    inStock: true,
  },
  {
    id: "knit",
    name: "بافت یقه‌اسکی کرم",
    description: "بافت درشت با یقهٔ برگردان و مچ کشباف",
    category: "women",
    art: "knit",
    price: 1150000,
    oldPrice: 1390000,
    palette: [
      { name: "کرم", hex: "#e6d8c3" },
      { name: "قهوه‌ای", hex: "#6b4f3a" },
      { name: "سبز جنگلی", hex: "#3f5f52" },
    ],
    sizes: [
      { label: "S", inStock: true },
      { label: "M", inStock: true },
      { label: "L", inStock: false },
    ],
    rating: 4.8,
    reviews: 96,
    inStock: true,
  },
  {
    id: "cargo",
    name: "شلوار کارگو مشکی",
    description: "پارچهٔ کش با شش جیب کاربردی و بند تنظیم کمر",
    category: "men",
    art: "cargo",
    price: 1180000,
    oldPrice: 1480000,
    palette: [
      { name: "مشکی", hex: "#2c2f33" },
      { name: "خاکی", hex: "#a89a7c" },
      { name: "سرمه‌ای", hex: "#3b4a5a" },
    ],
    sizes: [
      { label: "۳۰", inStock: true },
      { label: "۳۲", inStock: true },
      { label: "۳۴", inStock: true },
      { label: "۳۶", inStock: false },
    ],
    rating: 4.6,
    reviews: 173,
    inStock: true,
  },
  {
    id: "hoodie",
    name: "هودی قهوه‌ای",
    description: "پنبهٔ ضخیم با کلاه دو لایه و جیب کانگورویی",
    category: "men",
    art: "hoodie",
    price: 1350000,
    palette: [
      { name: "قهوه‌ای", hex: "#6b4f3a" },
      { name: "طوسی", hex: "#b9bec4" },
      { name: "خردلی", hex: "#c9a227" },
    ],
    sizes: [
      { label: "M", inStock: true },
      { label: "L", inStock: true },
      { label: "XL", inStock: true },
    ],
    rating: 4.8,
    reviews: 302,
    badge: "last",
    inStock: true,
  },
  {
    id: "dress",
    name: "پیراهن ساتن شرابی",
    description: "ساتن مات با برش مورب و درز کمر؛ مناسب مهمانی",
    category: "women",
    art: "dress",
    price: 1950000,
    palette: [
      { name: "شرابی", hex: "#7d2f45" },
      { name: "مشکی", hex: "#232323" },
      { name: "سبز تیره", hex: "#2f4a3e" },
    ],
    sizes: [
      { label: "S", inStock: true },
      { label: "M", inStock: true },
      { label: "L", inStock: true },
    ],
    rating: 4.9,
    reviews: 64,
    badge: "new",
    inStock: true,
  },
  {
    id: "tote",
    name: "کیف چرمی دستی",
    description: "چرم طبیعی با آستر پارچه‌ای و بند قابل تنظیم",
    category: "accessories",
    art: "tote",
    price: 1950000,
    oldPrice: 2300000,
    palette: [
      { name: "عسلی", hex: "#a9744f" },
      { name: "مشکی", hex: "#2b2b2b" },
      { name: "کرم", hex: "#d9c9b3" },
    ],
    sizes: [{ label: "تک سایز", inStock: true }],
    rating: 4.7,
    reviews: 51,
    inStock: false,
  },
  {
    id: "watch",
    name: "ساعت مینیمال",
    description: "بند چرمی، صفحهٔ مات و ضدآب روزمره",
    category: "accessories",
    art: "watch",
    price: 2100000,
    palette: [
      { name: "بند مشکی", hex: "#2b2b2b" },
      { name: "بند قهوه‌ای", hex: "#6d4c33" },
      { name: "بند سبز", hex: "#3d5044" },
    ],
    sizes: [{ label: "تک سایز", inStock: true }],
    rating: 4.8,
    reviews: 88,
    inStock: true,
  },
];


export const SHOP_LOOKS: ShopLook[] = [
  {
    id: "office",
    title: "استایل اداری",
    subtitle: "پالتو + پیراهن کتان + ساعت مینیمال",
    items: ["coat", "shirt", "watch"],
    scene: "layered",
  },
  {
    id: "weekend",
    title: "آخر هفته",
    subtitle: "هودی + کارگو + کیف چرمی",
    items: ["hoodie", "cargo", "tote"],
    scene: "stack",
  },
  {
    id: "gallery",
    title: "گالری و مهمانی",
    subtitle: "پیراهن کتان + بافت + ساعت",
    items: ["shirt", "knit", "watch"],
    scene: "tray",
  },
];

/** Headline facts. The storefront never repeats these numbers by hand. */
export const SHOP_STATS = {
  rating: 4.8,
  reviews: 341,
  pieces: SHOP_PRODUCTS.length,
  deliveryHours: 24,
  exchangeDays: 7,
  madeIn: "تهران",
} as const;

export const SHOP_SERVICES: {
  art: "truck" | "return" | "sew" | "shield";
  title: string;
  body: string;
}[] = [
  {
    art: "truck",
    title: "ارسال سریع",
    body: "تهران ۲۴ ساعته و شهرستان‌ها ۲ تا ۴ روز کاری",
  },
  {
    art: "return",
    title: "بازگشت ۷ روزه",
    body: "تعویض سایز بدون هزینه، فقط با یک تماس",
  },
  {
    art: "sew",
    title: "دوخت محدود",
    body: "هر سری در تهران و در تعداد کم دوخته می‌شود",
  },
  {
    art: "shield",
    title: "پرداخت امن",
    body: "درگاه بانکی و پرداخت در محل برای شهر تهران",
  },
];

/** Size chart shown by the measuring-tape guide. */
export const SHOP_SIZE_TABLE: {
  size: string;
  chest: string;
  length: string;
  sleeve: string;
  fit: string;
}[] = [
  { size: "S", chest: "۹۶", length: "۶۸", sleeve: "۵۸", fit: "جذب" },
  { size: "M", chest: "۱۰۲", length: "۷۰", sleeve: "۵۹", fit: "معمولی" },
  { size: "L", chest: "۱۰۸", length: "۷۲", sleeve: "۶۰", fit: "راحت" },
  { size: "XL", chest: "۱۱۴", length: "۷۴", sleeve: "۶۱", fit: "اورسایز" },
];

/** Order states printed on the confirmation panel. */
export const SHOP_TRACKING: {
  title: string;
  description: string;
  meta: string;
  tone: "success" | "primary" | "muted";
}[] = [
  {
    title: "سفارش ثبت شد",
    description: "کد پیگیری برای شما پیامک شد.",
    meta: "امروز · ۱۰:۲۴",
    tone: "success",
  },
  {
    title: "در حال آماده‌سازی",
    description: "بسته‌بندی و بازرسی نهایی در کارگاه تهران.",
    meta: "امروز · ۱۴:۰۰",
    tone: "primary",
  },
  {
    title: "تحویل به پست",
    description: "پست پیشتاز، تحویل ۲۴ تا ۷۲ ساعت کاری.",
    meta: "فردا",
    tone: "muted",
  },
  {
    title: "تحویل به شما",
    description: "تعویض سایز تا ۷ روز پس از تحویل.",
    meta: "۲ روز بعد",
    tone: "muted",
  },
];

/** Rating distribution for the aggregate review panel. */
export const SHOP_REVIEW_STATS = {
  average: 4.8,
  total: 341,
  buckets: [
    { stars: 5, count: 268 },
    { stars: 4, count: 51 },
    { stars: 3, count: 14 },
    { stars: 2, count: 6 },
    { stars: 1, count: 2 },
  ],
} as const;

export const SHOP_REVIEWS = [
  {
    name: "مهسا رحیمی",
    city: "تهران",
    rating: 5,
    text: "پالتو دقیقاً همان رنگ کاتالوگ بود. جنس پشم واقعاً گرم است و برش اورسایز با شلوار اداری هم می‌نشیند.",
    portrait: 0,
  },
  {
    name: "کیوان صادقی",
    city: "اصفهان",
    rating: 5,
    text: "کارگو را برای سفر گرفتم؛ جیب‌ها عمیق‌اند و پارچه بعد از شست‌وشو فرمش را از دست نداد.",
    portrait: 1,
  },
  {
    name: "نگار موسوی",
    city: "شیراز",
    rating: 4,
    text: "بافت یقه‌اسکی نرم و بدون خارش است. یک سایز بزرگ‌تر بگیرید اگر اورسایز دوست دارید.",
    portrait: 2,
  },
];

export const SHOP_FAQ = [
  {
    value: "shipping",
    question: "ارسال چطور انجام می‌شود؟",
    answer:
      "ارسال تهران ۲۴ ساعته و شهرستان‌ها ۲ تا ۴ روز کاری است. برای خرید بالای ۳٬۰۰۰٬۰۰۰ تومان ارسال رایگان می‌شود.",
  },
  {
    value: "size",
    question: "اگر سایز مناسب نبود چه کنم؟",
    answer:
      "تا ۷ روز پس از تحویل، امکان تعویض سایز بدون هزینه وجود دارد؛ کافی است بستهٔ سالم را با پست برگشتی بفرستید.",
  },
  {
    value: "fabric",
    question: "پارچه‌ها را چطور بشویم؟",
    answer:
      "همهٔ کالاها با شست‌وشوی ملایم و آب سرد قابل شست‌وشو هستند. برای پشم و ساتن، خشک‌شویی توصیه می‌شود.",
  },
  {
    value: "payment",
    question: "روش‌های پرداخت کدام‌اند؟",
    answer:
      "پرداخت آنلاین با تمام کارت‌های شتاب و همچنین پرداخت در محل برای شهر تهران فعال است.",
  },
];


/**
 * Filter bounds derived from the catalogue itself, so the price slider can
 * never drift away from the products it filters. Both ends are rounded to
 * 100 000 Toman for a tidy step.
 */
const PRICE_STEP = 100_000;
export const PRICE_FLOOR =
  Math.floor(Math.min(...SHOP_PRODUCTS.map((p) => p.price)) / PRICE_STEP) *
  PRICE_STEP;
export const PRICE_CEILING =
  Math.ceil(Math.max(...SHOP_PRODUCTS.map((p) => p.price)) / PRICE_STEP) *
  PRICE_STEP;

