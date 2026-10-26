"use client";

import type { EmbedProvider } from "@/lib/richtext";

export function EmbedFrame({ provider, src }: { provider: EmbedProvider; src: string }) {
  return (
    <div className='cc-embed-frame' dir='ltr'>
      <iframe
        src={src}
        title={provider === "youtube" ? "ویدیوی یوتیوب" : "ویدیوی ویمئو"}
        sandbox='allow-scripts allow-same-origin allow-presentation allow-popups'
        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
        allowFullScreen
        referrerPolicy='no-referrer'
        loading='lazy'
      />
    </div>
  );
}
