"use client";

import { Download } from "lucide-react";
import { STYLES, type StyleId } from "@/components/create-studio-config";
import { designDocForStyle } from "@/components/create-studio-design-doc";
import { Panel, PanelHeading } from "@/components/admin/ui";

function downloadDesignDoc(styleId: StyleId) {
  const blob = new Blob([designDocForStyle(styleId)], {
    type: "text/markdown;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `design-${styleId}.md`;
  anchor.click();
  URL.revokeObjectURL(url);
}

/** One click per style: the whole design language as a downloadable `design.md`. */
export function DesignDocsPanel() {
  return (
    <Panel>
      <PanelHeading
        eyebrow='DESIGN LANGUAGE'
        title='راهنمای طراحی سبک‌ها'
        description='برای هر سبک استودیو یک فایل design.md انگلیسی آماده است: رنگ‌های نقش و خنثی، پالت نمودار، شکل و سایه، تایپوگرافی، آیکون‌ها و نقشهٔ کامل توکن‌های --cc-*. این نسخه پیش‌فرض هر سبک است؛ design.md هر درخواست (با سفارشی‌سازی‌های همان کاربر) از جزئیات درخواست در /admin/inbox دانلود می‌شود.'
      />
      <div className='grid grid-cols-1 gap-2 p-4 sm:grid-cols-2 xl:grid-cols-3'>
        {STYLES.map((style) => (
          <button
            key={style.id}
            type='button'
            onClick={() => downloadDesignDoc(style.id)}
            className='flex items-center justify-between gap-2 rounded-sm border-[2px] border-indigo-ink/25 bg-paper px-3 py-2 text-start transition-colors hover:bg-mustard/25'
          >
            <span className='flex min-w-0 flex-col gap-0.5'>
              <span className='truncate text-[12px] font-black text-indigo-ink'>
                {style.label}
              </span>
              <span
                dir='ltr'
                className='font-mono text-[9px] font-bold tracking-widest text-indigo-light uppercase'
              >
                {style.id}
              </span>
            </span>
            <Download className='size-3.5 shrink-0 text-coral' />
          </button>
        ))}
      </div>
    </Panel>
  );
}
