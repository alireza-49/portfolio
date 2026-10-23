"use client";

import { useEffect, useRef } from "react";
import { driver, type Driver, type DriveStep } from "driver.js";
import { toPersianDigits } from "@/components/create-components/jalali";
import {
  hasSeenStudioTour,
  markStudioTourSeen,
} from "@/components/create-studio-store";

/**
 * First-visit guide for `/create`.
 *
 * The tour is pure DOM guidance: driver.js highlights the real studio controls
 * (sidebar sections, scenario tabs, the preview window) while the copy explains
 * what each one does. It opens once per browser and can be replayed from the
 * studio bar at any time.
 *
 * Storage is only read/written from effects and driver hooks, never while
 * rendering, so the prerendered page stays deterministic.
 */
const STEPS: DriveStep[] = [
  {
    popover: {
      title: "به استودیو کدولوژی خوش آمدید",
      description:
        "اینجا کارگاه زندهٔ ساخت ظاهر سایت است؛ به‌جای حدس زدن، سبک، رنگ، فونت و آیکون را روی یک سایت واقعی می‌بینید. در چند قدم کوتاه هر بخش را معرفی می‌کنم و در پایان نشان می‌دهم چطور همین ترکیب را برای من بفرستید.",
    },
  },
  {
    element: "[data-tour='scenarios']",
    popover: {
      title: "۱. سناریو را انتخاب کنید",
      description:
        "هر سناریو یک سایت کامل است: لندینگ تدریس آنلاین، فروشگاه پوشاک، نوبت‌دهی کلینیک، داشبورد تحلیل و گالری کامپوننت‌ها. با این تب‌ها بوم را عوض کنید و ببینید یک تم روی چه نوع سایتی می‌نشیند.",
      side: "bottom",
      align: "center",
    },
  },
  {
    element: "[data-tour='styles']",
    popover: {
      title: "۲. سبک بصری",
      description:
        "سیزده سبک آماده در سه خانوادهٔ مدرن، فنی و بیانی. هر سبک پالت، فونت، بافت، فرم کنترل‌ها و سایهٔ خودش را دارد؛ با انتخاب سبک، گردی گوشه و فونت هم با آن همگام می‌شوند.",
      side: "left",
      align: "start",
    },
  },
  {
    element: "[data-tour='palette']",
    popover: {
      title: "۳. پالت رنگ",
      description:
        "پالت‌های آماده را بزنید یا در تب «سفارشی» تک‌تک نقش‌ها (اصلی، مکمل، موفقیت، هشدار، خطر) و رنگ‌های خنثی و نمودار را دقیق تنظیم کنید. هر تغییر همان لحظه روی بوم می‌نشیند و هشدار کنتراست کمک می‌کند متن خوانا بماند.",
      side: "left",
      align: "start",
    },
  },
  {
    element: "[data-tour='icons']",
    popover: {
      title: "۴. کتابخانه و استایل آیکون",
      description:
        "بین سه کتابخانهٔ واقعی جابه‌جا شوید؛ همهٔ آیکون‌های بوم عوض می‌شوند. اندازه، ضخامت خط و رنگ آیکون‌ها را هم از همین بخش تنظیم کنید.",
      side: "left",
      align: "start",
    },
  },
  {
    element: "[data-tour='radius']",
    popover: {
      title: "۵. گردی گوشه‌ها",
      description:
        "از تیز و چاپی تا نرم و مدرن؛ یکی از گزینه‌ها را بزنید یا عدد دلخواه خودتان را به پیکسل وارد کنید. کارت‌ها، دکمه‌ها و ورودی‌ها همه از همین یک توکن پیروی می‌کنند.",
      side: "left",
      align: "start",
    },
  },
  {
    element: "[data-tour='shadow']",
    popover: {
      title: "۶. سایهٔ جعبه‌ها",
      description:
        "بدون سایه، نرم، برجسته، چاپی یا هالهٔ رنگی؛ «پیرو سبک» هم امضای خود سبک را نگه می‌دارد. سایه روی کارت‌ها، دکمه‌ها، ورودی‌ها و پنل نمودارها می‌نشیند.",
      side: "left",
      align: "start",
    },
  },
  {
    element: "[data-tour='typography']",
    popover: {
      title: "۷. فونت و تایپوگرافی",
      description:
        "فونت متن و فونت نمایشی را جدا انتخاب کنید یا فونت اختصاصی خودتان را (woff2، woff، ttf یا otf) آپلود کنید. فونت‌های آپلودی در همین مرورگر ذخیره می‌شوند.",
      side: "left",
      align: "start",
    },
  },
  {
    element: "[data-tour='canvas-chrome']",
    popover: {
      title: "بوم پیش‌نمایش",
      description:
        "این پنجره یک سایت مستقل و زنده است که با تنظیمات شما رنگ می‌گیرد. نوار بالای آن نام سناریو و آدرس نمایشی را نشان می‌دهد و دکمهٔ «بزرگ‌نمایی» آن را تمام‌صفحه می‌کند (با Esc برگردید).",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: "[data-tour='canvas-status']",
    popover: {
      title: "در بوم بگردید و کاوش کنید",
      description:
        "فقط داخل همین پنجره اسکرول می‌شود؛ پایین بروید تا هدر، بخش‌ها، جدول‌ها و فرم‌های هر سناریو را ببینید. سناریوها را عوض کنید و همین تم را روی فرم، نمودار و جدول امتحان کنید.",
      side: "top",
      align: "center",
    },
  },
  {
    element: "[data-tour='submit-config']",
    popover: {
      title: "ترکیبتان را برای من بفرستید",
      description:
        "وقتی از نتیجه راضی شدید، این دکمه پیکربندی فعلی را ذخیره می‌کند و شما را به فرم تماس صفحهٔ اصلی می‌برد؛ آنجا این ترکیب به پیام شما پیوست می‌شود. اگر هم ترجیح می‌دهید، در همان فرم انتخاب ظاهر را به من بسپارید.",
      side: "left",
      align: "end",
    },
  },
  {
    popover: {
      title: "هر وقت خواستید دوباره",
      description:
        "تنظیمات شما در همین مرورگر ذخیره می‌ماند؛ دفعهٔ بعد همان ترکیب را می‌بینید. برای دیدن دوبارهٔ این راهنما از دکمهٔ «راهنما» در نوار بالای استودیو استفاده کنید. حالا نوبت شماست؛ یک سبک انتخاب کنید و ببینید چه می‌شود.",
    },
  },
];

type CreateStudioTourProps = {
  /** Increment to replay the guide; `0` auto-opens on the first visit. */
  run: number;
};

export function CreateStudioTour({ run }: CreateStudioTourProps) {
  const driverRef = useRef<Driver | null>(null);

  useEffect(() => {
    // First visit only: once the flag is set the guide stays out of the way
    // until the visitor asks for it again from the studio bar.
    if (run === 0 && hasSeenStudioTour()) return;

    // Let the canvas paint (and the persisted configuration settle) first.
    const timer = window.setTimeout(() => {
      const tour = driver({
        steps: STEPS,
        animate: true,
        duration: 400,
        // Instant scrolling keeps the spotlight glued to sections inside the
        // sidebar's own scroll container.
        smoothScroll: false,
        allowClose: true,
        allowScroll: true,
        overlayClickBehavior: "none",
        // The studio frame's fixed indigo ink, matching the preview bezel.
        overlayColor: "#264653",
        overlayOpacity: 0.55,
        stagePadding: 8,
        stageRadius: 4,
        popoverOffset: 12,
        popoverClass: "cc-tour-popover",
        showProgress: true,
        progressText: "قدم {{current}} از {{total}}",
        nextBtnText: "بعدی",
        prevBtnText: "قبلی",
        doneBtnText: "شروع ساخت",
        closeBtnLabel: "بستن راهنما",
        // The guide explains; it must never navigate away mid-tour.
        disableActiveInteraction: true,
        onPopoverRender: (popover) => {
          popover.wrapper.setAttribute("dir", "rtl");
          popover.wrapper.setAttribute("lang", "fa");
          popover.progress.textContent = toPersianDigits(
            popover.progress.textContent ?? "",
          );
        },
        onDestroyed: () => {
          markStudioTourSeen();
          driverRef.current = null;
        },
      });

      driverRef.current = tour;
      tour.drive();
    }, 600);

    return () => {
      window.clearTimeout(timer);
      driverRef.current?.destroy();
      driverRef.current = null;
    };
  }, [run]);

  return null;
}
