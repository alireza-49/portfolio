import { cn } from "@/lib/utils";

/** Four-point sparkle used across both illustration sets. */
export const SPARKLE_PATH =
  "M12 0C12.6 6.4 17.6 11.4 24 12C17.6 12.6 12.6 17.6 12 24C11.4 17.6 6.4 12.6 0 12C6.4 11.4 11.4 6.4 12 0Z";

export function Sparkle({
  className,
  transform,
}: {
  className?: string;
  transform?: string;
}) {
  return (
    <path
      d={SPARKLE_PATH}
      transform={transform}
      className={cn("origin-center", className)}
    />
  );
}

/** Dotted background pattern; ids must be unique per SVG. */
export function DotPattern({
  id,
  size = 18,
  color = "var(--cc-border)",
}: {
  id: string;
  size?: number;
  color?: string;
}) {
  return (
    <pattern
      id={id}
      width={size}
      height={size}
      patternUnits='userSpaceOnUse'
    >
      <circle cx={1.2} cy={1.2} r={1.2} style={{ fill: color }} opacity={0.55} />
    </pattern>
  );
}

/** Fine technical grid, used behind the classroom and atelier scenes. */
export function GridPattern({
  id,
  size = 24,
  color = "var(--cc-border)",
}: {
  id: string;
  size?: number;
  color?: string;
}) {
  return (
    <pattern id={id} width={size} height={size} patternUnits='userSpaceOnUse'>
      <path
        d={`M ${size} 0 L 0 0 0 ${size}`}
        fill='none'
        style={{ stroke: color }}
        strokeWidth={0.6}
        opacity={0.5}
      />
    </pattern>
  );
}

export function StarRating({
  value,
  count,
  className,
}: {
  value: number;
  count?: number;
  className?: string;
}) {
  const filled = Math.round(value);
  return (
    <span
      className={cn("inline-flex items-center gap-1", className)}
      aria-label={`${value} از ۵`}
    >
      <span className='inline-flex items-center gap-0.5' aria-hidden='true'>
        {Array.from({ length: 5 }).map((_, index) => (
          <svg key={index} viewBox='0 0 20 20' className='size-3'>
            <path
              d='M10 1.6l2.5 5.1 5.6.8-4 3.9.9 5.6-5-2.6-5 2.6.9-5.6-4-3.9 5.6-.8z'
              className={
                index < filled
                  ? "fill-[var(--cc-warning)]"
                  : "fill-[var(--cc-border)]"
              }
            />
          </svg>
        ))}
      </span>
      {typeof count === "number" ? (
        <span className='text-[0.625rem] text-[color:var(--cc-muted-foreground)]'>
          {count}
        </span>
      ) : null}
    </span>
  );
}

/** Small three-diamond rule used under section eyebrows. */
export function Ornament({ className }: { className?: string }) {
  return (
    <span
      aria-hidden='true'
      className={cn("inline-flex items-center gap-1", className)}
    >
      <span className='h-px w-5 bg-[var(--cc-border)]' />
      <svg viewBox='0 0 12 12' className='size-2 fill-[var(--cc-primary)]'>
        <path d='M6 0 12 6 6 12 0 6Z' />
      </svg>
      <svg viewBox='0 0 12 12' className='size-1.5 fill-[var(--cc-accent)]'>
        <path d='M6 0 12 6 6 12 0 6Z' />
      </svg>
      <span className='h-px w-5 bg-[var(--cc-border)]' />
    </span>
  );
}
