import Link from "next/link";
import { ArrowLeft, Banknote, ReceiptText } from "lucide-react";
import {
  PROJECT_STATUS_META,
  SUBMISSION_STATUS_META,
  type Project,
  type Submission,
} from "@/lib/types";
import { faMoney, faNumber, faRelative } from "@/lib/fa";
import {
  EmptyState,
  Panel,
  PanelHeading,
  StatusPill,
} from "@/components/admin/ui";

/** The form's estimate travels as million toman (`۲۵ تا ۴۰ م.ت`). */
function estimateRange(
  submission: Submission,
): { min: number; max: number } | null {
  const estimate = submission.estimate;
  if (!estimate) return null;
  const min = Number(estimate.min);
  const max = Number(estimate.max);
  if (!Number.isFinite(min) || !Number.isFinite(max)) return null;
  return { min, max };
}

const STATUS_ORDER: Record<Project["status"], number> = {
  active: 0,
  planning: 1,
  review: 2,
  delivered: 3,
  paused: 4,
  archived: 5,
};

export function OfferBoard({ offers }: { offers: Submission[] }) {
  const ceiling = offers.reduce((sum, offer) => {
    const range = estimateRange(offer);
    return sum + (range ? range.max * 1_000_000 : 0);
  }, 0);

  return (
    <Panel>
      <PanelHeading
        eyebrow='OPEN OFFERS'
        title='پیشنهادهای تازه'
        description='هر پیشنهاد با برآورد همان فرم تماس سایت برچسب قیمت خورده است؛ سایر پیشنهادها بودجهٔ نوشته‌شده را نشان می‌دهند.'
        actions={
          <Link
            href='/admin/inbox'
            className='inline-flex items-center gap-1 text-[0.6875rem] font-black text-coral hover:text-indigo-ink'
          >
            صندوق درخواست‌ها
            <ArrowLeft className='size-3' />
          </Link>
        }
      />
      <div className='flex flex-col divide-y divide-dashed divide-indigo-ink/15'>
        {offers.length === 0 ? (
          <div className='p-4'>
            <EmptyState
              title='پیشنهادی در انتظار نیست'
              description='درخواست تازه‌ای از فرم تماس ثبت نشده است. سفارش‌های بسته‌شده در صندوق درخواست‌ها می‌مانند.'
            />
          </div>
        ) : (
          offers.map((offer) => {
            const range = estimateRange(offer);
            const meta = SUBMISSION_STATUS_META[offer.status];
            const typeTitle = offer.estimate
              ? String(offer.estimate.typeTitle ?? "")
              : "";

            return (
              <Link
                key={offer.id}
                href={`/admin/inbox?open=${offer.id}`}
                className='flex flex-col gap-1.5 px-4 py-3 transition-colors hover:bg-mustard/15 sm:px-5'
              >
                <div className='flex flex-wrap items-center justify-between gap-2'>
                  <span className='text-[0.8125rem] font-black text-indigo-ink'>
                    {offer.name}
                  </span>
                  <StatusPill tone={meta.tone}>{meta.label}</StatusPill>
                </div>
                <div className='flex flex-wrap items-center justify-between gap-2 text-[0.6875rem] font-medium text-indigo-light'>
                  <span>
                    {[offer.business, offer.projectType || typeTitle]
                      .filter(Boolean)
                      .join(" • ") || "بدون مجموعه"}
                  </span>
                  <span className='font-mono'>{faRelative(offer.createdAt)}</span>
                </div>
                <span className='inline-flex w-fit items-center gap-1 rounded-sm border-[1.5px] border-mustard-deep bg-mustard/25 px-2 py-0.5 text-[0.6875rem] font-black text-indigo-ink'>
                  <Banknote className='size-3' />
                  {range
                    ? `${faNumber(range.min)} تا ${faNumber(range.max)} م.ت`
                    : offer.budget || "برآوردی ثبت نشده"}
                </span>
              </Link>
            );
          })
        )}
      </div>
      {ceiling > 0 ? (
        <div className='border-t-2 border-dashed border-indigo-ink/20 px-4 py-2.5 text-[0.6875rem] font-bold text-indigo-light sm:px-5'>
          سقف برآورد پیشنهادهای باز:{" "}
          <span className='font-mono text-indigo-ink'>{faMoney(ceiling)}</span>
        </div>
      ) : null}
    </Panel>
  );
}

