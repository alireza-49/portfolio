import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { BTN_SECONDARY } from "@/components/admin/ui";

export default function ConsoleNotFound() {
  return (
    <div className='mx-auto flex w-full max-w-xl flex-col items-center gap-3 rounded-md border-[2px] border-indigo-ink bg-paper-light p-8 text-center shadow-craft'>
      <FileQuestion className='size-8 text-coral' />
      <h1 className='text-lg font-black text-indigo-ink'>
        این مورد در کنسول پیدا نشد
      </h1>
      <p className='max-w-md text-xs leading-relaxed font-medium text-indigo-light'>
        ممکن است حذف شده باشد یا نشانی وارد‌شده اشتباه باشد. از فهرست پروژه‌ها یا
        یادداشت‌ها دوباره انتخاب کنید.
      </p>
      <div className='flex flex-wrap justify-center gap-2 pt-1'>
        <Link href='/admin/projects' className={BTN_SECONDARY}>
          مدیریت پروژه‌ها
        </Link>
        <Link href='/admin/posts' className={BTN_SECONDARY}>
          یادداشت‌ها
        </Link>
      </div>
    </div>
  );
}
