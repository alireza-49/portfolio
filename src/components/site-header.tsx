"use client";

import { useState } from "react";
import { Coffee, Menu } from "lucide-react";
import Link from "next/link";
import { cn } from "cn";
import { LogoButton } from "@/assests/logo";
import { buttonVariants } from "@/components/ui/button";
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
  highlight?: boolean;
};

const NAV_LINKS: NavLink[] = [
  { href: "#projects-container", label: "پروژه‌ها" },
  { href: "#estimator-section", label: "برآورد هزینه" },
  { href: "#why-me-section", label: "چرا مستقل؟" },
  { href: "/create", label: "ساخت آنلاین", highlight: true },
  { href: "#contact-section", label: "تماس و سفارش" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className='fixed inset-x-0 top-0 z-50 border-b-[2.5px] border-indigo-ink bg-paper/90 backdrop-blur-md'>
      <div className='mx-auto flex h-15 max-w-7xl flex-nowrap items-center justify-between gap-4 px-4 sm:px-8'>
        <div className='flex shrink-0 items-center gap-3'>
          <div className='relative flex items-center'>
            <LogoButton
              aria-label='استودیو کدولوژی'
              logoClassName='size-full'
              className='size-9 rounded-sm border-[1.5px] border-indigo-ink bg-mustard/30 p-1 text-indigo-ink shadow-craft-inset hover:bg-mustard/30 hover:text-indigo-ink'
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
              استودیو کدولوژی
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
              className={
                link.highlight
                  ? "rounded-sm border-[1.5px] border-indigo-ink bg-mustard/40 px-2.5 py-1 font-black text-indigo-ink shadow-craft-sm transition-all hover:bg-mustard"
                  : "rounded px-2 py-1 text-indigo-ink/80 transition-all hover:bg-mustard/20 hover:text-coral"
              }
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className='flex shrink-0 items-center gap-2.5 whitespace-nowrap'>
          <div className='inline-flex items-center rounded-sm border-[1.5px] border-indigo-ink bg-paper-dim p-[2px] text-[10px] font-bold shadow-craft-inset'>
            <Link
              href='#'
              className='rounded-[2px] bg-indigo-ink px-2 py-[2px] text-paper'
            >
              فا
            </Link>
            <Link
              href='#'
              className='px-1.5 py-[2px] text-indigo-ink transition-colors hover:text-coral'
            >
              EN
            </Link>
          </div>

          <Link
            href='#contact-section'
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "craft-btn hidden h-auto items-center justify-center gap-1 rounded-sm border-[2.5px] border-indigo-ink bg-coral px-3.5 py-1.5 text-xs font-bold whitespace-nowrap text-white sm:inline-flex sm:text-[13px]",
            )}
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
                  دسترسی سریع به بخش‌های استودیو کدولوژی
                </SheetDescription>
              </SheetHeader>
              <nav className='px-4'>
                <ul className='flex flex-col divide-y divide-dashed divide-indigo-ink/20'>
                  {NAV_LINKS.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className={
                          link.highlight
                            ? "block py-3 text-sm font-black text-coral transition-colors hover:text-coral-dark"
                            : "block py-3 text-sm font-bold text-indigo-ink transition-colors hover:text-coral"
                        }
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
