import { GitCommitHorizontal, PackageCheck, StickyNote } from "lucide-react";
import { cn } from "cn";
import { faDate } from "@/lib/fa";
import {
  UPDATE_TYPE_META,
  type ProjectUpdate,
} from "@/lib/types";

const ICONS = {
  commit: GitCommitHorizontal,
  note: StickyNote,
  release: PackageCheck,
} as const;

const TONES = {
  commit: "bg-coral/10 text-coral border-coral/30",
  note: "bg-paper-dim text-indigo-ink border-indigo-ink/25",
  release: "bg-teal-craft/10 text-teal-craft border-teal-craft/30",
} as const;

export function Changelog({ updates }: { updates: ProjectUpdate[] }) {
  const ordered = [...updates].sort((a, b) => b.date.localeCompare(a.date));

  if (ordered.length === 0) {
    return (
      <p className='rounded-sm border-[2px] border-dashed border-indigo-ink/30 bg-paper-light px-4 py-8 text-center text-xs font-bold text-indigo-light'>
        هنوز به‌روزرسانی مهندسی ثبت نشده است.
      </p>
    );
  }

  return (
    <ol className='flex flex-col divide-y divide-dashed divide-indigo-ink/20'>
      {ordered.map((update) => {
        const Icon = ICONS[update.type] ?? StickyNote;
        return (
          <li key={update.id} className='flex gap-3 py-3 first:pt-0 last:pb-0'>
            <span
              className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-sm border",
                TONES[update.type] ?? TONES.note,
              )}
            >
              <Icon className='size-4' />
            </span>
            <div className='flex min-w-0 flex-col gap-0.5'>
              <div className='flex flex-wrap items-center gap-2'>
                <span className='text-[12px] leading-snug font-black text-indigo-ink'>
                  {update.title}
                </span>
                <span className='rounded-sm border border-indigo-ink/20 bg-paper px-1.5 py-0.5 font-mono text-[9px] font-bold text-indigo-light'>
                  {UPDATE_TYPE_META[update.type].label}
                </span>
                <span className='ms-auto font-mono text-[10px] font-bold text-indigo-light'>
                  {faDate(update.date)}
                </span>
              </div>
              {update.body ? (
                <p className='text-[11px] leading-relaxed font-medium text-indigo-light'>
                  {update.body}
                </p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
