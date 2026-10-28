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
 * Below `lg` the settings panel is a drawer, so the tour opens it for the
 * sidebar steps and closes it again for the canvas steps — otherwise driver.js
 * would measure a hidden element and the spotlight would land in the wrong
 * place.
 *
 * Storage is only read/written from effects and driver hooks, never while
 * rendering, so the prerendered page stays deterministic.
 */
const COMPACT_QUERY = "(max-width: 1023px)";

const isCompactViewport = () => window.matchMedia(COMPACT_QUERY).matches;

type TourPanel = "sidebar" | "canvas";

const panelOf = (step: DriveStep | undefined): TourPanel =>
  step?.data?.panel === "sidebar" ? "sidebar" : "canvas";

/** How long the drawer transition takes before driver.js may measure it. */
const DRAWER_SETTLE_MS = 260;

const STEPS: DriveStep[] = [
  {
    popover: {
      title: "به وب دیزاین فیل خوش آمدید",
      // driver.js renders `description` as HTML, so the scope note is a real
      // styled block (`.cc-tour-scope` in tour.css) instead of a buried
      // sentence at the end of the paragraph.
      description:
        "اینجا کارگاه زندهٔ ساخت ظاهر سایت است؛ به‌جای حدس زدن، سبک، رنگ و فونت را روی یک سایت واقعی می‌بینید. در چند قدم کوتاه هر بخش را معرفی می‌کنم و در پایان نشان می‌دهم چطور همین ترکیب را برای من بفرستید." +
        "<div class='cc-tour-scope'>" +
        "<span class='cc-tour-scope-badge' aria-hidden='true'>!</span>" +
        "<span><b>این تم فقط ظاهر است، نه چیدمان.</b> " +
        "اینجا رنگ، پالت، فونت و سبک بصری را انتخاب می‌کنید؛ چیدمان، بخش‌ها و عملکرد سایت کاملاً سفارشی و از صفر بر اساس نیاز شما ساخته می‌شود.</span>" +
        "</div>",
    },
  },
  {
    element: "[data-tour='scenarios']",
    popover: {
      title: "۱. سناریو را انتخاب کنید",
      description:
        "هر سناریو یک سایت کامل است: لندینگ تدریس آنلاین، فروشگاه پوشاک، نوبت‌دهی کلینیک، داشبورد تحلیل و کاتالوگ المان‌های خام. با این تب‌ها بوم را عوض کنید و ببینید یک تم روی چه نوع سایتی می‌نشیند.",
      side: "bottom",
      align: "center",
    },
  },
  {
    element: "[data-tour='styles']",
    data: { panel: "sidebar" },
    popover: {
      title: "۲. سبک بصری",
      description:
        "سیزده سبک آماده، از شرکتی و مینیمال تا چاپی و آزمایشی. هر سبک پالت رنگ، فونت، بافت، فرم کنترل‌ها و سایهٔ خودش را دارد؛ با انتخاب سبک، پالت، گردی گوشه و فونت هم با آن همگام می‌شوند.",
      side: "left",
      align: "start",
    },
  },
  {
    element: "[data-tour='palette']",
    data: { panel: "sidebar" },
    popover: {
      title: "۳. پالت رنگ",
      description:
        "پالت‌های آماده را بزنید یا در تب «سفارشی» تک‌تک نقش‌ها (اصلی، مکمل، موفقیت، هشدار، خطر) و رنگ‌های خنثی و نمودار را دقیق تنظیم کنید. هر تغییر همان لحظه روی بوم می‌نشیند و هشدار کنتراست کمک می‌کند متن خوانا بماند.",
      side: "left",
      align: "start",
    },
  },
  {
    element: "[data-tour='radius']",
    data: { panel: "sidebar" },
    popover: {
      title: "۴. گردی گوشه‌ها",
      description:
        "از تیز و چاپی تا نرم و مدرن؛ یکی از گزینه‌ها را بزنید یا عدد دلخواه خودتان را به پیکسل وارد کنید. کارت‌ها، دکمه‌ها و ورودی‌ها همه از همین یک توکن پیروی می‌کنند.",
      side: "left",
      align: "start",
    },
  },
  {
    element: "[data-tour='shadow']",
    data: { panel: "sidebar" },
    popover: {
      title: "۵. سایهٔ جعبه‌ها",
      description:
        "بدون سایه، نرم، برجسته، چاپی یا هالهٔ رنگی؛ «پیرو سبک» هم امضای خود سبک را نگه می‌دارد. سایه روی کارت‌ها، دکمه‌ها، ورودی‌ها و پنل نمودارها می‌نشیند.",
      side: "left",
      align: "start",
    },
  },
  {
    element: "[data-tour='typography']",
    data: { panel: "sidebar" },
    popover: {
      title: "۶. انتخاب فونت",
      description:
        "گزینهٔ «پیش‌فرض» همان فونتِ سبک فعال است؛ فونت متن و نمایشی را جدا انتخاب کنید یا فونت اختصاصی خودتان را (woff2، woff، ttf یا otf) آپلود کنید. فونت‌های آپلودی در همین مرورگر ذخیره می‌شوند.",
      side: "left",
      align: "start",
    },
  },
  {
    element: "[data-tour='canvas-chrome']",
    popover: {
      title: "بوم پیش‌نمایش",
      description:
        "این پنجره یک سایت مستقل و زنده است که با تنظیمات شما رنگ می‌گیرد. نوار بالای آن نام سناریو و آدرس نمایشی را نشان می‌دهد و دکمهٔ «بزرگ‌نمایی» آن را تمام‌صفحه می‌کند (با Esc برگردید)." +
        "<div class='cc-tour-scope cc-tour-scope-sm'>" +
        "<span class='cc-tour-scope-badge' aria-hidden='true'>!</span>" +
        "<span><b>نوار تیرهٔ بالای پنجره:</b> این استودیو فقط تم می‌سازد؛ چیدمان، بخش‌ها و عملکرد سایت بخشی از تم نیست و از صفر و کاملاً سفارشی طراحی می‌شود.</span>" +
        "</div>",
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
    data: { panel: "sidebar" },
    popover: {
      title: "ترکیبتان را برای من بفرستید",
      description:
        "وقتی از نتیجه راضی شدید، این دکمه پیکربندی فعلی را ذخیره می‌کند و شما را به فرم تماس صفحهٔ اصلی می‌برد؛ آنجا وضعیت تم (سفارشی یا پیش‌فرض)، همهٔ گزینه‌های انتخاب‌شده و پالت به‌صورت کامل به پیام شما پیوست می‌شود. از همین بلوک می‌توانید کد CSS یا فایل JSON پیکربندی را بگیرید و بعداً با «بارگذاری پیکربندی کپی‌شده» همان تم را روی هر مرورگری برگردانید.",
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

/**
 * On a phone the sidebar is a full-height sheet, so a popover beside the
 * highlighted control has nowhere to go. Put those popovers under the control
 * and let driver.js clamp them into the viewport.
 */
function stepsForViewport(compact: boolean): DriveStep[] {
  if (!compact) return STEPS;
  return STEPS.map((step) =>
    step.data?.panel === "sidebar"
      ? {
          ...step,
          popover: { ...step.popover, side: "bottom", align: "center" },
        }
      : step,
  );
}

type CreateStudioTourProps = {
  /** Increment to replay the guide; `0` auto-opens on the first visit. */
  run: number;
  /**
   * Opens or closes the mobile settings sheet. The tour calls it whenever the
   * next step lives in the settings panel, and closes the sheet on destroy.
   */
  onSettingsChange?: (open: boolean) => void;
};

export function CreateStudioTour({
  run,
  onSettingsChange,
}: CreateStudioTourProps) {
  const driverRef = useRef<Driver | null>(null);

  useEffect(() => {
    // First visit only: once the flag is set the guide stays out of the way
    // until the visitor asks for it again from the studio bar.
    if (run === 0 && hasSeenStudioTour()) return;

    /**
     * Space steps forward even when a click moved focus out of the button.
     * Focus parked on «قبلی» or the close button keeps its native behaviour so
     * keyboard users can still go back or dismiss the guide.
     */
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === " " && !event.repeat && !event.defaultPrevented) {
        if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey)
          return;

        const target = event.target;
        if (target instanceof Element) {
          if (
            target.closest(
              "input, textarea, select, [contenteditable='true'], [contenteditable='']",
            )
          ) {
            return;
          }

          const button = target.closest(".cc-tour-popover button");
          if (button && !button.classList.contains("driver-popover-next-btn"))
            return;
        }

        const next = document.querySelector<HTMLButtonElement>(
          ".cc-tour-popover .driver-popover-next-btn",
        );
        if (!next || next.disabled) return;

        // Cancel the page scroll and the native button click on keyup, then
        // advance once through driver's own handler.
        event.preventDefault();
        next.click();
        return;
      }

      // Compact mode disables driver's own keyboard control (its arrow keys
      // bypass our hooks and would step onto a hidden drawer target); Escape
      // still has to dismiss the guide.
      if (event.key === "Escape" && isCompactViewport()) {
        event.preventDefault();
        driverRef.current?.destroy();
      }
    };

    // Let the canvas paint (and the persisted configuration settle) first.
    const timer = window.setTimeout(() => {
      const compact = isCompactViewport();
      const panelRef = { current: "canvas" as TourPanel };
      let settleTimer: number | null = null;

      if (compact) onSettingsChange?.(false);

      let tour: Driver | null = null;

      /**
       * Move to a step after making its panel visible. The sheet animates, so
       * wait one transition before driver.js measures the target element.
       */
      const revealStep = (index: number) => {
        if (!tour) return;
        const steps = tour.getConfig().steps ?? [];
        const step = steps[index];
        if (!step) {
          tour.destroy();
          return;
        }
        const panel = panelOf(step);
        if (!compact || panel === panelRef.current) {
          tour.moveTo(index);
          return;
        }
        panelRef.current = panel;
        onSettingsChange?.(panel === "sidebar");
        if (settleTimer !== null) window.clearTimeout(settleTimer);
        // Hide the outgoing popover while the sheet slides; the next step
        // re-renders its own popover, so nothing has to be restored.
        const popover = tour.getState("popover") as
          | { wrapper?: HTMLElement }
          | undefined;
        if (popover?.wrapper) popover.wrapper.style.visibility = "hidden";
        settleTimer = window.setTimeout(() => {
          settleTimer = null;
          if (!tour?.isActive()) return;
          tour.moveTo(index);
        }, DRAWER_SETTLE_MS);
      };

      tour = driver({
        steps: stepsForViewport(compact),
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
        // Arrow keys bypass onNextClick/onPrevClick, so they would walk onto
        // drawer targets that are still hidden. Compact mode advances through
        // the buttons and Space only.
        allowKeyboardControl: !compact,
        onNextClick: () => {
          const index = tour?.getActiveIndex();
          if (index === undefined) return;
          revealStep(index + 1);
        },
        onPrevClick: () => {
          const index = tour?.getActiveIndex();
          if (index === undefined) return;
          revealStep(index - 1);
        },
        onPopoverRender: (popover) => {
          popover.wrapper.setAttribute("dir", "rtl");
          popover.wrapper.setAttribute("lang", "fa");
          popover.progress.textContent = toPersianDigits(
            popover.progress.textContent ?? "",
          );
          // driver.js focuses its close button right after this hook, which
          // makes Space dismiss the guide. Park focus on the primary action
          // instead, once driver's own focus call has run.
          queueMicrotask(() => {
            if (!popover.nextButton.isConnected) return;
            popover.nextButton.focus({ preventScroll: true });
          });
        },
        onDestroyed: () => {
          markStudioTourSeen();
          window.removeEventListener("keydown", onKeyDown);
          if (settleTimer !== null) window.clearTimeout(settleTimer);
          if (compact) onSettingsChange?.(false);
          panelRef.current = "canvas";
          driverRef.current = null;
        },
      });

      driverRef.current = tour;
      tour.drive();
      window.addEventListener("keydown", onKeyDown);
    }, 600);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", onKeyDown);
      driverRef.current?.destroy();
      driverRef.current = null;
    };
  }, [run, onSettingsChange]);

  return null;
}
