"use client";

import { useState } from "react";
import {
  Badge,
  Button,
  Icon,
  Input,
  Select,
  Slider,
  Switch,
  monoType,
} from "@/components/create-components";
import { cn } from "@/lib/utils";
import {
  PRICE_CEILING,
  PRICE_FLOOR,
  SHOP_CATEGORIES,
  SHOP_PRODUCTS,
  type ShopProduct,
} from "../data/shop";
import { formatNumber, formatToman } from "../format";
import { Collapse } from "../motion-primitives";
import { CategoryTileArt } from "../art/shop-art";
import { ShopProductCard } from "./product-card";
import { SectionHeading } from "./section-heading";

/** Every catalogue control lives in one object, so the page passes one prop. */
export type ShopFilters = {
  category: string;
  query: string;
  sort: string;
  maxPrice: number;
  size: string;
  colour: string;
  inStockOnly: boolean;
  discountOnly: boolean;
  wishlistOnly: boolean;
};

export const DEFAULT_FILTERS: ShopFilters = {
  category: "all",
  query: "",
  sort: "featured",
  maxPrice: PRICE_CEILING,
  size: "all",
  colour: "all",
  inStockOnly: false,
  discountOnly: false,
  wishlistOnly: false,
};

export const SORT_OPTIONS = [
  { value: "featured", label: "پیشنهاد مانو" },
  { value: "price-asc", label: "ارزان‌ترین" },
  { value: "price-desc", label: "گران‌ترین" },
  { value: "rating", label: "بالاترین امتیاز" },
];

const SIZE_FILTERS = Array.from(
  new Set(SHOP_PRODUCTS.flatMap((product) => product.sizes.map((s) => s.label))),
);

const COLOUR_FILTERS = Array.from(
  new Map(
    SHOP_PRODUCTS.flatMap((product) =>
      product.palette.map((colour) => [colour.hex, colour] as const),
    ),
  ).values(),
);

const CATEGORY_COUNTS: Record<string, number> = SHOP_CATEGORIES.reduce(
  (counts, category) => ({
    ...counts,
    [category.value]:
      category.value === "all"
        ? SHOP_PRODUCTS.length
        : SHOP_PRODUCTS.filter((product) => product.category === category.value)
            .length,
  }),
  {},
);

const RAIL_PANEL = [
  "rounded-[var(--cc-card-radius)] border-[length:var(--cc-border-width)] border-[color:var(--cc-border)]",
  "bg-[var(--cc-surface)] [background-image:var(--cc-surface-pattern)]",
  "[background-size:var(--cc-surface-pattern-size)] [box-shadow:var(--cc-shadow)]",
].join(" ");

const RAIL_HEADING = "text-[11px] font-bold text-[color:var(--cc-muted-foreground)]";
const RAIL_SECTION =
  "flex flex-col gap-1.5 border-t-[length:var(--cc-border-width)] border-[color:var(--cc-border)] pt-3";

/** Toggle chip shared by the category, size and colour rows. */
function chipClass(active: boolean) {
  return cn(
    "rounded-[var(--cc-radius-sm)] border-[length:var(--cc-border-width)] px-2 py-0.5 text-[11px] transition-colors",
    active
      ? "border-transparent bg-[var(--cc-primary)] text-[color:var(--cc-primary-foreground)]"
      : "border-[color:var(--cc-border)] text-[color:var(--cc-surface-foreground)] hover:bg-[var(--cc-muted)]",
  );
}

/**
 * The filter rail. Rendered twice — once as the sticky column from `@4xl` and
 * once inside the mobile disclosure — so it holds no ids and only touches
 * state through the callbacks it is given.
 */
