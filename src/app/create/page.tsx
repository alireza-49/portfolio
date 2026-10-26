import type { Metadata } from "next";
import "driver.js/dist/driver.css";
import "@/components/create-scenarios/scenes.css";
import "./fonts.css";
import "./tour.css";
import { CreateStudio } from "@/components/create-studio";

export const metadata: Metadata = {
  title: "کارگاه ساخت تم | وب دیزاین فیل",
  description:
    "تم ریسوگراف خودت را بساز: پالت رنگ، شعاع گوشه و تراکم را انتخاب کن، پیش‌نمایش زنده را ببین و خروجی CSS و Tailwind را کپی کن.",
  keywords: ["تم ریسوگراف", "دیزاین سیستم", "Tailwind", "پالت رنگ", "فیل"],
};

export default function CreatePage() {
  return (
    <main className='flex h-dvh w-full flex-col overflow-hidden bg-paper' dir='rtl'>
      <CreateStudio />
    </main>
  );
}
