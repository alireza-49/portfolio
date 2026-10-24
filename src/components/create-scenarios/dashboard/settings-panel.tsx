"use client";

import { useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Icon,
  RadioGroup,
  RadioGroupField,
  Select,
  Separator,
  Switch,
  monoType,
} from "@/components/create-components";
import { cn } from "@/lib/utils";
import { RANGES, type RangeId } from "../data/dashboard";

const CHANNELS = [
  { value: "email", label: "ایمیل", description: "خلاصهٔ روزانه به صندوق تیم" },
  { value: "slack", label: "اسلک", description: "پیام فوری در کانال #alerts" },
  { value: "sms", label: "پیامک", description: "فقط برای رویدادهای بحرانی" },
];

/**
 * Real controls instead of a decorative panel: the live toggle and the default
 * range are the same state the app header drives, so flipping them here changes
 * the charts, and «ذخیره» confirms with an alert that can be dismissed.
 */
export function SettingsPanel({
  live,
  onLiveChange,
  range,
  onRangeChange,
}: {
  live: boolean;
  onLiveChange: (value: boolean) => void;
  range: RangeId;
  onRangeChange: (value: RangeId) => void;
}) {
  const [channel, setChannel] = useState("email");
  const [digest, setDigest] = useState(true);
  const [saved, setSaved] = useState(false);
  const activeChannel = CHANNELS.find((item) => item.value === channel);

  return (
    <div className='grid gap-3 @2xl:grid-cols-2'>
      <Card>
        <CardHeader>
          <CardTitle className='text-sm'>تنظیمات میز کار</CardTitle>
          <CardDescription>
            هر تغییر همین حالا روی پیش‌نمایش اثر می‌گذارد.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='flex items-center justify-between gap-4'>
            <div className='flex flex-col gap-0.5'>
              <span className='text-[10px] font-bold text-[color:var(--cc-surface-foreground)]'>
                به‌روزرسانی زنده
              </span>
              <span className='text-[9px] text-[color:var(--cc-muted-foreground)]'>
                شاخص‌ها هر ۸ ثانیه بازخوانی می‌شوند
              </span>
            </div>
            <Switch
              checked={live}
              onCheckedChange={onLiveChange}
              aria-label='به‌روزرسانی زنده'
            />
          </div>

          <Separator />

          <div className='flex flex-col gap-1.5'>
            <label
              htmlFor='dash-default-range'
              className='text-[10px] font-bold text-[color:var(--cc-surface-foreground)]'
            >
              بازهٔ پیش‌فرض گزارش‌ها
            </label>
            <Select
              id='dash-default-range'
              value={range}
              onValueChange={(value) => onRangeChange(value as RangeId)}
              options={RANGES.map((item) => ({
                value: item.id,
                label: item.label,
              }))}
              size='sm'
            />
            <span className='text-[9px] text-[color:var(--cc-muted-foreground)]'>
              همین بازه در نوار بالا هم انتخاب شده است.
            </span>
          </div>

          <Separator />

          <div className='flex items-center justify-between gap-4'>
            <div className='flex flex-col gap-0.5'>
              <span className='text-[10px] font-bold text-[color:var(--cc-surface-foreground)]'>
                خلاصهٔ هفتگی
              </span>
              <span className='text-[9px] text-[color:var(--cc-muted-foreground)]'>
                یک ایمیل دوشنبه‌ها با نمودارهای هفته
              </span>
            </div>
            <Switch
              checked={digest}
              onCheckedChange={setDigest}
              aria-label='خلاصهٔ هفتگی'
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className='flex flex-wrap items-center justify-between gap-2'>
            <CardTitle className='text-sm'>مسیر هشدارها</CardTitle>
            <Badge variant='outline' className={cn("text-[9px]", monoType)}>
              {activeChannel?.label ?? channel}
            </Badge>
          </div>
          <CardDescription>
            رویدادهای نیازمند بررسی به این کانال فرستاده می‌شوند.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={channel} onValueChange={setChannel}>
            {CHANNELS.map((item) => (
              <RadioGroupField
                key={item.value}
                value={item.value}
                label={item.label}
                description={item.description}
              />
            ))}
          </RadioGroup>

          <Separator />

          <div className='flex flex-wrap items-center justify-between gap-2'>
            <span className='text-[9px] text-[color:var(--cc-muted-foreground)]'>
              تغییرات فقط برای اعضای تیم اعمال می‌شود.
            </span>
            <Button size='sm' onClick={() => setSaved(true)}>
              <Icon name='check' className='size-3.5' />
              ذخیرهٔ تنظیمات
            </Button>
          </div>

          {saved ? (
            <Alert
              variant='success'
              title='تنظیمات ذخیره شد'
              icon={<Icon name='check-circle' className='size-4' />}
            >
              <span className='flex flex-wrap items-center justify-between gap-2'>
                مسیر هشدارها روی «{activeChannel?.label}» تنظیم شد.
                <Button
                  size='sm'
                  variant='ghost'
                  onClick={() => setSaved(false)}
                >
                  بستن
                </Button>
              </span>
            </Alert>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
