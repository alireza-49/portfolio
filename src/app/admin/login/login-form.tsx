"use client";

import { useActionState, useState } from "react";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { cn } from "cn";
import { FIELD_CLASS } from "@/components/admin/ui";
import { loginAction, type LoginState } from "./actions";

const INITIAL_STATE: LoginState = { error: null, username: "" };

export function LoginForm({
  devCredentials,
}: {
  devCredentials: { username: string; password: string } | null;
}) {
  const [state, formAction, pending] = useActionState(
    loginAction,
    INITIAL_STATE,
  );
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={formAction} className='flex w-full flex-col gap-5'>
      <div className='flex items-center gap-2 rounded-sm border-[1.5px] border-indigo-ink/25 bg-paper-dim px-3 py-2'>
        <ShieldCheck className='size-4 shrink-0 text-coral' />
        <span className='text-[11px] font-bold text-indigo-ink'>
          نشست احراز هویت‌شده / امضای HMAC-SHA256
        </span>
      </div>

      <div className='flex flex-col gap-1.5'>
        <label
          htmlFor='admin-username'
          className='flex items-center gap-1.5 text-[12px] font-bold text-indigo-ink'
        >
          <span className='size-1.5 rounded-full bg-coral' />
          شناسه کاربری یا ایمیل سازمانی
        </label>
        <div className='relative flex items-center'>
          <UserRound className='pointer-events-none absolute right-3.5 size-4 text-indigo-light' />
          <input
            id='admin-username'
            name='username'
            type='text'
            dir='ltr'
            required
            autoComplete='username'
            spellCheck={false}
            placeholder='admin@phill.studio'
            className={cn(FIELD_CLASS, "h-12 pr-11 pl-4 text-left")}
          />
        </div>
      </div>

      <div className='flex flex-col gap-1.5'>
        <label
          htmlFor='admin-password'
          className='flex items-center gap-1.5 text-[12px] font-bold text-indigo-ink'
        >
          <span className='size-1.5 rounded-full bg-coral' />
          گذرواژهٔ امنیتی
        </label>
        <div className='relative flex items-center'>
          <LockKeyhole className='pointer-events-none absolute right-3.5 size-4 text-indigo-light' />
          <input
            id='admin-password'
            name='password'
            type={showPassword ? "text" : "password"}
            dir='ltr'
            required
            autoComplete='current-password'
            placeholder='••••••••••••'
            className={cn(FIELD_CLASS, "h-12 pr-11 pl-12 text-left")}
          />
          <button
            type='button'
            onClick={() => setShowPassword((value) => !value)}
            aria-label={
              showPassword ? "پنهان کردن گذرواژه" : "نمایش گذرواژه"
            }
            aria-pressed={showPassword}
            className='absolute left-2 flex size-8 items-center justify-center rounded-sm text-indigo-light transition-colors hover:bg-mustard/30 hover:text-indigo-ink'
          >
            {showPassword ? (
              <EyeOff className='size-4' />
            ) : (
              <Eye className='size-4' />
            )}
          </button>
        </div>
      </div>

      <div className='flex flex-wrap items-center justify-between gap-2 rounded-sm border border-indigo-ink/15 bg-paper px-3 py-2'>
        <label className='flex cursor-pointer items-center gap-2 text-[11px] font-bold text-indigo-ink select-none'>
          <input
            type='checkbox'
            name='remember'
            className='size-4 cursor-pointer rounded-sm border-[1.5px] border-indigo-ink accent-coral'
          />
          ثبت نشست روی دستگاه جاری (۳۰ روز)
        </label>
        <span className='font-mono text-[10px] font-bold text-indigo-light'>
          SESSION / 12H–30D
        </span>
      </div>

      {state.error ? (
        <p
          role='alert'
          aria-live='assertive'
          className='rounded-sm border-[1.5px] border-coral bg-coral/10 px-3 py-2 text-[12px] font-bold text-coral-dark'
        >
          {state.error}
        </p>
      ) : null}

      <button
        type='submit'
        disabled={pending}
        className='craft-btn flex h-12 w-full items-center justify-center gap-2 rounded-sm border-[2.5px] border-indigo-ink bg-coral text-sm font-black text-white disabled:cursor-wait disabled:opacity-70'
      >
        {pending ? (
          <>
            <LoaderCircle className='size-4 animate-spin' />
            <span>در حال اعتبارسنجی نشست…</span>
          </>
        ) : (
          <>
            <span>ورود به داشبورد مدیریت</span>
            <ArrowLeft className='size-4' />
          </>
        )}
      </button>

      {devCredentials ? (
        <div className='rounded-sm border-[1.5px] border-dashed border-mustard-deep bg-mustard/25 px-3 py-2 text-[11px] leading-relaxed font-bold text-indigo-ink'>
          محیط توسعه: هنوز متغیرهای محیطی تنظیم نشده‌اند. با{" "}
          <code className='font-mono' dir='ltr'>
            {devCredentials.username}
          </code>{" "}
          /{" "}
          <code className='font-mono' dir='ltr'>
            {devCredentials.password}
          </code>{" "}
          وارد شوید یا فایل <code className='font-mono'>.env.local</code> را
          بسازید.
        </div>
      ) : null}
    </form>
  );
}
