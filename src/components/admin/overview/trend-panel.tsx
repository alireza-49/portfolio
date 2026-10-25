import { TrendingUp } from "lucide-react";
import { Panel, PanelHeading } from "@/components/admin/ui";
import { faNumber } from "@/lib/fa";

/** Pure CSS bar chart — no client JS, no recharts, deterministic output. */
export function TrendPanel({
  series,
}: {
  series: { date: string; count: number }[];
}) {
  const max = Math.max(1, ...series.map((point) => point.count));
  const total = series.reduce((sum, point) => sum + point.count, 0);

  return (
    <Panel>
      <PanelHeading
        eyebrow='14-DAY WINDOW'
        title='روند درخواست‌های سفارش'
        description={`در ۱۴ روز گذشته ${faNumber(total)} درخواست از فرم تماس سایت ثبت شده است.`}
        actions={
          <span className='flex items-center gap-1 rounded-sm border border-teal-craft/40 bg-teal-craft/10 px-2 py-0.5 text-[10px] font-bold text-teal-craft'>
            <TrendingUp className='size-3' />
            داده زنده
          </span>
        }
      />
      <div className='px-4 py-4 sm:px-5'>
        <div
          role='img'
          aria-label='نمودار ستونی درخواست‌های سفارش در ۱۴ روز گذشته'
          className='flex h-32 items-end gap-1.5 sm:gap-2'
        >
          {series.map((point, index) => {
            const height =
              point.count === 0 ? 2 : Math.max(6, (point.count / max) * 100);
            const showLabel = index % 2 === 0 || index === series.length - 1;
            return (
              <div
                key={point.date}
                className='flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1'
              >
                <span className='font-mono text-[9px] font-bold text-indigo-light'>
                  {point.count > 0 ? faNumber(point.count) : ""}
                </span>
                <div
                  title={`${point.date}: ${point.count}`}
                  className='w-full rounded-t-[2px] border-t-[1.5px] border-indigo-ink bg-coral/80'
                  style={{ height: `${height}%` }}
                />
                <span className='h-3 text-[9px] font-bold whitespace-nowrap text-indigo-light'>
                  {showLabel
                    ? faNumber(Number(point.date.slice(8)))
                    : ""}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </Panel>
  );
}
