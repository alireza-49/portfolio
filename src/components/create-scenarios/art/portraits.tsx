import { cn } from "@/lib/utils";
import { sc as styles } from "../scenes";

/**
 * Abstract geometric portrait used for tutors and shop reviewers.
 * Deliberately token-based so it never looks out of place in a preset.
 */
export function Portrait({
  variant = 0,
  className,
}: {
  variant?: number;
  className?: string;
}) {
  const backdrop = [
    styles.brandSoft,
    styles.accentSoft,
    styles.brandFaint,
    styles.accentSoft,
  ][variant % 4];
  const shirt = [styles.brand, styles.ink, styles.accent, styles.success][
    variant % 4
  ];

  return (
    <svg
      viewBox='0 0 120 120'
      className={cn(styles.art, className)}
      aria-hidden='true'
      focusable='false'
    >
      <rect width='120' height='120' className={styles.muted} />
      <path d='M14 120V74a46 46 0 0 1 92 0v46' className={backdrop} />
      <path
        d='M26 122c1-19 16-31 34-31s33 12 34 31'
        className={shirt}
      />
      <path d='M52 74h16l-8 12z' className={styles.surface} />
      <circle cx='60' cy='52' r='23' className={styles.surface} />

      {variant % 4 === 0 ? (
        <path
          d='M35 52a25 25 0 0 1 50 0v16h-7V54a18 18 0 0 0-36 0v14h-7z'
          className={styles.ink}
        />
      ) : null}
      {variant % 4 === 1 ? (
        <path
          d='M39 50a21 21 0 0 1 42 0v5h-5v-2a16 16 0 0 0-32 0v2h-5z'
          className={styles.ink}
        />
      ) : null}
      {variant % 4 === 2 ? (
        <>
          <circle cx='60' cy='22' r='8' className={styles.ink} />
          <path
            d='M37 50a23 23 0 0 1 46 0v4h-5a18 18 0 0 0-36 0h-5z'
            className={styles.ink}
          />
        </>
      ) : null}
      {variant % 4 === 3 ? (
        <path
          d='M36 54c0-16 10-26 24-26s24 10 24 26c0-8-10-12-24-12s-24 4-24 12z'
          className={styles.ink}
        />
      ) : null}

      <g className={styles.blink}>
        <circle cx='52' cy='52' r='2' className={styles.ink} />
        <circle cx='68' cy='52' r='2' className={styles.ink} />
      </g>
      <path
        d='M54 61q6 5 12 0'
        className={styles.inkLine}
        strokeWidth={1.6}
      />

      {variant % 4 === 1 ? (
        <g className={styles.inkLine} strokeWidth={1.4}>
          <circle cx='52' cy='52' r='7' />
          <circle cx='68' cy='52' r='7' />
          <path d='M59 52h2' />
        </g>
      ) : null}
      {variant % 4 === 2 ? (
        <>
          <circle cx='36' cy='62' r='2.4' className={styles.warning} />
          <circle cx='84' cy='62' r='2.4' className={styles.warning} />
        </>
      ) : null}
      {variant % 4 === 3 ? (
        <path
          d='M44 44q16-10 32 0'
          className={styles.accent}
          strokeWidth={3}
          fill='none'
        />
      ) : null}
    </svg>
  );
}
