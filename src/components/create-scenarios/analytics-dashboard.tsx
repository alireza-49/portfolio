"use client";

import { useMemo, useState } from "react";
import {
  Alert,
  AreaTrend,
  Avatar,
  BarSeries,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ChartFrame,
  ChartLegend,
  Checkbox,
  DonutBreakdown,
  FunnelChart,
  Heatmap,
  Icon,
  Input,
  LineTrend,
  MiniBars,
  Progress,
  RadialGauge,
  Select,
  Separator,
  Sparkline,
  Stat,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsList,
  TabsTrigger,
  Timeline,
  TimelineItem,
  useChartTheme,
  type IconName,
} from "@/components/create-components";
import { cn } from "@/lib/utils";
import {
  ACTIVITY,
  ALERTS,
  CHANNELS,
  DASHBOARD_RANGES,
  FUNNEL_STAGES,
  GAUGES,
  HEATMAP_CELLS,
  HEATMAP_DAYS,
  HEATMAP_HOURS,
  KPI_SERIES,
  NODES,
  ORDERS,
  RANGES,
  SIGNUP_WEEKS,
  SYSTEM_HEALTH,
  TOP_PAGES,
  TRAFFIC_SOURCES,
  jitter,
  statusTone,
  type DashboardOrder,
  type RangeId,
} from "./data/dashboard";
import { formatNumber, formatToman } from "./format";

type SortKey = "amount" | "customer" | "date";
type Metric = "revenue" | "orders";

const PAGE_SIZE = 5;

const NAV: { id: string; label: string; icon: IconName }[] = [
  { id: "overview", label: "نمای کلی", icon: "dashboard" },
  { id: "sales", label: "فروش", icon: "shopping-bag" },
  { id: "customers", label: "مشتریان", icon: "users" },
  { id: "billing", label: "پرداخت‌ها", icon: "credit-card" },
  { id: "infra", label: "زیرساخت", icon: "boxes" },
  { id: "settings", label: "تنظیمات", icon: "settings" },
];

function SortIndicator({ active, asc }: { active: boolean; asc: boolean }) {
  return asc ? (
    <Icon
      name='arrow-up'
      className={cn("size-3", !active && "opacity-30")}
    />
  ) : (
    <Icon
      name='arrow-down'
      className={cn("size-3", !active && "opacity-30")}
    />
  );
}

