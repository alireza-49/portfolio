"use client";

import Image from "next/image";
import type { ComponentProps } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * The studio mascot as the illustrated brand mark. The printed, paper-toned
 * emblem rests in the header and footer; hovering or keyboard-focusing the
 * button cross-fades it to the inked colour version (the same artwork the site
 * uses as its icon — `src/app/icon.png`).
 *
 * Both bitmaps are the optimized exports in `public/brand`, so the two layers
 * stay identical in size and only opacity moves.
 */
type BrandMarkProps = {
  className?: string;
  imageClassName?: string;
  priority?: boolean;
};

function markClassName(imageClassName?: string) {
  return cn(
    "size-full object-cover transition-opacity duration-300 ease-out motion-reduce:transition-none",
    imageClassName,
  );
}

export const BrandMark = ({
  className,
  imageClassName,
  priority = false,
}: BrandMarkProps) => (
  <span className={cn("relative block", className)}>
    <Image
      src='/brand/logo-normal.png'
      alt=''
      width={256}
      height={256}
      priority={priority}
      className={cn(markClassName(imageClassName), "group-hover/brand:opacity-0 group-focus-within/brand:opacity-0")}
    />
    <Image
      src='/brand/logo-color.png'
      alt=''
      aria-hidden='true'
      width={256}
      height={256}
      priority={priority}
      className={cn(
        markClassName(imageClassName),
        "absolute inset-0 opacity-0 group-hover/brand:opacity-100 group-focus-within/brand:opacity-100",
      )}
    />
  </span>
);

type BrandMarkButtonProps = ComponentProps<typeof Button> & {
  markClassName?: string;
  priority?: boolean;
};

/**
 * Same hit area and animation as `LogoButton`, only the artwork changes: the
 * mark is a raster emblem now, so the trunk sway (`logo-live`) does not apply.
 */
export const BrandMarkButton = ({
  className,
  markClassName,
  priority = false,
  variant = "ghost",
  size = "default",
  ...props
}: BrandMarkButtonProps) => (
  <span className='group/brand relative inline-flex'>
    <Button
      size={size}
      variant={variant}
      className={cn(
        "h-auto w-auto rounded-[1.75rem] p-0",
        "hover:bg-transparent aria-expanded:bg-transparent",
        "before:z-10",
        "duration-300 ease-out hover:scale-105 motion-reduce:hover:scale-100",
        className,
      )}
      {...props}
    >
      <BrandMark
        className='size-full'
        imageClassName={markClassName}
        priority={priority}
      />
    </Button>
  </span>
);