function FilterRail({
  filters,
  patchFilters,
  resetFilters,
}: {
  filters: ShopFilters;
  patchFilters: (patch: Partial<ShopFilters>) => void;
  resetFilters: () => void;
}) {
  return (
    <div className={cn(RAIL_PANEL, "flex flex-col gap-3 p-3")}>
      <div className='flex flex-col gap-1.5'>
        <span className={RAIL_HEADING}>دسته‌بندی</span>
        <div className='flex flex-col gap-1'>
          {SHOP_CATEGORIES.map((category) => {
            const active = filters.category === category.value;
            return (
              <button
                key={category.value}
                type='button'
                aria-pressed={active}
                onClick={() => patchFilters({ category: category.value })}
                className={cn(
                  "flex items-center justify-between gap-2 rounded-[var(--cc-radius-sm)] px-2 py-1.5 text-[length:calc(var(--cc-font-size)*0.86)] transition-colors",
                  active
                    ? "bg-[var(--cc-primary)] text-[color:var(--cc-primary-foreground)]"
                    : "text-[color:var(--cc-surface-foreground)] hover:bg-[var(--cc-muted)]",
                )}
              >
                <span>{category.label}</span>
                <span className={cn("text-[11px] opacity-75", monoType)}>
                  {formatNumber(CATEGORY_COUNTS[category.value] ?? 0)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className={RAIL_SECTION}>
        <div className='flex items-baseline justify-between gap-2'>
          <span className={RAIL_HEADING}>سقف قیمت</span>
          <span
            className={cn(
              "text-[length:calc(var(--cc-font-size)*0.86)] font-bold text-[color:var(--cc-surface-foreground)]",
              monoType,
            )}
          >
            {formatToman(filters.maxPrice)}
          </span>
        </div>
        <Slider
          min={PRICE_FLOOR}
          max={PRICE_CEILING}
          step={100_000}
          value={filters.maxPrice}
          onChange={(event) =>
            patchFilters({ maxPrice: Number(event.target.value) })
          }
          aria-label='سقف قیمت'
        />
      </div>

      <div className={RAIL_SECTION}>
        <span className={RAIL_HEADING}>سایز</span>
        <div className='flex flex-wrap gap-1'>
          <button
            type='button'
            aria-pressed={filters.size === "all"}
            onClick={() => patchFilters({ size: "all" })}
            className={chipClass(filters.size === "all")}
          >
            همه
          </button>
          {SIZE_FILTERS.map((size) => (
            <button
              key={size}
              type='button'
              aria-pressed={filters.size === size}
              onClick={() => patchFilters({ size })}
              className={chipClass(filters.size === size)}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div className={RAIL_SECTION}>
        <span className={RAIL_HEADING}>رنگ</span>
        <div className='flex flex-wrap items-center gap-1.5'>
          <button
            type='button'
            aria-pressed={filters.colour === "all"}
            onClick={() => patchFilters({ colour: "all" })}
            className={chipClass(filters.colour === "all")}
          >
            همه
          </button>
          {COLOUR_FILTERS.map((colour) => {
            const active = filters.colour === colour.hex;
            return (
              <button
                key={colour.hex}
                type='button'
                aria-label={`رنگ ${colour.name}`}
                aria-pressed={active}
                title={colour.name}
                onClick={() => patchFilters({ colour: colour.hex })}
                className={cn(
                  "size-5 rounded-full border transition-transform",
                  active
                    ? "scale-110 border-[color:var(--cc-surface-foreground)] ring-1 ring-[color:var(--cc-surface-foreground)] ring-offset-1 ring-offset-[var(--cc-surface)]"
                    : "border-[color:var(--cc-border)] hover:scale-110",
                )}
                style={{ backgroundColor: colour.hex }}
              />
            );
          })}
        </div>
      </div>

      <div className={cn(RAIL_SECTION, "gap-2")}>
        {[
          {
            label: "فقط موجود",
            checked: filters.inStockOnly,
            patch: { inStockOnly: !filters.inStockOnly },
          },
          {
            label: "فقط تخفیف‌دار",
            checked: filters.discountOnly,
            patch: { discountOnly: !filters.discountOnly },
          },
          {
            label: "علاقه‌مندی‌ها",
            checked: filters.wishlistOnly,
            patch: { wishlistOnly: !filters.wishlistOnly },
          },
        ].map((row) => (
          <div
            key={row.label}
            className='flex items-center justify-between gap-2'
          >
            <span className='text-[length:calc(var(--cc-font-size)*0.86)] text-[color:var(--cc-surface-foreground)]'>
              {row.label}
            </span>
            <Switch
              checked={row.checked}
              onCheckedChange={() => patchFilters(row.patch)}
              aria-label={row.label}
            />
          </div>
        ))}
      </div>

      <Button
        variant='outline'
        size='sm'
        fullWidth
        onClick={resetFilters}
        className='mt-1'
      >
        <Icon name='refresh' className='size-3.5' />
        پاک کردن فیلترها
      </Button>
    </div>
  );
}



/**
 * `#shop-collection`: toolbar, filter rail and the product grid. The filters
 * themselves live in the page (`ShopFilters`), because the header, the hero
 * and the category tiles all set them too.
 */
export function ShopCatalog({
  filters,
  patchFilters,
  resetFilters,
  visibleProducts,
  liked,
  onToggleLike,
  onAdd,
}: {
  filters: ShopFilters;
  patchFilters: (patch: Partial<ShopFilters>) => void;
  resetFilters: () => void;
  visibleProducts: ShopProduct[];
  liked: string[];
  onToggleLike: (id: string) => void;
  onAdd: (id: string, color: string, size: string) => void;
}) {
  const [filtersOpen, setFiltersOpen] = useState(false);

  const chips: { key: string; label: string; clear: Partial<ShopFilters> }[] = [];
  if (filters.category !== "all") {
    chips.push({
      key: "category",
      label:
        SHOP_CATEGORIES.find((entry) => entry.value === filters.category)
          ?.label ?? "",
      clear: { category: "all" },
    });
  }
  if (filters.size !== "all") {
    chips.push({
      key: "size",
      label: `سایز ${filters.size}`,
      clear: { size: "all" },
    });
  }
  if (filters.colour !== "all") {
    chips.push({
      key: "colour",
      label:
        COLOUR_FILTERS.find((entry) => entry.hex === filters.colour)?.name ?? "",
      clear: { colour: "all" },
    });
  }
  if (filters.inStockOnly) {
    chips.push({
      key: "stock",
      label: "فقط موجود",
      clear: { inStockOnly: false },
    });
  }
  if (filters.discountOnly) {
    chips.push({
      key: "discount",
      label: "فقط تخفیف‌دار",
      clear: { discountOnly: false },
    });
  }
  if (filters.wishlistOnly) {
    chips.push({
      key: "wishlist",
      label: "علاقه‌مندی‌ها",
      clear: { wishlistOnly: false },
    });
  }
  if (filters.maxPrice < PRICE_CEILING) {
    chips.push({
      key: "price",
      label: `تا ${formatToman(filters.maxPrice)}`,
      clear: { maxPrice: PRICE_CEILING },
    });
  }
  if (filters.query.trim()) {
    chips.push({
      key: "query",
      label: `«${filters.query.trim()}»`,
      clear: { query: "" },
    });
  }

  return (
    <section
      id='shop-collection'
      aria-labelledby='shop-collection-title'
      className='flex flex-col gap-4'
    >
      <SectionHeading
        id='shop-collection-title'
        eyebrow='کالکشن پاییز ۱۴۰۴'
        title='همهٔ قطعه‌ها'
        description='هشت قطعهٔ محدود، با فیلتر سایز و رنگ تا دقیقاً همان چیزی را پیدا کنی که می‌خواهی.'
        trailing={
          <Badge variant='soft'>
            {formatNumber(SHOP_PRODUCTS.length)} قطعه
          </Badge>
        }
      />

      <div className='flex flex-wrap items-center gap-2'>
        <div className='relative min-w-40 flex-1'>
          <Icon
            name='search'
            className='pointer-events-none absolute start-2.5 top-1/2 size-3.5 -translate-y-1/2 text-[color:var(--cc-muted-foreground)]'
          />
          <Input
            id='shop-search'
            value={filters.query}
            onChange={(event) => patchFilters({ query: event.target.value })}
            className='h-9 ps-8 text-xs'
            placeholder='جستجو در نام، رنگ یا توضیح…'
            aria-label='جستجوی محصولات'
          />
        </div>

        <div className='flex items-center gap-2'>
          <span className='hidden text-[11px] text-[color:var(--cc-muted-foreground)] @2xl:inline'>
            مرتب‌سازی
          </span>
          <Select
            options={SORT_OPTIONS}
            value={filters.sort}
            onValueChange={(sort) => patchFilters({ sort })}
            className='w-36'
          />
        </div>

        <Button
          variant='outline'
          size='sm'
          className='@4xl:hidden'
          aria-expanded={filtersOpen}
          onClick={() => setFiltersOpen((open) => !open)}
        >
          <Icon name='filter' className='size-3.5' />
          فیلترها
          {chips.length ? (
            <Badge variant='solid' className='px-1.5'>
              {formatNumber(chips.length)}
            </Badge>
          ) : null}
        </Button>
      </div>

      <div className='@4xl:hidden'>
        <Collapse open={filtersOpen}>
          <div className='pt-1'>
            <FilterRail
              filters={filters}
              patchFilters={patchFilters}
              resetFilters={resetFilters}
            />
          </div>
        </Collapse>
      </div>

      {chips.length ? (
        <div className='flex flex-wrap items-center gap-1.5'>
          <span className='text-[11px] text-[color:var(--cc-muted-foreground)]'>
            فیلترها:
          </span>
          {chips.map((chip) => (
            <Button
              key={chip.key}
              size='sm'
              variant='outline'
              onClick={() => patchFilters(chip.clear)}
            >
              {chip.label}
              <Icon name='close' className='size-3' />
            </Button>
          ))}
          <Button variant='ghost' size='sm' onClick={resetFilters}>
            حذف همه
          </Button>
        </div>
      ) : null}

      <div className='grid gap-4 @4xl:grid-cols-[224px_1fr]'>
        <div className='hidden @4xl:block'>
          <div className='sticky top-2'>
            <FilterRail
              filters={filters}
              patchFilters={patchFilters}
              resetFilters={resetFilters}
            />
          </div>
        </div>

        <div className='flex flex-col gap-3'>
          <div className='flex items-center gap-2'>
            <Badge variant='soft'>
              {formatNumber(visibleProducts.length)} کالا
            </Badge>
            <span className='text-[11px] text-[color:var(--cc-muted-foreground)]'>
              از {formatNumber(SHOP_PRODUCTS.length)} قطعه
            </span>
          </div>

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
            <div
              className={cn(
                RAIL_PANEL,
                "flex flex-col items-center gap-3 px-4 py-6 text-center",
              )}
            >
              <CategoryTileArt
                category='accessories'
                className='h-32 w-full max-w-56 rounded-[var(--cc-radius)] border-[length:var(--cc-border-width)] border-[color:var(--cc-border)]'
              />
              <span className='text-sm font-bold text-[color:var(--cc-surface-foreground)]'>
                کالایی با این فیلترها پیدا نشد
              </span>
              <p className='max-w-sm text-[11px] text-[color:var(--cc-muted-foreground)]'>
                سقف قیمت را بالاتر ببر، سایز یا رنگ را تغییر بده یا فیلترها را
                پاک کن.
              </p>
              <Button size='sm' variant='outline' onClick={resetFilters}>
                <Icon name='refresh' className='size-3.5' />
                شروع دوباره
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
