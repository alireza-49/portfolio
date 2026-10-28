"use client";

import {
  useMemo,
  useState,
  type ComponentProps,
  type CSSProperties,
  type FormEvent,
} from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Alert,
  Badge,
  Button,
  Icon,
  Input,
  Progress,
  buttonVariants,
  headingType,
  monoType,
} from "@/components/create-components";
import { cn } from "@/lib/utils";
import {
  CategoryTileArt,
  LookbookScene,
  ServiceArt,
  ShopPattern,
  ShopfrontScene,
} from "./art/shop-art";
import { Portrait } from "./art/portraits";
import { Ornament, StarRating } from "./art/shared";
import {
  COUPON_CODE,
  COUPON_PERCENT,
  FREE_SHIPPING,
  SHIPPING_COST,
  SHOP_CATEGORIES,
  SHOP_FAQ,
  SHOP_LOOKS,
  SHOP_NAV,
  SHOP_PRODUCTS,
  SHOP_REVIEW_STATS,
  SHOP_REVIEWS,
  SHOP_SERVICES,
  SHOP_STATS,
} from "./data/shop";
import { formatNumber, formatToman } from "./format";
import { Bump, Collapse, Lift, Reveal, Swap } from "./motion-primitives";
import { sc as styles } from "./scenes";
import { ShopBag, type BagLine, type BagTotals } from "./shop/bag";
import {
  DEFAULT_FILTERS,
  ShopCatalog,
  type ShopFilters,
} from "./shop/catalog";
import { SectionHeading } from "./shop/section-heading";
import { HeroOffer } from "./shop/hero-offer";
import { ShopSizeGuide } from "./shop/size-guide";

const BY_ID = new Map(SHOP_PRODUCTS.map((product) => [product.id, product]));

const ANNOUNCEMENTS = [
  `ارسال رایگان بالای ${formatToman(FREE_SHIPPING)}`,
  `تعویض سایز تا ${formatNumber(SHOP_STATS.exchangeDays)} روز`,
  `دوخت محدود در ${SHOP_STATS.madeIn}`,
  `ارسال تهران ${formatNumber(SHOP_STATS.deliveryHours)} ساعته`,
  "پرداخت در محل برای تهران",
];

const PANEL = [
  "rounded-[var(--cc-card-radius)] border-[length:var(--cc-border-width)] border-[color:var(--cc-border)]",
  "bg-[var(--cc-surface)] [background-image:var(--cc-surface-pattern)]",
  "[background-size:var(--cc-surface-pattern-size)] [box-shadow:var(--cc-shadow)]",
].join(" ");

/** A floating HTML chip over the hero illustration. */
function HeroChip({
  icon,
  label,
  tone,
  className,
  delay,
}: {
  icon: ComponentProps<typeof Icon>["name"];
  label: string;
  tone: "success" | "brand";
  className?: string;
  delay: string;
}) {
  return (
    <div
      className={cn(
        "absolute flex items-center gap-1.5 rounded-[var(--cc-radius-sm)] border-[length:var(--cc-border-width)] border-[color:var(--cc-border)] bg-[var(--cc-surface)] px-2 py-1 text-[0.6875rem] font-bold text-[color:var(--cc-surface-foreground)] [box-shadow:var(--cc-shadow)]",
        styles.floatChip,
        className,
      )}
      style={{ "--sc-delay": delay } as CSSProperties}
    >
      <Icon
        name={icon}
        className={cn(
          "size-3.5",
          tone === "success"
            ? "text-[color:var(--cc-success)]"
            : "text-[color:var(--cc-primary)]",
        )}
      />
      {label}
    </div>
  );
}

type CartLine = { qty: number; color: string; size: string };

