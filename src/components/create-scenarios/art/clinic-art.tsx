"use client";

import { useId, type CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { sc } from "../scenes";
import { DotPattern, GridPattern, Sparkle } from "./shared";

/**
 * Hero illustration for the clinic scenario: a calm reception room with a
 * live ECG trace, a reception desk and floating booking chips. Painted with
 * `sc-*` token classes so every preset re-colours the scene. Motion: the trace
 * draws itself, a playhead sweeps the monitor, the admission dot beats and the
 * halo behind the room breathes.
 */
export function ClinicScene({ className }: { className?: string }) {
  const dots = `clinic-dots-${useId().replace(/:/g, "")}`;
  const grid = `clinic-grid-${useId().replace(/:/g, "")}`;

  return (
    <svg
      viewBox='0 0 560 440'
      preserveAspectRatio='xMidYMid slice'
      className={cn(sc.art, className)}
      aria-hidden='true'
      focusable='false'
    >
      <defs>
        <DotPattern id={dots} size={20} />
        <GridPattern id={grid} size={30} />
      </defs>

      <rect width='560' height='440' className={sc.paper} />
      <rect width='560' height='440' fill={`url(#${dots})`} />
      <circle cx='300' cy='150' r='132' className={cn(sc.brandFaint, sc.breathe)} />
      <path d='M0 352h560' className={sc.inkLine} strokeWidth={2} opacity={0.25} />

      <rect
        x='40'
        y='52'
        width='176'
        height='120'
        rx='6'
        className={cn(sc.surface, sc.outlined)}
      />
      <rect x='40' y='52' width='176' height='120' fill={`url(#${grid})`} />
      <path
        d='M52 140h40V96h26v44h34v-22h30v22'
        className={sc.line}
        fill='none'
      />
      <path d='M128 52v120M40 112h176' className={sc.hairline} />
      <circle cx='176' cy='86' r='12' className={sc.warning} opacity={0.85} />

      <g>
        <rect
          x='252'
          y='46'
          width='214'
          height='106'
          rx='8'
          className={cn(sc.surface, sc.outlined)}
        />
        <path d='M252 70h214' className={sc.hairline} />
        <circle cx='268' cy='58' r='3.4' className={sc.success} />
        <circle cx='280' cy='58' r='3.4' className={sc.warning} />
        <path d='M296 58h56' className={sc.hairline} />
        <path
          d='M266 128h24l10-26 12 44 12-30 10 12h48l10-18 12 30 10-12h52'
          className={cn(sc.brandLine, sc.draw)}
          style={{ "--sc-dash": "340", "--sc-duration": "3s" } as CSSProperties}
          strokeWidth={2}
        />
        <path d='M266 100h180' className={sc.stitch} strokeDasharray='3 8' />
        <g className={sc.pulse}>
          <circle cx='440' cy='100' r='9' className={sc.danger} opacity={0.22} />
          <circle cx='440' cy='100' r='4' className={cn(sc.danger, sc.beat)} />
        </g>
        <path
          d='M266 84v52'
          className={cn(sc.brandLine, sc.scan)}
          strokeWidth={1.6}
          style={{ "--sc-run-x": "182px" } as CSSProperties}
        />
        <path d='M398 142h52' className={sc.hairline} />
      </g>

      <rect
        x='70'
        y='252'
        width='250'
        height='96'
        rx='10'
        className={cn(sc.surface, sc.outlined)}
      />
      <rect x='70' y='252' width='250' height='26' rx='10' className={sc.brandSoft} />
      <path d='M96 300h74M96 314h48' className={sc.hairline} />
      <path d='M196 300h98M196 314h64' className={sc.hairline} />
      <rect x='102' y='330' width='58' height='8' rx='4' className={sc.line} />
      <circle cx='286' cy='286' r='9' className={sc.brand} />
      <path
        d='M282 286l3 3 5-6'
        className={sc.surface}
        strokeWidth={1.8}
        fill='none'
      />

      <circle cx='196' cy='212' r='20' className={sc.muted} />
      <path d='M168 252c2-18 13-26 28-26s26 8 28 26' className={sc.brandSoft} />
      <circle cx='189' cy='210' r='2' className={sc.ink} />
      <circle cx='203' cy='210' r='2' className={sc.ink} />
      <path
        d='M190 220c4 3 8 3 12 0'
        className={sc.inkLine}
        strokeWidth={1.6}
        fill='none'
      />

      {[0, 1, 2].map((index) => (
        <g key={index} transform={`translate(${356 + index * 60} 268)`}>
          <rect
            width='44'
            height='12'
            rx='5'
            className={index === 0 ? sc.brand : sc.muted}
          />
          <rect y='12' width='6' height='30' rx='3' className={sc.line} />
          <rect x='38' y='12' width='6' height='30' rx='3' className={sc.line} />
          <rect y='30' width='44' height='7' rx='3.5' className={sc.muted} />
        </g>
      ))}

      <path d='M492 352h44v-26a22 22 0 0 0-44 0z' className={sc.muted} />
      <path
        d='M514 300c-14-16-8-38 0-46 8 8 14 30 0 46z'
        className={sc.success}
        opacity={0.9}
      />
      <path
        d='M514 300c-12 2-22-6-24-16 10-2 20 4 24 16z'
        className={sc.brandSoft}
      />

      <g className={sc.float} style={{ "--sc-delay": "-1.2s" } as CSSProperties}>
        <rect
          x='382'
          y='164'
          width='132'
          height='86'
          rx='8'
          className={cn(sc.surface, sc.outlined)}
        />
        <rect x='382' y='164' width='132' height='20' rx='8' className={sc.brand} />
        <path d='M382 184h132' className={sc.hairline} />
        {Array.from({ length: 12 }).map((_, index) => {
          const column = index % 6;
          const row = Math.floor(index / 6);
          const isFree = index % 4 !== 3;
          return (
            <rect
              key={index}
              x={394 + column * 19}
              y={196 + row * 20}
              width='12'
              height='12'
              rx='2.5'
              className={isFree ? sc.brandSoft : sc.muted}
            />
          );
        })}
        <rect x='394' y='196' width='12' height='12' rx='2.5' className={sc.brand} />
      </g>

      <g
        className={sc.floatSlow}
        style={{ "--sc-delay": "-0.4s" } as CSSProperties}
      >
        <rect
          x='60'
          y='150'
          width='152'
          height='58'
          rx='10'
          className={cn(sc.surface, sc.outlined)}
        />
        <circle cx='84' cy='179' r='12' className={sc.success} />
        <path
          d='M79 179l3.5 4 6-7'
          className={sc.surface}
          strokeWidth={2}
          fill='none'
        />
        <path d='M104 168h86M104 180h58' className={sc.hairline} />
        <rect
          x='104'
          y='188'
          width='40'
          height='7'
          rx='3.5'
          className={sc.brandSoft}
        />
      </g>

      <g opacity={0.9}>
        <path
          d='M300 330c0 34 26 44 44 44s44-10 44-44'
          className={sc.brandLine}
          strokeWidth={3}
          fill='none'
        />
        <circle cx='300' cy='326' r='6' className={cn(sc.surface, sc.outlined)} />
        <circle cx='388' cy='326' r='6' className={cn(sc.surface, sc.outlined)} />
        <circle cx='344' cy='378' r='11' className={cn(sc.surface, sc.outlined)} />
        <circle cx='344' cy='378' r='4' className={sc.brand} />
      </g>

      <path d='M70 392h420' className={sc.stitch} />
      <Sparkle transform='translate(232 336) scale(0.5)' className={sc.accent} />
      <Sparkle transform='translate(52 268) scale(0.4)' className={sc.warning} />
    </svg>
  );
}


/** Abstract neighbourhood map used in the location card. */
export function ClinicMap({ className }: { className?: string }) {
  const grid = `clinic-map-${useId().replace(/:/g, "")}`;

  return (
    <svg
      viewBox='0 0 320 150'
      preserveAspectRatio='xMidYMid slice'
      className={cn(sc.art, className)}
      aria-hidden='true'
      focusable='false'
    >
      <defs>
        <GridPattern id={grid} size={22} />
      </defs>
      <rect width='320' height='150' className={sc.paper} />
      <rect width='320' height='150' fill={`url(#${grid})`} />
      <path d='M0 74h320M186 0v150' className={sc.muted} strokeWidth={12} />
      <path d='M0 74h320M186 0v150' className={sc.stitch} strokeDasharray='6 6' />
      {[
        [24, 18, 52, 34],
        [96, 22, 44, 30],
        [212, 20, 74, 36],
        [28, 92, 58, 40],
        [108, 96, 54, 34],
        [212, 92, 40, 30],
        [262, 92, 34, 40],
      ].map(([x, y, width, height]) => (
        <rect
          key={`${x}-${y}`}
          x={x}
          y={y}
          width={width}
          height={height}
          rx='3'
          className={sc.surface}
          stroke='var(--cc-border)'
          strokeWidth={1}
          opacity={0.95}
        />
      ))}
      <path d='M120 74h66' className={sc.brandLine} fill='none' />
      <path
        d='M24 120 L100 74 H186'
        className={cn(sc.brandLine, sc.travel)}
        fill='none'
        strokeWidth={2}
        style={{ "--sc-dash-run": "16 300" } as CSSProperties}
      />
      <g>
        <circle cx='186' cy='74' r='16' className={sc.brandFaint} />
        <circle
          cx='186'
          cy='74'
          r='14'
          className={cn(sc.brandFaint, sc.signal)}
        />
        <circle cx='186' cy='74' r='9' className={sc.brand} />
        <circle cx='186' cy='74' r='3.4' className={sc.surface} />
        <circle
          cx='186'
          cy='74'
          r='14'
          className={sc.brandLine}
          fill='none'
          strokeDasharray='2 4'
        />
      </g>
      <Sparkle
        transform='translate(292 20) scale(0.4)'
        className={cn(sc.accent, sc.pop)}
      />
    </svg>
  );
}

/**
 * Faux printed appointment slip shown after a successful booking. The stamp
 * pops, a short confetti burst celebrates it and a light sweep crosses the
 * barcode — all CSS classes, so the preset still owns every colour.
 */
export function BookingSlip({ code }: { code: string }) {
  const clip = `clinic-slip-${useId().replace(/:/g, "")}`;

  return (
    <svg
      viewBox='0 0 240 160'
      className={sc.art}
      aria-hidden='true'
      focusable='false'
    >
      <defs>
        <clipPath id={clip}>
          <rect x='10' y='8' width='220' height='144' rx='8' />
        </clipPath>
      </defs>
      <rect
        x='10'
        y='8'
        width='220'
        height='144'
        rx='8'
        className={cn(sc.surface, sc.outlined)}
      />
      <g clipPath={`url(#${clip})`}>
        {Array.from({ length: 8 }).map((_, index) => {
          const angle = (index / 8) * Math.PI * 2;
          return (
            <rect
              key={index}
              x={196 + Math.cos(angle) * 27}
              y={26 + Math.sin(angle) * 27}
              width='3'
              height='3'
              rx='1'
              className={cn(index % 2 === 0 ? sc.brand : sc.accent, sc.burst)}
              style={
                {
                  "--sc-delay": `${index * 0.14}s`,
                  "--sc-duration": "6.4s",
                } as CSSProperties
              }
            />
          );
        })}
      </g>
      <g className={sc.pop}>
        <circle cx='196' cy='26' r='13' className={sc.success} />
        <path
          d='M190 26l4 4 8-9'
          className={sc.surface}
          strokeWidth={2.2}
          fill='none'
        />
      </g>
      <path d='M10 40h220' className={sc.hairline} />
      <rect x='26' y='20' width='74' height='9' rx='4.5' className={sc.brandSoft} />
      <path d='M28 58h96M28 70h64M28 88h78M28 100h48' className={sc.hairline} />
      <path
        d='M150 58h62M150 70h44M150 88h58M150 100h36'
        className={sc.hairline}
      />
      <path d='M10 118h220' className={sc.stitch} strokeDasharray='5 6' />
      {Array.from({ length: 26 }).map((_, index) => (
        <rect
          key={index}
          x={24 + index * 5}
          y={128}
          width={index % 3 === 0 ? 2.4 : 1.4}
          height={16}
          className={sc.ink}
          opacity={0.75}
        />
      ))}
      <g clipPath={`url(#${clip})`}>
        <rect
          x='26'
          y='128'
          width='4'
          height='16'
          className={cn(sc.brandSoft, sc.shimmer)}
          style={{ "--sc-duration": "5.6s" } as CSSProperties}
        />
      </g>
      <rect x='176' y='124' width='22' height='22' rx='3' className={sc.muted} />
      <path
        d='M180 130h4v4h-4zM188 130h4v4h-4zM180 138h4v4h-4zM190 140h3v3h-3z'
        className={sc.ink}
        opacity={0.7}
      />
      <text
        x='120'
        y='140'
        textAnchor='middle'
        fontSize='7'
        fill='var(--cc-muted-foreground)'
      >
        {code}
      </text>
    </svg>
  );
}

