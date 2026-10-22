"use client";

import { useId, type CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { sc as styles } from "../scenes";
import type { GarmentVariant, ShopCategory } from "../data/shop";
import { DotPattern, GridPattern, Sparkle } from "./shared";

const garmentStyle = (color: string) =>
  ({ "--sc-garment": color }) as CSSProperties;

function StudioBackdrop({ patternId }: { patternId: string }) {
  return (
    <>
      <rect width='320' height='240' className={styles.paper} />
      <rect width='320' height='240' fill={`url(#${patternId})`} />
      <circle
        cx='252'
        cy='54'
        r='42'
        className={styles.brandSoft}
        opacity={0.5}
      />
      <path
        d='M42 198V138a118 118 0 0 1 236 0v60'
        className={styles.brandFaint}
      />
      <ellipse cx='160' cy='208' rx='82' ry='8' className={styles.muted} />
      <path d='M46 206h228' className={styles.stitch} />
      <Sparkle
        transform='translate(52 42) scale(0.55)'
        className={styles.accent}
      />
      <Sparkle
        transform='translate(266 182) scale(0.42)'
        className={styles.brand}
      />
    </>
  );
}

function Hanger({ y = 34 }: { y?: number }) {
  return (
    <g className={styles.line}>
      <path d={`M160 ${y - 22}v-6`} />
      <path d={`M160 ${y - 28}c-7 0-10 5-10 8`} />
      <path d={`M108 ${y + 4} 160 ${y - 6} 212 ${y + 4}`} />
      <path d={`M108 ${y + 4}h6M206 ${y + 4}h6`} />
    </g>
  );
}

function Coat() {
  return (
    <g>
      <Hanger y={32} />
      <path
        d='M120 64 92 122l18 10 20-50zM200 64l28 58-18 10-20-50z'
        className={cn(styles.garmentSoft, styles.outlined)}
      />
      <path
        d='M120 62 146 52l14 10 14-10 26 10 12 58-10 78q-42 10-84 0l-10-78z'
        className={cn(styles.garment, styles.outlined)}
      />
      <path
        d='M146 52l14 10-12 34-12-26zM174 52l-14 10 12 34 12-26z'
        className={styles.garmentSoft}
      />
      <path
        d='M132 74l14 22M188 74l-14 22'
        className={styles.brandStitch}
      />
      <rect
        x='116'
        y='132'
        width='88'
        height='11'
        rx='3'
        className={cn(styles.garmentDeep, styles.outlined)}
      />
      <rect x='153' y='130' width='14' height='15' rx='2' className={styles.surface} />
      <path d='M128 156v24h20M192 156v24h-20' className={styles.inkLine} opacity={0.35} />
      <path d='M124 196h72' className={styles.stitch} />
      <circle cx='160' cy='112' r='2.4' className={styles.ink} />
      <circle cx='160' cy='122' r='2.4' className={styles.ink} />
    </g>
  );
}

function Shirt() {
  return (
    <g>
      <Hanger y={32} />
      <path
        d='M122 66 96 122l16 10 20-48zM198 66l26 56-16 10-20-48z'
        className={cn(styles.garmentSoft, styles.outlined)}
      />
      <path
        d='M122 64 148 54l12 12 12-12 26 10 8 54-8 70h-72l-8-70z'
        className={cn(styles.garment, styles.outlined)}
      />
      <path
        d='M148 54l12 12-8 22-10-20zM172 54l-12 12 8 22 10-20z'
        className={styles.garmentSoft}
      />
      <path d='M160 66v76' className={styles.brandStitch} />
      {[78, 94, 110, 126].map((y) => (
        <circle key={y} cx='160' cy={y} r='2.3' className={styles.ink} />
      ))}
      <rect
        x='146'
        y='96'
        width='18'
        height='18'
        rx='1'
        className={styles.line}
      />
      <path d='M98 126l14 6M222 126l-14 6' className={styles.stitch} />
      <path d='M122 188h76' className={styles.stitch} />
    </g>
  );
}

function Knit() {
  return (
    <g>
      <Hanger y={32} />
      <path
        d='M120 72 96 136l18 9 18-54zM200 72l24 64-18 9-18-54z'
        className={cn(styles.garmentSoft, styles.outlined)}
      />
      <path
        d='M116 72q44-16 88 0l6 110q-50 12-100 0z'
        className={cn(styles.garment, styles.outlined)}
      />
      <rect
        x='138'
        y='46'
        width='44'
        height='22'
        rx='10'
        className={cn(styles.garmentDeep, styles.outlined)}
      />
      <g className={styles.line} opacity={0.35}>
        <path d='M134 92q6 40 0 82M148 88q5 44 0 90M160 86v94M172 88q-5 44 0 90M186 92q-6 40 0 82' />
        <path d='M118 172h84M120 180h80' />
      </g>
      <path d='M96 144l18 2M224 144l-18 2' className={styles.stitch} />
      <path d='M140 56h40' className={styles.brandStitch} />
    </g>
  );
}

function Cargo() {
  return (
    <g>
      <Hanger y={32} />
      <rect
        x='116'
        y='62'
        width='88'
        height='14'
        rx='2'
        className={cn(styles.garmentDeep, styles.outlined)}
      />
      <path
        d='M118 76h84l8 120h-38l-12-72-12 72h-38z'
        className={cn(styles.garment, styles.outlined)}
      />
      <path d='M160 78v46' className={styles.brandStitch} />
      <path d='M124 84q10 8 20 0' className={styles.line} />
      <rect
        x='122'
        y='116'
        width='24'
        height='26'
        rx='2'
        className={cn(styles.garmentSoft, styles.outlined)}
      />
      <rect
        x='174'
        y='116'
        width='24'
        height='26'
        rx='2'
        className={cn(styles.garmentSoft, styles.outlined)}
      />
      <path d='M122 122h24M174 122h24' className={styles.stitch} />
      <path d='M126 198h30M166 198h30' className={styles.stitch} />
      <path d='M130 66v-8M190 66v-8' className={styles.inkLine} strokeWidth={1.4} />
    </g>
  );
}

function Hoodie() {
  return (
    <g>
      <Hanger y={32} />
      <path
        d='M136 68q24-30 48 0 4 20-24 24-28-4-24-24z'
        className={cn(styles.garmentSoft, styles.outlined)}
      />
      <path
        d='M122 74 98 136l18 8 16-48zM198 74l24 62-18 8-16-48z'
        className={cn(styles.garmentSoft, styles.outlined)}
      />
      <path
        d='M122 72q38-12 76 0l8 104q-46 10-92 0z'
        className={cn(styles.garment, styles.outlined)}
      />
      <path
        d='M132 158h56v22h-56z'
        className={styles.garmentSoft}
        opacity={0.9}
      />
      <path d='M132 158h56' className={styles.stitch} />
      <g className={styles.hang} style={{ "--sc-duration": "4.5s" } as CSSProperties}>
        <path d='M150 92v26M170 92v26' className={styles.inkLine} strokeWidth={1.8} />
        <circle cx='150' cy='120' r='2.4' className={styles.ink} />
        <circle cx='170' cy='120' r='2.4' className={styles.ink} />
      </g>
      <path d='M118 168h84M120 175h80' className={styles.line} opacity={0.4} />
      <path d='M100 142l16 2M220 142l-16 2' className={styles.stitch} />
    </g>
  );
}

function Dress() {
  return (
    <g>
      <path d='M138 62v-14M182 62v-14' className={styles.garmentDeep} strokeWidth={4} />
      <path
        d='M138 62 148 56 160 68 172 56 182 62 188 112H132z'
        className={cn(styles.garment, styles.outlined)}
      />
      <path
        d='M132 112h56l24 84q-52 12-104 0z'
        className={cn(styles.garmentSoft, styles.outlined)}
      />
      <path d='M132 112h56' className={styles.brandStitch} />
      <g className={styles.line} opacity={0.35}>
        <path d='M146 120 136 192M160 120v76M174 120l10 72' />
      </g>
      <path d='M150 68q10 12 20 0' className={styles.stitch} />
      <Sparkle
        transform='translate(196 150) scale(0.45)'
        className={styles.accent}
      />
    </g>
  );
}


function Tote() {
  return (
    <g>
      <path
        d='M132 92V74a28 28 0 0 1 56 0v18'
        className={styles.garmentDeep}
        strokeWidth={5}
        fill='none'
      />
      <path
        d='M134 92V74a26 26 0 0 1 52 0v18'
        className={styles.line}
        strokeWidth={1.2}
        fill='none'
      />
      <path
        d='M104 90h112l12 106q-68 14-136 0z'
        className={cn(styles.garment, styles.outlined)}
      />
      <path
        d='M104 90h112l-3 26h-106z'
        className={cn(styles.garmentSoft, styles.outlined)}
      />
      <rect
        x='150'
        y='116'
        width='20'
        height='12'
        rx='3'
        className={cn(styles.ink, styles.outlined)}
      />
      <path d='M112 132h96M110 186h100' className={styles.brandStitch} />
      <path d='M124 106v12M196 106v12' className={styles.stitch} />
      <Sparkle
        transform='translate(214 64) scale(0.5)'
        className={styles.accent}
      />
    </g>
  );
}

function Watch() {
  return (
    <g>
      <rect
        x='140'
        y='26'
        width='40'
        height='52'
        rx='8'
        className={cn(styles.garment, styles.outlined)}
      />
      <rect
        x='140'
        y='162'
        width='40'
        height='52'
        rx='8'
        className={cn(styles.garment, styles.outlined)}
      />
      {[40, 52, 64, 176, 188, 200].map((y) => (
        <circle key={y} cx='160' cy={y} r='1.6' className={styles.inkSoft} />
      ))}
      <circle
        cx='160'
        cy='120'
        r='48'
        className={cn(styles.garmentDeep, styles.outlined)}
      />
      <circle cx='160' cy='120' r='39' className={styles.surface} />
      <g className={styles.line} strokeWidth={1.4}>
        {Array.from({ length: 12 }).map((_, index) => (
          <path
            key={index}
            d='M160 90v6'
            transform={`rotate(${index * 30} 160 120)`}
          />
        ))}
      </g>
      <path d='M160 120V98' className={styles.inkLine} strokeWidth={3} />
      <path d='M160 120l18 10' className={styles.inkLine} strokeWidth={2.4} />
      <g
        className={styles.spin}
        style={{ "--sc-duration": "12s" } as CSSProperties}
      >
        <path d='M160 120V92' className={styles.brandLine} strokeWidth={1.6} />
        <circle cx='160' cy='92' r='2.4' className={styles.brand} />
      </g>
      <circle cx='160' cy='120' r='3' className={styles.ink} />
      <rect
        x='205'
        y='112'
        width='9'
        height='16'
        rx='3'
        className={cn(styles.garmentDeep, styles.outlined)}
      />
      <path d='M96 120h8M216 120h8' className={styles.line} />
    </g>
  );
}

export function GarmentArt({
  variant,
  color,
  className,
}: {
  variant: GarmentVariant;
  color: string;
  className?: string;
}) {
  const patternId = `garment-${useId().replace(/:/g, "")}`;

  return (
    <svg
      viewBox='0 0 320 240'
      className={cn(styles.art, className)}
      style={garmentStyle(color)}
      aria-hidden='true'
      focusable='false'
    >
      <defs>
        <DotPattern id={patternId} />
      </defs>
      <StudioBackdrop patternId={patternId} />
      {variant === "watch" ? (
        <Watch />
      ) : (
        <g
          className={variant === "tote" ? styles.floatSlow : styles.hangSlow}
          style={{ "--sc-delay": "-1.6s" } as CSSProperties}
        >
          {variant === "coat" ? <Coat /> : null}
          {variant === "shirt" ? <Shirt /> : null}
          {variant === "knit" ? <Knit /> : null}
          {variant === "cargo" ? <Cargo /> : null}
          {variant === "hoodie" ? <Hoodie /> : null}
          {variant === "dress" ? <Dress /> : null}
          {variant === "tote" ? <Tote /> : null}
        </g>
      )}
    </svg>
  );
}


export function RailScene({ className }: { className?: string }) {
  const patternId = `rail-${useId().replace(/:/g, "")}`;

  return (
    <svg
      viewBox='0 0 560 460'
      className={cn(styles.art, className)}
      aria-hidden='true'
      focusable='false'
    >
      <defs>
        <DotPattern id={patternId} size={20} />
      </defs>
      <rect width='560' height='460' className={styles.muted} />
      <rect width='560' height='460' fill={`url(#${patternId})`} />
      <path
        d='M52 408V272a136 136 0 0 1 272 0v136'
        className={styles.surface}
        opacity={0.55}
      />
      <circle cx='454' cy='116' r='98' className={styles.brandFaint} />
      <path d='M60 120h440' className={styles.inkLine} strokeWidth={3} />
      <path d='M84 120v18M476 120v18' className={styles.inkLine} />
      <path d='M84 138v10M476 138v10' className={styles.stitch} />

      <g transform='translate(18 88) scale(0.95)'>
        <g style={garmentStyle("#d6c7b0")} className={styles.hang}>
          <Coat />
        </g>
      </g>
      <g transform='translate(158 88) scale(0.95)'>
        <g style={garmentStyle("#6b7a5a")} className={styles.hang}>
          <Knit />
        </g>
      </g>
      <g transform='translate(300 52) scale(0.9)'>
        <g style={garmentStyle("#a9744f")} className={styles.float}>
          <Tote />
        </g>
      </g>

      <path d='M78 390h404' className={styles.stitch} />
      <g className={styles.line}>
        <path d='M330 330v60M410 330v60' />
        <path d='M306 330h128' strokeWidth={3} />
      </g>
      <g className={styles.floatSlow} style={{ "--sc-delay": "-2s" } as CSSProperties}>
        <circle cx='474' cy='330' r='26' className={styles.brandSoft} />
        <path d='M474 330v-18' className={styles.brandLine} />
        <path d='M474 330c10-4 16-12 18-20' className={styles.brandLine} />
        <path d='M474 330c-8 6-16 8-24 6' className={styles.brandLine} />
      </g>
      <Sparkle
        transform='translate(86 214) scale(0.6)'
        className={styles.accent}
      />
      <Sparkle
        transform='translate(250 62) scale(0.4)'
        className={styles.warning}
      />
    </svg>
  );
}

export function AtelierScene({ className }: { className?: string }) {
  const patternId = `atelier-${useId().replace(/:/g, "")}`;

  return (
    <svg
      viewBox='0 0 520 360'
      className={cn(styles.art, className)}
      aria-hidden='true'
      focusable='false'
    >
      <defs>
        <GridPattern id={patternId} size={26} />
      </defs>
      <rect width='520' height='360' className={styles.muted} />
      <rect width='520' height='360' fill={`url(#${patternId})`} />
      <rect
        x='26'
        y='26'
        width='468'
        height='308'
        rx='12'
        className={styles.surface}
        opacity={0.55}
      />

      <g transform='rotate(-7 196 186)'>
        <rect
          x='78'
          y='66'
          width='236'
          height='240'
          rx='4'
          className={cn(styles.surface, styles.outlined)}
        />
        <path d='M100 96h192M100 110h150' className={styles.hairline} />
        <path
          d='M104 152c34 0 22 44 58 44s28-52 66-52 24 40 60 40'
          className={cn(styles.brandLine, styles.draw)}
          style={{ "--sc-dash": "240" } as CSSProperties}
        />
        <path
          d='M108 214c26 20 42-10 68 8s34 34 62 20'
          className={cn(styles.stitch, styles.drawSlow)}
          style={{ "--sc-dash": "170", "--sc-delay": "0.4s" } as CSSProperties}
        />
        <path d='M102 262h188' className={styles.hairline} />
        <path d='M102 276h120' className={styles.hairline} />
      </g>

      <g transform='translate(366 226)'>
        {[0, 1, 2].map((index) => (
          <rect
            key={index}
            x={-52 + index * 6}
            y={34 - index * 26}
            width='104'
            height='26'
            rx='5'
            className={cn(styles.outlined, styles.garment)}
            style={garmentStyle(
              ["var(--cc-primary)", "var(--cc-accent)", "var(--cc-success)"][
                index
              ],
            )}
          />
        ))}
        <path d='M-44 38h88' className={styles.stitch} />
        <path d='M-44 64h88' className={styles.stitch} />
      </g>

      <g transform='translate(352 128) rotate(16)'>
        <path d='M0 0l62 42M0 42l62-42' className={styles.inkLine} />
        <circle cx='-7' cy='0' r='8' className={styles.line} />
        <circle cx='-7' cy='42' r='8' className={styles.line} />
      </g>

      <g transform='translate(430 130)'>
        <rect
          x='-20'
          y='-30'
          width='40'
          height='60'
          rx='7'
          className={cn(styles.brandSoft, styles.outlined)}
        />
        <path d='M-20-16h40M-20 16h40' className={styles.brandLine} />
        <path d='M20 0c34-8 46 34 8 54' className={styles.brandStitch} />
      </g>

      <g className={styles.line}>
        <rect x='54' y='312' width='196' height='18' rx='2' />
        {Array.from({ length: 14 }).map((_, index) => (
          <path
            key={index}
            d={`M${62 + index * 14} 312v${index % 2 === 0 ? 8 : 4}`}
          />
        ))}
      </g>
      <Sparkle
        transform='translate(322 78) scale(0.55)'
        className={styles.accent}
      />
      <Sparkle
        transform='translate(76 180) scale(0.4)'
        className={styles.brand}
      />
    </svg>
  );
}


export function LookbookScene({
  scene,
  colors,
  className,
}: {
  scene: "layered" | "stack" | "tray";
  colors: string[];
  className?: string;
}) {
  const patternId = `look-${useId().replace(/:/g, "")}`;

  return (
    <svg
      viewBox='0 0 260 320'
      className={cn(styles.art, className)}
      aria-hidden='true'
      focusable='false'
    >
      <defs>
        <DotPattern id={patternId} size={16} />
      </defs>
      <rect width='260' height='320' className={styles.muted} />
      <rect width='260' height='320' fill={`url(#${patternId})`} />
      <path
        d='M22 300V190a108 108 0 0 1 216 0v110'
        className={styles.brandFaint}
      />

      {scene === "layered" ? (
        <>
          <g transform='translate(6 58) scale(0.62)'>
            <g
              style={garmentStyle(colors[0] ?? "var(--cc-primary)")}
              className={styles.hang}
            >
              <Coat />
            </g>
          </g>
          <g transform='translate(104 96) scale(0.5)'>
            <g
              style={garmentStyle(colors[1] ?? "var(--cc-accent)")}
              className={styles.hangSlow}
            >
              <Dress />
            </g>
          </g>
          <g transform='translate(148 158) scale(0.4)'>
            <g
              style={garmentStyle(colors[2] ?? "var(--cc-surface-foreground)")}
              className={styles.float}
            >
              <Tote />
            </g>
          </g>
        </>
      ) : null}

      {scene === "stack" ? (
        <g>
          {[0, 1, 2].map((index) => (
            <g key={index} transform={`translate(40 ${78 + index * 50})`}>
              <rect
                width='180'
                height='40'
                rx='6'
                className={cn(styles.outlined, styles.garment)}
                style={garmentStyle(colors[index] ?? "var(--cc-primary)")}
              />
              <path d='M66 0l24 10 24-10' className={styles.line} />
              <path d='M16 30h148' className={styles.stitch} />
              <circle cx='166' cy='20' r='2.2' className={styles.ink} />
            </g>
          ))}
          <path d='M58 228h144' className={styles.brandStitch} />
        </g>
      ) : null}

      {scene === "tray" ? (
        <>
          <g
            transform='translate(18 42) scale(0.52)'
            style={garmentStyle(colors[0] ?? "var(--cc-primary)")}
            className={styles.floatSlow}
          >
            <Tote />
          </g>
          <g
            transform='translate(128 116) scale(0.44)'
            style={garmentStyle(colors[1] ?? "var(--cc-surface-foreground)")}
          >
            <Watch />
          </g>
        </>
      ) : null}

      <path d='M30 292h200' className={styles.stitch} />
      <Sparkle
        transform='translate(214 52) scale(0.55)'
        className={styles.accent}
      />
    </svg>
  );
}

export function CategoryTileArt({
  category,
  className,
}: {
  category: ShopCategory;
  className?: string;
}) {
  const patternId = `cat-${useId().replace(/:/g, "")}`;

  return (
    <svg
      viewBox='0 0 260 150'
      className={cn(styles.art, className)}
      aria-hidden='true'
      focusable='false'
    >
      <defs>
        <DotPattern id={patternId} size={14} />
      </defs>
      <rect width='260' height='150' className={styles.muted} />
      <rect width='260' height='150' fill={`url(#${patternId})`} />
      <path d='M18 142V92a54 54 0 0 1 108 0v50' className={styles.brandFaint} />
      <rect
        x='140'
        y='24'
        width='104'
        height='104'
        rx='52'
        className={styles.surface}
        opacity={0.45}
      />

      {category === "women" ? (
        <g transform='translate(66 8) scale(0.52)'>
          <g style={garmentStyle("var(--cc-primary)")} className={styles.hangSlow}>
            <Dress />
          </g>
        </g>
      ) : null}
      {category === "men" ? (
        <g transform='translate(66 8) scale(0.52)'>
          <g style={garmentStyle("var(--cc-accent)")} className={styles.hangSlow}>
            <Hoodie />
          </g>
        </g>
      ) : null}
      {category === "accessories" ? (
        <>
          <g transform='translate(18 22) scale(0.44)'>
            <g style={garmentStyle("var(--cc-primary)")} className={styles.float}>
              <Tote />
            </g>
          </g>
          <g
            transform='translate(136 34) scale(0.34)'
            style={garmentStyle("var(--cc-surface-foreground)")}
          >
            <Watch />
          </g>
        </>
      ) : null}

      <Sparkle
        transform='translate(222 116) scale(0.5)'
        className={styles.warning}
      />
    </svg>
  );
}


export function ServiceArt({
  variant,
  className,
}: {
  variant: "truck" | "return" | "support";
  className?: string;
}) {
  return (
    <svg
      viewBox='0 0 200 110'
      className={cn(styles.art, className)}
      aria-hidden='true'
      focusable='false'
    >
      <rect width='200' height='110' rx='8' className={styles.brandFaint} />

      {variant === "truck" ? (
        <>
          <path
            d='M30 72V46h78v26z'
            className={cn(styles.surface, styles.outlined)}
          />
          <path
            d='M108 72V54h24l14 12v6z'
            className={cn(styles.brandSoft, styles.outlined)}
          />
          <circle cx='58' cy='80' r='9' className={styles.ink} />
          <circle cx='130' cy='80' r='9' className={styles.ink} />
          <path d='M16 46h12M8 56h16M14 66h10' className={styles.brandLine} />
          <path d='M126 58h8l8 8h-16z' className={styles.surface} />
          <Sparkle
            transform='translate(166 28) scale(0.4)'
            className={styles.accent}
          />
        </>
      ) : null}

      {variant === "return" ? (
        <>
          <g
            className={styles.drawSlow}
            style={{ "--sc-dash": "220" } as CSSProperties}
          >
            <path
              d='M64 32a34 34 0 1 0 22 60'
              className={styles.brandLine}
              fill='none'
            />
            <path d='M64 32l-4 14 14-4' className={styles.brandLine} />
          </g>
          <rect
            x='108'
            y='52'
            width='44'
            height='34'
            rx='4'
            className={cn(styles.surface, styles.outlined)}
          />
          <path d='M108 64h44' className={styles.stitch} />
          <path d='M130 52v12' className={styles.hairline} />
          <Sparkle
            transform='translate(158 30) scale(0.4)'
            className={styles.accent}
          />
        </>
      ) : null}

      {variant === "support" ? (
        <>
          <path
            d='M66 72V62a34 34 0 0 1 68 0v10'
            className={styles.inkLine}
            fill='none'
          />
          <rect
            x='58'
            y='66'
            width='14'
            height='24'
            rx='6'
            className={cn(styles.brand, styles.outlined)}
          />
          <rect
            x='128'
            y='66'
            width='14'
            height='24'
            rx='6'
            className={cn(styles.brand, styles.outlined)}
          />
          <path d='M135 88q-8 10-22 8' className={styles.inkLine} />
          <circle cx='110' cy='96' r='4' className={styles.brand} />
          <g className={styles.pulse}>
            <path
              d='M150 56q8 8 0 20M158 48q14 14 0 32'
              className={styles.brandLine}
            />
          </g>
        </>
      ) : null}
    </svg>
  );
}

