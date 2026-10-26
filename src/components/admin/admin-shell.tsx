"use client";

import { useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { LogOut, Menu, ShieldAlert } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { logoutAction } from "@/app/admin/(console)/logout-action";
import {
  ADMIN_NAV,
  AdminBrand,
  AdminNavLinks,
  AdminSidebarFooter,
  isActive,
} from "@/components/admin/admin-nav";

/**
 * Console chrome: a fixed ink-ruled sidebar on the right (RTL), a slimmer
 * top bar with the active section and a mobile sheet for the same navigation.
 * The public site header never appears here.
 */
export function AdminShell({
  username,
  usingFallback,
  children,
}: {
  username: string;
  usingFallback: boolean;
  children: ReactNode;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const section =
    ADMIN_NAV.find((item) => isActive(pathname, item))?.label ??
    "کنسول مدیریت";

  return (
    <div className='min-h-dvh w-full bg-paper' dir='rtl'>
      <aside className='fixed inset-y-0 right-0 z-40 hidden w-64 flex-col border-l-[2px] border-indigo-ink bg-paper-dim lg:flex'>
        <AdminBrand />
        <div className='flex flex-1 flex-col gap-3 overflow-y-auto px-3 py-4'>
          <span className='px-2 font-mono text-[9px] tracking-widest text-indigo-light uppercase'>
            کارگاه / بخش‌ها
          </span>
          <AdminNavLinks />
        </div>
        <AdminSidebarFooter username={username} />
      </aside>

      <div className='lg:pr-64'>
        <header className='sticky top-0 z-30 flex h-15 items-center justify-between gap-3 border-b-[2px] border-indigo-ink bg-paper/95 px-4 backdrop-blur-md sm:px-6'>
          <div className='flex min-w-0 items-center gap-2.5'>
            <button
              type='button'
              onClick={() => setMenuOpen(true)}
              aria-label='باز کردن منوی کنسول'
              className='flex size-9 items-center justify-center rounded-sm border-[2px] border-indigo-ink bg-paper-light text-indigo-ink lg:hidden'
            >
              <Menu className='size-4' />
            </button>
            <span className='hidden font-mono text-[10px] font-bold tracking-widest text-indigo-light uppercase sm:inline'>
              PHILL // OPS
            </span>
            <span className='truncate text-[13px] font-black text-indigo-ink'>
              {section}
            </span>
          </div>

          <div className='flex shrink-0 items-center gap-2'>
            <span className='hidden items-center gap-1.5 rounded-full border border-teal-craft/40 bg-teal-craft/10 px-2.5 py-0.5 text-[10px] font-bold text-teal-craft sm:inline-flex'>
              <span className='relative flex size-1.5'>
                <span className='absolute inline-flex size-full animate-ping rounded-full bg-teal-craft opacity-70' />
                <span className='relative inline-flex size-1.5 rounded-full bg-teal-craft' />
              </span>
              کنسول فعال
            </span>
            <form action={logoutAction}>
              <button
                type='submit'
                className='inline-flex h-8 items-center gap-1.5 rounded-sm border-[2px] border-indigo-ink bg-paper px-2.5 text-[11px] font-black text-indigo-ink transition-colors hover:bg-indigo-ink hover:text-paper'
              >
                <LogOut className='size-3.5' />
                <span className='hidden sm:inline'>خروج</span>
              </button>
            </form>
          </div>
        </header>

        {usingFallback ? (
          <div
            role='note'
            className='flex flex-wrap items-center gap-2 border-b-[2px] border-indigo-ink bg-mustard/30 px-4 py-2 text-[11px] font-bold text-indigo-ink sm:px-6'
          >
            <ShieldAlert className='size-4 shrink-0 text-coral' />
            <span>
              این نشست با گذرواژهٔ پیش‌فرض توسعه باز شده است. برای انتشار،
              متغیرهای <code className='font-mono'>ADMIN_USERNAME</code> و{" "}
              <code className='font-mono'>ADMIN_PASSWORD</code> را تنظیم کنید.
            </span>
          </div>
        ) : null}

        <main className='mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8'>
          {children}
        </main>
      </div>

      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent
          side='right'
          className='w-72 border-indigo-ink bg-paper p-0'
        >
          <SheetHeader className='sr-only'>
            <SheetTitle>منوی کنسول مدیریت</SheetTitle>
            <SheetDescription>دسترسی به بخش‌های کنسول</SheetDescription>
          </SheetHeader>
          <AdminBrand />
          <div className='flex flex-1 flex-col gap-3 px-3 py-4'>
            <AdminNavLinks onNavigate={() => setMenuOpen(false)} />
          </div>
          <AdminSidebarFooter username={username} />
        </SheetContent>
      </Sheet>
    </div>
  );
}
