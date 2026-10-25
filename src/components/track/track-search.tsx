"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

/**
 * The tracking form only navigates: the project page re-checks the code on the
 * server, so a guessed URL can never leak an unpublished board.
 */
export function TrackSearchForm({
  initialCode = "",
  compact = false,
}: {
  initialCode?: string;
  compact?: boolean;
}) {
  const router = useRouter();
  const [code, setCode] = useState(initialCode);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = code.trim();
    if (!value) return;
    router.push(`/track/${encodeURIComponent(value)}`);
  };

  return (
    <form onSubmit={submit} className='flex w-full flex-col gap-2'>
      <label
        htmlFor='track-code'
        className='text-[12px] font-bold text-indigo-ink'
      >
        کد رهگیری سفارش
      </label>
      <div className='flex flex-col gap-2 sm:flex-row'>
        <div className='relative flex flex-1 items-center'>
          <Search className='pointer-events-none absolute right-3 size-4 text-indigo-light' />
          <input
            id='track-code'
            name='code'
            dir='ltr'
            value={code}
            onChange={(event) => setCode(event.target.value)}
            placeholder='CDL-9402'
            autoComplete='off'
            spellCheck={false}
            className={`h-12 w-full rounded-sm border-[2px] border-indigo-ink bg-paper pr-9 pl-3 text-left font-mono text-sm font-bold text-indigo-ink placeholder:font-normal placeholder:text-indigo-ink/35 focus-visible:border-coral focus-visible:ring-2 focus-visible:ring-coral/25 ${compact ? "" : "sm:h-13"}`}
          />
        </div>
        <button
          type='submit'
          className='craft-btn inline-flex h-12 items-center justify-center gap-1.5 rounded-sm border-[2.5px] border-indigo-ink bg-coral px-5 text-sm font-black text-white'
        >
          مشاهدهٔ پیشرفت
        </button>
      </div>
      <p className='text-[11px] font-medium text-indigo-light'>
        کد رهگیری در پیش‌فاکتور و پیام تأیید سفارش ارسال شده است.
      </p>
    </form>
  );
}
