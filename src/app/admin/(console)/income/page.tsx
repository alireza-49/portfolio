import type { Metadata } from "next";
import Link from "next/link";
import { Banknote, ReceiptText, TrendingUp, Wallet } from "lucide-react";
import { getIncomeOverview } from "@/lib/content";
import { requireConsolePage } from "@/lib/auth";
import { faNumber } from "@/lib/fa";
import {
  BTN_SECONDARY,
  MetricCard,
  PageHeader,
} from "@/components/admin/ui";
import { IncomeTrendPanel } from "@/components/admin/income/income-bars";
import {
  ContractBoard,
  OfferBoard,
} from "@/components/admin/income/price-board";

export const metadata: Metadata = { title: "درآمد" };
export const instant = false;

/** Cards read in million toman so the value never wraps. */
const millions = (value: number) => faNumber(Math.round(value / 1_000_000));

export default async function IncomePage() {
  await requireConsolePage();
  const { summary, offers, projects } = await getIncomeOverview();
  const remainingRatio = 100 - summary.receivedRatio;
  const empty = projects.length === 0;

  return (
    <div className='flex flex-col gap-6'>
      <PageHeader
        eyebrow='INCOME LEDGER // CASH & PIPELINE'
        title='درآمد و پیش‌بینی'
        description='این صفحه چیزی از خودش نمی‌سازد: مبلغ قرارداد، مبلغ تسویه‌شده و ماندهٔ هر پروژه از پروندهٔ همان پروژه خوانده می‌شود و پیش‌بینی فقط از پروژه‌های در جریان می‌آید.'
        actions={
          <Link href='/admin/projects' className={BTN_SECONDARY}>
            <Wallet className='size-3.5' />
            <span>مدیریت پروژه‌ها</span>
          </Link>
        }
      />

      <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4'>
        <MetricCard
          label='ارزش قراردادها'
          value={millions(summary.contractedTotal)}
          unit='م.ت'
          hint={
            empty ? "با ثبت پروژه شروع می‌شود" : `${faNumber(projects.length)} پروژهٔ ثبت‌شده`
          }
          tone='ink'
          icon={<Wallet className='size-3.5' />}
        />
        <MetricCard
          label='دریافت‌شده'
          value={millions(summary.receivedTotal)}
          unit='م.ت'
          hint={
            empty
              ? "هنوز درآمدی ثبت نشده"
              : `${faNumber(summary.receivedRatio)}٪ از قراردادها تسویه شد`
          }
          tone='teal'
          icon={<Banknote className='size-3.5' />}
          progress={summary.receivedRatio}
        />
        <MetricCard
          label='ماندهٔ قراردادها'
          value={millions(summary.remainingTotal)}
          unit='م.ت'
          hint={
            empty
              ? "قراردادی بسته نشده است"
              : `${faNumber(Math.max(0, remainingRatio))}٪ هنوز تسویه نشده`
          }
          tone='coral'
          icon={<ReceiptText className='size-3.5' />}
        />
        <MetricCard
          label='درآمد پیش‌بینی‌شده'
          value={millions(summary.pipelineOutstanding)}
          unit='م.ت'
          hint={
            summary.pipelineCount === 0
              ? "پروژه‌ای در جریان نیست"
              : `${faNumber(summary.pipelineCount)} پروژهٔ در جریان`
          }
          tone='mustard'
          icon={<TrendingUp className='size-3.5' />}
        />
      </div>

      <div className='grid grid-cols-1 gap-4 xl:grid-cols-2'>
        <IncomeTrendPanel
          buckets={summary.months}
          eyebrow='PERSIAN MONTHS'
          title='درآمد ماهانه'
          description='شش ماه شمسی اخیر. ارتفاع ستون مبلغ قرارداد است و بخش فیروزه‌ای مبلغی که واقعاً دریافت شده؛ ارقام بالای ستون‌ها به میلیون تومان.'
          averageLabel='میانگین ماهانه (۶ ماه اخیر)'
          average={summary.monthlyAverage}
          ariaLabel='نمودار ستونی درآمد ماهانه به تقویم شمسی'
        />
        <IncomeTrendPanel
          buckets={summary.weeks}
          eyebrow='PERSIAN WEEKS'
          title='درآمد هفتگی'
          description='هشت هفتهٔ اخیر، هر هفته از شنبه تا جمعه. ستون‌ها همان مبلغ قرارداد و دریافت‌شدهٔ ماهانه‌اند، فقط در بازهٔ هفتگی.'
          averageLabel='میانگین هفتگی (۸ هفته اخیر)'
          average={summary.weeklyAverage}
          ariaLabel='نمودار ستونی درآمد هفتگی به هفتهٔ شمسی'
        />
      </div>

      <p
        role='note'
        className='rounded-sm border-[2px] border-dashed border-mustard-deep bg-mustard/20 px-4 py-3 text-[11px] leading-relaxed font-bold text-indigo-ink'
      >
        مبنای گروه‌بندی: هر پروژه با تاریخ شروع خودش (و اگر خالی باشد، با تاریخ
        ثبت در کنسول) در ماه و هفتهٔ شمسی حساب می‌شود؛ چون پایگاه داده تاریخ
        تک‌تک پرداخت‌ها را نگه نمی‌دارد. برای دیدن رقم دقیق هر ستون، نشانگر را
        روی آن نگه دارید.
      </p>

      <div className='grid grid-cols-1 gap-4 xl:grid-cols-2'>
        <OfferBoard offers={offers} />
        <ContractBoard projects={projects} />
      </div>
    </div>
  );
}
