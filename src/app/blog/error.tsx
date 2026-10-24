"use client";

import { PublicError } from "@/components/public-error";

export default function BlogError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <PublicError
      title='آرشیو یادداشت‌ها موقتاً در دسترس نیست'
      description='اتصال پایگاه دادهٔ روزنامه برقرار نشد. چند لحظه بعد دوباره تلاش کنید؛ اگر خطا ادامه داشت با کارگاه تماس بگیرید.'
      reset={reset}
    />
  );
}
