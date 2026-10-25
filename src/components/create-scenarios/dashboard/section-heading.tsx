import type { ReactNode } from "react";
import { headingType, labelType } from "@/components/create-components";
import { cn } from "@/lib/utils";
import type { DashboardPageMeta } from "./pages";

/**
 * One heading scale for the dashboard: an eyebrow, a display line, an optional
 * description and a trailing slot (badge, range chip, action). The landing,
 * the storefront and the clinic keep their own copies on purpose — a scenario
 * is a standalone site, not a view inside the studio.
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
            "text-[length:calc(var(--cc-font-size)*0.72)] font-bold text-[color:var(--cc-primary)]",
            labelType,
          )}
        >
          {eyebrow}
        </span>
        <h2
          id={id}
          className={cn(
            "text-lg leading-tight text-[color:var(--cc-surface-foreground)] @2xl:text-xl",
            headingType,
          )}
        >
          {title}
        </h2>
        {description ? (
          <p className='max-w-2xl text-[length:calc(var(--cc-font-size)*0.86)] text-[color:var(--cc-muted-foreground)]'>
            {description}
          </p>
        ) : null}
      </div>
      {trailing}
    </div>
  );
}

/**
 * A dashboard page: one heading + one body. The rail swaps these instead of
 * scrolling between anchors, so there is no id to jump to — only the label the
 * heading owns, which the section points at with `aria-labelledby`.
 */
export function DashboardPage({
  page,
  trailing,
  children,
}: {
  page: DashboardPageMeta;
  trailing?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section
      data-dash-page={page.id}
      aria-labelledby={`dash-${page.id}-title`}
      className='flex flex-col gap-3'
    >
      <SectionHeading
        id={`dash-${page.id}-title`}
        eyebrow={page.eyebrow}
        title={page.label}
        description={page.description}
        trailing={trailing}
      />
      {children}
    </section>
  );
}
