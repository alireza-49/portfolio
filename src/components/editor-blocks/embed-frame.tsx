"use client";

import type { EmbedProvider } from "@/lib/richtext";

const TITLES: Record<EmbedProvider, string> = {
  youtube: "ویدیوی یوتیوب",
  vimeo: "ویدیوی ویمئو",
  aparat: "ویدیوی آپارات",
};

export function EmbedFrame({ provider, src }: { provider: EmbedProvider; src: string }) {
  return (
    <div className='cc-embed-frame' dir='ltr'>
      <iframe
        src={src}
        title={TITLES[provider]}
        sandbox='allow-scripts allow-same-origin allow-presentation allow-popups'
        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
        allowFullScreen
        referrerPolicy='no-referrer'
        loading='lazy'
      />
    </div>
  );
}