export function AnalyticsDashboardView() {
  const theme = useChartTheme();

  const [nav, setNav] = useState("overview");
  const [range, setRange] = useState<RangeId>("30d");
  const [metric, setMetric] = useState<Metric>("revenue");
  const [live, setLive] = useState(true);
  const [tick, setTick] = useState(0);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("amount");
  const [sortAsc, setSortAsc] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(0);

  const dataset = DASHBOARD_RANGES[range];
  const totals = useMemo(() => {
    const revenue = dataset.revenue.reduce((sum, row) => sum + row.revenue, 0);
    const previous = dataset.revenue.reduce((sum, row) => sum + row.previous, 0);
    const orders = dataset.revenue.reduce((sum, row) => sum + row.orders, 0);
    return {
      revenue: jitter(revenue, tick, live ? 0.05 : 0),
      previous: jitter(previous, tick + 1, live ? 0.05 : 0),
      orders: jitter(orders, tick + 2, live ? 0.05 : 0),
    };
  }, [dataset, tick, live]);

  const trendRows = dataset.revenue.map((row) => ({
    label: row.label,
    revenue: jitter(row.revenue, tick, live ? 0.04 : 0),
    previous: jitter(row.previous, tick + 7, live ? 0.04 : 0),
    orders: jitter(row.orders, tick + 3, live ? 0.04 : 0),
  }));

  const filteredOrders = useMemo(() => {
    const needle = query.trim();
    const rows = ORDERS.filter((order) => {
      const matchesQuery =
        !needle ||
        order.customer.includes(needle) ||
        order.id.includes(needle) ||
        order.plan.includes(needle);
      const matchesStatus =
        statusFilter === "all" || order.status === statusFilter;
      return matchesQuery && matchesStatus;
    });

    const sorted = [...rows].sort((a, b) => {
      if (sortKey === "amount") return a.amount - b.amount;
      if (sortKey === "customer") return a.customer.localeCompare(b.customer, "fa");
      return a.date.localeCompare(b.date);
    });
    return sortAsc ? sorted : sorted.reverse();
  }, [query, statusFilter, sortKey, sortAsc]);

  const pageCount = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount - 1);
  const pagedOrders = filteredOrders.slice(
    safePage * PAGE_SIZE,
    safePage * PAGE_SIZE + PAGE_SIZE,
  );
  const pageTotal = pagedOrders.reduce((sum, order) => sum + order.amount, 0);

  const toggleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortAsc((previous) => !previous);
      return;
    }
    setSortKey(key);
    setSortAsc(key === "customer");
    setPage(0);
  };

  const toggleRow = (id: string) =>
    setSelected((previous) =>
      previous.includes(id)
        ? previous.filter((entry) => entry !== id)
        : [...previous, id],
    );

  const allVisibleSelected =
    pagedOrders.length > 0 &&
    pagedOrders.every((order) => selected.includes(order.id));


  const bucket = (order: DashboardOrder) => statusTone(order.status);


  return (
    <div className='@container flex flex-col gap-5'>
      {/* ------------------------------------------------------------ top bar */}
      <Card className='gap-0 py-0'>
        <div className='flex flex-wrap items-center justify-between gap-3 p-3'>
          <div className='flex items-center gap-2.5'>
            <span className='flex size-9 items-center justify-center rounded-[var(--cc-radius)] border-[length:var(--cc-border-width)] border-[color:var(--cc-border)] bg-[var(--cc-primary)] text-[color:var(--cc-primary-foreground)] [box-shadow:var(--cc-shadow)]'>
              <Icon name='brand' className='size-5' />
            </span>
            <div className='flex flex-col'>
              <span className='text-sm font-bold text-[color:var(--cc-surface-foreground)]'>
                آترین آنالیتیکس
              </span>
              <span className='text-[10px] text-[color:var(--cc-muted-foreground)]'>
                میز کار داده · {dataset.label}
              </span>
            </div>
          </div>

          <div className='flex flex-wrap items-center gap-2'>
            <div className='relative'>
              <Icon name='search' className='pointer-events-none absolute end-2 top-1/2 size-3.5 -translate-y-1/2 text-[color:var(--cc-muted-foreground)]' />
              <Input
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setPage(0);
                }}
                placeholder='جست‌وجوی سفارش یا مشتری…'
                aria-label='جست‌وجو'
                className='h-8 w-40 pe-7 text-[11px]'
              />
            </div>

            <Select
              value={range}
              onValueChange={(value) => {
                setRange(value as RangeId);
                setPage(0);
              }}
              options={RANGES.map((item) => ({
                value: item.id,
                label: item.label,
              }))}
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
              onClick={() => setTick((previous) => previous + 1)}
            >
              <Icon name='refresh' className='size-3.5' />
            </Button>

            <Avatar alt='کاربر' size='sm' />
          </div>
        </div>

        <div className='flex items-center gap-1 overflow-x-auto border-t-[length:var(--cc-border-width)] border-[color:var(--cc-border)] px-2 py-1.5'>
          {NAV.map((item) => {
            const active = nav === item.id;
            return (
              <button
                key={item.id}
                type='button'
                onClick={() => setNav(item.id)}
                aria-pressed={active}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-[var(--cc-radius-sm)] border-[length:var(--cc-border-width)] px-2 py-1 text-[10px] transition-colors duration-[var(--cc-duration)]",
                  active
                    ? "border-[color:var(--cc-primary)] bg-[var(--cc-primary)] font-bold text-[color:var(--cc-primary-foreground)]"
                    : "border-transparent text-[color:var(--cc-muted-foreground)] hover:bg-[var(--cc-muted)]",
                )}
              >
                <Icon name={item.icon} className='size-3.5' />
                {item.label}
              </button>
            );
          })}
          <span className='ms-auto hidden items-center gap-1 ps-2 text-[10px] text-[color:var(--cc-muted-foreground)] @xl:flex'>
            <Icon name='shield-check' className='size-3' />
            داده‌ها تا {formatNumber(5)} دقیقه پیش
          </span>
        </div>
      </Card>

      {/* --------------------------------------------------------------- KPIs */}
      <div className='grid grid-cols-2 gap-3 @xl:grid-cols-4'>
        <Stat
          label='درآمد دوره'
          value={`${formatNumber(totals.revenue)} م`}
          delta={{ value: "۱۲٪", direction: "up" }}
          hint={`دورهٔ قبل: ${formatNumber(totals.previous)} میلیون`}
          icon={<Icon name='chart-area' className='size-3.5' />}
        >
          <Sparkline points={KPI_SERIES.revenue} />
        </Stat>
        <Stat
          label='سفارش‌ها'
          value={formatNumber(totals.orders)}
          delta={{ value: "۸٪", direction: "up" }}
          hint='۲۴٪ از کانال ارگانیک'
          icon={<Icon name='shopping-bag' className='size-3.5' />}
        >
          <MiniBars points={KPI_SERIES.users} />
        </Stat>
        <Stat
          label='نرخ تبدیل'
          value={`${dataset.summary.conversion}٪`}
          delta={{ value: "۰.۳", direction: "up" }}
          hint={`${formatNumber(dataset.summary.visitors)} بازدید یکتا`}
          icon={<Icon name='gauge' className='size-3.5' />}
        >
          <MiniBars points={KPI_SERIES.conversion} />
        </Stat>
        <Stat
          label='ریزش مشتری'
          value='۳.۸٪'
          delta={{ value: "۰.۴", direction: "down" }}
          hint='بهترین ماه در ۶ ماه گذشته'
          icon={<Icon name='activity' className='size-3.5' />}
        >
          <Sparkline points={KPI_SERIES.churn} tone='success' />
        </Stat>
      </div>


      {/* ------------------------------------------------------- revenue + mix */}
      <div className='grid gap-3 @3xl:grid-cols-[1.55fr_1fr]'>
        <ChartFrame
          eyebrow='روند درآمد'
          title='درآمد در برابر دورهٔ قبل'
          description={dataset.label}
          actions={
            <Tabs
              value={metric}
              onValueChange={(value) => setMetric(value as Metric)}
            >
              <TabsList className='text-[10px]'>
                <TabsTrigger value='revenue'>درآمد</TabsTrigger>
                <TabsTrigger value='orders'>سفارش</TabsTrigger>
              </TabsList>
            </Tabs>
          }
          legend={
            <ChartLegend
              items={[
                {
                  label:
                    metric === "revenue" ? "درآمد (میلیون تومان)" : "سفارش",
                  color: theme.series[0],
                },
                { label: "دورهٔ قبل", color: theme.series[1], dashed: true },
              ]}
            />
          }
          footer={
            <>
              <span>
                اوج:{" "}
                {formatNumber(Math.max(...trendRows.map((row) => row.revenue)))}{" "}
                میلیون تومان
              </span>
              <Badge variant='success'>
                رشد{" "}
                {Math.round(
                  ((totals.revenue - totals.previous) / totals.previous) * 100,
                )}
                ٪
              </Badge>
            </>
          }
        >
          <AreaTrend
            data={trendRows}
            xKey='label'
            height={244}
            series={
              metric === "revenue"
                ? [
                    { key: "revenue", label: "درآمد" },
                    { key: "previous", label: "دورهٔ قبل" },
                  ]
                : [{ key: "orders", label: "سفارش" }]
            }
            dashedKeys={metric === "revenue" ? ["previous"] : []}
            formatValue={(value) => formatNumber(value)}
          />
        </ChartFrame>

        <div className='flex flex-col gap-3'>
          <ChartFrame
            eyebrow='ترافیک'
            title='منبع بازدیدها'
            footer={
              <span>
                مجموع{" "}
                {formatNumber(
                  TRAFFIC_SOURCES.reduce((sum, item) => sum + item.value, 0),
                )}{" "}
                نشست
              </span>
            }
          >
            <DonutBreakdown
              data={TRAFFIC_SOURCES}
              height={168}
              centerValue={formatNumber(86290)}
              centerLabel='نشست'
              formatValue={(value) => formatNumber(value)}
            />
            <ChartLegend
              className='mt-2 justify-center'
              items={TRAFFIC_SOURCES.slice(0, 3).map((source, index) => ({
                label: source.label,
                color: theme.series[index],
              }))}
            />
          </ChartFrame>

          <ChartFrame eyebrow='هدف' title='شاخص‌های کلیدی'>
            <div className='grid grid-cols-2 gap-2'>
              <RadialGauge
                value={GAUGES.monthlyGoal.value}
                label={GAUGES.monthlyGoal.label}
                hint={GAUGES.monthlyGoal.hint}
                footnote={GAUGES.monthlyGoal.footnote}
                size={104}
                thickness={9}
              />
              <RadialGauge
                value={GAUGES.satisfaction.value}
                label={GAUGES.satisfaction.label}
                hint={GAUGES.satisfaction.hint}
                footnote={GAUGES.satisfaction.footnote}
                size={104}
                thickness={9}
                tone='success'
              />
            </div>
          </ChartFrame>
        </div>
      </div>


      {/* ------------------------------------------------------ signups + heat */}
      <div className='grid gap-3 @3xl:grid-cols-[1.15fr_0.85fr]'>
        <ChartFrame
          eyebrow='ثبت‌نام'
          title='ثبت‌نام هفتگی به تفکیک کانال'
          legend={
            <ChartLegend
              items={CHANNELS.map((channel, index) => ({
                label: channel.label,
                color: theme.series[index],
              }))}
            />
          }
          contentClassName='pt-1'
        >
          <BarSeries
            data={SIGNUP_WEEKS}
            xKey='label'
            stacked
            height={222}
            series={CHANNELS.map((channel) => ({
              key: channel.key,
              label: channel.label,
            }))}
            formatValue={(value) => formatNumber(value)}
          />
        </ChartFrame>

        <ChartFrame
          eyebrow='الگوی فعالیت'
          title='بازدید بر اساس روز و ساعت'
          description='تیره‌تر یعنی ترافیک بیشتر'
        >
          <Heatmap
            rows={HEATMAP_DAYS}
            columns={HEATMAP_HOURS}
            cells={HEATMAP_CELLS}
            lowLabel='آرام'
            highLabel='شلوغ'
          />
        </ChartFrame>
      </div>

      {/* ---------------------------------------------------- funnel + pages */}
      <div className='grid gap-3 @3xl:grid-cols-[1fr_1fr]'>
        <ChartFrame
          eyebrow='قیف تبدیل'
          title='از بازدید تا خرید دوم'
          footer={<span>بیشترین ریزش: افزودن به سبد ← شروع پرداخت</span>}
        >
          <FunnelChart
            stages={FUNNEL_STAGES}
            formatValue={(value) => formatNumber(value)}
          />
        </ChartFrame>

        <ChartFrame
          eyebrow='محتوا'
          title='پربازدیدترین صفحه‌ها'
          footer={<span>سهم از کل بازدید · روند هفتگی</span>}
        >
          <div className='flex flex-col gap-2'>
            {TOP_PAGES.map((page) => (
              <div key={page.path} className='flex flex-col gap-1'>
                <div className='flex items-center justify-between gap-2'>
                  <span className='font-mono text-[10px] text-[color:var(--cc-surface-foreground)]'>
                    {page.path}
                  </span>
                  <span className='flex items-center gap-1.5 font-mono text-[10px] text-[color:var(--cc-muted-foreground)]'>
                    {formatNumber(page.visits)}
                    <span
                      className={cn(
                        "font-bold",
                        page.trend > 0
                          ? "text-[color:var(--cc-success)]"
                          : "text-[color:var(--cc-danger)]",
                      )}
                    >
                      {page.trend > 0 ? "▲" : "▼"}
                      {Math.abs(page.trend)}٪
                    </span>
                  </span>
                </div>
                <Progress value={page.share} />
              </div>
            ))}
          </div>
        </ChartFrame>
      </div>


      {/* --------------------------------------------------------- orders */}
      <Card className='gap-3'>
        <CardHeader>
          <div className='flex flex-wrap items-center justify-between gap-2'>
            <div className='flex flex-col gap-1'>
              <CardTitle>سفارش‌های اخیر</CardTitle>
              <CardDescription>
                {formatNumber(filteredOrders.length)} سفارش · صفحهٔ{" "}
                {formatNumber(safePage + 1)} از {formatNumber(pageCount)}
              </CardDescription>
            </div>
            <div className='flex flex-wrap items-center gap-1.5'>
              <Select
                value={statusFilter}
                onValueChange={(value) => {
                  setStatusFilter(value);
                  setPage(0);
                }}
                options={[
                  { value: "all", label: "همهٔ وضعیت‌ها" },
                  { value: "پرداخت‌شده", label: "پرداخت‌شده" },
                  { value: "ارسال‌شده", label: "ارسال‌شده" },
                  { value: "در انتظار", label: "در انتظار" },
                  { value: "لغوشده", label: "لغوشده" },
                ]}
                className='h-8 w-32 text-[10px]'
              />
              <Button size='sm' variant='outline'>
                <Icon name='download' className='size-3.5' />
                CSV
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className='gap-2'>
          {selected.length > 0 ? (
            <div className='flex flex-wrap items-center justify-between gap-2 rounded-[var(--cc-radius)] border-[length:var(--cc-border-width)] border-[color:var(--cc-primary)] bg-[color:color-mix(in_srgb,var(--cc-primary)_8%,var(--cc-surface))] px-2 py-1.5'>
              <span className='text-[10px] font-bold text-[color:var(--cc-surface-foreground)]'>
                {formatNumber(selected.length)} سفارش انتخاب شده
              </span>
              <div className='flex items-center gap-1'>
                <Button size='sm' variant='outline'>
                  <Icon name='filter' className='size-3' />
                  برچسب‌گذاری
                </Button>
                <Button size='sm' onClick={() => setSelected([])}>
                  لغو انتخاب
                </Button>
              </div>
            </div>
          ) : null}

          <Table className='text-right'>
            <TableHeader>
              <TableRow>
                <TableHead className='w-8 text-right'>
                  <Checkbox
                    aria-label='انتخاب همهٔ ردیف‌ها'
                    checked={allVisibleSelected}
                    onCheckedChange={(checked) =>
                      setSelected(
                        checked ? pagedOrders.map((order) => order.id) : [],
                      )
                    }
                  />
                </TableHead>
                <TableHead className='text-right'>
                  <button
                    type='button'
                    onClick={() => toggleSort("customer")}
                    className='inline-flex items-center gap-1'
                  >
                    مشتری
                    <SortIndicator active={sortKey === "customer"} asc={sortAsc} />
                  </button>
                </TableHead>
                <TableHead className='text-right'>پلن</TableHead>
                <TableHead className='text-right'>شهر</TableHead>
                <TableHead className='text-right'>
                  <button
                    type='button'
                    onClick={() => toggleSort("date")}
                    className='inline-flex items-center gap-1'
                  >
                    تاریخ
                    <SortIndicator active={sortKey === "date"} asc={sortAsc} />
                  </button>
                </TableHead>
                <TableHead className='text-right'>
                  <button
                    type='button'
                    onClick={() => toggleSort("amount")}
                    className='inline-flex items-center gap-1'
                  >
                    مبلغ
                    <SortIndicator active={sortKey === "amount"} asc={sortAsc} />
                  </button>
                </TableHead>
                <TableHead className='text-right'>وضعیت</TableHead>
              </TableRow>
            </TableHeader>


            <TableBody>
              {pagedOrders.map((order) => (
                <TableRow key={order.id} data-cc-order={order.id}>
                  <TableCell>
                    <Checkbox
                      aria-label={`انتخاب ${order.customer}`}
                      checked={selected.includes(order.id)}
                      onCheckedChange={() => toggleRow(order.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className='flex items-center gap-2'>
                      <Avatar size='sm' alt={order.customer} />
                      <div className='flex flex-col'>
                        <span className='text-[10px] font-bold'>
                          {order.customer}
                        </span>
                        <span className='font-mono text-[9px] text-[color:var(--cc-muted-foreground)]'>
                          {order.id} · {order.channel}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className='text-[10px]'>{order.plan}</TableCell>
                  <TableCell className='text-[10px]'>{order.city}</TableCell>
                  <TableCell className='font-mono text-[10px]'>
                    {order.date}
                  </TableCell>
                  <TableCell className='whitespace-nowrap font-mono text-[10px]'>
                    {formatToman(order.amount)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={bucket(order)}>{order.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
              {pagedOrders.length === 0 ? (
                <TableRow>
                  <TableCell className='text-center text-[10px] text-[color:var(--cc-muted-foreground)]'>
                    سفارشی با این فیلتر پیدا نشد.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>

          <div className='flex flex-wrap items-center justify-between gap-2 border-t-[length:var(--cc-border-width)] border-[color:var(--cc-border)] pt-2'>
            <span className='text-[10px] text-[color:var(--cc-muted-foreground)]'>
              جمع این صفحه: {formatToman(pageTotal)}
            </span>
            <div className='flex items-center gap-1'>
              <Button
                size='icon'
                variant='outline'
                aria-label='صفحهٔ قبل'
                disabled={safePage === 0}
                onClick={() =>
                  setPage((previous) => Math.max(0, previous - 1))
                }
              >
                <Icon name='chevron-right' className='size-3.5' />
              </Button>
              {Array.from({ length: pageCount }).map((_, index) => (
                <Button
                  key={index}
                  size='sm'
                  variant={index === safePage ? "solid" : "outline"}
                  onClick={() => setPage(index)}
                  className='min-w-7 px-0 font-mono text-[10px]'
                >
                  {formatNumber(index + 1)}
                </Button>
              ))}
              <Button
                size='icon'
                variant='outline'
                aria-label='صفحهٔ بعد'
                disabled={safePage >= pageCount - 1}
                onClick={() =>
                  setPage((previous) => Math.min(pageCount - 1, previous + 1))
                }
              >
                <Icon name='chevron-left' className='size-3.5' />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>


      {/* --------------------------------------------- alerts, activity, infra */}
      <div className='grid gap-3 @3xl:grid-cols-[1fr_1fr_0.9fr]'>
        <Card className='gap-2.5'>
          <CardHeader>
            <div className='flex items-center justify-between gap-2'>
              <CardTitle className='text-sm'>هشدارها</CardTitle>
              <Badge variant='danger'>{formatNumber(ALERTS.length)}</Badge>
            </div>
            <CardDescription>رویدادهای نیازمند بررسی</CardDescription>
          </CardHeader>
          <CardContent className='gap-2'>
            {ALERTS.map((alert) => (
              <Alert key={alert.title} variant={alert.tone} title={alert.title}>
                <span className='flex flex-col gap-0.5'>
                  {alert.detail}
                  <span className='text-[9px] opacity-70'>{alert.time}</span>
                </span>
              </Alert>
            ))}
            <Button size='sm' variant='outline' fullWidth>
              <Icon name='bell' className='size-3.5' />
              تنظیم قاعدهٔ هشدار
            </Button>
          </CardContent>
        </Card>

        <Card className='gap-2.5'>
          <CardHeader>
            <CardTitle className='text-sm'>فعالیت تیم</CardTitle>
            <CardDescription>آخرین تغییرات محصول و زیرساخت</CardDescription>
          </CardHeader>
          <CardContent>
            <Timeline>
              {ACTIVITY.map((item) => (
                <TimelineItem
                  key={item.title}
                  title={item.title}
                  description={item.description}
                  meta={item.meta}
                  tone={item.tone}
                />
              ))}
            </Timeline>
          </CardContent>
        </Card>

        <Card className='gap-2.5'>
          <CardHeader>
            <CardTitle className='text-sm'>سلامت سیستم</CardTitle>
            <CardDescription>آپ‌تایم و لتنسی سرویس‌ها</CardDescription>
          </CardHeader>
          <CardContent className='gap-2'>
            {SYSTEM_HEALTH.map((service) => (
              <div key={service.name} className='flex flex-col gap-1'>
                <div className='flex items-center justify-between gap-2'>
                  <span className='text-[10px] font-bold text-[color:var(--cc-surface-foreground)]'>
                    {service.name}
                  </span>
                  <Badge
                    variant={service.status === "پایدار" ? "success" : "warning"}
                  >
                    {service.status}
                  </Badge>
                </div>
                <Progress value={service.uptime} />
                <div className='flex items-center justify-between font-mono text-[9px] text-[color:var(--cc-muted-foreground)]'>
                  <span>{service.uptime}٪ آپ‌تایم</span>
                  <span>{service.latency}ms</span>
                </div>
              </div>
            ))}
            <Separator />
            <div className='grid grid-cols-2 gap-1.5'>
              {NODES.map((node) => (
                <div
                  key={node.name}
                  className='flex flex-col gap-1 rounded-[var(--cc-radius-sm)] border-[length:var(--cc-border-width)] border-[color:var(--cc-border)] p-1.5'
                >
                  <span className='flex items-center justify-between font-mono text-[9px] text-[color:var(--cc-muted-foreground)]'>
                    {node.name}
                    <Badge variant='outline'>{node.region}</Badge>
                  </span>
                  <Progress value={node.load} />
                  <span className='font-mono text-[9px] text-[color:var(--cc-surface-foreground)]'>
                    {node.load}٪ مصرف
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>


      {/* ------------------------------------------------------------- forecast */}
      <ChartFrame
        eyebrow='پیش‌بینی'
        title='روند کاربران فعال در برابر سفارش‌ها'
        description='مدل پیش‌بینی ساده بر پایهٔ میانگین متحرک ۷ روزه'
        actions={
          <Badge variant='soft' className='gap-1'>
            <Icon name='activity' className='size-3' />
            دقت مدل: ۸۶٪
          </Badge>
        }
        legend={
          <ChartLegend
            items={[
              { label: "کاربران فعال", color: theme.series[3] },
              { label: "پیش‌بینی", color: theme.series[4], dashed: true },
            ]}
          />
        }
        footer={
          <>
            <span>داده‌ها هر ۵ دقیقه بازخوانی می‌شوند.</span>
            <Button
              size='sm'
              variant='outline'
              onClick={() => setTick((previous) => previous + 1)}
            >
              <Icon name='refresh' className='size-3' />
              بازخوانی
            </Button>
          </>
        }
      >
        <LineTrend
          data={trendRows.map((row, index) => {
            const actual = jitter(
              KPI_SERIES.users[index % KPI_SERIES.users.length],
              tick + index,
            );
            return {
              label: row.label,
              actual,
              forecast: Math.round(actual * 1.12),
            };
          })}
          xKey='label'
          height={210}
          showDots
          dashedKeys={["forecast"]}
          series={[
            { key: "actual", label: "کاربران فعال (هزار)" },
            { key: "forecast", label: "پیش‌بینی هفتهٔ بعد" },
          ]}
          formatValue={(value) => formatNumber(value)}
        />
      </ChartFrame>

      <footer className='flex flex-wrap items-center justify-between gap-2 border-t-[length:var(--cc-border-width)] border-[color:var(--cc-border)] pt-2'>
        <span className='flex items-center gap-1.5 text-[10px] text-[color:var(--cc-muted-foreground)]'>
          <Icon name='brand' className='size-3.5 text-[color:var(--cc-primary)]' />
          آترین آنالیتیکس · نسخهٔ ۲.۱۴.۰
        </span>
        <div className='flex flex-wrap items-center gap-1'>
          <Badge variant='outline'>منطقهٔ داده: EU</Badge>
          <Badge variant='outline'>نگهداری ۹۰ روز</Badge>
          <Badge variant='outline'>دسترسی محدود</Badge>
        </div>
      </footer>
    </div>
  );
}

