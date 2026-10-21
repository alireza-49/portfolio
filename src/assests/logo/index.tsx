"use client";
import type { ComponentProps, CSSProperties } from "react";
import { cn } from "cn";

import { Button } from "@/components/ui/button";

type Props = { className?: string };

const Logo = (props: Props) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 512 512'
      width='512'
      height='512'
      {...props}
    >
      <defs>
        <filter id='riso-texture' x='-10%' y='-10%' width='120%' height='120%'>
          <feTurbulence
            type='fractalNoise'
            baseFrequency='0.8'
            numOctaves='3'
            result='noise'
          />
          <feColorMatrix
            type='matrix'
            values='0 0 0 0 0.1   0 0 0 0 0.1   0 0 0 0 0.1  0 0 0 0.07 0'
            in='noise'
            result='coloredNoise'
          />
          <feComposite
            operator='in'
            in='coloredNoise'
            in2='SourceGraphic'
            result='texture'
          />
          <feBlend mode='multiply' in='texture' in2='SourceGraphic' />
        </filter>

        <pattern
          id='dot-grid'
          x='0'
          y='0'
          width='16'
          height='16'
          patternUnits='userSpaceOnUse'
        >
          <circle cx='2' cy='2' r='1.2' fill='#e64833' opacity='0.18' />
        </pattern>
      </defs>

      <rect
        width='512'
        height='512'
        rx='32'
        fill='#fdf9f0'
        stroke='#1e284a'
        strokeWidth='8'
      />

      <rect
        x='24'
        y='24'
        width='464'
        height='464'
        rx='20'
        fill='url(#dot-grid)'
      />

      <rect
        x='40'
        y='40'
        width='432'
        height='432'
        rx='16'
        fill='none'
        stroke='#1e284a'
        strokeWidth='3'
        strokeDasharray='10 6'
        opacity='0.4'
      />

      <path
        d='M 32 40 L 48 40 M 40 32 L 40 48'
        stroke='#e64833'
        strokeWidth='2.5'
        strokeLinecap='round'
      />
      <path
        d='M 464 40 L 480 40 M 472 32 L 472 48'
        stroke='#e64833'
        strokeWidth='2.5'
        strokeLinecap='round'
      />
      <path
        d='M 32 472 L 48 472 M 40 464 L 40 480'
        stroke='#e64833'
        strokeWidth='2.5'
        strokeLinecap='round'
      />
      <path
        d='M 464 472 L 480 472 M 472 464 L 472 480'
        stroke='#e64833'
        strokeWidth='2.5'
        strokeLinecap='round'
      />

      <g transform='translate(10, 12)' opacity='0.25'>
        <rect x='110' y='100' width='280' height='280' rx='28' fill='#1e284a' />
      </g>

      <g transform='translate(-6, -6)'>
        <rect
          x='116'
          y='106'
          width='280'
          height='280'
          rx='28'
          fill='#f59e0b'
          opacity='0.85'
        />
        <line
          x1='160'
          y1='106'
          x2='160'
          y2='386'
          stroke='#1e284a'
          strokeWidth='2'
          opacity='0.3'
          strokeDasharray='4 4'
        />
        <line
          x1='352'
          y1='106'
          x2='352'
          y2='386'
          stroke='#1e284a'
          strokeWidth='2'
          opacity='0.3'
          strokeDasharray='4 4'
        />
      </g>

      <rect
        x='110'
        y='100'
        width='280'
        height='280'
        rx='28'
        fill='#e64833'
        stroke='#1e284a'
        strokeWidth='7'
      />

      <path
        d='M 174 180 L 146 220 L 174 260'
        fill='none'
        stroke='#fdf9f0'
        strokeWidth='8'
        strokeLinecap='round'
        strokeLinejoin='round'
        opacity='0.6'
      />

      <path
        d='M 330 200 L 356 240 L 330 280'
        fill='none'
        stroke='#fdf9f0'
        strokeWidth='8'
        strokeLinecap='round'
        strokeLinejoin='round'
        opacity='0.6'
      />

      <path
        d='M 314 170 C 314 170 314 274 314 290 C 314 314 294 326 266 326 L 194 326 C 168 326 156 312 156 294'
        fill='none'
        stroke='#ffffff'
        strokeWidth='22'
        strokeLinecap='round'
        strokeLinejoin='round'
      />

      <path
        d='M 230 156 L 338 184'
        fill='none'
        stroke='#fdf9f0'
        strokeWidth='20'
        strokeLinecap='round'
      />

      <circle
        cx='236'
        cy='248'
        r='14'
        fill='#1e284a'
        stroke='#ffffff'
        strokeWidth='4'
      />
      <circle cx='270' cy='248' r='6' fill='#fdf9f0' />

      <g transform='translate(256, 428)' textAnchor='middle'>
        <text
          y='0'
          fontFamily='&#39;Space Grotesk&#39;, &#39;Vazirmatn&#39;, system-ui, sans-serif'
          fontWeight='900'
          fontSize='28'
          fill='#1e284a'
          letterSpacing='2'
        >
          CODOLOGY
        </text>
        <text
          y='22'
          fontFamily='&#39;Vazirmatn&#39;, system-ui, sans-serif'
          fontWeight='700'
          fontSize='14'
          fill='#e64833'
          letterSpacing='4'
        >
          استودیو کُدولوژی // چاپ دیجیتال و کد
        </text>
      </g>
    </svg>
  );
};

