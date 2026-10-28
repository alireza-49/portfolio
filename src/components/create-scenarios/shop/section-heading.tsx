import type { ReactNode } from "react";
import { headingType, labelType } from "@/components/create-components";
import { cn } from "@/lib/utils";

/**
 * One heading scale for every storefront section: an eyebrow, a display line,
 * an optional description and a trailing slot (badge, link, ornament). The
 * shop and the landing share the same rhythm without sharing a component.
 */
export function SectionHeading({
  id,
  eyebrow,
  title,
  description,
  trailing,
}: {
  id: string;
  eyebrow: string;
  title: string;
  description?: string;
  trailing?: ReactNode;
}) {
  return (
    <div className='flex flex-wrap items-end justify-between gap-3'>
      <div className='flex flex-col gap-1.5'>
        <span
          className={cn(
            "text-[0.6875rem] font-bold text-[color:var(--cc-primary)]",
            labelType,
          )}
        >
          {eyebrow}
        </span>
        <h3
          id={id}
          className={cn(
            "text-xl leading-tight text-[color:var(--cc-surface-foreground)] @2xl:text-2xl",
            headingType,
          )}
        >
          {title}
        </h3>
        {description ? (
          <p className='max-w-xl text-[length:calc(var(--cc-font-size)*0.88)] text-[color:var(--cc-muted-foreground)]'>
            {description}
          </p>
        ) : null}
      </div>
      {trailing}
    </div>
  );
}
