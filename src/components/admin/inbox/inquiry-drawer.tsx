"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  SUBMISSION_STATUS_META,
  type Submission,
  type SubmissionStatus,
} from "@/lib/types";
import { InquiryDetail } from "./inquiry-detail";

export function InquiryDrawer({
  submission,
  pending,
  onClose,
  onStatusChange,
  onDelete,
}: {
  submission: Submission | null;
  pending: boolean;
  onClose: () => void;
  onStatusChange: (status: SubmissionStatus) => void;
  onDelete: () => void;
}) {
  const meta = submission ? SUBMISSION_STATUS_META[submission.status] : null;

  return (
    <Sheet
      open={Boolean(submission)}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <SheetContent
        side='left'
        className='w-full gap-0 border-indigo-ink bg-paper-light p-0 sm:max-w-lg'
      >
        <SheetHeader className='border-b-[2px] border-indigo-ink bg-paper-dim px-4 py-3 sm:px-5'>
          <SheetTitle className='text-right text-sm font-black text-indigo-ink'>
            جزئیات درخواست
          </SheetTitle>
          <SheetDescription className='text-right text-[0.6875rem] font-medium text-indigo-light'>
            {meta ? meta.label : "درخواست انتخاب نشده"}
          </SheetDescription>
        </SheetHeader>
        {submission ? (
          <InquiryDetail
            key={submission.id}
            submission={submission}
            pending={pending}
            onStatusChange={onStatusChange}
            onDelete={onDelete}
          />
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
