"use client";

import { useState } from "react";
import { Coffee, Menu } from "lucide-react";
import Link from "next/link";
import { LogoButton } from "@/assests/logo";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type NavLink = {
  href: string;
  label: string;
};

const NAV_LINKS: NavLink[] = [
  { href: "/blog", label: "وبلاگ" },
  { href: "/#projects-container", label: "پروژه‌ها" },
  { href: "/track", label: "پیگیری پروژه" },
  { href: "/#estimator-section", label: "برآورد هزینه" },
];

const CREATE_LINK: NavLink = { href: "/create", label: "ساخت آنلاین" };

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className='fixed inset-x-0 top-0 z-50 border-b-[2.5px] border-indigo-ink bg-paper/90 backdrop-blur-md'>
      <div className='mx-auto flex h-15 max-w-7xl flex-nowrap items-center justify-between gap-4 px-4 sm:px-8'>
        <div className='flex shrink-0 items-center gap-3'>
          <div className='relative flex items-center'>
            <LogoButton
              aria-label='وب دیزاین فیل'
              logoClassName='size-full'
              className='size-13 rounded-sm border-[1.5px] border-indigo-ink bg-mustard/30 p-1 text-indigo-ink shadow-craft-inset hover:bg-mustard/30 hover:text-indigo-ink'
            />
            <span className='absolute -top-1 -right-1 flex h-2.5 w-2.5'>
              <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-craft opacity-75' />
              <span className='relative inline-flex h-2.5 w-2.5 rounded-full bg-teal-craft' />
            </span>
          </div>
          <div className='flex flex-col'>
            <Link
              href='/'
              className='font-display text-base leading-tight font-black tracking-tight text-indigo-ink transition-colors hover:text-coral sm:text-lg'
            >
              وب دیزاین فیل
            </Link>
            <span className='mt-0.5 text-[11px] leading-none font-medium text-indigo-light'>
              توسعه فرانت‌اند دست‌ساز
            </span>
          </div>
        </div>

        <nav className='hidden shrink items-center gap-3 text-[13px] font-bold whitespace-nowrap text-indigo-ink lg:flex'>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className='rounded px-2 py-1 text-indigo-ink/80 transition-all hover:bg-mustard/20 hover:text-coral'
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className='flex shrink-0 items-center gap-2.5 whitespace-nowrap'>
          <Link
            href={CREATE_LINK.href}
            className='craft-btn hidden items-center justify-center rounded-sm border-[2.5px] border-indigo-ink bg-mustard/60 px-3.5 py-1.5 text-xs font-black whitespace-nowrap text-indigo-ink shadow-craft-sm transition-colors hover:bg-mustard hover:text-coral sm:inline-flex sm:text-[13px]'
          >
            {CREATE_LINK.label}
          </Link>
          <Link
            href='#contact-section'
            className='craft-btn hidden h-auto items-center justify-center gap-1 rounded-sm border-[2.5px] border-indigo-ink bg-coral px-3.5 py-1.5 text-xs font-bold whitespace-nowrap text-white shadow-craft-sm transition-colors hover:bg-coral-dark sm:inline-flex sm:text-[13px]'
          >
            <Coffee className='size-4' />
            <span>مشاوره و سفارش</span>
          </Link>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              aria-label='منوی ناوبری'
              className='craft-btn flex size-9 items-center justify-center rounded-sm border-[2.5px] border-indigo-ink bg-paper-light text-indigo-ink lg:hidden'
            >
              <Menu className='size-4' />
            </SheetTrigger>
            <SheetContent side='left' className='border-indigo-ink bg-paper'>
              <SheetHeader className='border-b-[2px] border-indigo-ink'>
                <SheetTitle className='text-right text-base font-black text-indigo-ink'>
                  منوی ناوبری
                </SheetTitle>
                <SheetDescription className='text-right text-xs text-indigo-light'>
                  دسترسی سریع به بخش‌های وب دیزاین فیل
                </SheetDescription>
              </SheetHeader>
              <nav className='px-4'>
                <ul className='flex flex-col divide-y divide-dashed divide-indigo-ink/20'>
                  {NAV_LINKS.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className='block py-3 text-sm font-bold text-indigo-ink transition-colors hover:text-coral'
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link
                      href={CREATE_LINK.href}
                      onClick={() => setOpen(false)}
                      className='block py-3 text-sm font-black text-coral transition-colors hover:text-coral-dark'
                    >
                      {CREATE_LINK.label}
                    </Link>
                  </li>
                </ul>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
