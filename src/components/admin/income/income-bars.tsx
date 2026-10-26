import { CalendarDays } from "lucide-react";
import { Panel, PanelHeading } from "@/components/admin/ui";
import { faMoney, faNumber } from "@/lib/fa";
import type { IncomeBucket } from "@/lib/income";

/** Million-toman axis ticks keep six bars readable on one line. */
const millions = (value: number) => Math.round(value / 1_000_000);

function Bars({
  buckets,
  ariaLabel,
}: {
  buckets: IncomeBucket[];
  ariaLabel: string;
}) {
  const max = Math.max(1, ...buckets.map((bucket) => bucket.contracted));

  return (
    <div
      role='img'
      aria-label={ariaLabel}
      className='flex h-32 items-end gap-1.5 sm:gap-2'
    >
      {buckets.map((bucket) => {
        const height =
          bucket.contracted === 0
            ? 2
            : Math.max(6, (bucket.contracted / max) * 100);
        const receivedShare =
          bucket.contracted > 0
            ? Math.min(100, (bucket.received / bucket.contracted) * 100)
            : 0;

        return (
          <div
            key={bucket.key}
            className='flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1'
          >
            <span className='font-mono text-[9px] font-bold text-indigo-light'>
              {bucket.contracted > 0 ? faNumber(millions(bucket.contracted)) : ""}
            </span>
            <div
              title={`${bucket.label} — ${faNumber(bucket.projects)} پروژه • ${faMoney(bucket.contracted)} قرارداد • ${faMoney(bucket.received)} دریافت‌شده`}
              className='relative w-full overflow-hidden rounded-t-[2px] border-t-[1.5px] border-indigo-ink bg-mustard/40'
              style={{ height: `${height}%` }}
            >
              {receivedShare > 0 ? (
                <span
                  className='absolute inset-x-0 bottom-0 bg-teal-craft'
                  style={{ height: `${receivedShare}%` }}
                />
              ) : null}
            </div>
            <span className='h-3 w-full truncate text-center text-[9px] font-bold text-indigo-light'>
              {bucket.short}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function IncomeTrendPanel({
  buckets,
  eyebrow,
  title,
  description,
  averageLabel,
  average,
  ariaLabel,
}: {
  buckets: IncomeBucket[];
  eyebrow: string;
  title: string;
  description: string;
  averageLabel: string;
  average: number;
  ariaLabel: string;
}) {
  const hasMoney = buckets.some((bucket) => bucket.contracted > 0);

  return (
    <Panel>
      <PanelHeading
        eyebrow={eyebrow}
        title={title}
        description={description}
        actions={
          <span className='flex items-center gap-1 rounded-sm border border-mustard-deep/50 bg-mustard/25 px-2 py-0.5 text-[10px] font-bold text-indigo-ink'>
            <CalendarDays className='size-3' />
            تقویم شمسی
          </span>
        }
      />
      <div className='px-4 py-4 sm:px-5'>
        <div className='mb-4 flex flex-wrap items-baseline justify-between gap-2 border-b border-dashed border-indigo-ink/20 pb-3'>
          <span className='text-[11px] font-bold text-indigo-light'>
            {averageLabel}
          </span>
          <span className='font-mono text-sm font-black text-indigo-ink'>
            {faMoney(average)}
          </span>
        </div>
        {hasMoney ? (
          <Bars buckets={buckets} ariaLabel={ariaLabel} />
        ) : (
          <div className='flex h-32 flex-col items-center justify-center gap-1.5 rounded-sm border-[2px] border-dashed border-indigo-ink/25 bg-paper px-4 text-center'>
            <span className='text-xs font-black text-indigo-ink'>
              در این بازه درآمدی ثبت نشده است
            </span>
            <span className='text-[11px] leading-relaxed font-medium text-indigo-light'>
              مبلغ قرارداد و تاریخ شروع را در پروندهٔ هر پروژه وارد کنید تا این
              نمودار از دادهٔ واقعی پر شود.
            </span>
          </div>
        )}
        {hasMoney ? (
          <div className='mt-3 flex flex-wrap items-center gap-4 text-[10px] font-bold text-indigo-light'>
            <span className='flex items-center gap-1.5'>
              <span className='size-2.5 rounded-t-[2px] border-t-[1.5px] border-indigo-ink bg-mustard/40' />
              مبلغ قرارداد
            </span>
            <span className='flex items-center gap-1.5'>
              <span className='size-2.5 rounded-t-[2px] bg-teal-craft' />
              واقعاً دریافت‌شده
            </span>
          </div>
        ) : null}
      </div>
    </Panel>
  );
}
