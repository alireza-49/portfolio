"use client";

import { useEffect, useState } from "react";

/** Coral reading rule pinned under the fixed site header. */
export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const documentElement = document.documentElement;
      const max = documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div
      aria-hidden
      className='pointer-events-none fixed inset-x-0 top-15 z-40 h-1 bg-transparent'
    >
      <div
        className='h-full bg-coral transition-[width] duration-150'
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
