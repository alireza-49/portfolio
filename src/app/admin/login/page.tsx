import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Lock, Plus, Terminal } from "lucide-react";
import { LogoButton } from "@/assests/logo";
import { getAdminConfig, getAdminSession } from "@/lib/auth";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "ورود به کنسول",
  robots: { index: false, follow: false },
};

export const instant = false;

export default async function AdminLoginPage() {
  await connection();
  const session = await getAdminSession();
  if (session) redirect("/admin");

  const config = getAdminConfig();
  const devCredentials =
    config?.usingFallback === true
      ? { username: config.username, password: config.password }
      : null;

  return (
    <main
      dir='rtl'
      className='paper-pattern flex min-h-dvh w-full flex-col items-center justify-center px-4 py-10'
    >
      <div className='w-full max-w-md'>
        <div className='flex w-full flex-wrap items-center justify-between gap-2 pb-4 text-[10px] font-bold tracking-widest text-indigo-light uppercase opacity-70 select-none'>
          <span className='flex items-center gap-1 font-mono text-coral'>
            <Plus className='size-3.5' />
            REG: #092-COD
          </span>
          <span className='flex items-center gap-1.5'>
            <span className='size-2 animate-pulse rounded-full bg-coral' />
            درگاه امنیتی کارگاه
          </span>
          <span className='flex items-center gap-1 font-mono text-coral'>
            LAY: 03-INK
            <Plus className='size-3.5' />
          </span>
        </div>

        <section className='relative flex w-full flex-col gap-5 rounded-md border-[2px] border-indigo-ink bg-paper-light p-6 shadow-craft-lg sm:p-8'>
          <div className='flex flex-col items-center gap-2 text-center'>
            <div className='relative rounded-full border-[2px] border-indigo-ink bg-paper-dim p-1.5 shadow-craft-sm'>
              <LogoButton
                aria-label='استودیو کدولوژی'
                logoClassName='size-full'
                className='flex size-20 items-center justify-center rounded-full border border-indigo-ink/20 bg-paper text-indigo-ink hover:text-indigo-ink'
              />
              <span className='absolute -bottom-1 -left-1 flex size-6 items-center justify-center rounded-full border-[1.5px] border-indigo-ink bg-coral text-white'>
                <Terminal className='size-3.5' />
              </span>
            </div>
            <span className='pt-1 font-mono text-[10px] font-bold tracking-[0.2em] text-indigo-ink uppercase'>
              CODOLOGY // چاپ و کُد
            </span>
          </div>

          <div className='flex flex-col items-center gap-1.5 text-center'>
            <h1 className='font-display text-xl leading-tight font-black text-indigo-ink sm:text-2xl'>
              ورود به کنسول کارگاهی و مدیریت
            </h1>
            <p className='max-w-sm text-xs leading-relaxed font-medium text-indigo-light'>
              دسترسی به پیام‌های دریافتی، مدیریت پروژه‌ها، انتشار یادداشت‌ها و
              پیگیری پیشرفت سفارش‌ها.
            </p>
          </div>

          {config ? (
            <LoginForm devCredentials={devCredentials} />
          ) : (
            <div
              role='alert'
              className='flex flex-col gap-2 rounded-sm border-[2px] border-coral bg-coral/10 p-3 text-[12px] leading-relaxed font-bold text-coral-dark'
            >
              <span className='flex items-center gap-1.5'>
                <Lock className='size-4' />
                ورود مدیر پیکربندی نشده است
              </span>
              <span className='font-medium text-indigo-ink'>
                در محیط تولید، سه متغیر{" "}
                <code className='font-mono'>ADMIN_USERNAME</code>،{" "}
                <code className='font-mono'>ADMIN_PASSWORD</code> و{" "}
                <code className='font-mono'>ADMIN_SESSION_SECRET</code> باید در
                تنظیمات محیطی تعریف شوند. نمونه را در{" "}
                <code className='font-mono'>.env.example</code> ببینید.
              </span>
            </div>
          )}

          <div className='flex items-center gap-2 opacity-50'>
            <span className='h-0.5 flex-1 bg-indigo-ink/20' />
            <span className='text-[10px] font-bold text-indigo-light'>
              دستورالعمل نظارت بر نشر
            </span>
            <span className='h-0.5 flex-1 bg-indigo-ink/20' />
          </div>

          <div className='flex flex-col items-center gap-2 text-center text-[10px] font-bold text-indigo-light sm:flex-row sm:justify-between sm:text-right'>
            <span className='flex items-center gap-1'>
              <Lock className='size-3.5 text-mustard-deep' />
              نشست رمزنگاری‌شده و HttpOnly
            </span>
            <span className='font-mono'>CODOLOGY OPS © ۲۰۲۶</span>
          </div>
        </section>

        <p className='pt-4 text-center text-[11px] font-bold text-indigo-light'>
          <Link
            href='/'
            className='underline decoration-dashed underline-offset-4 transition-colors hover:text-coral'
          >
            بازگشت به سایت استودیو
          </Link>
        </p>
      </div>
    </main>
  );
}
