"use client";

import { useState } from "react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardTitle,
  Icon,
  monoType,
} from "@/components/create-components";
import { cn } from "@/lib/utils";
import { GarmentArt } from "../art/shop-art";
import { StarRating } from "../art/shared";
import type { ShopProduct } from "../data/shop";
import { formatNumber } from "../format";
import { Lift } from "../motion-primitives";
import { sc as styles } from "../scenes";

/**
 * Catalogue tile.
 *
 * Rebuilt around three reads: what it is (name + price), how it is rated, and
 * how to pick a variant. The long description lives in the `title` attribute
 * instead of a second text block, which keeps every card the same height and
 * lets the grid scan vertically.
 */
export function ShopProductCard({
  product,
  liked,
  onToggleLike,
  onAdd,
}: {
  product: ShopProduct;
  liked: boolean;
  onToggleLike: (id: string) => void;
  onAdd: (id: string, color: string, size: string) => void;
}) {
  const firstAvailable =
    product.sizes.find((size) => size.inStock)?.label ?? product.sizes[0].label;
  const [color, setColor] = useState(product.palette[0].hex);
  const [size, setSize] = useState(firstAvailable);
  const discount = product.oldPrice
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : 0;
  const activeColor =
    product.palette.find((entry) => entry.hex === color) ?? product.palette[0];

  return (
    <Lift className='h-full'>
      <Card className='group h-full gap-0 overflow-hidden p-0'>
        <div className='relative aspect-[5/4] overflow-hidden border-b-[length:var(--cc-border-width)] border-[color:var(--cc-border)] bg-[var(--cc-muted)]'>
          <GarmentArt
            variant={product.art}
            color={color}
            className='size-full transition-transform duration-500 group-hover:scale-[1.05]'
          />

          {/* Light sweep on hover; purely decorative, so it stays aria-hidden. */}
          <span className='pointer-events-none absolute inset-0 overflow-hidden opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
            <span
              aria-hidden='true'
              className={cn(
                styles.shimmer,
                "absolute inset-y-0 -start-1/3 w-1/3 bg-[var(--cc-surface)]",
              )}
            />
          </span>

          <div className='absolute start-2 top-2 flex flex-col items-start gap-1'>
            {discount > 0 ? (
              <Badge variant='danger'>{formatNumber(discount)}٪ تخفیف</Badge>
            ) : null}
            {product.badge === "new" ? (
              <Badge variant='accent'>جدید</Badge>
            ) : null}
            {product.badge === "last" ? (
              <Badge variant='warning'>آخرین موجودی</Badge>
            ) : null}
          </div>

          <Button
            size='icon'
            variant='outline'
            className='absolute end-2 top-2 size-8'
            aria-label={
              liked
                ? `حذف ${product.name} از علاقه‌مندی‌ها`
                : `افزودن ${product.name} به علاقه‌مندی‌ها`
            }
            aria-pressed={liked}
            onClick={() => onToggleLike(product.id)}
          >
            <Icon
              name='heart'
              className={cn(
                "size-4 transition-colors",
                liked &&
                  "fill-[var(--cc-danger)] text-[color:var(--cc-danger)]",
              )}
            />
          </Button>

          {product.inStock ? null : (
            <div className='absolute inset-0 flex items-center justify-center bg-[var(--cc-muted)]/55 backdrop-blur-[1px]'>
              <Badge
                variant='outline'
                className='bg-[var(--cc-surface)] px-3 py-1'
              >
                فعلاً ناموجود
              </Badge>
            </div>
          )}
        </div>

        <CardContent className='gap-2 p-[calc(0.75rem*var(--cc-density))]'>
          <div className='flex items-start justify-between gap-2'>
            <div className='flex min-w-0 flex-col gap-0.5'>
              <CardTitle
                className='truncate text-[length:calc(var(--cc-font-size)*1.02)]'
                title={product.description}
              >
                {product.name}
              </CardTitle>
              <span className='flex items-center gap-1.5'>
                <StarRating value={product.rating} />
                <span className='text-[0.6875rem] text-[color:var(--cc-muted-foreground)]'>
                  {formatNumber(product.reviews)} نظر
                </span>
              </span>
            </div>
            <div className='flex shrink-0 flex-col items-end gap-0.5 leading-tight'>
              <span
                className={cn(
                  "text-[length:calc(var(--cc-font-size)*1.05)] font-bold text-[color:var(--cc-surface-foreground)]",
                  monoType,
                )}
              >
                {formatNumber(product.price)}
                <span className='ms-1 text-[0.6875rem] font-normal text-[color:var(--cc-muted-foreground)]'>
                  تومان
                </span>
              </span>
              {product.oldPrice ? (
                <span
                  className={cn(
                    "text-[0.6875rem] text-[color:var(--cc-muted-foreground)] line-through decoration-1",
                    monoType,
                  )}
                >
                  {formatNumber(product.oldPrice)}
                </span>
              ) : null}
            </div>
          </div>

          <div className='flex items-center gap-1.5'>
            {product.palette.map((entry) => {
              const active = entry.hex === color;
              return (
                <button
                  key={entry.hex}
                  type='button'
                  onClick={() => setColor(entry.hex)}
                  aria-label={`رنگ ${entry.name}`}
                  aria-pressed={active}
                  title={entry.name}
                  className={cn(
                    "size-4 rounded-full border transition-transform",
                    active
                      ? "scale-110 border-[color:var(--cc-surface-foreground)] ring-1 ring-[color:var(--cc-surface-foreground)] ring-offset-1 ring-offset-[var(--cc-surface)]"
                      : "border-[color:var(--cc-border)] hover:scale-110",
                  )}
                  style={{ backgroundColor: entry.hex }}
                />
              );
            })}
            <span className='text-[0.6875rem] text-[color:var(--cc-muted-foreground)]'>
              {activeColor.name}
            </span>
          </div>

          <div className='flex flex-wrap gap-1'>
            {product.sizes.map((entry) => {
              const active = entry.label === size;
              return (
                <button
                  key={entry.label}
                  type='button'
                  disabled={!entry.inStock}
                  onClick={() => setSize(entry.label)}
                  aria-pressed={active}
                  aria-label={`سایز ${entry.label}${entry.inStock ? "" : " ناموجود"}`}
                  className={cn(
                    "min-w-7 rounded-[var(--cc-radius-sm)] border-[length:var(--cc-border-width)] px-1.5 py-0.5 text-[0.6875rem]",
                    "border-[color:var(--cc-border)] transition-colors",
                    active
                      ? "bg-[var(--cc-primary)] text-[color:var(--cc-primary-foreground)]"
                      : "bg-[var(--cc-surface)] text-[color:var(--cc-surface-foreground)] hover:bg-[var(--cc-muted)]",
                    !entry.inStock &&
                      "cursor-not-allowed text-[color:var(--cc-muted-foreground)] line-through opacity-50",
                  )}
                >
                  {entry.label}
                </button>
              );
            })}
          </div>

          <Button
            fullWidth
            size='sm'
            disabled={!product.inStock}
            onClick={() => onAdd(product.id, color, size)}
          >
            <Icon name='plus' className='size-3.5' />
            {product.inStock ? "افزودن به سبد" : "ناموجود"}
          </Button>
        </CardContent>
      </Card>
    </Lift>
  );
}
