"use client";

import {
  useMemo,
  useState,
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CheckboxField,
  Icon,
  Input,
  Progress,
  Select,
  Separator,
  Slider,
  Switch,
  headingType,
} from "@/components/create-components";
import { cn } from "@/lib/utils";
import {
  AtelierScene,
  CategoryTileArt,
  GarmentArt,
  LookbookScene,
  RailScene,
  ServiceArt,
} from "./art/shop-art";
import { Portrait } from "./art/portraits";
import { Ornament, Sparkle, StarRating } from "./art/shared";
import {
  COUPON_CODE,
  FREE_SHIPPING,
  SHIPPING_COST,
  SHOP_CATEGORIES,
  SHOP_FAQ,
  SHOP_LOOKS,
  SHOP_PRODUCTS,
  SHOP_REVIEWS,
  SHOP_SERVICES,
  type ShopProduct,
} from "./data/shop";
import { formatNumber, formatToman } from "./format";
import { sc as styles } from "./scenes";
import { ShopProductCard } from "./shop-product-card";

type CartLine = { qty: number; color: string; size: string };

const TICKER = [
  "ارسال رایگان بالای ۳٬۰۰۰٬۰۰۰ تومان",
  "تعویض سایز تا ۷ روز",
  "دوخت محدود در تهران",
  "پرداخت در محل برای تهران",
];

const SORT_OPTIONS = [
  { value: "featured", label: "پیشنهاد مانو" },
  { value: "price-asc", label: "ارزان‌ترین" },
  { value: "price-desc", label: "گران‌ترین" },
  { value: "rating", label: "بالاترین امتیاز" },
];

const BY_ID = new Map(SHOP_PRODUCTS.map((product) => [product.id, product]));
const SIZE_FILTERS = Array.from(
  new Set(
    SHOP_PRODUCTS.flatMap((product) => product.sizes.map((size) => size.label)),
  ),
);
const COLOUR_FILTERS = Array.from(
  new Map(
    SHOP_PRODUCTS.flatMap((product) =>
      product.palette.map((colour) => [colour.hex, colour] as const),
    ),
  ).values(),
);

const discountPercent = (product: ShopProduct) =>
  product.oldPrice
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : 0;

