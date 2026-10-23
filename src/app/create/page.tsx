import type { Metadata } from "next";
import "@/components/create-scenarios/scenes.css";
import "./fonts.css";
import { CreateStudio } from "@/components/create-studio";
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
      <main
        className='flex h-dvh w-full flex-col overflow-hidden bg-paper pt-15'
        dir='rtl'
      >
        <CreateStudio />
      </main>
    </>
  );
}
