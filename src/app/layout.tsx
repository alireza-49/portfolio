import type { Metadata } from "next";
import { Epilogue, Newsreader, Space_Grotesk, Vazirmatn } from "next/font/google";
import { CustomCursor } from "@/components/custom-cursor";
import "./globals.css";

const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["arabic", "latin"],
  display: "swap",
});

const epilogue = Epilogue({
  variable: "--font-epilogue",
  subsets: ["latin"],
  display: "swap",
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "استودیو کدولوژی | طراحی و توسعه وب دست‌ساز و پایدار",
  description:
    "استودیو مستقل طراحی و توسعه فرانت‌اند؛ وب‌سایت‌های دست‌ساز، سبک و اصیل با الهام از چاپ ریسوگراف برای کسب‌وکارهای مستقل و خلاق.",
  keywords: [
    "طراحی وب",
    "توسعه فرانت‌اند",
    "ریسوگراف",
    "Next.js",
    "پورتفولیو",
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={`${vazirmatn.variable} ${epilogue.variable} ${newsreader.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper font-sans text-indigo-ink">
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
