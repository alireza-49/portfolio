"use client";

import type { FormEvent } from "react";
import { AnimatePresence } from "motion/react";
import {
  Alert,
  Badge,
  Button,
  Icon,
  Input,
  Separator,
  Timeline,
  TimelineItem,
  buttonVariants,
  monoType,
  type TimelineTone,
} from "@/components/create-components";
import { cn } from "@/lib/utils";
import { GarmentArt, OrderPlacedScene, ShippingTrack } from "../art/shop-art";
import {
  COUPON_CODE,
  FREE_SHIPPING,
  SHOP_TRACKING,
  type ShopProduct,
} from "../data/shop";
import { formatNumber, formatToman } from "../format";
import { Row, Swap } from "../motion-primitives";
import { SectionHeading } from "./section-heading";

export type BagLine = {
  product: ShopProduct;
  qty: number;
  color: string;
  size: string;
};

export type BagTotals = {
  count: number;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  remaining: number;
  percent: number;
};

const PANEL = [
  "rounded-[var(--cc-card-radius)] border-[length:var(--cc-border-width)] border-[color:var(--cc-border)]",
  "bg-[var(--cc-surface)] [background-image:var(--cc-surface-pattern)]",
  "[background-size:var(--cc-surface-pattern-size)] [box-shadow:var(--cc-shadow)]",
].join(" ");

const TONE: Record<string, TimelineTone> = {
  success: "success",
  primary: "primary",
  muted: "muted",
};

/**
 * `#shop-bag`: the bag itself plus the checkout summary. Removing a line plays
 * the `Row` exit animation, the free-shipping meter is the `ShippingTrack`
 * illustration, and a completed checkout swaps in the receipt scene and the
 * order timeline instead of a bare alert.
 */
