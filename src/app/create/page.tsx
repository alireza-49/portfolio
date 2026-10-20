import type { Metadata } from "next";
import { CreateStudio } from "@/components/create-studio";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "کارگاه ساخت تم | استودیو کدولوژی",
  description:
    "تم ریسوگراف خودت را بساز: پالت رنگ، شعاع گوشه و تراکم را انتخاب کن، پیش‌نمایش زنده را ببین و خروجی CSS و Tailwind را کپی کن.",
  keywords: ["تم ریسوگراف", "دیزاین سیستم", "Tailwind", "پالت رنگ", "کدولوژی"],
};

export default function CreatePage() {
  return (
    <>
      <SiteHeader />
      <main className="flex w-full flex-1 flex-col bg-paper pt-20" dir="rtl">
        <CreateStudio />
      </main>
      <SiteFooter />
    </>
  );
}
