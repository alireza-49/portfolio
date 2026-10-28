"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowUpRight,
  CalendarClock,
  Gauge,
  Inbox,
  Layers,
  LayoutDashboard,
  MessageSquare,
  Newspaper,
  Settings2,
  Wallet,
} from "lucide-react";
import { cn } from "cn";
import { LogoButton } from "@/assests/logo";

export type NavItem = {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
};

export const ADMIN_NAV: NavItem[] = [
  {
    href: "/admin",
    label: "میز کار مدیریت",
    icon: LayoutDashboard,
    exact: true,
  },
  { href: "/admin/projects", label: "مدیریت پروژه‌ها", icon: Layers },
  { href: "/admin/plan", label: "برنامه‌ریزی و تقویم", icon: CalendarClock },
  { href: "/admin/progress", label: "پیشرفت پروژه‌ها", icon: Gauge },
  { href: "/admin/income", label: "درآمد و پیش‌بینی", icon: Wallet },
  { href: "/admin/inbox", label: "درخواست‌های سفارش", icon: Inbox },
  { href: "/admin/posts", label: "نشر یادداشت‌ها", icon: Newspaper },
  { href: "/admin/comments", label: "نظرات یادداشت‌ها", icon: MessageSquare },
  { href: "/admin/settings", label: "تنظیمات و پیامک", icon: Settings2 },
];

export function isActive(pathname: string, item: NavItem): boolean {
  if (item.exact) return pathname === item.href;
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

export function AdminNavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav aria-label='بخش‌های کنسول' className='flex flex-col gap-1'>
      {ADMIN_NAV.map((item) => {
        const active = isActive(pathname, item);
        const Glyph = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-2.5 rounded-sm border-[2px] px-3 py-2 text-[0.8125rem] font-bold transition-all",
              active
                ? "border-indigo-ink bg-coral text-white shadow-craft-sm"
                : "border-transparent text-indigo-ink/80 hover:border-indigo-ink/20 hover:bg-mustard/25 hover:text-indigo-ink",
            )}
          >
            <Glyph className='size-4 shrink-0' />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function AdminBrand() {
  return (
    <div className='flex items-center gap-2.5 border-b-[2px] border-dashed border-indigo-ink/20 px-4 py-4'>
      <LogoButton
        aria-label='وب دیزاین فیل'
        logoClassName='size-full'
        className='size-13 rounded-sm border-[1.5px] border-indigo-ink bg-mustard/30 p-1 text-indigo-ink shadow-craft-inset hover:bg-mustard/30 hover:text-indigo-ink'
      />
      <div className='flex min-w-0 flex-col'>
        <Link
          href='/admin'
          className='truncate font-display text-sm leading-tight font-black text-indigo-ink'
        >
          کنسول مدیریت
        </Link>
        <span className='font-mono text-[0.5625rem] tracking-widest text-indigo-light uppercase'>
          PHILL OPS
        </span>
      </div>
    </div>
  );
}

export function AdminSidebarFooter({ username }: { username: string }) {
  return (
    <div className='mt-auto flex flex-col gap-2 border-t-[2px] border-dashed border-indigo-ink/20 px-4 py-4'>
      <div className='flex items-center gap-2 rounded-sm border border-indigo-ink/20 bg-paper px-2.5 py-2'>
        <span className='flex size-7 items-center justify-center rounded-full bg-indigo-ink font-mono text-[0.6875rem] font-black text-paper'>
          ک
        </span>
        <div className='flex min-w-0 flex-col'>
          <span className='truncate text-[0.6875rem] font-black text-indigo-ink'>
            {username}
          </span>
          <span className='text-[0.625rem] font-medium text-indigo-light'>
            مدیر کارگاه
          </span>
        </div>
      </div>
      <Link
        href='/'
        target='_blank'
        rel='noopener noreferrer'
        className='flex items-center justify-between rounded-sm px-1 py-1 text-[0.6875rem] font-bold text-indigo-ink/80 transition-colors hover:text-coral'
      >
        <span>مشاهده سایت</span>
        <ArrowUpRight className='size-3.5' />
      </Link>
    </div>
  );
}
