"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Icon,
  Select,
  Switch,
  monoType,
} from "@/components/create-components";
import { cn } from "@/lib/utils";
import { BillingPage } from "./dashboard/billing-page";
import { CustomersPage } from "./dashboard/customers-page";
import { InfraPage } from "./dashboard/infra-page";
import { OverviewPage } from "./dashboard/overview-page";
import { DASHBOARD_PAGES, type DashboardPageId } from "./dashboard/pages";
import { SalesPage } from "./dashboard/sales-page";
import { SettingsPage } from "./dashboard/settings-page";
import { useDashboardData } from "./dashboard/use-dashboard-data";
import { RANGES, type RangeId } from "./data/dashboard";
import { formatNumber } from "./format";
import { Swap } from "./motion-primitives";

/**
 * Dashboard shell: an app bar, a page rail and exactly one page at a time.
 *
 * The rail is navigation, not an anchor list — picking a page swaps the body
 * (and resets the preview scroller) instead of scrolling a long document.
 * `range` / `live` / `tick` live here so the 8 s live tick and the chosen
 * period survive page changes, while view state (sort, paging, metric) belongs
 * to the page and resets when you leave it, like a real route change.
 */
export function AnalyticsDashboardView() {
  const [page, setPage] = useState<DashboardPageId>("overview");
  const [range, setRange] = useState<RangeId>("30d");
  const [live, setLive] = useState(true);
  const [tick, setTick] = useState(0);

  const data = useDashboardData(range, live, tick);
  const activePage =
    DASHBOARD_PAGES.find((entry) => entry.id === page) ?? DASHBOARD_PAGES[0];

  // Live mode actually ticks: the chips and charts re-jitter every 8 seconds
  // while the switch is on. The interval only exists after hydration, so the
  // prerendered page stays deterministic.
  useEffect(() => {
    if (!live) return;
    const timer = window.setInterval(() => {
      setTick((previous) => previous + 1);
    }, 8000);
    return () => window.clearInterval(timer);
  }, [live]);

  const selectPage = (next: DashboardPageId) => {
    if (next === page) return;
    setPage(next);
  };

  /**
   * Each page opens at its own top, like a route change. Runs after the
   * outgoing page has faded out (see `Swap`), and only moves the preview
   * scroller — the studio page keeps its position.
   */
  const scrollPreviewTop = () => {
    document
      .querySelector<HTMLElement>("[data-preview-viewport]")
      ?.scrollTo({ top: 0 });
  };

  const refresh = () => setTick((previous) => previous + 1);

  const renderPage = (): ReactNode => {
    switch (page) {
      case "sales":
        return <SalesPage data={data} tick={tick} onRefresh={refresh} />;
      case "customers":
        return <CustomersPage data={data} />;
      case "billing":
        return <BillingPage />;
      case "infra":
        return <InfraPage />;
      case "settings":
        return (
          <SettingsPage
            live={live}
            onLiveChange={setLive}
            range={range}
            onRangeChange={setRange}
          />
        );
      default:
        return <OverviewPage data={data} />;
    }
  };

  return (
    <div className='@container flex flex-col gap-4'>
      {/* ------------------------------------------------------------ app bar */}
      <Card className='gap-2 py-2.5'>
        <div className='flex flex-wrap items-center justify-between gap-2.5'>
          <div className='flex items-center gap-2.5'>
            <span className='flex size-9 items-center justify-center rounded-[var(--cc-radius)] border-[length:var(--cc-border-width)] border-[color:var(--cc-border)] bg-[var(--cc-primary)] text-[color:var(--cc-primary-foreground)] [box-shadow:var(--cc-shadow)]'>
              <Icon name='brand' className='size-5' />
            </span>
            <div className='flex flex-col'>
              <span className='text-sm font-bold text-[color:var(--cc-surface-foreground)]'>
                آترین آنالیتیکس
              </span>
              <span className='flex flex-wrap items-center gap-1 text-[10px] text-[color:var(--cc-muted-foreground)]'>
                میز کار داده
                <span aria-hidden='true'>·</span>
                <span className='font-bold text-[color:var(--cc-surface-foreground)]'>
                  {activePage.label}
                </span>
                <span
                  dir='ltr'
                  className={cn(
                    "rounded-[var(--cc-radius-sm)] border-[length:var(--cc-border-width)] border-[color:var(--cc-border)] px-1 text-[9px]",
                    monoType,
                  )}
                >
                  {activePage.path}
                </span>
              </span>
            </div>
          </div>

          <div className='flex flex-wrap items-center gap-1.5'>
            <Select
              value={range}
              onValueChange={(value) => setRange(value as RangeId)}
              options={RANGES.map((item) => ({
                value: item.id,
                label: item.label,
              }))}
              aria-label='بازهٔ گزارش'
              className='h-8 w-28 text-[11px]'
            />

            <span className='flex items-center gap-1.5 rounded-[var(--cc-radius-sm)] border-[length:var(--cc-border-width)] border-[color:var(--cc-border)] px-2 py-1'>
              <span
                className={cn(
                  "size-1.5 rounded-full",
                  live ? "bg-[var(--cc-success)]" : "bg-[var(--cc-border)]",
                )}
              />
              <span className='text-[10px] text-[color:var(--cc-muted-foreground)]'>
                زنده
              </span>
              <Switch
                checked={live}
                onCheckedChange={setLive}
                aria-label='به‌روزرسانی زنده'
              />
            </span>

            <Button
              size='icon'
              variant='outline'
              aria-label='بروزرسانی داده‌ها'
              onClick={refresh}
            >
              <Icon name='refresh' className='size-3.5' />
            </Button>

            <Avatar alt='کاربر' size='sm' />
          </div>
        </div>
      </Card>

      {/* --------------------------------------------------------- rail + page */}
      <div className='flex flex-col gap-4 @3xl:grid @3xl:grid-cols-[12.5rem_minmax(0,1fr)] @3xl:items-start'>
        <nav
          aria-label='صفحه‌های داشبورد'
          className='flex flex-col gap-1 rounded-[var(--cc-radius)] border-[length:var(--cc-border-width)] border-[color:var(--cc-border)] bg-[var(--cc-surface)] p-1.5 @3xl:sticky @3xl:top-0'
        >
          <div className='flex items-center gap-1 overflow-x-auto @3xl:flex-col @3xl:items-stretch'>
            {DASHBOARD_PAGES.map((item) => {
              const active = item.id === page;
              return (
                <button
                  key={item.id}
                  type='button'
                  onClick={() => selectPage(item.id)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex shrink-0 items-center gap-1.5 rounded-[var(--cc-radius-sm)] px-2 py-1.5 text-[11px] transition-colors duration-[var(--cc-duration)]",
                    "focus-visible:ring-[length:var(--cc-focus-ring-width)] focus-visible:ring-[color:var(--cc-ring)] focus-visible:outline-none",
                    active
                      ? "bg-[var(--cc-primary)] font-bold text-[color:var(--cc-primary-foreground)]"
                      : "text-[color:var(--cc-muted-foreground)] hover:bg-[var(--cc-muted)]",
                  )}
                >
                  <Icon name={item.icon} className='size-3.5' />
                  {item.label}
                </button>
              );
            })}
          </div>
          <div className='hidden flex-col gap-1 border-t-[length:var(--cc-border-width)] border-[color:var(--cc-border)] pt-2 @3xl:flex'>
            <span className='text-[9px] text-[color:var(--cc-muted-foreground)]'>
              نسخهٔ ۲.۱۴.۰ · منطقهٔ داده EU
            </span>
            <span className='text-[9px] text-[color:var(--cc-muted-foreground)]'>
              {formatNumber(DASHBOARD_PAGES.length)} صفحه · موتور نمودار:
              Recharts
            </span>
          </div>
        </nav>

        <div className='flex min-w-0 flex-col gap-4'>
          <Swap
            swapKey={page}
            onExitComplete={scrollPreviewTop}
            className='min-h-[24rem]'
          >
            {renderPage()}
          </Swap>

          <footer className='flex flex-wrap items-center justify-between gap-2 border-t-[length:var(--cc-border-width)] border-[color:var(--cc-border)] pt-2'>
            <span className='flex items-center gap-1.5 text-[10px] text-[color:var(--cc-muted-foreground)]'>
              <Icon
                name='brand'
                className='size-3.5 text-[color:var(--cc-primary)]'
              />
              آترین آنالیتیکس · نسخهٔ ۲.۱۴.۰
            </span>
            <div className='flex flex-wrap items-center gap-1'>
              <Badge variant='outline'>منطقهٔ داده: EU</Badge>
              <Badge variant='outline'>نگهداری ۹۰ روز</Badge>
              <Badge variant='outline'>دسترسی محدود</Badge>
            </div>
          </footer>
        </div>
      </div>

      {/* Page changes are announced without stealing focus from the canvas. */}
      <span role='status' aria-live='polite' className='sr-only'>
        صفحهٔ {activePage.label}
      </span>
    </div>
  );
}

