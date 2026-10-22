import { cn } from "@/lib/utils";

export type AvatarProps = {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const SIZES: Record<NonNullable<AvatarProps["size"]>, string> = {
  sm: "size-8 text-[length:calc(var(--cc-font-size)*0.7)]",
  md: "size-10 text-[length:calc(var(--cc-font-size)*0.85)]",
  lg: "size-14 text-[length:calc(var(--cc-font-size)*1.1)]",
};

export function Avatar({
  src,
  alt = "",
  fallback,
  size = "md",
  className,
}: AvatarProps) {
  const initials =
    fallback ??
    alt
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("");

  return (
    <span
      data-cc-avatar=""
      className={cn(
        "inline-flex shrink-0 items-center justify-center overflow-hidden",
        "rounded-full",
        "border-[length:var(--cc-border-width)] border-[color:var(--cc-border)]",
        "bg-[var(--cc-muted)] font-semibold text-[color:var(--cc-muted-foreground)]",
        SIZES[size],
        className,
      )}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          className="size-full object-cover"
          loading="lazy"
        />
      ) : (
        <span aria-hidden={!alt}>{initials || "?"}</span>
      )}
    </span>
  );
}
