import type { Metadata } from "next";
import { listSubmissions } from "@/lib/content";
import { InquiryInbox } from "@/components/admin/inbox/inquiry-inbox";
import { requireConsolePage } from "@/lib/auth";

export const metadata: Metadata = { title: "درخواست‌های سفارش" };
export const instant = false;

export default async function InboxPage({
  searchParams,
}: {
  searchParams: Promise<{ open?: string | string[] }>;
}) {
  await requireConsolePage();
  const params = await searchParams;
  const submissions = await listSubmissions();
  const open = Array.isArray(params.open) ? params.open[0] : params.open;

  return (
    <InquiryInbox
      submissions={submissions}
      initialOpenId={open ?? null}
    />
  );
}
