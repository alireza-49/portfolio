import { ReceiptText, Wallet } from "lucide-react";
import { faMoney, faNumber } from "@/lib/fa";
import type { Project } from "@/lib/types";

/**
 * Rendered only when the studio has switched the public financials flag on;
 * the page checks that before mounting this panel.
 */
export function FinancePanel({ project }: { project: Project }) {
  const remaining = Math.max(0, project.amount - project.paid);
  const ratio =
    project.amount > 0
      ? Math.min(100, Math.round((project.paid / project.amount) * 100))
      : 0;

  return (
    <section className='flex flex-col gap-3 rounded-md border-[2px] border-indigo-ink bg-paper-light p-4 shadow-craft sm:p-5'>
      <div className='flex items-center justify-between gap-2'>
        <div className='flex flex-col gap-0.5'>
          <span className='font-mono text-[10px] font-bold tracking-widest text-mustard-deep uppercase'>
            LEDGER // وضعیت مالی
          </span>
          <h2 className='text-sm font-black text-indigo-ink'>
            صورت‌حساب و تسویه‌حساب پروژه
          </h2>
        </div>
        <ReceiptText className='size-5 text-mustard-deep' />
      </div>

      <div className='grid grid-cols-1 gap-2 sm:grid-cols-3'>
        <div className='flex flex-col gap-0.5 rounded-sm border border-indigo-ink/15 bg-paper p-3'>
          <span className='text-[10px] font-bold text-indigo-light'>
            مبلغ کل قرارداد
          </span>
          <span className='font-mono text-sm font-black text-indigo-ink'>
            {faMoney(project.amount)}
          </span>
        </div>
        <div className='flex flex-col gap-0.5 rounded-sm border border-teal-craft/30 bg-teal-craft/10 p-3'>
          <span className='text-[10px] font-bold text-teal-craft'>
            تسویه‌شده
          </span>
          <span className='font-mono text-sm font-black text-teal-craft'>
            {faMoney(project.paid)}
          </span>
        </div>
        <div className='flex flex-col gap-0.5 rounded-sm border border-coral/30 bg-coral/10 p-3'>
          <span className='text-[10px] font-bold text-coral'>مانده</span>
          <span className='font-mono text-sm font-black text-coral-dark'>
            {faMoney(remaining)}
          </span>
        </div>
      </div>

      <div className='flex flex-col gap-1.5'>
        <div className='flex items-center justify-between text-[10px] font-bold text-indigo-light'>
          <span className='flex items-center gap-1'>
            <Wallet className='size-3.5' />
            نسبت تسویه
          </span>
          <span className='font-mono'>{faNumber(ratio)}٪</span>
        </div>
        <div className='h-2 overflow-hidden rounded-full bg-paper-shade'>
          <div
            className='h-full rounded-full bg-teal-craft'
            style={{ width: `${ratio}%` }}
          />
        </div>
      </div>
    </section>
  );
}
