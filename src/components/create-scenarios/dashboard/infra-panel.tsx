"use client";

import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Progress,
  Separator,
  Timeline,
  TimelineItem,
  monoType,
} from "@/components/create-components";
import { cn } from "@/lib/utils";
import { ACTIVITY, NODES, SYSTEM_HEALTH } from "../data/dashboard";
import { formatNumber, formatPercent } from "../format";

/**
 * Operations half of the dashboard: service health, node load and the team
 * timeline. Every figure prints through `formatNumber`/`formatPercent`, and
 * the "stable" counter is derived from the health list itself.
 */
export function InfraPanel() {
  const stable = SYSTEM_HEALTH.filter((service) => service.status === "پایدار");
  const averageLatency = Math.round(
    SYSTEM_HEALTH.reduce((sum, service) => sum + service.latency, 0) /
      SYSTEM_HEALTH.length,
  );

  return (
    <div className='grid gap-3 @2xl:grid-cols-2'>
      <Card className='gap-2.5'>
        <CardHeader>
          <div className='flex flex-wrap items-center justify-between gap-2'>
            <CardTitle className='text-sm'>سلامت سیستم</CardTitle>
            <Badge variant={stable.length === SYSTEM_HEALTH.length ? "success" : "warning"}>
              {formatNumber(stable.length)} از {formatNumber(SYSTEM_HEALTH.length)} پایدار
            </Badge>
          </div>
          <CardDescription>آپ‌تایم و لتنسی سرویس‌ها در ۲۴ ساعت گذشته</CardDescription>
        </CardHeader>
        <CardContent className='gap-2'>
          {SYSTEM_HEALTH.map((service) => (
            <div key={service.name} className='flex flex-col gap-1'>
              <div className='flex items-center justify-between gap-2'>
                <span className='text-[0.625rem] font-bold text-[color:var(--cc-surface-foreground)]'>
                  {service.name}
                </span>
                <Badge
                  variant={service.status === "پایدار" ? "success" : "warning"}
                >
                  {service.status}
                </Badge>
              </div>
              <Progress value={service.uptime} />
              <div
                className={cn(
                  "flex items-center justify-between text-[0.5625rem] text-[color:var(--cc-muted-foreground)]",
                  monoType,
                )}
              >
                <span>{formatNumber(service.uptime)}٪ آپ‌تایم</span>
                <span dir='ltr'>{formatNumber(service.latency)}ms</span>
              </div>
            </div>
          ))}

          <Separator label='نودها' />

          <div className='grid grid-cols-2 gap-1.5'>
            {NODES.map((node) => (
              <div
                key={node.name}
                className='flex flex-col gap-1 rounded-[var(--cc-radius-sm)] border-[length:var(--cc-border-width)] border-[color:var(--cc-border)] p-1.5'
              >
                <span
                  className={cn(
                    "flex items-center justify-between gap-1 text-[0.5625rem] text-[color:var(--cc-muted-foreground)]",
                    monoType,
                  )}
                >
                  {node.name}
                  <Badge variant='outline'>{node.region}</Badge>
                </span>
                <Progress value={node.load} />
                <span
                  className={cn(
                    "text-[0.5625rem] text-[color:var(--cc-surface-foreground)]",
                    monoType,
                  )}
                >
                  {formatPercent(node.load)} مصرف
                </span>
              </div>
            ))}
          </div>
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
          <Separator />
          <div className='grid grid-cols-2 gap-1.5'>
            <div className='flex flex-col gap-0.5 rounded-[var(--cc-radius-sm)] bg-[var(--cc-muted)] p-2'>
              <span className='text-[0.5625rem] text-[color:var(--cc-muted-foreground)]'>
                میانگین زمان پاسخ
              </span>
              <span className={cn("text-sm font-black", monoType)}>
                {formatNumber(averageLatency)}
                <span dir='ltr'>ms</span>
              </span>
            </div>
            <div className='flex flex-col gap-0.5 rounded-[var(--cc-radius-sm)] bg-[var(--cc-muted)] p-2'>
              <span className='text-[0.5625rem] text-[color:var(--cc-muted-foreground)]'>
                رویدادهای ثبت‌شده
              </span>
              <span className={cn("text-sm font-black", monoType)}>
                {formatNumber(ACTIVITY.length)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