export function ShopBag({
  lines,
  totals,
  coupon,
  couponState,
  checkoutDone,
  onCouponChange,
  onApplyCoupon,
  onChangeQty,
  onClearCart,
  onCheckout,
}: {
  lines: BagLine[];
  totals: BagTotals;
  coupon: string;
  couponState: "idle" | "applied" | "error";
  checkoutDone: boolean;
  onCouponChange: (value: string) => void;
  onApplyCoupon: (event: FormEvent<HTMLFormElement>) => void;
  onChangeQty: (id: string, delta: number) => void;
  onClearCart: () => void;
  onCheckout: () => void;
}) {
  const trackingCode = `MANO-${formatNumber(1400 + totals.count * 7)}`;

  return (
    <section
      id='shop-bag'
      aria-labelledby='shop-bag-title'
      className='flex flex-col gap-4'
    >
      <SectionHeading
        id='shop-bag-title'
        eyebrow='سبد و پرداخت'
        title='سبد خرید'
        description={`ارسال رایگان برای خرید بالای ${formatToman(FREE_SHIPPING)} و تعویض سایز تا ۷ روز.`}
        trailing={<Badge variant='soft'>{formatNumber(totals.count)} قلم</Badge>}
      />

      <Swap swapKey={checkoutDone ? "done" : "open"}>
        {checkoutDone ? (
          <div
            className={cn(
              PANEL,
              "grid items-center gap-4 p-[calc(1rem*var(--cc-density))] @2xl:grid-cols-[13.75rem_1fr]",
            )}
          >
            <OrderPlacedScene className='h-44 w-full rounded-[var(--cc-radius)] border-[length:var(--cc-border-width)] border-[color:var(--cc-border)]' />
            <div className='flex flex-col gap-2'>
              <Badge variant='success' className='self-start'>
                سفارش آزمایشی ثبت شد
              </Badge>
              <h4 className='text-base text-[color:var(--cc-surface-foreground)]'>
                کد پیگیری{" "}
                <span className={cn("font-bold", monoType)} dir='ltr'>
                  {trackingCode}
                </span>
              </h4>
              <p className='text-[length:calc(var(--cc-font-size)*0.88)] text-[color:var(--cc-muted-foreground)]'>
                این یک دموی استودیو است؛ سفارش واقعی ثبت نمی‌شود. مراحل زیر
                نمونهٔ پیگیری یک خرید واقعی است.
              </p>
              <Timeline className='pt-1'>
                {SHOP_TRACKING.map((step) => (
                  <TimelineItem
                    key={step.title}
                    title={step.title}
                    description={step.description}
                    meta={step.meta}
                    tone={TONE[step.tone]}
                  />
                ))}
              </Timeline>
            </div>
          </div>
        ) : null}
      </Swap>

      {lines.length ? (
        <div className='grid gap-4 @3xl:grid-cols-[1.25fr_0.85fr]'>
          <div className={cn(PANEL, "flex flex-col gap-2 p-3")}>
            <ul className='flex flex-col gap-2'>
              <AnimatePresence initial={false}>
                {lines.map((line) => {
                  const colour = line.product.palette.find(
                    (entry) => entry.hex === line.color,
                  );
                  return (
                    <Row
                      key={line.product.id}
                      className='flex flex-wrap items-center gap-3 rounded-[var(--cc-radius)] border-[length:var(--cc-border-width)] border-[color:var(--cc-border)] p-2'
                    >
                      <span className='size-16 shrink-0 overflow-hidden rounded-[var(--cc-radius-sm)] border-[length:var(--cc-border-width)] border-[color:var(--cc-border)] bg-[var(--cc-muted)]'>
                        <GarmentArt
                          variant={line.product.art}
                          color={line.color}
                          className='size-full'
                        />
                      </span>
                      <div className='min-w-0 flex-1'>
                        <div className='flex items-start justify-between gap-2'>
                          <span className='text-[length:calc(var(--cc-font-size)*0.9)] font-bold text-[color:var(--cc-surface-foreground)]'>
                            {line.product.name}
                          </span>
                          <Button
                            size='icon'
                            variant='ghost'
                            className='size-6'
                            aria-label={`حذف ${line.product.name}`}
                            onClick={() =>
                              onChangeQty(line.product.id, -line.qty)
                            }
                          >
                            <Icon name='trash' className='size-3.5' />
                          </Button>
                        </div>
                        <span className='text-[0.6875rem] text-[color:var(--cc-muted-foreground)]'>
                          سایز {line.size}
                          {colour ? ` · ${colour.name}` : ""}
                        </span>
                        <div className='mt-1.5 flex items-center justify-between gap-2'>
                          <div className='flex items-center gap-1'>
                            <Button
                              size='icon'
                              variant='outline'
                              className='size-6'
                              aria-label={`کاهش ${line.product.name}`}
                              onClick={() => onChangeQty(line.product.id, -1)}
                            >
                              <Icon name='minus' className='size-3' />
                            </Button>
                            <span
                              className={cn(
                                "w-6 text-center text-xs",
                                monoType,
                              )}
                            >
                              {formatNumber(line.qty)}
                            </span>
                            <Button
                              size='icon'
                              variant='outline'
                              className='size-6'
                              aria-label={`افزایش ${line.product.name}`}
                              onClick={() => onChangeQty(line.product.id, 1)}
                            >
                              <Icon name='plus' className='size-3' />
                            </Button>
                          </div>
                          <span
                            className={cn(
                              "text-xs font-bold text-[color:var(--cc-surface-foreground)]",
                              monoType,
                            )}
                          >
                            {formatNumber(line.product.price * line.qty)}
                          </span>
                        </div>
                      </div>
                    </Row>
                  );
                })}
              </AnimatePresence>
            </ul>

            <div className='flex flex-wrap items-center justify-between gap-2'>
              <Button variant='ghost' size='sm' onClick={onClearCart}>
                <Icon name='trash' className='size-3.5' />
                خالی کردن سبد
              </Button>
              <span className='text-[0.6875rem] text-[color:var(--cc-muted-foreground)]'>
                قیمت‌ها شامل مالیات است.
              </span>
            </div>
          </div>

          <div className={cn(PANEL, "flex flex-col gap-2.5 p-3")}>
            <div className='flex items-center justify-between text-[length:calc(var(--cc-font-size)*0.88)] text-[color:var(--cc-muted-foreground)]'>
              <span>جمع کالاها</span>
              <span className={monoType}>{formatToman(totals.subtotal)}</span>
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
            <span className='text-[0.6875rem] text-[color:var(--cc-muted-foreground)]'>
              کد نمایشی:{" "}
              <span className={cn("font-bold", monoType)} dir='ltr'>
                {COUPON_CODE}
              </span>
            </span>

            {couponState === "applied" ? (
              <Alert variant='success' title='کد اعمال شد'>
                ۱۰٪ تخفیف روی جمع کالاها فعال است.
              </Alert>
            ) : null}
            {couponState === "error" ? (
              <Alert variant='danger' title='کد معتبر نیست'>
                کد <span className={monoType}>{COUPON_CODE}</span> را امتحان کن.
              </Alert>
            ) : null}

            {totals.discount > 0 ? (
              <div className='flex items-center justify-between text-[length:calc(var(--cc-font-size)*0.88)] text-[color:var(--cc-success)]'>
                <span>تخفیف کد</span>
                <span className={monoType}>
                  − {formatToman(totals.discount)}
                </span>
              </div>
            ) : null}

            <div className='flex items-center justify-between text-[length:calc(var(--cc-font-size)*0.88)] text-[color:var(--cc-muted-foreground)]'>
              <span>ارسال</span>
              <span className={monoType}>
                {totals.shipping === 0 ? "رایگان" : formatToman(totals.shipping)}
              </span>
            </div>

            <Separator />

            <div className='flex items-center justify-between'>
              <span className='text-sm font-bold text-[color:var(--cc-surface-foreground)]'>
                مبلغ نهایی
              </span>
              <span
                className={cn(
                  "text-base font-bold text-[color:var(--cc-surface-foreground)]",
                  monoType,
                )}
              >
                {formatToman(totals.total)}
              </span>
            </div>

            <div className='flex flex-col gap-1.5 rounded-[var(--cc-radius)] border-[length:var(--cc-border-width)] border-[color:var(--cc-border)] bg-[var(--cc-muted)] p-2'>
              <ShippingTrack percent={totals.percent} className='h-16 w-full' />
              <div className='flex flex-col gap-0.5'>
                <span className='text-[0.6875rem] font-bold text-[color:var(--cc-surface-foreground)]'>
                  {totals.remaining > 0
                    ? `${formatToman(totals.remaining)} تا ارسال رایگان`
                    : "ارسال رایگان فعال شد"}
                </span>
                <span className='text-[0.6875rem] text-[color:var(--cc-muted-foreground)]'>
                  انبار تهران ← تحویل درِ خانه
                </span>
              </div>
            </div>

            <Button fullWidth onClick={onCheckout}>
              <Icon name='shopping-bag' className='size-4' />
              تکمیل خرید
            </Button>

            <div className='flex flex-wrap items-center justify-center gap-1'>
              <Badge variant='outline'>زرین‌پال</Badge>
              <Badge variant='outline'>پرداخت در محل</Badge>
              <Badge variant='outline'>پست پیشتاز</Badge>
            </div>
          </div>
        </div>
      ) : (
        <div
          className={cn(
            PANEL,
            "flex flex-col items-center gap-2 px-4 py-6 text-center",
          )}
        >
          <GarmentArt
            variant='tote'
            color='var(--cc-primary)'
            className='h-32 w-56 rounded-[var(--cc-radius)] border-[length:var(--cc-border-width)] border-[color:var(--cc-border)]'
          />
          <span className='text-sm font-bold text-[color:var(--cc-surface-foreground)]'>
            سبد خرید خالی است
          </span>
          <p className='max-w-sm text-[0.6875rem] text-[color:var(--cc-muted-foreground)]'>
            از کالکشن یکی انتخاب کن یا یکی از استایل‌های آماده را اضافه کن.
          </p>
          <a
            href='#shop-collection'
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            رفتن به کالکشن
            <Icon name='arrow-left' className='size-3.5' />
          </a>
        </div>
      )}
    </section>
  );
}
