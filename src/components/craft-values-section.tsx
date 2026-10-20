import { ScrollText } from "lucide-react";

export function CraftValuesSection() {
  return (
    <section
      id="craft-values"
      className="w-full border-b-[2.5px] border-indigo-ink bg-paper px-4 py-20 sm:px-8 lg:px-12"
    >
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 rounded-sm border-[2px] border-indigo-ink bg-paper-dim p-8 shadow-craft-inset md:flex-row">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-sm border-[2px] border-indigo-ink bg-mustard text-indigo-ink shadow-craft-inset">
          <ScrollText className="size-[34px]" />
        </div>
        <div className="flex flex-1 flex-col gap-1 text-right">
          <h4 className="text-lg font-black text-indigo-ink">
            تعهد اخلاقی استودیو چاپ و کد
          </h4>
          <p className="text-sm leading-relaxed text-indigo-light">
            هیچ پروژه‌ای به شخص ثالث یا کارآموز برون‌سپاری نمی‌شود. تمامی خطوط
            کدنویسی، بهینه‌سازی تصاویر و چیدمان‌ها مستقیماً توسط خودم با وسواس
            علمی مهندسی و ذوق دیزاین انجام خواهد شد.
          </p>
        </div>
      </div>
    </section>
  );
}
