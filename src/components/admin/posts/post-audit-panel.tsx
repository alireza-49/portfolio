"use client";

import { CheckCircle2, TriangleAlert } from "lucide-react";
import { Panel, PanelHeading } from "@/components/admin/ui";
import type { PostIssue } from "@/lib/types";

export function PostAuditPanel({ issues }: { issues: PostIssue[] }) {
  return (
    <Panel>
      <PanelHeading
        eyebrow='05 / CHECK'
        title='بررسی پیش از انتشار'
        description='نکته‌های دسترس‌پذیری و ساختار متن؛ بازدارنده نیستند.'
      />
      <div className='p-3.5'>
        {issues.length === 0 ? (
          <p className='flex items-center gap-1.5 text-[10px] font-bold text-teal-craft'>
            <CheckCircle2 className='size-3.5' />
            موردی برای یادآوری نیست.
          </p>
        ) : (
          <ul className='flex flex-col gap-1.5'>
            {issues.map((issue) => (
              <li key={issue.id} className='flex items-start gap-1.5 text-[10px] leading-relaxed font-medium text-indigo-ink'>
                <TriangleAlert className={issue.severity === "warning" ? "size-3.5 shrink-0 text-coral" : "size-3.5 shrink-0 text-mustard-deep"} />
                <span>{issue.message}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Panel>
  );
}
