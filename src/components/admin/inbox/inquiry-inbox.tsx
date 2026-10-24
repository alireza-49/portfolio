"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Download } from "lucide-react";
import {
  BTN_SECONDARY,
  MetricCard,
  PageHeader,
  Panel,
} from "@/components/admin/ui";
import { faNumber } from "@/lib/fa";
import {
  SUBMISSION_STATUSES,
  type Submission,
  type SubmissionStatus,
} from "@/lib/types";
import {
  bulkSetSubmissionStatusAction,
  deleteSubmissionAction,
  setSubmissionStatusAction,
} from "@/app/admin/(console)/inbox/actions";
import { InquiryTable } from "./inquiry-table";
import { InquiryDrawer } from "./inquiry-drawer";
import { exportSubmissionsCsv } from "./inquiry-csv";
import { InquiryToolbar, type InboxFilter } from "./inquiry-toolbar";

export function InquiryInbox({
  submissions,
  initialOpenId,
}: {
  submissions: Submission[];
  initialOpenId: string | null;
}) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<InboxFilter>("all");
  const [selected, setSelected] = useState<string[]>([]);
  const [openId, setOpenId] = useState<string | null>(initialOpenId);
  const [bulkStatus, setBulkStatus] = useState<SubmissionStatus>("reviewing");
  const [notice, setNotice] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const counts = useMemo(() => {
    const base = Object.fromEntries(
      SUBMISSION_STATUSES.map((status) => [status, 0]),
    ) as Record<SubmissionStatus, number>;
    for (const submission of submissions) base[submission.status] += 1;
    return base;
  }, [submissions]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return submissions.filter((submission) => {
      if (filter !== "all" && submission.status !== filter) return false;
      if (!needle) return true;
      return [
        submission.name,
        submission.business,
        submission.contact,
        submission.projectType,
        submission.budget,
        submission.message,
      ].some((value) => value.toLowerCase().includes(needle));
    });
  }, [submissions, filter, query]);

  const open = submissions.find((item) => item.id === openId) ?? null;

  const notify = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(null), 4500);
  };

  const changeStatus = (id: string, status: SubmissionStatus) => {
    startTransition(async () => {
      const result = await setSubmissionStatusAction(id, status);
      notify(result.message);
      if (result.ok) router.refresh();
    });
  };

  const remove = (id: string) => {
    startTransition(async () => {
      const result = await deleteSubmissionAction(id);
      if (result.ok) {
        setOpenId(null);
        setSelected((current) => current.filter((item) => item !== id));
      }
      notify(result.message);
      if (result.ok) router.refresh();
    });
  };

  const applyBulk = () => {
    if (selected.length === 0) return;
    startTransition(async () => {
      const result = await bulkSetSubmissionStatusAction(selected, bulkStatus);
      notify(result.message);
      if (result.ok) setSelected([]);
      if (result.ok) router.refresh();
    });
  };

  const toggle = (id: string) => {
    setSelected((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  };

  const toggleAll = () => {
    const ids = filtered.map((item) => item.id);
    setSelected((current) =>
      ids.every((id) => current.includes(id)) ? [] : ids,
    );
  };

  const exportRows =
    selected.length > 0
      ? submissions.filter((item) => selected.includes(item.id))
      : filtered;

  return (
    <div className='flex flex-col gap-5'>
      <PageHeader
        eyebrow='CODOLOGY STUDIO // INBOUND OPS'
        title='صندوق استعلام و پیام‌های سفارش'
        description='هر پیامی که از فرم تماس سایت ثبت شود، همراه با برآورد هزینه و پیکربندی استودیو، همین‌جا نگه‌داری می‌شود.'
        actions={
          <button
            type='button'
            onClick={() => exportSubmissionsCsv(exportRows)}
            disabled={exportRows.length === 0}
            className={BTN_SECONDARY}
          >
            <Download className='size-3.5' />
            <span>
              خروجی CSV
              {selected.length > 0
                ? ` (${faNumber(selected.length)} انتخاب)`
                : ""}
            </span>
          </button>
        }
      />

      <div className='grid grid-cols-2 gap-3 xl:grid-cols-4'>
        <MetricCard
          label='جدید و بررسی‌نشده'
          value={faNumber(counts.new)}
          tone='coral'
          hint='نیازمند پاسخ اولیه'
        />
        <MetricCard
          label='در حال بررسی'
          value={faNumber(counts.reviewing)}
          tone='mustard'
          hint='در حال برآورد فنی'
        />
        <MetricCard
          label='جلسه هماهنگ‌شده'
          value={faNumber(counts.meeting)}
          tone='ink'
          hint='در تقویم کارگاه'
        />
        <MetricCard
          label='بسته‌شده'
          value={faNumber(counts.closed)}
          tone='teal'
          hint='پایان‌یافته یا منصرف'
        />
      </div>

      <Panel className='overflow-hidden'>
        <InquiryToolbar
          total={submissions.length}
          filteredCount={filtered.length}
          counts={counts}
          query={query}
          onQuery={setQuery}
          filter={filter}
          onFilter={setFilter}
          selectedCount={selected.length}
          bulkStatus={bulkStatus}
          onBulkStatus={setBulkStatus}
          onApplyBulk={applyBulk}
          onClearSelection={() => setSelected([])}
          pending={pending}
          notice={notice}
        />
        <InquiryTable
          rows={filtered}
          selected={selected}
          onToggle={toggle}
          onToggleAll={toggleAll}
          onOpen={(id) => setOpenId(id)}
        />
      </Panel>

      <InquiryDrawer
        submission={open}
        pending={pending}
        onClose={() => setOpenId(null)}
        onStatusChange={(status) => {
          if (open) changeStatus(open.id, status);
        }}
        onDelete={() => {
          if (open) remove(open.id);
        }}
      />
    </div>
  );
}
