"use client";

import { useState } from "react";
import { Check, Link2, Send } from "lucide-react";

export function ShareRow({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  const share = (network: "telegram" | "x") => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(title);
    const target =
      network === "telegram"
        ? `https://t.me/share/url?url=${url}&text=${text}`
        : `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
    window.open(target, "_blank", "noopener,noreferrer");
  };

  const button =
    "inline-flex items-center gap-1.5 rounded-sm border-[1.5px] border-indigo-ink bg-paper px-2.5 py-1.5 text-[11px] font-black text-indigo-ink transition-colors hover:bg-mustard/30";

  return (
    <div className='flex flex-wrap items-center gap-1.5'>
      <button type='button' onClick={copy} className={button}>
        {copied ? <Check className='size-3.5' /> : <Link2 className='size-3.5' />}
        {copied ? "لینک کپی شد" : "کپی لینک"}
      </button>
      <button type='button' onClick={() => share("telegram")} className={button}>
        <Send className='size-3.5' />
        تلگرام
      </button>
      <button type='button' onClick={() => share("x")} className={button}>
        <span className='font-mono text-[11px]'>𝕏</span>
        اشتراک در X
      </button>
    </div>
  );
}
