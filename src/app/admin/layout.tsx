import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: {
    default: "کنسول مدیریت | استودیو کدولوژی",
    template: "%s | کنسول کدولوژی",
  },
  description: "کنسول خصوصی مدیریت پروژه‌ها، درخواست‌ها و یادداشت‌های استودیو.",
  robots: { index: false, follow: false },
};

/**
 * The console is a private area: no site header/footer, no indexing, and the
 * authenticated shell lives in the `(console)` group so the login card stays
 * outside it.
 */
export default function AdminRootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
