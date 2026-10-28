import type { Metadata } from "next";
import { requireConsolePage } from "@/lib/auth";
import { getSmsSettings, listSmsLog } from "@/lib/content";
import {
  buildProjectProgressSms,
  buildProjectStatusSms,
  buildSubmissionSms,
  buildTestSms,
  smsSegments,
} from "@/lib/sms-text";
import { siteOrigin } from "@/lib/site-url";
import { SmsSettingsPanel } from "@/components/admin/settings/sms-settings-panel";

export const metadata: Metadata = { title: "تنظیمات و پیامک" };
export const instant = false;

export default async function SettingsPage() {
  await requireConsolePage();
  const [settings, log, origin] = await Promise.all([
    getSmsSettings(),
    listSmsLog(20),
    siteOrigin(),
  ]);

  const now = new Date().toISOString();
  const previews = [
    {
      id: "submission",
      label: "پیامک درخواست سفارش",
      when: "وقتی بازدیدکننده فرم تماس را با شمارهٔ موبایل بفرستد.",
      body: buildSubmissionSms({
        createdAt: now,
        reference: "REQ-1A2B3C4D",
        link: `${origin}/track?ref=<id>`,
      }),
    },
    {
      id: "project_status",
      label: "پیامک تغییر وضعیت پروژه",
      when: "وقتی وضعیت پروژه در کنسول واقعاً عوض شود.",
      body: buildProjectStatusSms({
        title: "سایت آرین",
        statusLabel: "بازبینی کارفرما",
        progress: 65,
        link: `${origin}/track/CC-1404-07`,
      }),
    },
    {
      id: "project_progress",
      label: "پیامک پیشرفت (دستی)",
      when: "با دکمهٔ «ارسال پیام پیشرفت» روی صفحهٔ پروژه.",
      body: buildProjectProgressSms({
        title: "سایت آرین",
        progress: 80,
        phase: "تست نهایی",
        link: `${origin}/track/CC-1404-07`,
      }),
    },
    {
      id: "test",
      label: "پیام آزمایشی",
      when: "با دکمهٔ «ارسال پیام آزمایشی» پایین همین صفحه.",
      body: buildTestSms(),
    },
  ].map((item) => ({ ...item, segments: smsSegments(item.body) }));

  return (
    <SmsSettingsPanel settings={settings} log={log} previews={previews} />
  );
}