export function ClothingShopView() {
  const [category, setCategory] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("featured");
  const [maxPrice, setMaxPrice] = useState(3_200_000);
  const [size, setSize] = useState("all");
  const [colour, setColour] = useState("all");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [discountOnly, setDiscountOnly] = useState(false);
  const [wishlistOnly, setWishlistOnly] = useState(false);
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
  const [menuOpen, setMenuOpen] = useState(false);

  const visibleProducts = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const result = SHOP_PRODUCTS.filter((product) => {
      const haystack = [
        product.name,
        product.description,
        ...product.palette.map((entry) => entry.name),
      ]
        .join(" ")
        .toLowerCase();

      return (
        (category === "all" || product.category === category) &&
        product.price <= maxPrice &&
        (size === "all" ||
          product.sizes.some(
            (entry) => entry.label === size && entry.inStock,
          )) &&
        (colour === "all" ||
          product.palette.some((entry) => entry.hex === colour)) &&
        (!inStockOnly || product.inStock) &&
        (!discountOnly || Boolean(product.oldPrice)) &&
        (!wishlistOnly || liked.includes(product.id)) &&
        (!needle || haystack.includes(needle))
      );
    });

    if (sort === "price-asc") return result.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") return result.sort((a, b) => b.price - a.price);
    if (sort === "rating") return result.sort((a, b) => b.rating - a.rating);
    return result;
  }, [
    category,
    colour,
    discountOnly,
    inStockOnly,
    liked,
    maxPrice,
    query,
    size,
    sort,
    wishlistOnly,
  ]);

  const cartItems = Object.entries(cart).flatMap(([id, line]) => {
    const product = BY_ID.get(id);
    return product ? [{ product, ...line }] : [];
  });
  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.qty,
    0,
  );
  const couponDiscount =
    couponState === "applied" ? Math.round(subtotal * 0.1) : 0;
  const shipping =
    subtotal === 0 || subtotal >= FREE_SHIPPING ? 0 : SHIPPING_COST;
  const total = Math.max(0, subtotal - couponDiscount + shipping);
  const shippingRemaining = Math.max(0, FREE_SHIPPING - subtotal);
  const shippingProgress = Math.min(
    100,
    Math.round((subtotal / FREE_SHIPPING) * 100),
  );

  const toggleLiked = (id: string) =>
    setLiked((previous) =>
      previous.includes(id)
        ? previous.filter((entry) => entry !== id)
        : [...previous, id],
    );

  const addToCart = (id: string, color: string, sizeLabel: string) => {
    setCart((previous) => {
      const line = previous[id];
      return {
        ...previous,
        [id]: line
          ? { ...line, qty: line.qty + 1, color, size: sizeLabel }
          : { qty: 1, color, size: sizeLabel },
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

  const resetFilters = () => {
    setCategory("all");
    setQuery("");
    setMaxPrice(3_200_000);
    setSize("all");
    setColour("all");
    setInStockOnly(false);
    setDiscountOnly(false);
    setWishlistOnly(false);
  };

  const activeFilters: { key: string; label: string; clear: () => void }[] = [];
  if (category !== "all")
    activeFilters.push({
      key: "category",
      label:
        SHOP_CATEGORIES.find((entry) => entry.value === category)?.label ?? "",
      clear: () => setCategory("all"),
    });
  if (size !== "all")
    activeFilters.push({
      key: "size",
      label: `سایز ${size}`,
      clear: () => setSize("all"),
    });
  if (colour !== "all")
    activeFilters.push({
      key: "colour",
      label: COLOUR_FILTERS.find((entry) => entry.hex === colour)?.name ?? "",
      clear: () => setColour("all"),
    });
  if (inStockOnly)
    activeFilters.push({
      key: "stock",
      label: "فقط موجود",
      clear: () => setInStockOnly(false),
    });
  if (discountOnly)
    activeFilters.push({
      key: "discount",
      label: "فقط تخفیف‌دار",
      clear: () => setDiscountOnly(false),
    });
  if (wishlistOnly)
    activeFilters.push({
      key: "wishlist",
      label: "علاقه‌مندی‌ها",
      clear: () => setWishlistOnly(false),
    });
  if (query.trim())
    activeFilters.push({
      key: "query",
      label: `«${query.trim()}»`,
      clear: () => setQuery(""),
    });


  return (
    <div className='@container flex flex-col gap-6'>
      <TickerCard />

      <ShopHeader
        cartCount={cartCount}
        likedCount={liked.length}
        query={query}
        onQueryChange={setQuery}
        wishlistOnly={wishlistOnly}
        onToggleWishlist={() => setWishlistOnly((value) => !value)}
        menuOpen={menuOpen}
        onToggleMenu={() => setMenuOpen((value) => !value)}
        onPickCategory={(value) => {
          setCategory(value);
          setWishlistOnly(false);
        }}
      />

      <ShopHero onAdd={addToCart} />

      <CategoryTiles
        onPick={(value) => {
          setCategory(value);
          setWishlistOnly(false);
        }}
      />

      <LookbookSection onAddLook={addLook} />

      <CatalogSection
        visibleProducts={visibleProducts}
        liked={liked}
        onToggleLike={toggleLiked}
        onAdd={addToCart}
        category={category}
        onCategoryChange={setCategory}
        query={query}
        onQueryChange={setQuery}
        sort={sort}
        onSortChange={setSort}
        maxPrice={maxPrice}
        onMaxPriceChange={setMaxPrice}
        size={size}
        onSizeChange={setSize}
        colour={colour}
        onColourChange={setColour}
        inStockOnly={inStockOnly}
        onInStockChange={setInStockOnly}
        discountOnly={discountOnly}
        onDiscountChange={setDiscountOnly}
        wishlistOnly={wishlistOnly}
        onWishlistChange={setWishlistOnly}
        activeFilters={activeFilters}
        onReset={resetFilters}
      />

      <CartSection
        cartItems={cartItems}
        cartCount={cartCount}
        subtotal={subtotal}
        coupon={coupon}
        couponState={couponState}
        couponDiscount={couponDiscount}
        shipping={shipping}
        total={total}
        shippingRemaining={shippingRemaining}
        shippingProgress={shippingProgress}
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

      <ReviewsSection />
      <ServicesSection />
      <FaqSection />

      <NewsletterFooter
        newsletterSent={newsletterSent}
        onSubscribe={() => setNewsletterSent(true)}
      />
    </div>
  );
}


function TickerCard() {
  return (
    <Card className='gap-0 overflow-hidden p-0'>
      <div
        className={styles.ticker}
        style={{ "--sc-duration": "42s" } as CSSProperties}
      >
        <div className={styles.tickerTrack}>
          {[0, 1].map((copy) => (
            <div key={copy} className='flex items-center' aria-hidden={copy === 1}>
              {TICKER.map((item) => (
                <span
                  key={`${copy}-${item}`}
                  dir='rtl'
                  className='flex items-center gap-2 whitespace-nowrap px-4 py-2 text-[10px] text-[color:var(--cc-muted-foreground)]'
                >
                  <svg viewBox='0 0 24 24' className='size-2.5 shrink-0'>
                    <Sparkle className={styles.brand} />
                  </svg>
                  {item}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

function ShopHeader({
  cartCount,
  likedCount,
  query,
  onQueryChange,
  wishlistOnly,
  onToggleWishlist,
  menuOpen,
  onToggleMenu,
  onPickCategory,
}: {
  cartCount: number;
  likedCount: number;
  query: string;
  onQueryChange: (value: string) => void;
  wishlistOnly: boolean;
  onToggleWishlist: () => void;
  menuOpen: boolean;
  onToggleMenu: () => void;
  onPickCategory: (value: string) => void;
}) {
  return (
    <Card>
      <div className='flex flex-wrap items-center gap-3'>
        <div className='flex items-center gap-2.5'>
          <span className='flex size-9 items-center justify-center rounded-[var(--cc-radius)] border-[length:var(--cc-border-width)] border-[color:var(--cc-border)] bg-[var(--cc-primary)] text-[color:var(--cc-primary-foreground)] [box-shadow:var(--cc-shadow)]'>
            <Icon name='brand' className='size-5' />
          </span>
          <div className='flex flex-col'>
            <span className='text-sm font-bold text-[color:var(--cc-surface-foreground)]'>
              مانو | پوشاک روزمره
            </span>
            <span className='text-[10px] text-[color:var(--cc-muted-foreground)]'>
              کالکشن پاییز ۱۴۰۴ · تهران
            </span>
          </div>
        </div>

        <nav className='hidden items-center gap-0.5 @3xl:flex'>
          {SHOP_CATEGORIES.map((item) => (
            <Button
              key={item.value}
              variant='ghost'
              size='sm'
              onClick={() => onPickCategory(item.value)}
            >
              {item.label}
            </Button>
          ))}
        </nav>

        <div className='ms-auto flex flex-1 items-center justify-end gap-2'>
          <div className='relative w-full max-w-56'>
            <Icon name='search' className='pointer-events-none absolute start-2.5 top-1/2 size-3.5 -translate-y-1/2 text-[color:var(--cc-muted-foreground)]' />
            <Input
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              className='h-9 ps-8 text-xs'
              placeholder='جستجو در کالکشن…'
              aria-label='جستجو در محصولات'
            />
          </div>

          <div className='relative'>
            <Button
              size='icon'
              variant={wishlistOnly ? "solid" : "outline"}
              aria-label='نمایش علاقه‌مندی‌ها'
              aria-pressed={wishlistOnly}
              onClick={onToggleWishlist}
            >
              <Icon
                name='heart'
                className={cn("size-4", wishlistOnly && "fill-current")}
              />
            </Button>
            <Badge
              variant='solid'
              className='absolute -end-1.5 -top-1.5 px-1.5'
            >
              {formatNumber(likedCount)}
            </Badge>
          </div>

          <div className='relative'>
            <Button size='icon' aria-label='سبد خرید'>
              <Icon name='shopping-bag' className='size-4' />
            </Button>
            <Badge
              variant='solid'
              className='absolute -end-1.5 -top-1.5 px-1.5'
            >
              {formatNumber(cartCount)}
            </Badge>
          </div>

          <Button
            size='icon'
            variant='outline'
            className='@3xl:hidden'
            aria-label={menuOpen ? 'بستن منو' : 'باز کردن منو'}
            aria-expanded={menuOpen}
            onClick={onToggleMenu}
          >
            {menuOpen ? (
              <Icon name='close' className='size-4' />
            ) : (
              <Icon name='menu' className='size-4' />
            )}
          </Button>
        </div>
      </div>

      {menuOpen ? (
        <>
          <Separator />
          <div className='grid grid-cols-2 gap-1 @xl:grid-cols-4'>
            {SHOP_CATEGORIES.map((item) => (
              <Button
                key={item.value}
                variant='outline'
                size='sm'
                onClick={() => {
                  onPickCategory(item.value);
                  onToggleMenu();
                }}
              >
                {item.label}
              </Button>
            ))}
          </div>
        </>
      ) : null}
    </Card>
  );
}


function ShopHero({
  onAdd,
}: {
  onAdd: (id: string, color: string, size: string) => void;
}) {
  const featured = BY_ID.get("coat")!;

  return (
    <Card className='gap-0 overflow-hidden p-0'>
      <div className='grid @3xl:grid-cols-[1.02fr_0.98fr]'>
        <div className='flex flex-col gap-4 p-5 @2xl:p-7'>
          <div className='flex flex-wrap items-center gap-2'>
            <Badge variant='accent'>کالکشن پاییز ۱۴۰۴</Badge>
            <Ornament />
          </div>

          <h2
            className={`text-2xl leading-tight text-[color:var(--cc-surface-foreground)] @2xl:text-3xl ${headingType}`}
          >
            لایه‌های ساده،
            <br />
            برای{" "}
            <span className='relative inline-block'>
              روزهای شلوغ
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
            </span>
          </h2>

          <p className='max-w-lg text-sm text-[color:var(--cc-muted-foreground)]'>
            پارچه‌های طبیعی، برش راحت و رنگ‌هایی که با هم ترکیب می‌شوند. از پالتو
            اورسایز تا کیف چرمی؛ همه در یک کالکشن هماهنگ و محدود.
          </p>

          <div className='flex flex-wrap items-center gap-2'>
            <Button size='lg'>
              <Icon name='shopping-bag' className='size-4' />
              خرید کالکشن
            </Button>
            <Button size='lg' variant='outline'>
              راهنمای سایز
            </Button>
          </div>

          <div className='grid grid-cols-3 gap-2 border-t-[length:var(--cc-border-width)] border-[color:var(--cc-border)] pt-3'>
            {[
              { label: "امتیاز مشتریان", value: "۴.۸ / ۵" },
              { label: "قطعه در کالکشن", value: "۸ قطعه" },
              { label: "ارسال تهران", value: "۲۴ ساعته" },
            ].map((stat) => (
              <div key={stat.label} className='flex flex-col gap-0.5'>
                <span className='font-mono text-sm font-bold text-[color:var(--cc-surface-foreground)]'>
                  {stat.value}
                </span>
                <span className='text-[10px] text-[color:var(--cc-muted-foreground)]'>
                  {stat.label}
                </span>
              </div>
            ))}
          </div>

          <div className='flex items-center gap-2'>
            <span className='text-[10px] text-[color:var(--cc-muted-foreground)]'>
              پالت فصل:
            </span>
            {["#d6c7b0", "#6b7a5a", "#7d2f45", "#2c2f33"].map((hex) => (
              <span
                key={hex}
                aria-hidden='true'
                className='size-4 rounded-full border border-[color:var(--cc-border)]'
                style={{ backgroundColor: hex }}
              />
            ))}
          </div>
        </div>

        <div className='relative min-h-[320px] overflow-hidden border-t-[length:var(--cc-border-width)] border-[color:var(--cc-border)] @3xl:min-h-[420px] @3xl:border-s @3xl:border-t-0'>
          <RailScene className='absolute inset-0 size-full' />


          <div className='absolute start-3 top-3 -rotate-6'>
            <Badge variant='danger' className='px-2.5 py-1 text-[10px]'>
              {formatNumber(discountPercent(featured))}٪ آف پالتو
            </Badge>
          </div>

          <div
            className={cn(
              "absolute end-3 top-4 flex items-center gap-1.5 rounded-[var(--cc-radius-sm)] border-[length:var(--cc-border-width)] border-[color:var(--cc-border)] bg-[var(--cc-surface)] px-2 py-1 text-[10px] [box-shadow:var(--cc-shadow)]",
              styles.float,
            )}
            style={{ "--sc-delay": "-2.4s" } as CSSProperties}
          >
            <Icon name='check-circle' className='size-3 text-[color:var(--cc-success)]' />
            ارسال رایگان
          </div>

          <div className='absolute bottom-3 start-3 flex items-center gap-2 rounded-[var(--cc-radius-sm)] border-[length:var(--cc-border-width)] border-[color:var(--cc-border)] bg-[var(--cc-surface)] px-2 py-1 [box-shadow:var(--cc-shadow)]'>
            <StarRating value={featured.rating} />
            <span className='text-[10px] text-[color:var(--cc-muted-foreground)]'>
              {formatNumber(featured.reviews)} نظر
            </span>
          </div>

          <div className='absolute bottom-3 end-3 w-44 rounded-[var(--cc-radius)] border-[length:var(--cc-border-width)] border-[color:var(--cc-border)] bg-[var(--cc-surface)] p-2.5 [box-shadow:var(--cc-shadow)]'>
            <span className='block text-[10px] text-[color:var(--cc-muted-foreground)]'>
              پیشنهاد استودیو
            </span>
            <span className='mb-1 block text-xs font-bold text-[color:var(--cc-surface-foreground)]'>
              {featured.name}
            </span>
            <div className='mb-2 flex items-end justify-between gap-1'>
              <span className='font-mono text-xs font-bold'>
                {formatToman(featured.price)}
              </span>
              <span className='font-mono text-[9px] text-[color:var(--cc-muted-foreground)] line-through'>
                {formatToman(featured.oldPrice ?? featured.price)}
              </span>
            </div>
            <Button
              size='sm'
              fullWidth
              onClick={() =>
                onAdd(
                  featured.id,
                  featured.palette[0].hex,
                  featured.sizes.find((entry) => entry.inStock)?.label ??
                    featured.sizes[0].label,
                )
              }
            >
              <Icon name='plus' className='size-3.5' />
              افزودن
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

function CategoryTiles({ onPick }: { onPick: (value: string) => void }) {
  const tiles = SHOP_CATEGORIES.filter((entry) => entry.value !== "all");

  return (
    <div className='grid gap-4 @xl:grid-cols-3'>
      {tiles.map((tile) => {
        const count = SHOP_PRODUCTS.filter(
          (product) => product.category === tile.value,
        ).length;
        return (
          <Card key={tile.value} className='gap-0 overflow-hidden p-0'>
            <button
              type='button'
              onClick={() => onPick(tile.value)}
              className='group flex flex-col text-start'
            >
              <CategoryTileArt
                category={tile.value as "women" | "men" | "accessories"}
                className='h-36 w-full'
              />
              <div className='flex items-center justify-between gap-2 p-3'>
                <div className='flex flex-col'>
                  <span className='text-sm font-bold text-[color:var(--cc-surface-foreground)]'>
                    {tile.label}
                  </span>
                  <span className='text-[10px] text-[color:var(--cc-muted-foreground)]'>
                    {tile.caption} · {formatNumber(count)} قطعه
                  </span>
                </div>
                <span className='flex size-7 items-center justify-center rounded-full border-[length:var(--cc-border-width)] border-[color:var(--cc-border)]'>
                  <Icon name='arrow-left' className='size-3.5 transition-transform group-hover:-translate-x-0.5' />
                </span>
              </div>
            </button>
          </Card>
        );
      })}
    </div>
  );
}


function LookbookSection({
  onAddLook,
}: {
  onAddLook: (items: string[]) => void;
}) {
  return (
    <div className='flex flex-col gap-3'>
      <div className='flex flex-wrap items-end justify-between gap-2'>
        <div className='flex flex-col gap-1'>
          <span className='text-[10px] font-bold tracking-wide text-[color:var(--cc-primary)]'>
            دفترچهٔ استایل
          </span>
          <h3
            className={`text-lg text-[color:var(--cc-surface-foreground)] ${headingType}`}
          >
            سه قطعه، یک ظاهر کامل
          </h3>
        </div>
        <Ornament />
      </div>

      <div className='grid gap-4 @3xl:grid-cols-[1.08fr_0.92fr]'>
        <Card className='gap-0 overflow-hidden p-0'>
          <div className='grid h-full @xl:grid-cols-2'>
            <AtelierScene className='h-52 w-full @xl:h-full' />
            <div className='flex flex-col gap-2.5 p-4'>
              <Badge variant='soft' className='self-start'>
                پشت صحنه
              </Badge>
              <h4
                className={`text-base text-[color:var(--cc-surface-foreground)] ${headingType}`}
              >
                هر دوخت، یک تصمیم
              </h4>
              <p className='text-xs text-[color:var(--cc-muted-foreground)]'>
                الگوها در تهران کشیده می‌شوند، پارچه از تولیدکننده‌های داخلی
                می‌آید و هر قطعه پیش از ارسال یک بار اتو و بازرسی می‌شود.
              </p>
              <div className='grid grid-cols-3 gap-2 border-t-[length:var(--cc-border-width)] border-[color:var(--cc-border)] pt-2'>
                {[
                  { value: "۱۸۰h", label: "دوخت در هر سری" },
                  { value: "۹", label: "پارچهٔ طبیعی" },
                  { value: "۱۰۰٪", label: "تولید تهران" },
                ].map((metric) => (
                  <div key={metric.label} className='flex flex-col'>
                    <span className='font-mono text-sm font-bold'>
                      {metric.value}
                    </span>
                    <span className='text-[9px] text-[color:var(--cc-muted-foreground)]'>
                      {metric.label}
                    </span>
                  </div>
                ))}
              </div>
              <Button
                variant='outline'
                size='sm'
                className='mt-auto self-start'
              >
                داستان کالکشن
                <Icon name='arrow-left' className='size-3.5' />
              </Button>
            </div>
          </div>
        </Card>

        <div className='grid gap-4 @xl:grid-cols-2'>
          {SHOP_LOOKS.map((look) => {
            const colors = look.items.map(
              (id) => BY_ID.get(id)?.palette[0].hex ?? "#000000",
            );
            return (
              <Card key={look.id} className='gap-0 overflow-hidden p-0'>
                <LookbookScene
                  scene={look.scene}
                  colors={colors}
                  className='h-48 w-full'
                />
                <div className='flex flex-1 flex-col gap-1.5 p-3'>
                  <span className='text-sm font-bold text-[color:var(--cc-surface-foreground)]'>
                    {look.title}
                  </span>
                  <span className='text-[10px] text-[color:var(--cc-muted-foreground)]'>
                    {look.subtitle}
                  </span>
                  <Button
                    size='sm'
                    variant='outline'
                    fullWidth
                    className='mt-auto'
                    onClick={() => onAddLook(look.items)}
                  >
                    <Icon name='shopping-bag' className='size-3.5' />
                    خرید استایل
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}


function CatalogSection({
  visibleProducts,
  liked,
  onToggleLike,
  onAdd,
  category,
  onCategoryChange,
  query,
  onQueryChange,
  sort,
  onSortChange,
  maxPrice,
  onMaxPriceChange,
  size,
  onSizeChange,
  colour,
  onColourChange,
  inStockOnly,
  onInStockChange,
  discountOnly,
  onDiscountChange,
  wishlistOnly,
  onWishlistChange,
  activeFilters,
  onReset,
}: {
  visibleProducts: ShopProduct[];
  liked: string[];
  onToggleLike: (id: string) => void;
  onAdd: (id: string, color: string, size: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  query: string;
  onQueryChange: (value: string) => void;
  sort: string;
  onSortChange: (value: string) => void;
  maxPrice: number;
  onMaxPriceChange: (value: number) => void;
  size: string;
  onSizeChange: (value: string) => void;
  colour: string;
  onColourChange: (value: string) => void;
  inStockOnly: boolean;
  onInStockChange: (value: boolean) => void;
  discountOnly: boolean;
  onDiscountChange: (value: boolean) => void;
  wishlistOnly: boolean;
  onWishlistChange: (value: boolean) => void;
  activeFilters: { key: string; label: string; clear: () => void }[];
  onReset: () => void;
}) {
  return (
    <div className='flex flex-col gap-3'>
      <div className='flex flex-wrap items-end justify-between gap-2'>
        <div className='flex flex-col gap-1'>
          <span className='text-[10px] font-bold tracking-wide text-[color:var(--cc-primary)]'>
            کالکشن
          </span>
          <h3
            className={`text-lg text-[color:var(--cc-surface-foreground)] ${headingType}`}
          >
            انتخاب‌های این فصل
          </h3>
          <p className='text-xs text-[color:var(--cc-muted-foreground)]'>
            {formatNumber(SHOP_PRODUCTS.length)} قطعه،{" "}
            {formatNumber(SIZE_FILTERS.length)} سایز و{" "}
            {formatNumber(COLOUR_FILTERS.length)} رنگ.
          </p>
        </div>
        <Badge variant='outline'>
          {formatNumber(visibleProducts.length)} نتیجه
        </Badge>
      </div>

      <div className='grid gap-4 @3xl:grid-cols-[232px_1fr]'>
        <Card className='h-fit gap-3 @3xl:sticky @3xl:top-2'>
          <div className='flex items-center justify-between gap-2'>
            <span className='text-sm font-bold text-[color:var(--cc-surface-foreground)]'>
              فیلترها
            </span>
            <Button variant='ghost' size='sm' onClick={onReset}>
              پاک کردن
            </Button>
          </div>

          <div className='flex flex-col gap-1'>
            {SHOP_CATEGORIES.map((item) => {
              const count =
                item.value === "all"
                  ? SHOP_PRODUCTS.length
                  : SHOP_PRODUCTS.filter(
                      (product) => product.category === item.value,
                    ).length;
              const active = category === item.value;
              return (
                <button
                  key={item.value}
                  type='button'
                  onClick={() => onCategoryChange(item.value)}
                  aria-pressed={active}
                  className={cn(
                    "flex items-center justify-between gap-2 rounded-[var(--cc-radius-sm)] px-2 py-1.5 text-xs transition-colors",
                    active
                      ? "bg-[var(--cc-primary)] text-[color:var(--cc-primary-foreground)]"
                      : "text-[color:var(--cc-surface-foreground)] hover:bg-[var(--cc-muted)]",
                  )}
                >
                  <span>{item.label}</span>
                  <span className='font-mono text-[10px] opacity-70'>
                    {formatNumber(count)}
                  </span>
                </button>
              );
            })}
          </div>

          <Separator />

          <div className='flex flex-col gap-1.5'>
            <div className='flex items-center justify-between text-xs'>
              <span className='text-[color:var(--cc-surface-foreground)]'>
                سقف قیمت
              </span>
              <span className='font-mono text-[10px] text-[color:var(--cc-muted-foreground)]'>
                {formatToman(maxPrice)}
              </span>
            </div>
            <Slider
              min={500000}
              max={3200000}
              step={50000}
              value={maxPrice}
              onChange={(event) => onMaxPriceChange(Number(event.target.value))}
              aria-label='حداکثر قیمت'
            />
          </div>


          <div className='flex flex-col gap-1.5'>
            <span className='text-xs text-[color:var(--cc-surface-foreground)]'>
              سایز
            </span>
            <div className='flex flex-wrap gap-1'>
              <button
                type='button'
                onClick={() => onSizeChange("all")}
                aria-pressed={size === "all"}
                className={cn(
                  "rounded-[var(--cc-radius-sm)] border-[length:var(--cc-border-width)] border-[color:var(--cc-border)] px-2 py-0.5 text-[10px]",
                  size === "all"
                    ? "bg-[var(--cc-primary)] text-[color:var(--cc-primary-foreground)]"
                    : "bg-[var(--cc-surface)]",
                )}
              >
                همه
              </button>
              {SIZE_FILTERS.map((label) => (
                <button
                  key={label}
                  type='button'
                  onClick={() => onSizeChange(label)}
                  aria-pressed={size === label}
                  className={cn(
                    "min-w-7 rounded-[var(--cc-radius-sm)] border-[length:var(--cc-border-width)] border-[color:var(--cc-border)] px-1.5 py-0.5 text-[10px]",
                    size === label
                      ? "bg-[var(--cc-primary)] text-[color:var(--cc-primary-foreground)]"
                      : "bg-[var(--cc-surface)] hover:bg-[var(--cc-muted)]",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className='flex flex-col gap-1.5'>
            <span className='text-xs text-[color:var(--cc-surface-foreground)]'>
              رنگ
            </span>
            <div className='flex flex-wrap items-center gap-1.5'>
              <button
                type='button'
                onClick={() => onColourChange("all")}
                aria-pressed={colour === "all"}
                className={cn(
                  "rounded-[var(--cc-radius-sm)] border-[length:var(--cc-border-width)] border-[color:var(--cc-border)] px-2 py-0.5 text-[10px]",
                  colour === "all"
                    ? "bg-[var(--cc-primary)] text-[color:var(--cc-primary-foreground)]"
                    : "bg-[var(--cc-surface)]",
                )}
              >
                همه
              </button>
              {COLOUR_FILTERS.map((entry) => (
                <button
                  key={entry.hex}
                  type='button'
                  onClick={() => onColourChange(entry.hex)}
                  aria-label={`رنگ ${entry.name}`}
                  aria-pressed={colour === entry.hex}
                  title={entry.name}
                  className={cn(
                    "size-4 rounded-full border transition-transform",
                    colour === entry.hex
                      ? "scale-110 border-[color:var(--cc-surface-foreground)] ring-1 ring-[color:var(--cc-surface-foreground)] ring-offset-1 ring-offset-[var(--cc-surface)]"
                      : "border-[color:var(--cc-border)] hover:scale-110",
                  )}
                  style={{ backgroundColor: entry.hex }}
                />
              ))}
            </div>
          </div>

          <Separator />

          <div className='flex flex-col gap-2'>
            <div className='flex items-center justify-between gap-2'>
              <span className='text-xs text-[color:var(--cc-surface-foreground)]'>
                فقط موجود
              </span>
              <Switch
                checked={inStockOnly}
                onCheckedChange={onInStockChange}
                aria-label='فقط کالاهای موجود'
              />
            </div>
            <div className='flex items-center justify-between gap-2'>
              <span className='text-xs text-[color:var(--cc-surface-foreground)]'>
                فقط تخفیف‌دار
              </span>
              <Switch
                checked={discountOnly}
                onCheckedChange={onDiscountChange}
                aria-label='فقط کالاهای تخفیف‌دار'
              />
            </div>
            <CheckboxField
              label='علاقه‌مندی‌ها'
              description='قطعه‌هایی که قلب کرده‌اید'
              checked={wishlistOnly}
              onCheckedChange={onWishlistChange}
            />
          </div>

          <div className='relative'>
            <Icon name='search' className='pointer-events-none absolute start-2.5 top-1/2 size-3.5 -translate-y-1/2 text-[color:var(--cc-muted-foreground)]' />
            <Input
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              className='ps-8 text-xs'
              placeholder='جستجوی سریع…'
              aria-label='جستجوی سریع در محصولات'
            />
          </div>
        </Card>


        <div className='flex flex-col gap-3'>
          <div className='flex flex-wrap items-center justify-between gap-2'>
            <div className='flex items-center gap-2'>
              <Badge variant='soft'>
                {formatNumber(visibleProducts.length)} کالا
              </Badge>
              <span className='text-[10px] text-[color:var(--cc-muted-foreground)]'>
                از {formatNumber(SHOP_PRODUCTS.length)} قطعه
              </span>
            </div>
            <div className='flex items-center gap-2'>
              <span className='text-[10px] text-[color:var(--cc-muted-foreground)]'>
                مرتب‌سازی
              </span>
              <Select
                options={SORT_OPTIONS}
                value={sort}
                onValueChange={onSortChange}
                className='w-40'
              />
            </div>
          </div>

          {activeFilters.length ? (
            <div className='flex flex-wrap items-center gap-1'>
              <span className='text-[10px] text-[color:var(--cc-muted-foreground)]'>
                فیلترها:
              </span>
              {activeFilters.map((filter) => (
                <Button
                  key={filter.key}
                  size='sm'
                  variant='outline'
                  onClick={filter.clear}
                >
                  {filter.label}
                  <Icon name='close' className='size-3' />
                </Button>
              ))}
              <Button variant='ghost' size='sm' onClick={onReset}>
                حذف همه
              </Button>
            </div>
          ) : null}

          {visibleProducts.length ? (
            <div className='grid gap-3 @xl:grid-cols-2 @5xl:grid-cols-3'>
              {visibleProducts.map((product) => (
                <ShopProductCard
                  key={product.id}
                  product={product}
                  liked={liked.includes(product.id)}
                  onToggleLike={onToggleLike}
                  onAdd={onAdd}
                />
              ))}
            </div>
          ) : (
            <Card className='items-center gap-3 py-6 text-center'>
              <CategoryTileArt
                category='accessories'
                className='h-32 w-full max-w-56 rounded-[var(--cc-radius)] border-[length:var(--cc-border-width)] border-[color:var(--cc-border)]'
              />
              <span className='text-sm font-bold text-[color:var(--cc-surface-foreground)]'>
                کالایی با این فیلترها پیدا نشد
              </span>
              <p className='max-w-sm text-xs text-[color:var(--cc-muted-foreground)]'>
                سقف قیمت را بالاتر ببر، سایز یا رنگ را تغییر بده یا فیلترها را
                پاک کن.
              </p>
              <Button size='sm' variant='outline' onClick={onReset}>
                حذف فیلترها
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}


function CartSection({
  cartItems,
  cartCount,
  subtotal,
  coupon,
  couponState,
  couponDiscount,
  shipping,
  total,
  shippingRemaining,
  shippingProgress,
  checkoutDone,
  onCouponChange,
  onApplyCoupon,
  onChangeQty,
  onClearCart,
  onCheckout,
}: {
  cartItems: {
    product: ShopProduct;
    qty: number;
    color: string;
    size: string;
  }[];
  cartCount: number;
  subtotal: number;
  coupon: string;
  couponState: "idle" | "applied" | "error";
  couponDiscount: number;
  shipping: number;
  total: number;
  shippingRemaining: number;
  shippingProgress: number;
  checkoutDone: boolean;
  onCouponChange: (value: string) => void;
  onApplyCoupon: (event: FormEvent<HTMLFormElement>) => void;
  onChangeQty: (id: string, delta: number) => void;
  onClearCart: () => void;
  onCheckout: () => void;
}) {
  return (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between gap-2'>
          <CardTitle>سبد خرید</CardTitle>
          <Badge variant='soft'>{formatNumber(cartCount)} قلم</Badge>
        </div>
        <CardDescription>
          ارسال رایگان برای خرید بالای {formatToman(FREE_SHIPPING)} · تعویض سایز
          تا ۷ روز.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {cartItems.length ? (
          <div className='grid gap-4 @3xl:grid-cols-[1.25fr_0.9fr]'>
            <div className='flex flex-col gap-2'>
              {cartItems.map((item) => {
                const colour = item.product.palette.find(
                  (entry) => entry.hex === item.color,
                );
                return (
                  <div
                    key={item.product.id}
                    className='flex flex-wrap items-center gap-3 rounded-[var(--cc-radius)] border-[length:var(--cc-border-width)] border-[color:var(--cc-border)] p-2'
                  >
                    <span className='size-16 shrink-0 overflow-hidden rounded-[var(--cc-radius-sm)] border-[length:var(--cc-border-width)] border-[color:var(--cc-border)] bg-[var(--cc-muted)]'>
                      <GarmentArt
                        variant={item.product.art}
                        color={item.color}
                        className='size-full'
                      />
                    </span>
                    <div className='min-w-0 flex-1'>
                      <div className='flex items-start justify-between gap-2'>
                        <span className='text-xs font-bold text-[color:var(--cc-surface-foreground)]'>
                          {item.product.name}
                        </span>
                        <Button
                          size='icon'
                          variant='ghost'
                          className='size-6'
                          aria-label={`حذف ${item.product.name}`}
                          onClick={() => onChangeQty(item.product.id, -item.qty)}
                        >
                          <Icon name='trash' className='size-3.5' />
                        </Button>
                      </div>
                      <span className='text-[10px] text-[color:var(--cc-muted-foreground)]'>
                        سایز {item.size}
                        {colour ? ` · ${colour.name}` : ""}
                      </span>
                      <div className='mt-1.5 flex items-center justify-between gap-2'>
                        <div className='flex items-center gap-1'>
                          <Button
                            size='icon'
                            variant='outline'
                            className='size-6'
                            aria-label={`کاهش ${item.product.name}`}
                            onClick={() => onChangeQty(item.product.id, -1)}
                          >
                            <Icon name='minus' className='size-3' />
                          </Button>
                          <span className='w-6 text-center font-mono text-xs'>
                            {formatNumber(item.qty)}
                          </span>
                          <Button
                            size='icon'
                            variant='outline'
                            className='size-6'
                            aria-label={`افزایش ${item.product.name}`}
                            onClick={() => onChangeQty(item.product.id, 1)}
                          >
                            <Icon name='plus' className='size-3' />
                          </Button>
                        </div>
                        <span className='font-mono text-xs font-bold'>
                          {formatToman(item.product.price * item.qty)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
              <Button
                variant='ghost'
                size='sm'
                className='self-start'
                onClick={onClearCart}
              >
                <Icon name='trash' className='size-3.5' />
                خالی کردن سبد
              </Button>
            </div>


            <div className='flex flex-col gap-2.5 rounded-[var(--cc-radius)] border-[length:var(--cc-border-width)] border-[color:var(--cc-border)] bg-[var(--cc-muted)] p-3'>
              <div className='flex items-center justify-between text-xs text-[color:var(--cc-muted-foreground)]'>
                <span>جمع کالاها</span>
                <span className='font-mono'>{formatToman(subtotal)}</span>
              </div>

              <form onSubmit={onApplyCoupon} className='flex items-center gap-1'>
                <Input
                  value={coupon}
                  onChange={(event) => onCouponChange(event.target.value)}
                  placeholder='کد تخفیف'
                  dir='ltr'
                  className='h-8 text-xs'
                  aria-label='کد تخفیف'
                />
                <Button type='submit' size='sm'>
                  اعمال
                </Button>
              </form>
              <span className='text-[9px] text-[color:var(--cc-muted-foreground)]'>
                کد نمایشی: <span className='font-mono'>MANO10</span>
              </span>

              {couponState === "applied" ? (
                <Alert variant='success' title='کد اعمال شد'>
                  ۱۰٪ تخفیف روی جمع کالاها فعال است.
                </Alert>
              ) : null}
              {couponState === "error" ? (
                <Alert variant='danger' title='کد معتبر نیست'>
                  کد <span className='font-mono'>MANO10</span> را امتحان کن.
                </Alert>
              ) : null}

              {couponDiscount > 0 ? (
                <div className='flex items-center justify-between text-xs text-[color:var(--cc-success)]'>
                  <span>تخفیف کد</span>
                  <span className='font-mono'>
                    − {formatToman(couponDiscount)}
                  </span>
                </div>
              ) : null}

              <div className='flex items-center justify-between text-xs text-[color:var(--cc-muted-foreground)]'>
                <span>ارسال</span>
                <span className='font-mono'>
                  {shipping === 0 ? "رایگان" : formatToman(shipping)}
                </span>
              </div>

              <Separator />

              <div className='flex items-center justify-between'>
                <span className='text-sm font-bold text-[color:var(--cc-surface-foreground)]'>
                  مبلغ نهایی
                </span>
                <span className='font-mono text-base font-bold text-[color:var(--cc-surface-foreground)]'>
                  {formatToman(total)}
                </span>
              </div>

              <div className='flex flex-col gap-1'>
                <div className='flex items-center justify-between text-[10px] text-[color:var(--cc-muted-foreground)]'>
                  <span>ارسال رایگان</span>
                  <span>
                    {shippingRemaining > 0
                      ? `${formatToman(shippingRemaining)} باقی مانده`
                      : "فعال شد"}
                  </span>
                </div>
                <Progress value={shippingProgress} />
              </div>

              <Button fullWidth onClick={onCheckout}>
                <Icon name='shopping-bag' className='size-4' />
                تکمیل خرید
              </Button>

              {checkoutDone ? (
                <Alert variant='success' title='سفارش آزمایشی ثبت شد'>
                  این یک دموی استودیو است؛ سفارش واقعی ثبت نمی‌شود.
                </Alert>
              ) : null}

              <div className='flex flex-wrap items-center justify-center gap-1'>
                <Badge variant='outline'>زرین‌پال</Badge>
                <Badge variant='outline'>پرداخت در محل</Badge>
                <Badge variant='outline'>پست پیشتاز</Badge>
              </div>
            </div>
          </div>
        ) : (
          <div className='flex flex-col items-center gap-2 py-4 text-center'>
            <CategoryTileArt
              category='accessories'
              className='h-28 w-44 rounded-[var(--cc-radius)] border-[length:var(--cc-border-width)] border-[color:var(--cc-border)]'
            />
            <span className='text-sm font-bold text-[color:var(--cc-surface-foreground)]'>
              سبد خرید خالی است
            </span>
            <p className='max-w-sm text-xs text-[color:var(--cc-muted-foreground)]'>
              از کالکشن پاییز یکی انتخاب کن یا یکی از استایل‌های آماده را اضافه
              کن.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}


function ReviewsSection() {
  return (
    <div className='flex flex-col gap-3'>
      <div className='flex flex-wrap items-end justify-between gap-2'>
        <div className='flex flex-col gap-1'>
          <span className='text-[10px] font-bold tracking-wide text-[color:var(--cc-primary)]'>
            از زبان مشتری
          </span>
          <h3
            className={`text-lg text-[color:var(--cc-surface-foreground)] ${headingType}`}
          >
            خریدهایی که تمدید شدند
          </h3>
        </div>
        <Ornament />
      </div>

      <div className='grid gap-3 @xl:grid-cols-3'>
        {SHOP_REVIEWS.map((review) => (
          <Card key={review.name} className='gap-2.5'>
            <div className='flex items-center gap-2'>
              <Portrait
                variant={review.portrait}
                className='size-10 overflow-hidden rounded-full border-[length:var(--cc-border-width)] border-[color:var(--cc-border)]'
              />
              <div className='flex min-w-0 flex-col'>
                <span className='truncate text-xs font-bold text-[color:var(--cc-surface-foreground)]'>
                  {review.name}
                </span>
                <span className='text-[10px] text-[color:var(--cc-muted-foreground)]'>
                  {review.city} · خرید تأییدشده
                </span>
              </div>
              <Icon name='check-circle' className='ms-auto size-4 shrink-0 text-[color:var(--cc-success)]' />
            </div>
            <StarRating value={review.rating} />
            <p className='text-xs leading-relaxed text-[color:var(--cc-surface-foreground)]'>
              «{review.text}»
            </p>
          </Card>
        ))}
      </div>

      <Card className='flex-row flex-wrap items-center justify-between gap-3'>
        <div className='flex items-baseline gap-2'>
          <span
            className={`text-2xl text-[color:var(--cc-surface-foreground)] ${headingType}`}
          >
            ۴.۸
          </span>
          <span className='text-xs text-[color:var(--cc-muted-foreground)]'>
            میانگین ۸۰۰+ نظر تأییدشده
          </span>
        </div>
        <div className='flex flex-wrap items-center gap-1.5'>
          <Badge variant='soft'>۹۴٪ خرید دوباره</Badge>
          <Badge variant='outline'>ارسال سریع</Badge>
          <Badge variant='outline'>کیفیت دوخت</Badge>
        </div>
      </Card>
    </div>
  );
}

function ServicesSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>خرید بدون ریسک</CardTitle>
        <CardDescription>
          سه قولی که در هر سفارش رعایت می‌شود.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='grid gap-3 @xl:grid-cols-3'>
          {SHOP_SERVICES.map((service) => (
            <div
              key={service.title}
              className='flex items-center gap-2.5 rounded-[var(--cc-radius)] border-[length:var(--cc-border-width)] border-[color:var(--cc-border)] p-2'
            >
              <ServiceArt
                variant={service.art}
                className='h-16 w-24 shrink-0 rounded-[var(--cc-radius-sm)]'
              />
              <div className='flex flex-col gap-0.5'>
                <span className='text-xs font-bold text-[color:var(--cc-surface-foreground)]'>
                  {service.title}
                </span>
                <span className='text-[10px] text-[color:var(--cc-muted-foreground)]'>
                  {service.body}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}


function FaqSection() {
  return (
    <div className='grid gap-4 @2xl:grid-cols-[1.4fr_0.8fr]'>
      <Card>
        <CardHeader>
          <CardTitle>ارسال، تعویض و پرداخت</CardTitle>
          <CardDescription>
            پاسخ کوتاه به سوال‌هایی که قبل از خرید پرسیده می‌شود.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type='single' defaultValue={["shipping"]}>
            {SHOP_FAQ.map((item) => (
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
          <Portrait
            variant={1}
            className='size-12 overflow-hidden rounded-full border-[length:var(--cc-border-width)] border-[color:var(--cc-border)]'
          />
          <div className='flex flex-col'>
            <span className='text-sm font-bold text-[color:var(--cc-surface-foreground)]'>
              تیم مانو
            </span>
            <span className='text-[10px] text-[color:var(--cc-muted-foreground)]'>
              پاسخ انسانی، نه ربات
            </span>
          </div>
          <span className='ms-auto flex items-center gap-1 text-[10px] text-[color:var(--cc-success)]'>
            <span className='size-1.5 rounded-full bg-[var(--cc-success)]' />
            آنلاین
          </span>
        </div>

        <CardDescription>
          اگر بین دو سایز هستی یا رنگ پارچه را می‌خواهی از نزدیک ببینی، پیام بده؛
          راهنمایی می‌کنیم.
        </CardDescription>

        <div className='flex flex-col gap-1.5'>
          {[
            "پاسخ در کمتر از ۵ دقیقه",
            "۹ صبح تا ۹ شب، هر روز",
            "ارسال نمونهٔ پارچه در تهران",
          ].map((item) => (
            <span
              key={item}
              className='flex items-center gap-1.5 text-[10px] text-[color:var(--cc-muted-foreground)]'
            >
              <Icon name='check' className='size-3 text-[color:var(--cc-primary)]' />
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
  );
}


function NewsletterFooter({
  newsletterSent,
  onSubscribe,
}: {
  newsletterSent: boolean;
  onSubscribe: () => void;
}) {
  return (
    <div className='flex flex-col gap-4'>
      <Card className='gap-0 overflow-hidden p-0'>
        <div className='grid @xl:grid-cols-[1.05fr_0.95fr]'>
          <div className='relative flex min-h-40 items-center justify-center overflow-hidden border-b-[length:var(--cc-border-width)] border-[color:var(--cc-border)] bg-[var(--cc-muted)] @xl:border-b-0 @xl:border-e'>
            <svg
              viewBox='0 0 240 160'
              className='size-full'
              aria-hidden='true'
              focusable='false'
            >
              <rect width='240' height='160' className={styles.brandFaint} />
              <rect
                x='48'
                y='52'
                width='144'
                height='86'
                rx='8'
                className={cn(styles.surface, styles.outlined)}
              />
              <path
                d='M48 58l72 50 72-50'
                className={styles.inkLine}
                fill='none'
              />
              <path
                d='M48 132l50-38M192 132l-50-38'
                className={styles.hairline}
              />
              <g className={styles.float}>
                <rect
                  x='142'
                  y='26'
                  width='60'
                  height='26'
                  rx='4'
                  className={cn(styles.brand, styles.outlined)}
                />
                <circle cx='152' cy='39' r='2.6' className={styles.surface} />
                <path
                  d='M160 39h30'
                  style={{ stroke: "var(--cc-surface)" }}
                  strokeWidth={2}
                  strokeLinecap='round'
                  fill='none'
                />
              </g>
              <Sparkle
                transform='translate(26 30) scale(0.6)'
                className={styles.accent}
              />
              <Sparkle
                transform='translate(198 118) scale(0.45)'
                className={styles.warning}
              />
              <path d='M30 132h48' className={styles.stitch} />
            </svg>
          </div>

          <div className='flex flex-col gap-2 p-4 @2xl:p-5'>
            <Badge variant='soft' className='self-start'>
              خبرنامه
            </Badge>
            <h3
              className={`text-lg text-[color:var(--cc-surface-foreground)] ${headingType}`}
            >
              ۱۰٪ تخفیف اولین خرید
            </h3>
            <p className='text-xs text-[color:var(--cc-muted-foreground)]'>
              ایمیلت را بگذار تا کد تخفیف، خبر کالکشن‌های تازه و راهنمای
              ترکیب رنگ‌ها را بفرستیم.
            </p>
            <form
              className='flex items-center gap-1'
              onSubmit={(event) => {
                event.preventDefault();
                onSubscribe();
              }}
            >
              <Input
                type='email'
                required
                dir='ltr'
                placeholder='you@example.com'
                aria-label='ایمیل برای خبرنامه'
                className='h-9 text-xs'
              />
              <Button type='submit' size='sm'>
                عضویت
              </Button>
            </form>
            {newsletterSent ? (
              <Alert variant='success' title='عضویت ثبت شد'>
                کد <span className='font-mono'>MANO10</span> برای اولین خرید فعال
                شد.
              </Alert>
            ) : null}
          </div>
        </div>
      </Card>


      <footer className='flex flex-col gap-3'>
        <Separator />
        <div className='grid gap-4 @2xl:grid-cols-4'>
          <div className='flex flex-col gap-1.5'>
            <span className='text-sm font-black text-[color:var(--cc-surface-foreground)]'>
              مانو
            </span>
            <p className='text-[10px] leading-relaxed text-[color:var(--cc-muted-foreground)]'>
              پوشاک روزمره با پارچهٔ طبیعی و دوخت محدود در تهران. کالکشن پاییز
              ۱۴۰۴.
            </p>
            <div className='flex flex-wrap gap-1'>
              <Badge variant='outline'>اینستاگرام</Badge>
              <Badge variant='outline'>تلگرام</Badge>
            </div>
          </div>

          {[
            {
              title: "خرید",
              links: ["زنانه", "مردانه", "اکسسوری", "تخفیف‌ها"],
            },
            {
              title: "پشتیبانی",
              links: ["ارسال و مرجوعی", "راهنمای سایز", "شرایط بازگشت", "تماس"],
            },
            {
              title: "مانو",
              links: ["داستان کالکشن", "مجله", "فرصت‌های شغلی", "همکاری"],
            },
          ].map((column) => (
            <div key={column.title} className='flex flex-col gap-1.5'>
              <span className='text-xs font-bold text-[color:var(--cc-surface-foreground)]'>
                {column.title}
              </span>
              {column.links.map((link) => (
                <button
                  key={link}
                  type='button'
                  className='text-start text-[10px] text-[color:var(--cc-muted-foreground)] transition-colors hover:text-[color:var(--cc-surface-foreground)]'
                >
                  {link}
                </button>
              ))}
            </div>
          ))}
        </div>

        <div className='flex flex-wrap items-center justify-between gap-2 border-t-[length:var(--cc-border-width)] border-[color:var(--cc-border)] pt-2'>
          <span className='text-[10px] text-[color:var(--cc-muted-foreground)]'>
            © ۱۴۰۴ مانو · ساخته‌شده با کامپوننت‌های استودیو
          </span>
          <div className='flex flex-wrap items-center gap-1'>
            <Badge variant='outline'>زرین‌پال</Badge>
            <Badge variant='outline'>شتاب</Badge>
            <Badge variant='outline'>پرداخت در محل</Badge>
          </div>
        </div>
      </footer>
    </div>
  );
}

