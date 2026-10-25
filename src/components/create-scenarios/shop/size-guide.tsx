"use client";

import {
  Badge,
  Icon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  monoType,
} from "@/components/create-components";
import { cn } from "@/lib/utils";
import { SizeTapeScene } from "../art/shop-art";
import { SHOP_SIZE_TABLE } from "../data/shop";
import { Ornament } from "../art/shared";
import { SectionHeading } from "./section-heading";

const TIPS = [
  "متر را روی بلندترین نقطهٔ سینه بگیر و بدون فشار دور بدن بچرخان.",
  "اگر بین دو سایز هستی، برای برش اورسایز سایز بزرگ‌تر را انتخاب کن.",
  "قد آستین از سرشانه تا مچ اندازه‌گیری شده است، نه از یقه.",
];

/**
 * `#shop-guide`: the size guide is a real section rather than a modal, so the
 * header and the hero can both link to it. The tape illustration unrolls once
 * per paint; the table is the actual content.
 */
export function ShopSizeGuide() {
  return (
    <section
      id='shop-guide'
      aria-labelledby='shop-guide-title'
      className='flex flex-col gap-4'
    >
      <SectionHeading
        id='shop-guide-title'
        eyebrow='راهنمای سایز'
        title='سایزت را پیدا کن'
        description='اندازه‌ها بر حسب سانتی‌متر و روی بدن، نه روی لباس. اگر بین دو سایز بودی، بزرگ‌تر را بردار.'
        trailing={<Ornament />}
      />

      <div
        className={cn(
          "grid gap-4 rounded-[var(--cc-card-radius)] border-[length:var(--cc-border-width)] border-[color:var(--cc-border)]",
          "bg-[var(--cc-surface)] p-3 [box-shadow:var(--cc-shadow)] @3xl:grid-cols-[0.85fr_1.15fr]",
        )}
      >
        <div className='flex flex-col gap-2.5'>
          <SizeTapeScene className='h-32 w-full rounded-[var(--cc-radius)] border-[length:var(--cc-border-width)] border-[color:var(--cc-border)]' />
          <ul className='flex flex-col gap-1.5'>
            {TIPS.map((tip) => (
              <li
                key={tip}
                className='flex items-start gap-1.5 text-[11px] leading-relaxed text-[color:var(--cc-muted-foreground)]'
              >
                <Icon
                  name='check-circle'
                  className='mt-0.5 size-3.5 shrink-0 text-[color:var(--cc-success)]'
                />
                {tip}
              </li>
            ))}
          </ul>
          <Badge variant='soft' className='self-start'>
            تعویض سایز تا ۷ روز، بدون هزینه
          </Badge>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>سایز</TableHead>
              <TableHead>دور سینه</TableHead>
              <TableHead>قد</TableHead>
              <TableHead>آستین</TableHead>
              <TableHead>فرم</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {SHOP_SIZE_TABLE.map((row) => (
              <TableRow key={row.size}>
                <TableCell>
                  <span className={cn("font-bold", monoType)} dir='ltr'>
                    {row.size}
                  </span>
                </TableCell>
                <TableCell>
                  <span className={monoType} dir='ltr'>
                    {row.chest}
                  </span>
                </TableCell>
                <TableCell>
                  <span className={monoType} dir='ltr'>
                    {row.length}
                  </span>
                </TableCell>
                <TableCell>
                  <span className={monoType} dir='ltr'>
                    {row.sleeve}
                  </span>
                </TableCell>
                <TableCell>{row.fit}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
