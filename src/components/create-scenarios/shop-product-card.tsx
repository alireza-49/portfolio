"use client";

import { useState } from "react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardTitle,
  Icon,
} from "@/components/create-components";
import { cn } from "@/lib/utils";
import { formatNumber, formatToman } from "./format";
import { GarmentArt } from "./art/shop-art";
import { StarRating } from "./art/shared";
import type { ShopProduct } from "./data/shop";

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
    <Card className='group gap-0 overflow-hidden p-0'>
      <div className='relative aspect-[4/3] overflow-hidden border-b-[length:var(--cc-border-width)] border-[color:var(--cc-border)] bg-[var(--cc-muted)]'>
        <GarmentArt
          variant={product.art}
          color={color}
          className='size-full transition-transform duration-500 group-hover:scale-[1.04]'
        />

        <div className='absolute start-2 top-2 flex flex-col items-start gap-1'>
          {discount > 0 ? (
            <Badge variant='danger'>{formatNumber(discount)}٪ تخفیف</Badge>
          ) : null}
          {product.badge === "new" ? <Badge variant='accent'>جدید</Badge> : null}
          {product.badge === "last" ? (
            <Badge variant='warning'>آخرین موجودی</Badge>
          ) : null}
        </div>

        <Button
          size='icon'
          variant='outline'
          className='absolute end-2 top-2'
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
            className={liked ? "size-4 fill-current" : "size-4"}
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

      <CardContent className='gap-2.5 p-[calc(1rem*var(--cc-density))]'>
        <div className='flex items-start justify-between gap-2'>
          <CardTitle className='text-[length:calc(var(--cc-font-size)*1.05)]'>
            {product.name}
          </CardTitle>
          <span className='shrink-0 pt-0.5 text-[10px] text-[color:var(--cc-muted-foreground)]'>
            {formatNumber(product.reviews)} نظر
          </span>
        </div>

        <StarRating value={product.rating} />

        <CardDescription className='line-clamp-2 text-[length:calc(var(--cc-font-size)*0.82)]'>
          {product.description}
        </CardDescription>

        <div className='flex items-center justify-between gap-2'>
          <div className='flex flex-col'>
            <span className='font-mono text-sm font-bold text-[color:var(--cc-surface-foreground)]'>
              {formatToman(product.price)}
            </span>
            {product.oldPrice ? (
              <span className='font-mono text-[10px] text-[color:var(--cc-muted-foreground)] line-through'>
                {formatToman(product.oldPrice)}
              </span>
            ) : null}
          </div>
          <span className='text-[10px] text-[color:var(--cc-muted-foreground)]'>
            {activeColor.name}
          </span>
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
          <span className='ms-auto text-[10px] text-[color:var(--cc-muted-foreground)]'>
            {product.sizes.length} سایز
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
                  "min-w-7 rounded-[var(--cc-radius-sm)] border-[length:var(--cc-border-width)] px-1.5 py-0.5 text-[10px]",
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
  );
}

