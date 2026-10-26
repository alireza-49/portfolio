"use client";

import { useId, type ComponentProps } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Phill — the studio mascot: the elephant at the small laptop on its desk,
 * head tilted toward the screen it is reading, pupils down toward it and the
 * trunk reaching onto the keys. The laptop faces away from the camera so the
 * elephant — not the visitor — is the one reading the screen: what we see is
 * the back of its lid, carrying the three-dot studio mark. A warm screen glow
 * still spills onto its cheek and the trunk's screen-facing edge. Static by
 * default; hovering (or keyboard-focusing) the button that wraps it makes the
 * trunk sway — see `.logo-live` in globals.css. Pivots stay in the 512 u
 * view-box.
 */
const Logo = ({ className }: { className?: string }) => {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const gid = (name: string) => `${uid}-${name}`;

  return (
    <svg
      viewBox="0 0 512 512"
      fill="none"
      aria-hidden="true"
      data-slot="phill-logo"
      className={cn("block size-full", className)}
    >
    <defs>
        <linearGradient id={gid("skin")} x1="150" y1="40" x2="330" y2="470" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#aac1cd"/>
          <stop offset="0.45" stopColor="#8aa3b2"/>
          <stop offset="1" stopColor="#6b8898"/>
        </linearGradient>
        <linearGradient id={gid("earin")} x1="40" y1="90" x2="160" y2="320" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#eebaa8"/>
          <stop offset="1" stopColor="#d78d79"/>
        </linearGradient>
        <linearGradient id={gid("tusk")} x1="200" y1="290" x2="220" y2="370" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fdf7e8"/>
          <stop offset="1" stopColor="#e4d5b7"/>
        </linearGradient>
        <linearGradient id={gid("deck")} x1="256" y1="432" x2="256" y2="500" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#fdf9ee"/>
        <stop offset="1" stopColor="#f3ecdb"/>
      </linearGradient>
      <linearGradient id={gid("lidback")} x1="0.1" y1="0" x2="0.75" y2="1">
        <stop offset="0" stopColor="#faf3e4"/>
        <stop offset="0.55" stopColor="#ece1ca"/>
        <stop offset="1" stopColor="#d8caae"/>
      </linearGradient>
      <linearGradient id={gid("base")} x1="256" y1="486" x2="256" y2="506" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#f4efe2"/>
          <stop offset="1" stopColor="#d3c9b2"/>
        </linearGradient>
        <linearGradient id={gid("headLight")} x1="256" y1="60" x2="256" y2="350" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#e6d9cc" stopOpacity="0"/>
          <stop offset="1" stopColor="#4f6b7a" stopOpacity="0.14"/>
        </linearGradient>
        <radialGradient id={gid("screenglow")} cx="308" cy="352" r="150" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#ffe7ae" stopOpacity="0.5"/>
          <stop offset="0.6" stopColor="#ffdc97" stopOpacity="0.18"/>
          <stop offset="1" stopColor="#ffdc97" stopOpacity="0"/>
        </radialGradient>
      </defs>

      <g stroke="#1f2e38" strokeLinejoin="round" strokeLinecap="round">

        <path d="M 146 298 C 128 330 116 396 113 512 L 399 512 C 396 396 384 330 366 298 C 338 326 300 337 256 337 C 212 337 174 326 146 298 Z" fill={`url(#${gid("skin")})`} strokeWidth="14"/>
        <path d="M 150 366 C 143 404 140 458 143 512" strokeWidth="8" opacity="0.22"/>
        <path d="M 362 366 C 369 404 372 458 369 512" strokeWidth="8" opacity="0.22"/>
        <path d="M 164 400 C 158 440 157 480 158 512" strokeWidth="5" opacity="0.12"/>
        <path d="M 348 400 C 354 440 355 480 354 512" strokeWidth="5" opacity="0.12"/>

        <g transform="rotate(9 256 250)">

        <g className="el-ear el-ear--l">
          <path d="M 198 172 C 190 128 172 94 142 72 C 110 49 68 57 44 90 C 19 124 18 176 33 221 C 50 272 82 320 122 344 C 156 364 190 344 200 306 C 205 285 203 218 198 172 Z" fill={`url(#${gid("skin")})`} strokeWidth="14"/>
          <path d="M 188 184 C 180 144 164 114 140 96 C 114 77 83 84 66 110 C 47 138 47 180 60 217 C 74 257 101 297 132 318 C 156 334 180 319 189 292 C 194 273 192 220 188 184 Z" fill={`url(#${gid("earin")})`}/>
          <path d="M 174 220 C 140 204 104 190 66 186" strokeWidth="5" opacity="0.13"/>
          <path d="M 180 258 C 148 250 112 248 76 254" strokeWidth="5" opacity="0.12"/>
          <path d="M 186 296 C 154 298 118 306 88 320" strokeWidth="5" opacity="0.12"/>
          <path d="M 176 148 C 154 128 128 112 100 104" strokeWidth="5" opacity="0.1"/>
        </g>
        <g className="el-ear el-ear--r" transform="translate(512 0) scale(-1 1) translate(16 -8) scale(0.92)">
          <path d="M 198 172 C 190 128 172 94 142 72 C 110 49 68 57 44 90 C 19 124 18 176 33 221 C 50 272 82 320 122 344 C 156 364 190 344 200 306 C 205 285 203 218 198 172 Z" fill={`url(#${gid("skin")})`} strokeWidth="14"/>
          <path d="M 188 184 C 180 144 164 114 140 96 C 114 77 83 84 66 110 C 47 138 47 180 60 217 C 74 257 101 297 132 318 C 156 334 180 319 189 292 C 194 273 192 220 188 184 Z" fill={`url(#${gid("earin")})`}/>
          <path d="M 174 220 C 140 204 104 190 66 186" strokeWidth="5" opacity="0.13"/>
          <path d="M 180 258 C 148 250 112 248 76 254" strokeWidth="5" opacity="0.12"/>
          <path d="M 186 296 C 154 298 118 306 88 320" strokeWidth="5" opacity="0.12"/>
          <path d="M 176 148 C 154 128 128 112 100 104" strokeWidth="5" opacity="0.1"/>
        </g>

        <g transform="translate(256 208) scale(1.09 0.87) translate(-256 -208)">

        <path d="M 256 54 C 306 54 340 88 346 140 C 352 196 346 254 332 294 C 320 330 292 352 256 352 C 220 352 192 330 180 294 C 166 254 160 196 166 140 C 172 88 206 54 256 54 Z" fill={`url(#${gid("skin")})`} strokeWidth="15"/>
        <path d="M 256 54 C 306 54 340 88 346 140 C 352 196 346 254 332 294 C 320 330 292 352 256 352 C 220 352 192 330 180 294 C 166 254 160 196 166 140 C 172 88 206 54 256 54 Z" fill={`url(#${gid("headLight")})`}/>


        <path d="M 216 92 C 230 78 246 78 256 94 C 266 78 282 78 296 92" strokeWidth="7" opacity="0.18"/>
        <path d="M 256 102 C 255 114 255 124 256 132" strokeWidth="5" opacity="0.12"/>
        <path d="M 196 232 C 193 258 199 282 212 300" strokeWidth="7" opacity="0.16"/>
        <path d="M 316 232 C 319 258 313 282 300 300" strokeWidth="7" opacity="0.16"/>
        <path d="M 240 300 C 248 308 252 316 252 324" strokeWidth="5" opacity="0.1"/>
        <path d="M 272 300 C 264 308 260 316 260 324" strokeWidth="5" opacity="0.1"/>


        <path d="M 206 238 C 206 268 218 292 236 302 C 224 306 208 300 198 286 C 190 274 188 254 192 238 Z" fill="#5d7a89" stroke="none" opacity="0.13"/>
        <path d="M 306 238 C 306 268 294 292 276 302 C 288 306 304 300 314 286 C 322 274 324 254 320 238 Z" fill="#5d7a89" stroke="none" opacity="0.13"/>


        <path d="M 198 186 C 208 170 230 168 242 180" strokeWidth="12"/>
        <path d="M 314 186 C 304 170 282 168 270 180" strokeWidth="12"/>
        <g className="el-eye el-eye--l">
          <ellipse cx="230" cy="212" rx="12.5" ry="15" fill="#1f2e38"/>
          <ellipse cx="233.4" cy="214.6" rx="3.2" ry="3.2" fill="#fdf8ef" stroke="none"/>
          <path d="M 212 215 C 217 220 231 220 236 215" strokeWidth="5.5" opacity="0.42"/>
          <path d="M 211 188.5 C 216 188.8 232 188.8 236 190.1 L 236 194.2 C 232 195.8 216 195.8 211 194.2 Z" fill={`url(#${gid("skin")})`} stroke="none"/>
          <path d="M 212 192.4 C 216 195.5 232 195.5 236 194.0" strokeWidth="1.6" opacity="0.5" fill="none"/>
        </g>
        <g className="el-eye el-eye--r">
          <ellipse cx="294" cy="212" rx="12.5" ry="15" fill="#1f2e38"/>
          <ellipse cx="297.4" cy="214.6" rx="3.2" ry="3.2" fill="#fdf8ef" stroke="none"/>
          <path d="M 276 215 C 281 220 295 220 300 215" strokeWidth="5.5" opacity="0.42"/>
          <path d="M 276 188.5 C 281 188.8 297 188.8 302 190.1 L 302 194.2 C 297 195.8 281 195.8 276 194.2 Z" fill={`url(#${gid("skin")})`} stroke="none"/>
          <path d="M 276 192.4 C 280 195.5 296 195.5 300 194.0" strokeWidth="1.6" opacity="0.5" fill="none"/>
        </g>


        </g>



        <g transform="translate(-2 -11) translate(236 292) scale(1.05 1.18) translate(-236 -292)">
          <path d="M 236 292 C 218 304 200 326 190 350 C 187 358 196 363 203 357 C 217 344 234 322 247 302 C 244 296 240 293 236 292 Z" fill={`url(#${gid("tusk")})`} strokeWidth="9"/>
          <path d="M 276 292 C 294 304 312 326 322 350 C 325 358 316 363 309 357 C 295 344 278 322 265 302 C 268 296 272 293 276 292 Z" fill={`url(#${gid("tusk")})`} strokeWidth="9"/>
        </g>

        </g>


        <ellipse cx="306" cy="336" rx="62" ry="46" fill={`url(#${gid("screenglow")})`} stroke="none"/>


        <path d="M 232 322 C 256 330 280 330 300 320 L 300 344 C 280 352 240 352 220 344 Z" fill="#ffe7ae" opacity="0.22" stroke="none"/>


        <g transform="translate(378 426) rotate(15) scale(0.93)">
          <ellipse cx="0" cy="86" rx="104" ry="15" fill="#1f2e38" opacity="0.1" stroke="none"/>
          <g transform="translate(0 -12) scale(1.4)">
          <path d="M -62 -86 L 62 -86 Q 68 -86 69 -80 L 78 -4 L -78 -4 L -69 -80 Q -68 -86 -62 -86 Z" fill="#2e444f" strokeWidth="10"/>
          <path d="M -54 -78 L 54 -78 L 61 -12 L -61 -12 Z" fill={`url(#${gid("lidback")})`} stroke="none"/>
          <path d="M -54 -78 L 30 -78 C 2 -52 -32 -40 -54 -30 Z" fill="#fffdf6" stroke="none" opacity="0.35"/>
          <g transform="translate(10 -44) rotate(-10)" stroke="none">
            <circle cx="-5.4" cy="1.6" r="7.2" fill="#e76f51" opacity="0.92"/>
            <circle cx="5.4" cy="1.6" r="7.2" fill="#e9c46a" opacity="0.92"/>
            <circle cx="0" cy="-5.4" r="7.2" fill="#5d7a89" opacity="0.9"/>
          </g>
          </g>
          <path d="M -74 -2 L 74 -2" stroke="#1f2e38" strokeWidth="5" opacity="0.35" strokeLinecap="round"/>
          <path d="M -78 -4 L 78 -4 L 92 58 Q 94 64 88 64 L -88 64 Q -94 64 -92 58 Z" fill={`url(#${gid("deck")})`} strokeWidth="10"/>
          <g stroke="none">
            <path d="M -76 4 L -50 4 L -51 13 L -77 13 Z" fill="#2e444f"/>
            <path d="M -44 4 L -18 4 L -18.4 13 L -44.4 13 Z" fill="#2e444f"/>
            <path d="M -12 4 L 14 4 L 14 13 L -12 13 Z" fill="#2e444f"/>
            <path d="M 20 4 L 46 4 L 46.4 13 L 20.4 13 Z" fill="#2e444f"/>
            <path d="M 52 4 L 78 4 L 78.4 13 L 52.4 13 Z" fill="#2e444f"/>
            <path d="M -80 20 L -52 20 L -53 29 L -81 29 Z" fill="#2e444f"/>
            <path d="M -46 20 L -18 20 L -18.4 29 L -46.4 29 Z" fill="#2e444f"/>
            <path d="M -12 20 L 16 20 L 16 29 L -12 29 Z" fill="#2e444f"/>
            <path d="M 22 20 L 50 20 L 50.4 29 L 22.4 29 Z" fill="#2e444f"/>
            <path d="M 56 20 L 84 20 L 84.4 29 L 56.4 29 Z" fill="#2e444f"/>
            <path d="M -82 36 L -54 36 L -55 45 L -83 45 Z" fill="#2e444f"/>
            <path d="M -48 36 L -20 36 L -20.4 45 L -48.4 45 Z" fill="#2e444f"/>
            <path d="M -14 36 L 14 36 L 14 45 L -14 45 Z" fill="#2e444f"/>
            <path d="M 20 36 L 48 36 L 48.4 45 L 20.4 45 Z" fill="#2e444f"/>
            <path d="M 54 36 L 82 36 L 82.4 45 L 54.4 45 Z" fill="#2e444f"/>
            <path d="M -22 52 L 22 52 L 23 61 L -23 61 Z" fill="#2e444f"/>
          </g>
          <path d="M -88 64 L 88 64 L 92 72 Q 93 77 87 77 L -87 77 Q -93 77 -92 72 Z" fill={`url(#${gid("base")})`} strokeWidth="8"/>
        </g>


        <g transform="translate(256 208) scale(1.09 0.87) translate(-256 -208)">
        <g transform="translate(224 236) rotate(-5) scale(1.04) translate(-224 -236)">
        <g className="el-trunk">
          <path d="M 224 234 C 221 274 224 312 233 346 C 242 380 258 412 280 436 C 296 453 316 460 328 450 C 338 442 334 428 322 424 C 310 420 302 406 296 390 C 288 368 283 340 282 310 C 281 280 286 256 290 234 C 282 228 268 226 256 226 C 244 226 232 228 224 234 Z" fill={`url(#${gid("skin")})`} strokeWidth="15"/>
          <path d="M 236 248 C 233 298 238 342 250 378 C 262 412 282 438 304 448" stroke="#aac1cd" strokeWidth="9" opacity="0.26" fill="none"/>
          <path d="M 276 250 C 279 300 278 342 286 380 C 292 406 304 426 316 436" stroke="#5d7a89" strokeWidth="8" opacity="0.18" fill="none"/>
          <g fill="none" strokeWidth="6" opacity="0.2">
            <path d="M 225 270 C 245 276 270 275 289 266"/>
            <path d="M 228 300 C 248 306 272 304 287 294"/>
            <path d="M 234 332 C 252 336 274 332 286 324"/>
            <path d="M 241 362 C 258 366 278 360 289 352"/>
            <path d="M 251 392 C 266 396 284 388 295 380"/>
            <path d="M 263 420 C 277 422 293 412 305 406"/>
          </g>
          <path d="M 312 446 C 320 448 326 444 327 438" strokeWidth="6" opacity="0.26" fill="none"/>
          <path d="M 278 252 C 281 300 280 342 288 378 C 294 404 306 424 318 434" stroke="#ffe7ae" strokeWidth="7" opacity="0.22" fill="none"/>
        </g>
        </g>
        </g>
      </g>



    </svg>
  );
};

type LogoButtonProps = ComponentProps<typeof Button> & {
  logoClassName?: string;
  animated?: boolean;
};

/**
 * `animated` keeps the old call sites working: it only turns the hover sway on,
 * never an idle loop.
 */
export const LogoButton = ({
  className,
  logoClassName,
  variant = "ghost",
  size = "default",
  animated = true,
  ...props
}: LogoButtonProps) => (
  <span className="group/logo relative inline-flex">
    <Button
      size={size}
      variant={variant}
      className={cn(
        "h-auto w-auto rounded-[1.75rem] p-0",
        "hover:bg-transparent aria-expanded:bg-transparent",
        "before:z-10",
        "duration-300 ease-out hover:scale-110 motion-reduce:hover:scale-100",
        animated && "logo-live",
        className,
      )}
      {...props}
    >
      <Logo className={cn("size-12", logoClassName)} />
    </Button>
  </span>
);

export { Logo };
export default Logo;