export function ContractBoard({ projects }: { projects: Project[] }) {
  const ordered = [...projects].sort(
    (a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status] || b.amount - a.amount,
  );
  const contracted = projects.reduce((sum, project) => sum + project.amount, 0);
  const paid = projects.reduce((sum, project) => sum + project.paid, 0);

  return (
    <Panel>
      <PanelHeading
        eyebrow='CONTRACT BOOK'
        title='قرارداد پروژه‌ها'
        description='مبلغ هر قرارداد، سهم تسویه‌شده و ماندهٔ آن از پروندهٔ همان پروژه خوانده می‌شود.'
        actions={
          <Link
            href='/admin/projects'
            className='inline-flex items-center gap-1 text-[0.6875rem] font-black text-coral hover:text-indigo-ink'
          >
            مدیریت پروژه‌ها
            <ArrowLeft className='size-3' />
          </Link>
        }
      />
      <div className='flex flex-col divide-y divide-dashed divide-indigo-ink/15'>
        {ordered.length === 0 ? (
          <div className='p-4'>
            <EmptyState
              title='هنوز قراردادی ثبت نشده است'
              description='در پروندهٔ هر پروژه، مبلغ کل و مبلغ تسویه‌شده را وارد کنید تا این تابلوی درآمد پر شود.'
              action={
                <Link
                  href='/admin/projects'
                  className='inline-flex items-center gap-1.5 rounded-sm border-[2px] border-indigo-ink bg-paper px-3 py-2 text-xs font-black text-indigo-ink hover:bg-mustard/30'
                >
                  <ReceiptText className='size-3.5' />
                  ثبت پروژه
                </Link>
              }
            />
          </div>
        ) : (
          ordered.map((project) => {
            const meta = PROJECT_STATUS_META[project.status];
            const remaining = Math.max(0, project.amount - project.paid);
            const ratio =
              project.amount > 0
                ? Math.min(100, Math.round((project.paid / project.amount) * 100))
                : 0;

            return (
              <Link
                key={project.id}
                href={`/admin/projects/${project.id}`}
                className='flex flex-col gap-2 px-4 py-3 transition-colors hover:bg-mustard/15 sm:px-5'
              >
                <div className='flex flex-wrap items-center justify-between gap-2'>
                  <span className='flex items-center gap-2 text-[0.8125rem] font-black text-indigo-ink'>
                    <span className='rounded-sm border border-indigo-ink/30 bg-paper-dim px-1.5 py-0.5 font-mono text-[0.625rem]'>
                      {project.code}
                    </span>
                    {project.title}
                  </span>
                  <StatusPill tone={meta.tone}>{meta.short}</StatusPill>
                </div>
                <div className='flex items-center gap-2'>
                  <div className='h-1.5 flex-1 overflow-hidden rounded-full bg-paper-shade'>
                    <div
                      className='h-full rounded-full bg-teal-craft'
                      style={{ width: `${ratio}%` }}
                    />
                  </div>
                  <span className='font-mono text-[0.625rem] font-bold text-indigo-light'>
                    {faNumber(ratio)}٪
                  </span>
                </div>
                <div className='flex flex-wrap items-center justify-between gap-2 text-[0.6875rem] font-bold text-indigo-light'>
                  <span className='font-mono'>
                    مبلغ: <span className='text-indigo-ink'>{faMoney(project.amount)}</span>
                  </span>
                  <span className='font-mono'>
                    مانده: <span className='text-coral'>{faMoney(remaining)}</span>
                  </span>
                </div>
              </Link>
            );
          })
        )}
      </div>
      {ordered.length > 0 ? (
        <div className='border-t-2 border-dashed border-indigo-ink/20 px-4 py-2.5 text-[0.6875rem] font-bold text-indigo-light sm:px-5'>
          جمع قراردادها:{" "}
          <span className='font-mono text-indigo-ink'>{faMoney(contracted)}</span>
          {" • "}
          دریافت‌شده:{" "}
          <span className='font-mono text-teal-craft'>{faMoney(paid)}</span>
        </div>
      ) : null}
    </Panel>
  );
}