const SPARKLE_COUNT = 24;
const SPARKLE_COLORS = ["#e64833", "#f59e0b"];
/** Must match the duration in the `animate-[logo-sparkle_…]` class below. */
const SPARKLE_DURATION = 0.8;
const SPARKLE_DISTANCES = [40, 50, 60, 70];
const SPARKLE_SIZES = ["size-2.5", "size-3", "size-3.5", "size-4"];

type LogoButtonProps = ComponentProps<typeof Button> & {
  /** Extra classes applied to the inner SVG. */
  logoClassName?: string;
  /** Disable the sparkle burst on hover. */
  sparkles?: boolean;
};

/**
 * The logo wrapped in `Button`, so it inherits the cursor-following
 * radial glow (`--btn-x` / `--btn-y`) from the button primitive.
 *
 * On hover the button grows strongly and a dense, wide ring of
 * sparkles bursts outward from its centre.
 */
const LogoButton = ({
  className,
  logoClassName,
  variant = "ghost",
  size = "default",
  sparkles = true,
  ...props
}: LogoButtonProps) => {
  return (
    <span className='group/logo relative inline-flex'>
      <Button
        variant={variant}
        size={size}
        className={cn(
          // strip the default button chrome so only the logo is visible
          "h-auto w-auto rounded-[1.75rem] p-0",
          "hover:bg-transparent aria-expanded:bg-transparent",
          // the SVG is opaque, so lift the glow above it
          "before:z-10",
          // grow on hover (base `transition-all` animates the scale)
          "duration-300 ease-out hover:scale-150 motion-reduce:hover:scale-100",
          className,
        )}
        {...props}
      >
        <Logo className={cn("size-12", logoClassName)} />
      </Button>

      {sparkles ? (
        <span
          aria-hidden='true'
          className='pointer-events-none absolute inset-0 motion-reduce:hidden'
        >
          <style>{`
            @keyframes logo-sparkle {
              0% {
                opacity: 0;
                transform: translate(-50%, -50%) rotate(var(--sparkle-angle)) translateY(0) scale(0.2);
              }
              25% {
                opacity: 1;
              }
              100% {
                opacity: 0;
                transform: translate(-50%, -50%) rotate(var(--sparkle-angle)) translateY(calc(-1 * var(--sparkle-distance))) scale(1);
              }
            }
          `}</style>
          {Array.from({ length: SPARKLE_COUNT }).map((_, index) => (
            <span
              key={index}
              className='absolute top-1/2 left-1/2 opacity-0 group-hover/logo:animate-[logo-sparkle_0.8s_ease-out_infinite]'
              style={
                {
                  "--sparkle-angle": `${(360 / SPARKLE_COUNT) * index}deg`,
                  "--sparkle-distance": `${SPARKLE_DISTANCES[index % SPARKLE_DISTANCES.length]}px`,
                  animationDelay: `-${(index * (SPARKLE_DURATION / SPARKLE_COUNT)).toFixed(3)}s`,
                  color: SPARKLE_COLORS[index % SPARKLE_COLORS.length],
                } as CSSProperties
              }
            >
              <svg
                viewBox='0 0 24 24'
                className={cn(
                  "fill-current",
                  SPARKLE_SIZES[index % SPARKLE_SIZES.length],
                )}
                aria-hidden='true'
              >
                <path d='M12 0 C12.5 6.5 17.5 11.5 24 12 C17.5 12.5 12.5 17.5 12 24 C11.5 17.5 6.5 12.5 0 12 C6.5 11.5 11.5 6.5 12 0 Z' />
              </svg>
            </span>
          ))}
        </span>
      ) : null}
    </span>
  );
};

export { LogoButton };
export default Logo;
