"use client";

import { PublicError } from "@/components/public-error";

export default function TrackError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <PublicError
      title='تابلوی رهگیری موقتاً در دسترس نیست'
      description='اتصال پایگاه دادهٔ رهگیری برقرار نشد. چند لحظه بعد دوباره تلاش کنید یا برای دریافت وضعیت پروژه با کارگاه تماس بگیرید.'
      reset={reset}
    />
  );
}
