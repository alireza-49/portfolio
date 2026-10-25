"use client";

import { useMemo, useState } from "react";
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Checkbox,
  Icon,
  Input,
  Select,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  monoType,
} from "@/components/create-components";
import { cn } from "@/lib/utils";
import {
  ORDER_STATUSES,
  ORDERS,
  statusTone,
  type DashboardOrder,
} from "../data/dashboard";
import { formatNumber, formatToman } from "../format";

type SortKey = "amount" | "customer" | "date";

const PAGE_SIZE = 5;

/**
 * Serialises the current rows (or the visitor's selection) to a UTF-8 CSV with
 * a BOM so Excel and Numbers open the Persian headers correctly.
 */
function downloadCsv(rows: DashboardOrder[], filename: string) {
  const header = [
    "شناسه",
    "مشتری",
    "پلن",
    "شهر",
    "کانال",
    "تاریخ",
    "مبلغ",
    "وضعیت",
  ];
  const body = rows.map((order) => [
    order.id,
    order.customer,
    order.plan,
    order.city,
    order.channel,
    order.date,
    String(order.amount),
    order.status,
  ]);
  const csv = [header, ...body]
    .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(","))
    .join("\r\n");

  const blob = new Blob([`\uFEFF${csv}`], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  // Give the browser a tick to start the download before dropping the blob.
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function SortIndicator({ active, asc }: { active: boolean; asc: boolean }) {
  if (!active) {
    return <Icon name='chevron-down' className='size-3 opacity-40' />;
  }
  return (
    <Icon name={asc ? "arrow-up" : "arrow-down"} className='size-3' />
  );
}

/**
 * The one place that knows how a search term and a status filter combine. The
 * card's counter and the table both call it, so they can never disagree.
 */
function filterOrders(query: string, statusFilter: string): DashboardOrder[] {
  const needle = query.trim();
  return ORDERS.filter((order) => {
    const haystack = `${order.customer} ${order.id} ${order.plan} ${order.city} ${order.channel} ${order.status}`;
    const matchesQuery = !needle || haystack.includes(needle);
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    return matchesQuery && matchesStatus;
  });
}

export function OrdersPanel() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("amount");
  const [sortAsc, setSortAsc] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(0);

  const filteredOrders = useMemo(() => {
    const sorted = [...filterOrders(query, statusFilter)].sort((a, b) => {
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

  /** Selections that still match the active filters. */
  const visibleSelected = selected.filter((id) =>
    filteredOrders.some((order) => order.id === id),
  );
  const allVisibleSelected =
    pagedOrders.length > 0 &&
    pagedOrders.every((order) => selected.includes(order.id));

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

  const ariaSort = (key: SortKey) =>
    sortKey === key ? (sortAsc ? "ascending" : "descending") : "none";

  const hasFilters = query.trim() !== "" || statusFilter !== "all";

  const resetFilters = () => {
    setQuery("");
    setStatusFilter("all");
    setPage(0);
  };

  return (
    <Card className='gap-3'>
      <CardHeader>
        <div className='flex flex-wrap items-center justify-between gap-2'>
          <div className='flex flex-col gap-1'>
            <CardTitle>سفارش‌های اخیر</CardTitle>
            <CardDescription aria-live='polite'>
              {formatNumber(filteredOrders.length)} سفارش · صفحهٔ{" "}
              {formatNumber(safePage + 1)} از {formatNumber(pageCount)}
              {query.trim() ? ` · جست‌وجو برای «${query.trim()}»` : ""}
            </CardDescription>
          </div>
          <div className='flex flex-wrap items-center gap-1.5'>
            <div className='relative'>
              <Icon
                name='search'
                className='pointer-events-none absolute end-2 top-1/2 size-3.5 -translate-y-1/2 text-[color:var(--cc-muted-foreground)]'
              />
              <Input
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setPage(0);
                }}
                placeholder='مشتری، شهر، کانال…'
                aria-label='جست‌وجوی سفارش‌ها'
                className='h-8 w-40 pe-7 text-[length:calc(var(--cc-font-size)*0.8)]'
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value);
                setPage(0);
              }}
              options={[
                { value: "all", label: "همهٔ وضعیت‌ها" },
                ...ORDER_STATUSES.map((status) => ({
                  value: status,
                  label: status,
                })),
              ]}
              size='sm'
              aria-label='فیلتر وضعیت سفارش‌ها'
              className='w-32 shrink-0'
            />
            {hasFilters ? (
              <Button size='sm' variant='ghost' onClick={resetFilters}>
                <Icon name='close' className='size-3' />
                پاک‌کردن فیلتر
              </Button>
            ) : null}
            <Button
              size='sm'
              variant='outline'
              onClick={() => downloadCsv(filteredOrders, "orders.csv")}
            >
              <Icon name='download' className='size-3.5' />
              CSV
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className='gap-2'>
        {visibleSelected.length > 0 ? (
          <div className='flex flex-wrap items-center justify-between gap-2 rounded-[var(--cc-radius)] border-[length:var(--cc-border-width)] border-[color:var(--cc-primary)] bg-[color:color-mix(in_srgb,var(--cc-primary)_8%,var(--cc-surface))] px-2 py-1.5'>
            <span className='text-[10px] font-bold text-[color:var(--cc-surface-foreground)]'>
              {formatNumber(visibleSelected.length)} سفارش انتخاب شده
            </span>
            <div className='flex flex-wrap items-center gap-1'>
              <Button
                size='sm'
                variant='outline'
                onClick={() =>
                  downloadCsv(
                    filteredOrders.filter((order) =>
                      visibleSelected.includes(order.id),
                    ),
                    "selected-orders.csv",
                  )
                }
              >
                <Icon name='download' className='size-3' />
                دانلود انتخاب‌شده‌ها
              </Button>
              <Button size='sm' onClick={() => setSelected([])}>
                لغو انتخاب
              </Button>
            </div>
          </div>
        ) : null}


        <Table className='text-right'>
          <TableCaption className='sr-only'>سفارش‌های اخیر</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className='w-8 text-right'>
                <Checkbox
                  aria-label='انتخاب همهٔ ردیف‌های این صفحه'
                  checked={allVisibleSelected}
                  onCheckedChange={(checked) =>
                    setSelected(
                      checked
                        ? Array.from(
                            new Set([
                              ...selected,
                              ...pagedOrders.map((order) => order.id),
                            ]),
                          )
                        : selected.filter(
                            (id) =>
                              !pagedOrders.some((order) => order.id === id),
                          ),
                    )
                  }
                />
              </TableHead>
              <TableHead className='text-right' aria-sort={ariaSort("customer")}>
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
              <TableHead className='text-right' aria-sort={ariaSort("date")}>
                <button
                  type='button'
                  onClick={() => toggleSort("date")}
                  className='inline-flex items-center gap-1'
                >
                  تاریخ
                  <SortIndicator active={sortKey === "date"} asc={sortAsc} />
                </button>
              </TableHead>
              <TableHead className='text-right' aria-sort={ariaSort("amount")}>
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
                      <span
                        className={cn(
                          "text-[9px] text-[color:var(--cc-muted-foreground)]",
                          monoType,
                        )}
                      >
                        {order.id} · {order.channel}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className='text-[10px]'>{order.plan}</TableCell>
                <TableCell className='text-[10px]'>{order.city}</TableCell>
                <TableCell
                  className={cn("whitespace-nowrap text-[10px]", monoType)}
                >
                  {order.date}
                </TableCell>
                <TableCell
                  className={cn("whitespace-nowrap text-[10px]", monoType)}
                >
                  {formatToman(order.amount)}
                </TableCell>
                <TableCell>
                  <Badge variant={statusTone(order.status)}>
                    {order.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
            {pagedOrders.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className='py-6 text-center text-[10px] text-[color:var(--cc-muted-foreground)]'
                >
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
              onClick={() => setPage((previous) => Math.max(0, previous - 1))}
            >
              <Icon name='chevron-right' className='size-3.5' />
            </Button>
            {Array.from({ length: pageCount }).map((_, index) => (
              <Button
                key={index}
                size='sm'
                variant={index === safePage ? "solid" : "outline"}
                onClick={() => setPage(index)}
                aria-label={`صفحهٔ ${formatNumber(index + 1)}`}
                aria-current={index === safePage ? "page" : undefined}
                className={cn("min-w-7 px-0 text-[10px]", monoType)}
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
  );
}

