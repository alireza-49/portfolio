"use client";

import { useId, type CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { sc as styles } from "../scenes";
import { DotPattern, GridPattern, Sparkle } from "./shared";

export function ClassroomScene({ className }: { className?: string }) {
  const dots = `classroom-dots-${useId().replace(/:/g, "")}`;
  const grid = `classroom-grid-${useId().replace(/:/g, "")}`;

  return (
    <svg
      viewBox='0 0 560 440'
      className={cn(styles.art, className)}
      aria-hidden='true'
      focusable='false'
    >
      <defs>
        <DotPattern id={dots} size={20} />
        <GridPattern id={grid} size={28} />
      </defs>

      <rect width='560' height='440' className={styles.paper} />
      <rect width='560' height='440' fill={`url(#${dots})`} />
      <circle cx='456' cy='112' r='104' className={styles.brandFaint} />
      <path
        d='M30 420V330a120 120 0 0 1 240 0v90'
        className={styles.accentSoft}
        opacity={0.45}
      />

      <rect
        x='34'
        y='36'
        width='412'
        height='288'
        rx='14'
        className={cn(styles.surface, styles.outlined)}
      />
      <path
        d='M34 74h412'
        className={styles.inkLine}
        strokeWidth={1.4}
        opacity={0.35}
      />
      <circle cx='54' cy='55' r='4' className={styles.danger} />
      <circle cx='68' cy='55' r='4' className={styles.warning} />
      <circle cx='82' cy='55' r='4' className={styles.success} />
      <rect
        x='102'
        y='48'
        width='86'
        height='14'
        rx='7'
        className={styles.muted}
      />

      <rect
        x='50'
        y='90'
        width='92'
        height='216'
        rx='8'
        className={styles.muted}
      />
      <rect
        x='60'
        y='102'
        width='72'
        height='24'
        rx='5'
        className={styles.brandSoft}
      />
      <circle cx='72' cy='114' r='4' className={styles.brand} />
      <path d='M82 112h38M82 118h26' className={styles.hairline} />
      {[136, 166, 196, 226, 256, 286].map((y) => (
        <g key={y}>
          <circle cx='72' cy={y} r='4' className={styles.line} />
          <path
            d={`M84 ${y - 3}h44M84 ${y + 4}h30`}
            className={styles.hairline}
          />
        </g>
      ))}

      <rect
        x='154'
        y='90'
        width='276'
        height='216'
        rx='8'
        className={styles.surface}
      />
      <rect x='154' y='90' width='276' height='216' fill={`url(#${grid})`} />
      <path
        d='M186 118v154M186 272h212'
        className={styles.brandLine}
        strokeWidth={1.6}
        opacity={0.5}
      />
      <path
        d='M196 258c34 4 26-58 60-62s34 44 64 26 18-72 58-74'
        className={cn(styles.brandLine, styles.draw)}
        style={{ "--sc-dash": "360", "--sc-duration": "3.2s" } as CSSProperties}
      />
      <path d='M196 196h206' className={styles.stitch} strokeDasharray='4 8' />
      <path d='M196 258l60-62' className={styles.stitch} strokeDasharray='4 8' />
      <circle cx='256' cy='196' r='4' className={styles.accent} />
      <circle cx='256' cy='196' r='9' className={styles.brandFaint} />

      <rect
        x='360'
        y='198'
        width='78'
        height='108'
        rx='10'
        className={cn(styles.surface, styles.outlined)}
      />
      <circle cx='399' cy='236' r='17' className={styles.muted} />
      <path
        d='M378 290c2-18 12-26 21-26s19 8 21 26'
        className={styles.brandSoft}
      />
      <circle cx='427' cy='210' r='4' className={styles.danger} />
      <g
        className={styles.pulse}
        style={{ "--sc-delay": "0.4s" } as CSSProperties}
      >
        <circle
          cx='427'
          cy='210'
          r='7'
          className={styles.danger}
          opacity={0.25}
        />
      </g>

      <g
        className={styles.float}
        style={{ "--sc-delay": "-1.4s" } as CSSProperties}
      >
        <rect
          x='64'
          y='320'
          width='132'
          height='62'
          rx='10'
          className={cn(styles.surface, styles.outlined)}
        />
        <circle cx='96' cy='351' r='20' className={styles.muted} />
        <g transform='rotate(-90 96 351)'>
          <circle
            cx='96'
            cy='351'
            r='20'
            fill='none'
            strokeWidth={6}
            strokeLinecap='round'
            className={styles.brandLine}
            strokeDasharray='126'
            strokeDashoffset='40'
          />
        </g>
        <path
          d='M122 336h58M122 346h40M122 362h50'
          className={styles.hairline}
        />
      </g>

      <g
        className={styles.float}
        style={{ "--sc-delay": "-0.6s" } as CSSProperties}
      >
        <rect
          x='418'
          y='92'
          width='104'
          height='58'
          rx='12'
          className={cn(styles.surface, styles.outlined)}
        />
        <path
          d='M436 150l-8 14 18-14'
          className={cn(styles.surface, styles.outlined)}
        />
        <path d='M436 112h68M436 124h48' className={styles.hairline} />
        <g className={styles.typing}>
          <circle cx='444' cy='138' r='2.6' className={styles.inkSoft} />
          <circle cx='452' cy='138' r='2.6' className={styles.inkSoft} />
          <circle cx='460' cy='138' r='2.6' className={styles.inkSoft} />
        </g>
      </g>

      <g
        className={styles.floatSlow}
        style={{ "--sc-delay": "-2s" } as CSSProperties}
      >
        <rect
          x='436'
          y='300'
          width='104'
          height='64'
          rx='10'
          className={cn(styles.surface, styles.outlined)}
        />
        <circle cx='456' cy='322' r='8' className={styles.success} />
        <path
          d='M452 322l3 3 6-7'
          className={styles.surface}
          strokeWidth={2}
          fill='none'
        />
        <path d='M470 320h54M470 330h36' className={styles.hairline} />
        <rect
          x='448'
          y='344'
          width='76'
          height='8'
          rx='4'
          className={styles.muted}
        />
        <rect
          x='448'
          y='344'
          width='48'
          height='8'
          rx='4'
          className={styles.brand}
        />
      </g>

      <path d='M70 408h420' className={styles.stitch} />
      <Sparkle
        transform='translate(488 236) scale(0.55)'
        className={styles.accent}
      />
      <Sparkle
        transform='translate(46 292) scale(0.4)'
        className={styles.warning}
      />
    </svg>
  );
}


export type CourseArtVariant = "formula" | "atom" | "globe" | "book";

export function CourseArt({
  variant,
  className,
}: {
  variant: CourseArtVariant;
  className?: string;
}) {
  const patternId = `course-${useId().replace(/:/g, "")}`;

  return (
    <svg
      viewBox='0 0 96 96'
      className={cn(styles.art, className)}
      aria-hidden='true'
      focusable='false'
    >
      <defs>
        <DotPattern id={patternId} size={12} />
      </defs>
      <rect width='96' height='96' rx='10' className={styles.brandFaint} />
      <rect width='96' height='96' rx='10' fill={`url(#${patternId})`} />

      {variant === "formula" ? (
        <>
          <rect
            x='22'
            y='16'
            width='52'
            height='64'
            rx='5'
            className={cn(styles.surface, styles.outlined)}
          />
          <path
            d='M32 32h32M32 42h24M32 60h18'
            className={styles.hairline}
          />
          <path
            d='M32 70h32'
            className={cn(styles.brandLine, styles.draw)}
            style={{ "--sc-dash": "40" } as CSSProperties}
          />
          <path d='M56 52l10 10M66 52l-10 10' className={styles.inkLine} />
        </>
      ) : null}

      {variant === "atom" ? (
        <>
          <g className={styles.orbit} style={{ "--sc-duration": "20s" } as CSSProperties}>
            <ellipse
              cx='48'
              cy='48'
              rx='32'
              ry='13'
              className={styles.brandLine}
              fill='none'
            />
            <ellipse
              cx='48'
              cy='48'
              rx='32'
              ry='13'
              transform='rotate(60 48 48)'
              className={styles.line}
              fill='none'
            />
            <ellipse
              cx='48'
              cy='48'
              rx='32'
              ry='13'
              transform='rotate(120 48 48)'
              className={styles.line}
              fill='none'
            />
          </g>
          <circle cx='48' cy='48' r='7' className={styles.brand} />
          <circle cx='48' cy='48' r='12' className={styles.brandFaint} />
          <circle cx='80' cy='48' r='3' className={styles.accent} />
        </>
      ) : null}

      {variant === "globe" ? (
        <>
          <circle
            cx='48'
            cy='48'
            r='30'
            className={cn(styles.surface, styles.outlined)}
          />
          <ellipse
            cx='48'
            cy='48'
            rx='14'
            ry='30'
            className={styles.hairline}
            fill='none'
          />
          <path
            d='M18 48h60M22 32h52M22 64h52'
            className={styles.hairline}
          />
          <circle cx='60' cy='38' r='4' className={styles.accent} />
          <g className={styles.pulse}>
            <circle cx='60' cy='38' r='8' className={styles.accent} opacity={0.25} />
          </g>
        </>
      ) : null}

      {variant === "book" ? (
        <>
          <path
            d='M48 28c-10-6-20-6-26-4v44c8-2 18-1 26 5 8-6 18-7 26-5V24c-6-2-16-2-26 4z'
            className={cn(styles.surface, styles.outlined)}
          />
          <path d='M48 28v45' className={styles.brandLine} />
          <path d='M30 36h10M30 44h10M58 36h10M58 44h10' className={styles.hairline} />
          <path
            d='M58 56h12'
            className={cn(styles.brandLine, styles.draw)}
            style={{ "--sc-dash": "16" } as CSSProperties}
          />
        </>
      ) : null}

      <Sparkle
        transform='translate(80 14) scale(0.35)'
        className={styles.accent}
      />
    </svg>
  );
}

export function Sparkline({
  points,
  className,
}: {
  points: number[];
  className?: string;
}) {
  const max = Math.max(...points);
  const min = Math.min(...points);
  const span = max - min || 1;
  const step = 116 / Math.max(1, points.length - 1);
  const line = points
    .map((value, index) => {
      const x = 2 + index * step;
      const y = 34 - ((value - min) / span) * 26;
      return `${index === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
  const lastX = 2 + (points.length - 1) * step;
  const lastY = 34 - ((points[points.length - 1] - min) / span) * 26;

  return (
    <svg
      viewBox='0 0 120 40'
      className={cn(styles.art, className)}
      aria-hidden='true'
      focusable='false'
    >
      <path d='M2 34h116' className={styles.hairline} />
      <path
        d={line}
        className={cn(styles.brandLine, styles.draw)}
        style={{ "--sc-dash": "180" } as CSSProperties}
      />
      <circle cx={lastX} cy={lastY} r='3' className={styles.brand} />
      <g className={styles.pulse}>
        <circle cx={lastX} cy={lastY} r='7' className={styles.brand} opacity={0.2} />
      </g>
    </svg>
  );
}


export function StepPath({ className }: { className?: string }) {
  return (
    <svg
      viewBox='0 0 800 40'
      className={cn(styles.art, className)}
      aria-hidden='true'
      focusable='false'
    >
      <path d='M24 20h752' className={styles.stitch} />
      <path
        d='M24 20h752'
        className={cn(styles.brandLine, styles.draw)}
        style={{ "--sc-dash": "760", "--sc-duration": "2.4s" } as CSSProperties}
        strokeWidth={2}
      />
      {[24, 400, 776].map((x, index) => (
        <g key={x}>
          <circle cx={x} cy='20' r='11' className={styles.surface} />
          <circle
            cx={x}
            cy='20'
            r='11'
            className={index === 1 ? styles.accent : styles.brand}
          />
          <circle cx={x} cy='20' r='4' className={styles.surface} />
        </g>
      ))}
      <path d='M766 14l10 6-10 6z' className={styles.brand} />
    </svg>
  );
}

export function ScoreChart({ className }: { className?: string }) {
  return (
    <svg
      viewBox='0 0 300 120'
      className={cn(styles.art, className)}
      aria-hidden='true'
      focusable='false'
    >
      {[24, 52, 80, 108].map((y) => (
        <path key={y} d={`M12 ${y}h276`} className={styles.hairline} />
      ))}
      <path
        d='M16 96c32-20 56-26 88-36s60-16 92-24 60-12 88-14v86H16z'
        className={styles.brandFaint}
      />
      <path
        d='M16 92c34-6 56-12 88-8s56-12 86-8 50-10 94-6'
        className={cn(styles.stitch, styles.drawSlow)}
        style={{ "--sc-dash": "320", "--sc-duration": "3s" } as CSSProperties}
        fill='none'
      />
      <path
        d='M16 96c32-20 56-26 88-36s60-16 92-24 60-12 88-14'
        className={cn(styles.brandLine, styles.draw)}
        style={{ "--sc-dash": "320", "--sc-duration": "2.6s" } as CSSProperties}
        fill='none'
      />
      <circle cx='284' cy='22' r='4' className={styles.brand} />
      <g className={styles.pulse}>
        <circle cx='284' cy='22' r='9' className={styles.brand} opacity={0.2} />
      </g>
    </svg>
  );
}

export function CtaPattern({ className }: { className?: string }) {
  const patternId = `cta-${useId().replace(/:/g, "")}`;

  return (
    <svg
      viewBox='0 0 520 260'
      className={cn(styles.art, className)}
      aria-hidden='true'
      focusable='false'
    >
      <defs>
        <DotPattern id={patternId} size={18} />
      </defs>
      <rect width='520' height='260' fill={`url(#${patternId})`} opacity={0.5} />
      <g
        className={styles.orbit}
        style={{ "--sc-duration": "40s" } as CSSProperties}
      >
        <circle
          cx='260'
          cy='130'
          r='104'
          fill='none'
          className={styles.brandLine}
          strokeDasharray='2 12'
          opacity={0.45}
        />
        <circle
          cx='260'
          cy='130'
          r='74'
          fill='none'
          className={styles.line}
          strokeDasharray='2 8'
        />
        <circle cx='364' cy='130' r='5' className={styles.accent} />
        <circle cx='260' cy='26' r='4' className={styles.warning} />
        <circle cx='186' cy='200' r='3' className={styles.success} />
      </g>
      <Sparkle
        transform='translate(64 54) scale(0.8)'
        className={styles.brand}
      />
      <Sparkle
        transform='translate(430 190) scale(0.6)'
        className={styles.accent}
      />
    </svg>
  );
}


export type FeatureVariant = "live" | "path" | "feedback";

export function FeatureVignette({
  variant,
  className,
}: {
  variant: FeatureVariant;
  className?: string;
}) {
  return (
    <svg
      viewBox='0 0 220 120'
      className={cn(styles.art, className)}
      aria-hidden='true'
      focusable='false'
    >
      <rect width='220' height='120' rx='8' className={styles.brandFaint} />
      <rect
        x='14'
        y='14'
        width='192'
        height='92'
        rx='8'
        className={styles.surface}
      />

      {variant === "live" ? (
        <>
          <rect
            x='26'
            y='26'
            width='76'
            height='46'
            rx='5'
            className={styles.brandSoft}
          />
          <rect
            x='110'
            y='26'
            width='84'
            height='46'
            rx='5'
            className={styles.muted}
          />
          <circle cx='64' cy='49' r='9' className={styles.brand} />
          <path d='M61 44l8 5-8 5z' className={styles.surface} />
          <g className={styles.pulse}>
            <circle cx='182' cy='36' r='4' className={styles.danger} />
            <circle
              cx='182'
              cy='36'
              r='8'
              className={styles.danger}
              opacity={0.25}
            />
          </g>
          <path d='M26 84h72M110 84h50' className={styles.hairline} />
          <path d='M26 94h110' className={styles.stitch} />
        </>
      ) : null}

      {variant === "path" ? (
        <>
          <path
            d='M34 84c26 0 22-46 48-46s22 42 46 42 20-38 46-38'
            className={cn(styles.brandLine, styles.draw)}
            style={{ "--sc-dash": "230" } as CSSProperties}
            fill='none'
          />
          {[
            { x: 34, y: 84 },
            { x: 82, y: 38 },
            { x: 128, y: 80 },
            { x: 174, y: 42 },
          ].map((point, index) => (
            <g key={`${point.x}-${point.y}`}>
              <circle
                cx={point.x}
                cy={point.y}
                r='8'
                className={styles.surface}
              />
              <circle
                cx={point.x}
                cy={point.y}
                r='8'
                className={index === 3 ? styles.accent : styles.brand}
              />
              <circle
                cx={point.x}
                cy={point.y}
                r='3'
                className={styles.surface}
              />
            </g>
          ))}
          <path d='M168 26h16v14' className={styles.accent} />
        </>
      ) : null}

      {variant === "feedback" ? (
        <>
          <rect
            x='28'
            y='26'
            width='114'
            height='38'
            rx='9'
            className={styles.muted}
          />
          <path d='M44 64l-6 10 14-10' className={styles.muted} />
          <path d='M42 38h74M42 48h50' className={styles.hairline} />
          <rect
            x='100'
            y='58'
            width='88'
            height='34'
            rx='9'
            className={styles.brandSoft}
          />
          <path d='M174 92l8 10 2-12' className={styles.brandSoft} />
          <path d='M112 72h58M112 82h40' className={styles.hairline} />
          <circle cx='94' cy='88' r='7' className={styles.success} />
          <path
            d='M91 88l2 2 5-5'
            className={styles.surface}
            strokeWidth={1.6}
            fill='none'
          />
          <path d='M28 100h120' className={styles.stitch} />
        </>
      ) : null}
    </svg>
  );
}

