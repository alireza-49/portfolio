"use client";

import { Badge, Button, Icon, monoType } from "@/components/create-components";
import { cn } from "@/lib/utils";
import { GarmentArt } from "../art/shop-art";
import type { ShopProduct } from "../data/shop";
import { formatNumber } from "../format";

const discountPercent = (product: ShopProduct) =>
  product.oldPrice
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : 0;

/**
 * The hero's product spotlight — a *mini* card, not a second product grid.
 *
 * It sits in the empty bottom corner of `ShopfrontScene` on wide screens and
 * drops into flow under the illustration on narrow ones (one element, two
 * positions). The rating lives in the hero's meta line, so it is deliberately
 * absent here: what is left is the four things a shopper needs — what it is,
 * what it costs, which colour, and the add button.
 */
export function HeroOffer({
  product,
  color,
  onColorChange,
  onAdd,
  className,
}: {
  product: ShopProduct;
  color: string;
  onColorChange: (hex: string) => void;
  onAdd: () => void;
  className?: string;
}) {
  const activeColor =
    product.palette.find((entry) => entry.hex === color) ?? product.palette[0];
  const discount = discountPercent(product);

  return (
    <div
      className={cn(
        "flex flex-col gap-1.5 rounded-[var(--cc-radius)] bg-[var(--cc-surface)] p-2",
        "border-[length:var(--cc-border-width)] border-[color:var(--cc-border)] [box-shadow:var(--cc-shadow)]",
        className,
      )}
    >
      <div className='flex items-center gap-2'>
        <span className='h-9 w-12 shrink-0 overflow-hidden rounded-[var(--cc-radius-sm)] border-[length:var(--cc-border-width)] border-[color:var(--cc-border)] bg-[var(--cc-muted)]'>
          <GarmentArt
            variant={product.art}
            color={color}
            className='size-full'
          />
        </span>

        <span className='flex min-w-0 flex-1 flex-col gap-0.5'>
          <span className='flex items-center gap-1 text-[11px] font-bold text-[color:var(--cc-surface-foreground)]'>
            <span className='truncate'>{product.name}</span>
            {discount > 0 ? (
              <Badge variant='danger' className='shrink-0 px-1 py-0'>
                {formatNumber(discount)}٪
              </Badge>
            ) : null}
          </span>
          <span className='flex flex-wrap items-baseline gap-x-1.5'>
            <span
              className={cn(
                "text-xs font-bold text-[color:var(--cc-surface-foreground)]",
                monoType,
              )}
            >
              {formatNumber(product.price)}
              <span className='ms-1 text-[11px] font-normal text-[color:var(--cc-muted-foreground)]'>
                تومان
              </span>
            </span>
          </span>
        </span>
      </div>

      <div className='flex items-center gap-1.5 border-t-[length:var(--cc-border-width)] border-[color:var(--cc-border)] pt-1.5'>
        {product.palette.map((entry) => {
          const active = entry.hex === color;
          return (
            <button
              key={entry.hex}
              type='button'
              onClick={() => onColorChange(entry.hex)}
              aria-label={`رنگ ${entry.name}`}
              aria-pressed={active}
              title={entry.name}
              className={cn(
                "size-3.5 rounded-full border transition-transform",
                active
                  ? "scale-110 border-[color:var(--cc-surface-foreground)] ring-1 ring-[color:var(--cc-surface-foreground)] ring-offset-1 ring-offset-[var(--cc-surface)]"
                  : "border-[color:var(--cc-border)] hover:scale-110",
              )}
              style={{ backgroundColor: entry.hex }}
            />
          );
        })}
        <span className='truncate text-[11px] text-[color:var(--cc-muted-foreground)]'>
          {activeColor.name}
        </span>
        <Button
          size='sm'
          className='ms-auto h-7 px-2 text-[11px]'
          onClick={onAdd}
        >
          <Icon name='plus' className='size-3' />
          افزودن
        </Button>
      </div>
    </div>
  );
}