export function ClothingShopView() {
  const [filters, setFilters] = useState<ShopFilters>(DEFAULT_FILTERS);
  const [liked, setLiked] = useState<string[]>(["coat", "dress"]);
  const [cart, setCart] = useState<Record<string, CartLine>>({
    shirt: { qty: 1, color: "#9cc3e5", size: "M" },
    cargo: { qty: 1, color: "#2c2f33", size: "۳۲" },
  });
  const [coupon, setCoupon] = useState("");
  const [couponState, setCouponState] = useState<"idle" | "applied" | "error">(
    "idle",
  );
  const [checkoutDone, setCheckoutDone] = useState(false);
  const [newsletterSent, setNewsletterSent] = useState(false);
  const [heroColor, setHeroColor] = useState(
    (BY_ID.get("coat") ?? SHOP_PRODUCTS[0]).palette[0].hex,
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const [reviewIndex, setReviewIndex] = useState(0);

  const patchFilters = (patch: Partial<ShopFilters>) =>
    setFilters((previous) => ({ ...previous, ...patch }));
  const resetFilters = () => setFilters(DEFAULT_FILTERS);

  const visibleProducts = useMemo(() => {
    const needle = filters.query.trim().toLowerCase();
    const result = SHOP_PRODUCTS.filter((product) => {
      const haystack = [
        product.name,
        product.description,
        ...product.palette.map((entry) => entry.name),
      ]
        .join(" ")
        .toLowerCase();

      return (
        (filters.category === "all" || product.category === filters.category) &&
        product.price <= filters.maxPrice &&
        (filters.size === "all" ||
          product.sizes.some(
            (entry) => entry.label === filters.size && entry.inStock,
          )) &&
        (filters.colour === "all" ||
          product.palette.some((entry) => entry.hex === filters.colour)) &&
        (!filters.inStockOnly || product.inStock) &&
        (!filters.discountOnly || Boolean(product.oldPrice)) &&
        (!filters.wishlistOnly || liked.includes(product.id)) &&
        (!needle || haystack.includes(needle))
      );
    });

    if (filters.sort === "price-asc")
      return result.sort((a, b) => a.price - b.price);
    if (filters.sort === "price-desc")
      return result.sort((a, b) => b.price - a.price);
    if (filters.sort === "rating")
      return result.sort((a, b) => b.rating - a.rating);
    return result;
  }, [filters, liked]);

  const lines: BagLine[] = Object.entries(cart).flatMap(([id, line]) => {
    const product = BY_ID.get(id);
    return product ? [{ product, ...line }] : [];
  });

  const count = lines.reduce((sum, line) => sum + line.qty, 0);
  const subtotal = lines.reduce(
    (sum, line) => sum + line.product.price * line.qty,
    0,
  );
  const discount =
    couponState === "applied"
      ? Math.round((subtotal * COUPON_PERCENT) / 100)
      : 0;
  const shipping =
    subtotal === 0 || subtotal >= FREE_SHIPPING ? 0 : SHIPPING_COST;

  const totals: BagTotals = {
    count,
    subtotal,
    discount,
    shipping,
    total: Math.max(0, subtotal - discount + shipping),
    remaining: Math.max(0, FREE_SHIPPING - subtotal),
    percent: Math.min(100, Math.round((subtotal / FREE_SHIPPING) * 100)),
  };

  const featured = BY_ID.get("coat") ?? SHOP_PRODUCTS[0];

  const toggleLiked = (id: string) =>
    setLiked((previous) =>
      previous.includes(id)
        ? previous.filter((entry) => entry !== id)
        : [...previous, id],
    );

  const addToCart = (id: string, color: string, size: string) => {
    setCart((previous) => {
      const line = previous[id];
      return {
        ...previous,
        [id]: line
          ? { ...line, qty: line.qty + 1, color, size }
          : { qty: 1, color, size },
      };
    });
    setCheckoutDone(false);
  };

  const changeQty = (id: string, delta: number) =>
    setCart((previous) => {
      const line = previous[id];
      if (!line) return previous;
      const qty = line.qty + delta;
      const next = { ...previous };
      if (qty <= 0) delete next[id];
      else next[id] = { ...line, qty };
      return next;
    });

  const addLook = (items: string[]) => {
    setCart((previous) => {
      const next = { ...previous };
      items.forEach((id) => {
        const product = BY_ID.get(id);
        if (!product || !product.inStock) return;
        const available =
          product.sizes.find((entry) => entry.inStock) ?? product.sizes[0];
        next[id] = {
          qty: (next[id]?.qty ?? 0) + 1,
          color: product.palette[0].hex,
          size: available.label,
        };
      });
      return next;
    });
    setCheckoutDone(false);
  };

  const applyCoupon = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCouponState(
      coupon.trim().toUpperCase() === COUPON_CODE ? "applied" : "error",
    );
  };

  /** Header search: jump to the catalogue and focus its single input. */
  const focusSearch = () => {
    const input = document.getElementById("shop-search");
    input?.scrollIntoView({ behavior: "smooth", block: "center" });
    input?.focus({ preventScroll: true });
  };

  /** Category tiles set the filter and then walk the eye to the grid. */
  const pickCategory = (value: string) => {
    patchFilters({ category: value, wishlistOnly: false });
    document
      .getElementById("shop-collection")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const moveReview = (direction: 1 | -1) =>
    setReviewIndex(
      (previous) =>
        (previous + direction + SHOP_REVIEWS.length) % SHOP_REVIEWS.length,
    );

  const review = SHOP_REVIEWS[reviewIndex];

  return (
    <div className='@container flex flex-col gap-6'>
      {/* 1 — Announcement strip: a marquee, not a card. */}
      <div className='overflow-hidden rounded-[var(--cc-radius)] border-[length:var(--cc-border-width)] border-[color:var(--cc-border)] bg-[var(--cc-primary)] text-[color:var(--cc-primary-foreground)]'>
        <div className={cn(styles.ticker, "py-1.5")}>
          <div
            className={styles.tickerTrack}
            style={{ "--sc-duration": "36s" } as CSSProperties}
          >
            {[...ANNOUNCEMENTS, ...ANNOUNCEMENTS].map((item, index) => (
              <span
                key={`${item}-${index}`}
                className='flex items-center gap-2 px-4 text-[0.6875rem] font-bold whitespace-nowrap'
              >
                <Icon name='sparkles' className='size-3 opacity-70' />
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 2 — Header: navigation, not a panel. */}
      <header className={cn(PANEL, "flex flex-col gap-2 px-3 py-2")}>
        <div className='flex flex-wrap items-center gap-2'>
          <a href='#shop-hero' className='flex items-center gap-2.5'>
            <span className='flex size-9 items-center justify-center rounded-[var(--cc-radius)] bg-[var(--cc-primary)] text-[color:var(--cc-primary-foreground)]'>
              <Icon name='brand' className='size-5' />
            </span>
            <span className='flex flex-col'>
              <span className='text-sm font-bold text-[color:var(--cc-surface-foreground)]'>
                مانو | پوشاک روزمره
              </span>
              <span className='text-[0.6875rem] text-[color:var(--cc-muted-foreground)]'>
                کالکشن پاییز ۱۴۰۴ · {SHOP_STATS.madeIn}
              </span>
            </span>
          </a>

          <nav
            aria-label='بخش‌های صفحه'
            className='hidden items-center gap-0.5 @4xl:flex'
          >
            {SHOP_NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className='rounded-[var(--cc-radius-sm)] px-2.5 py-1.5 text-[length:calc(var(--cc-font-size)*0.86)] text-[color:var(--cc-surface-foreground)] transition-colors hover:bg-[var(--cc-muted)]'
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className='ms-auto flex items-center gap-2.5'>
            <Button
              size='icon'
              variant='ghost'
              aria-label='جستجو در کالکشن'
              onClick={focusSearch}
            >
              <Icon name='search' className='size-4' />
            </Button>

            <div className='relative'>
              <Button
                size='icon'
                variant={filters.wishlistOnly ? "solid" : "outline"}
                aria-label='نمایش علاقه‌مندی‌ها'
                aria-pressed={filters.wishlistOnly}
                onClick={() =>
                  patchFilters({ wishlistOnly: !filters.wishlistOnly })
                }
              >
                <Icon
                  name='heart'
                  className={cn(
                    "size-4",
                    filters.wishlistOnly && "fill-current",
                  )}
                />
              </Button>
              <Badge
                variant='solid'
                className='pointer-events-none absolute -end-1 -top-1 min-w-4 justify-center px-1 py-0'
              >
                <Bump trigger={liked.length}>{formatNumber(liked.length)}</Bump>
              </Badge>
            </div>

            <a
              href='#shop-bag'
              aria-label='رفتن به سبد خرید'
              className={cn(
                "relative",
                buttonVariants({ size: "icon", variant: "solid" }),
              )}
            >
              <Icon name='shopping-bag' className='size-4' />
              <Badge
                variant='warning'
                className='pointer-events-none absolute -end-1 -top-1 min-w-4 justify-center px-1 py-0'
              >
                <Bump trigger={count}>{formatNumber(count)}</Bump>
              </Badge>
            </a>

            <Button
              size='icon'
              variant='outline'
              className='@4xl:hidden'
              aria-label={menuOpen ? "بستن منو" : "باز کردن منو"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <Icon
                name={menuOpen ? "close" : "menu"}
                className='size-4'
              />
            </Button>
          </div>
        </div>

        <div className='@4xl:hidden'>
          <Collapse open={menuOpen}>
            <nav
              aria-label='بخش‌های صفحه'
              className='grid grid-cols-2 gap-1 pb-1 @xl:grid-cols-3'
            >
              {SHOP_NAV.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "justify-start",
                  )}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </Collapse>
        </div>
      </header>

      {/* 3 — Hero: copy on one side, the animated boutique window on the other. */}
      <Reveal>
        <section
          id='shop-hero'
          aria-labelledby='shop-hero-title'
          className={cn(PANEL, "relative overflow-hidden p-0")}
        >
          <div className='grid @3xl:grid-cols-[1.05fr_0.95fr] @3xl:items-stretch'>
            <div className='flex flex-col justify-center gap-3 p-5 @2xl:p-6'>
              <Badge variant='accent' className='self-start'>
                کالکشن پاییز ۱۴۰۴
              </Badge>

              <h2
                id='shop-hero-title'
                className={cn(
                  "text-2xl leading-tight text-[color:var(--cc-surface-foreground)] @2xl:text-4xl",
                  headingType,
                )}
              >
                لایه‌های ساده،
                <br />
                برای{" "}
                <span className='underline decoration-[color:var(--cc-primary)] decoration-[3px] underline-offset-[0.28em]'>
                  روزهای شلوغ
                </span>
              </h2>

              <p className='max-w-md text-[length:calc(var(--cc-font-size)*0.88)] leading-relaxed text-[color:var(--cc-muted-foreground)]'>
                پارچه‌های طبیعی، برش راحت و رنگ‌های هماهنگ؛ از پالتو اورسایز تا
                کیف چرمی محدود.
              </p>

              <div className='flex flex-wrap items-center gap-2 pt-0.5'>
                <Lift>
                  <a
                    href='#shop-collection'
                    className={buttonVariants({ size: "lg" })}
                  >
                    <Icon name='shopping-bag' className='size-4' />
                    خرید کالکشن
                  </a>
                </Lift>
                <a
                  href='#shop-guide'
                  className={buttonVariants({ size: "lg", variant: "outline" })}
                >
                  راهنمای سایز
                </a>
              </div>

              <div className='flex flex-wrap items-center gap-x-2.5 gap-y-1 border-t-[length:var(--cc-border-width)] border-[color:var(--cc-border)] pt-2.5'>
                <StarRating value={SHOP_STATS.rating} />
                <span
                  className={cn(
                    "text-[0.6875rem] font-bold text-[color:var(--cc-surface-foreground)]",
                    monoType,
                  )}
                >
                  {formatNumber(SHOP_STATS.rating)} از {formatNumber(5)}
                </span>
                <span
                  aria-hidden='true'
                  className='text-[0.6875rem] text-[color:var(--cc-muted-foreground)]'
                >
                  ·
                </span>
                <span className='text-[0.6875rem] text-[color:var(--cc-muted-foreground)]'>
                  {formatNumber(SHOP_STATS.reviews)} نظر
                </span>
                <span
                  aria-hidden='true'
                  className='text-[0.6875rem] text-[color:var(--cc-muted-foreground)]'
                >
                  ·
                </span>
                <span className='flex items-center gap-1 text-[0.6875rem] text-[color:var(--cc-surface-foreground)]'>
                  <Icon
                    name='truck'
                    className='size-3.5 text-[color:var(--cc-primary)]'
                  />
                  ارسال {formatNumber(SHOP_STATS.deliveryHours)} ساعته تهران
                </span>
              </div>
            </div>

            <div className='relative order-first flex flex-col border-b-[length:var(--cc-border-width)] border-[color:var(--cc-border)] bg-[var(--cc-background)] @3xl:order-none @3xl:border-b-0 @3xl:border-s'>
              <div className='relative mx-auto aspect-[7/6] w-full max-w-md overflow-hidden @3xl:mx-0 @3xl:aspect-auto @3xl:h-[clamp(22.5rem,44vh,29.375rem)] @3xl:max-w-none'>
                <ShopfrontScene className='absolute inset-0 size-full' />

                <HeroChip
                  icon='truck'
                  label='ارسال ۲۴ ساعته'
                  tone='success'
                  className='start-3 top-3'
                  delay='-1.2s'
                />
                <HeroChip
                  icon='users'
                  label='۷ نفر همین حالا خریدند'
                  tone='brand'
                  className='end-3 top-3 hidden @2xl:flex'
                  delay='-3.6s'
                />
              </div>

              <HeroOffer
                product={featured}
                color={heroColor}
                onColorChange={setHeroColor}
                onAdd={() =>
                  addToCart(
                    featured.id,
                    heroColor,
                    featured.sizes.find((entry) => entry.inStock)?.label ??
                      featured.sizes[0].label,
                  )
                }
                className='mt-3 w-[calc(100%-1.5rem)] max-w-xs self-center @3xl:absolute @3xl:end-3 @3xl:bottom-3 @3xl:mt-0 @3xl:w-60'
              />
            </div>
          </div>
        </section>
      </Reveal>

      {/* 4 — Trust strip: a full-bleed band, the only home for these promises. */}
      <Reveal>
        <section
          aria-labelledby='shop-services-title'
          className='-mx-5 bg-[var(--cc-muted)] px-5 py-4 sm:-mx-7 sm:px-7'
        >
          <h3 id='shop-services-title' className='sr-only'>
            خدمات فروشگاه
          </h3>
          <div className='grid gap-3 @xl:grid-cols-2 @4xl:grid-cols-4'>
            {SHOP_SERVICES.map((service) => (
              <div key={service.title} className='flex items-center gap-2.5'>
                <ServiceArt
                  variant={service.art}
                  className='h-14 w-24 shrink-0 rounded-[var(--cc-radius-sm)] border-[length:var(--cc-border-width)] border-[color:var(--cc-border)]'
                />
                <div className='flex min-w-0 flex-col'>
                  <span className='text-[length:calc(var(--cc-font-size)*0.9)] font-bold text-[color:var(--cc-surface-foreground)]'>
                    {service.title}
                  </span>
                  <span className='text-[0.6875rem] leading-relaxed text-[color:var(--cc-muted-foreground)]'>
                    {service.body}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* 5 — Category rail. */}
      <Reveal>
        <section
          aria-labelledby='shop-categories-title'
          className='flex flex-col gap-3'
        >
          <SectionHeading
            id='shop-categories-title'
            eyebrow='دسته‌بندی'
            title='از کجا شروع کنیم؟'
            description='سه خط اصلی کالکشن؛ روی هر کدام بزنی فیلتر همان دسته در ویترین اعمال می‌شود.'
            trailing={
              <Button
                variant='ghost'
                size='sm'
                onClick={() => pickCategory("all")}
              >
                همهٔ قطعه‌ها
                <Icon name='arrow-left' className='size-3.5' />
              </Button>
            }
          />

          <div className='grid gap-3 @xl:grid-cols-3'>
            {SHOP_CATEGORIES.filter((entry) => entry.value !== "all").map(
              (entry) => (
                <button
                  key={entry.value}
                  type='button'
                  onClick={() => pickCategory(entry.value)}
                  aria-label={`نمایش ${entry.label}`}
                  className='group relative flex flex-col overflow-hidden rounded-[var(--cc-card-radius)] border-[length:var(--cc-border-width)] border-[color:var(--cc-border)] bg-[var(--cc-surface)] text-start transition-transform hover:-translate-y-0.5 [box-shadow:var(--cc-shadow)]'
                >
                  <span className='relative block h-28 overflow-hidden border-b-[length:var(--cc-border-width)] border-[color:var(--cc-border)] bg-[var(--cc-muted)]'>
                    <CategoryTileArt
                      category={
                        entry.value as "women" | "men" | "accessories"
                      }
                      className='size-full transition-transform duration-500 group-hover:scale-[1.04]'
                    />
                    <span className='pointer-events-none absolute inset-0 overflow-hidden opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
                      <span
                        aria-hidden='true'
                        className={cn(
                          styles.shimmer,
                          "absolute inset-y-0 -start-1/3 w-1/3 bg-[var(--cc-surface)]",
                        )}
                      />
                    </span>
                  </span>
                  <span className='flex items-center justify-between gap-2 px-3 py-2'>
                    <span className='flex flex-col'>
                      <span className='text-[length:calc(var(--cc-font-size)*0.95)] font-bold text-[color:var(--cc-surface-foreground)]'>
                        {entry.label}
                      </span>
                      <span className='text-[0.6875rem] text-[color:var(--cc-muted-foreground)]'>
                        {entry.caption}
                      </span>
                    </span>
                    <Icon
                      name='arrow-left'
                      className='size-4 shrink-0 text-[color:var(--cc-primary)] transition-transform group-hover:-translate-x-0.5'
                    />
                  </span>
                </button>
              ),
            )}
          </div>
        </section>
      </Reveal>

      {/* 6 — Collection: toolbar, filter rail and the product grid. */}
      <Reveal>
        <ShopCatalog
          filters={filters}
          patchFilters={patchFilters}
          resetFilters={resetFilters}
          visibleProducts={visibleProducts}
          liked={liked}
          onToggleLike={toggleLiked}
          onAdd={addToCart}
        />
      </Reveal>

      {/* 7 — Lookbook: ready-made outfits, priced as a set. */}
      <Reveal>
        <section
          id='shop-lookbook'
          aria-labelledby='shop-lookbook-title'
          className='flex flex-col gap-3'
        >
          <SectionHeading
            id='shop-lookbook-title'
            eyebrow='دفترچهٔ استایل'
            title='سه قطعه، یک ظاهر کامل'
            description='ترکیب‌های آمادهٔ تیم استایل؛ با یک کلیک همهٔ قطعه‌ها به سبد اضافه می‌شوند.'
            trailing={<Ornament />}
          />

          <div className='grid gap-3 @xl:grid-cols-2 @4xl:grid-cols-3'>
            {SHOP_LOOKS.map((look) => {
              const lookProducts = look.items.flatMap((id) => {
                const product = BY_ID.get(id);
                return product ? [product] : [];
              });
              const total = lookProducts.reduce(
                (sum, product) => sum + product.price,
                0,
              );

              return (
                <Lift key={look.id} className='h-full'>
                  <div
                    className={cn(
                      PANEL,
                      "flex h-full flex-col overflow-hidden p-0",
                    )}
                  >
                    <LookbookScene
                      scene={look.scene}
                      colors={lookProducts.map(
                        (product) => product.palette[0].hex,
                      )}
                      className='h-40 w-full border-b-[length:var(--cc-border-width)] border-[color:var(--cc-border)]'
                    />
                    <div className='flex flex-1 flex-col gap-1.5 p-3'>
                      <span className='text-sm font-bold text-[color:var(--cc-surface-foreground)]'>
                        {look.title}
                      </span>
                      <span className='text-[0.6875rem] text-[color:var(--cc-muted-foreground)]'>
                        {look.subtitle}
                      </span>
                      <div className='flex flex-wrap gap-1'>
                        {lookProducts.map((product) => (
                          <Badge key={product.id} variant='outline'>
                            {product.name}
                          </Badge>
                        ))}
                      </div>
                      <div className='mt-auto flex items-center justify-between gap-2 pt-1.5'>
                        <span
                          className={cn(
                            "text-xs font-bold text-[color:var(--cc-surface-foreground)]",
                            monoType,
                          )}
                        >
                          {formatToman(total)}
                        </span>
                        <Button
                          size='sm'
                          variant='outline'
                          onClick={() => addLook(look.items)}
                        >
                          <Icon name='plus' className='size-3.5' />
                          افزودن کل استایل
                        </Button>
                      </div>
                    </div>
                  </div>
                </Lift>
              );
            })}
          </div>
        </section>
      </Reveal>

      {/* 8 — Bag and checkout summary. */}
      <Reveal>
        <ShopBag
          lines={lines}
          totals={totals}
          coupon={coupon}
          couponState={couponState}
          checkoutDone={checkoutDone}
          onCouponChange={(value) => {
            setCoupon(value);
            if (couponState === "error") setCouponState("idle");
          }}
          onApplyCoupon={applyCoupon}
          onChangeQty={changeQty}
          onClearCart={() => setCart({})}
          onCheckout={() => setCheckoutDone(true)}
        />
      </Reveal>

      {/* 9 — Size guide. */}
      <Reveal>
        <ShopSizeGuide />
      </Reveal>

      {/* 10 — Reviews: the aggregate next to one story at a time. */}
      <Reveal>
        <section
          id='shop-reviews'
          aria-labelledby='shop-reviews-title'
          className='flex flex-col gap-3'
        >
          <SectionHeading
            id='shop-reviews-title'
            eyebrow='تجربهٔ خریداران'
            title='چی می‌گویند؟'
            description='فقط نظرهایی که خرید تأییدشده دارند؛ بدون ویرایش.'
            trailing={
              <Badge variant='success'>
                {formatNumber(SHOP_REVIEW_STATS.total)} نظر تأییدشده
              </Badge>
            }
          />

          <div className='grid gap-3 @3xl:grid-cols-[0.8fr_1.2fr]'>
            <div className={cn(PANEL, "flex flex-col gap-3 p-3")}>
              <div className='flex items-end gap-2'>
                <span
                  className={cn(
                    "text-3xl leading-none font-black text-[color:var(--cc-surface-foreground)]",
                    monoType,
                    headingType,
                  )}
                >
                  {formatNumber(SHOP_REVIEW_STATS.average)}
                </span>
                <div className='flex flex-col gap-0.5 pb-0.5'>
                  <StarRating value={SHOP_REVIEW_STATS.average} />
                  <span className='text-[0.6875rem] text-[color:var(--cc-muted-foreground)]'>
                    از {formatNumber(SHOP_REVIEW_STATS.total)} نظر
                  </span>
                </div>
              </div>

              <div className='flex flex-col gap-1.5'>
                {SHOP_REVIEW_STATS.buckets.map((bucket) => (
                  <div key={bucket.stars} className='flex items-center gap-2'>
                    <span
                      className={cn(
                        "w-4 text-[0.6875rem] text-[color:var(--cc-muted-foreground)]",
                        monoType,
                      )}
                    >
                      {formatNumber(bucket.stars)}
                    </span>
                    <Progress
                      value={bucket.count}
                      max={SHOP_REVIEW_STATS.total}
                      className='flex-1'
                    />
                    <span
                      className={cn(
                        "w-8 text-end text-[0.6875rem] text-[color:var(--cc-muted-foreground)]",
                        monoType,
                      )}
                    >
                      {formatNumber(bucket.count)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className={cn(PANEL, "flex flex-col gap-3 p-4")}>
              <Swap swapKey={reviewIndex}>
                <div className='flex flex-col gap-2'>
                  <div className='flex items-center gap-2'>
                    <Portrait
                      variant={review.portrait}
                      className='size-10 overflow-hidden rounded-full border-[length:var(--cc-border-width)] border-[color:var(--cc-border)]'
                    />
                    <div className='flex flex-col'>
                      <span className='text-sm font-bold text-[color:var(--cc-surface-foreground)]'>
                        {review.name}
                      </span>
                      <span className='text-[0.6875rem] text-[color:var(--cc-muted-foreground)]'>
                        {review.city} · خرید تأییدشده
                      </span>
                    </div>
                    <StarRating value={review.rating} className='ms-auto' />
                  </div>
                  <p className='text-[length:calc(var(--cc-font-size)*0.9)] leading-relaxed text-[color:var(--cc-surface-foreground)]'>
                    «{review.text}»
                  </p>
                </div>
              </Swap>

              <div className='mt-auto flex items-center justify-between gap-2 border-t-[length:var(--cc-border-width)] border-[color:var(--cc-border)] pt-2'>
                <span
                  className={cn(
                    "text-[0.6875rem] text-[color:var(--cc-muted-foreground)]",
                    monoType,
                  )}
                >
                  {formatNumber(reviewIndex + 1)} از{" "}
                  {formatNumber(SHOP_REVIEWS.length)}
                </span>
                <div className='flex items-center gap-1'>
                  <Button
                    size='icon'
                    variant='outline'
                    aria-label='نظر قبلی'
                    onClick={() => moveReview(-1)}
                  >
                    <Icon name='chevron-right' className='size-4' />
                  </Button>
                  <Button
                    size='icon'
                    variant='outline'
                    aria-label='نظر بعدی'
                    onClick={() => moveReview(1)}
                  >
                    <Icon name='chevron-left' className='size-4' />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* 11 — FAQ. */}
      <Reveal>
        <section
          id='shop-faq'
          aria-labelledby='shop-faq-title'
          className='flex flex-col gap-3'
        >
          <SectionHeading
            id='shop-faq-title'
            eyebrow='پرسش‌های پرتکرار'
            title='ارسال، تعویض و پرداخت'
            description='هر چیزی که پیش از خرید لازم است بدانی، بدون تماس تلفنی.'
            trailing={<Ornament />}
          />

          <div className={cn(PANEL, "p-1")}>
            <Accordion type='single' defaultValue={[SHOP_FAQ[0].value]}>
              {SHOP_FAQ.map((item) => (
                <AccordionItem key={item.value} value={item.value}>
                  <AccordionTrigger>{item.question}</AccordionTrigger>
                  <AccordionContent>{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      </Reveal>

      {/* 12 — Footer band: bleeds to the viewport edge. */}
      <footer className='-mx-5 -mb-5 sm:-mx-7 sm:-mb-7'>
        <div className='relative overflow-hidden border-t-[length:var(--cc-border-width)] border-[color:var(--cc-border)] bg-[var(--cc-muted)]'>
          <ShopPattern className='h-16 w-full' />

          <div className='relative grid gap-5 px-5 py-5 sm:px-7 @3xl:grid-cols-[1.05fr_0.95fr]'>
            <div className='flex flex-col gap-2'>
              <h3
                className={cn(
                  "text-lg text-[color:var(--cc-surface-foreground)]",
                  headingType,
                )}
              >
                مانو | پوشاک روزمره
              </h3>
              <p className='max-w-md text-[0.6875rem] leading-relaxed text-[color:var(--cc-muted-foreground)]'>
                کالکشن‌های کوچک، پارچهٔ طبیعی و دوخت داخلی. اگر سایز یا رنگ
                مناسبی پیدا نکردی، بنویس؛ سری بعد اضافه می‌کنیم.
              </p>

              <form
                className='flex max-w-sm items-center gap-1.5'
                onSubmit={(event: FormEvent<HTMLFormElement>) => {
                  event.preventDefault();
                  setNewsletterSent(true);
                }}
              >
                <Input
                  type='email'
                  required
                  placeholder='ایمیل برای خبرنامه'
                  dir='ltr'
                  className='h-9 text-xs'
                  aria-label='ایمیل برای خبرنامه'
                />
                <Button type='submit' size='sm'>
                  عضویت
                </Button>
              </form>

              {newsletterSent ? (
                <Alert variant='success' title='ثبت شد'>
                  خبر کالکشن بعدی را اول از همه می‌گیری.
                </Alert>
              ) : null}
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className='flex flex-col gap-1.5'>
                <span className='text-[0.6875rem] font-bold text-[color:var(--cc-surface-foreground)]'>
                  فروشگاه
                </span>
                <ul className='flex flex-col gap-1'>
                  {SHOP_NAV.map((item) => (
                    <li key={item.href}>
                      <a
                        href={item.href}
                        className='text-[0.6875rem] text-[color:var(--cc-muted-foreground)] transition-colors hover:text-[color:var(--cc-primary)]'
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className='flex flex-col gap-1.5'>
                <span className='text-[0.6875rem] font-bold text-[color:var(--cc-surface-foreground)]'>
                  پرداخت و ارسال
                </span>
                <div className='flex flex-wrap gap-1'>
                  <Badge variant='outline'>زرین‌پال</Badge>
                  <Badge variant='outline'>شتاب</Badge>
                  <Badge variant='outline'>پست پیشتاز</Badge>
                  <Badge variant='outline'>پرداخت در محل</Badge>
                </div>
                <span className='text-[0.6875rem] leading-relaxed text-[color:var(--cc-muted-foreground)]'>
                  این یک دموی استودیو است؛ سفارش واقعی ثبت نمی‌شود.
                </span>
              </div>
            </div>
          </div>

          <div className='relative flex flex-wrap items-center justify-between gap-2 border-t-[length:var(--cc-border-width)] border-[color:var(--cc-border)] px-5 py-2 sm:px-7'>
            <span className='text-[0.6875rem] text-[color:var(--cc-muted-foreground)]'>
              © ۱۴۰۴ مانو — همهٔ حقوق محفوظ است.
            </span>
            <span className='flex items-center gap-1 text-[0.6875rem] text-[color:var(--cc-muted-foreground)]'>
              <Icon
                name='shield-check'
                className='size-3.5 text-[color:var(--cc-success)]'
              />
              پرداخت امن با درگاه بانکی
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

