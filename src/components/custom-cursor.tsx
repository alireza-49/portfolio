"use client";

import { useEffect, useRef } from "react";

type CustomCursorProps = {
  /** Hide the OS cursor with a global `cursor: none` stylesheet. */
  hideNativeCursor?: boolean;
  /** Emit the sprinkle particles while the pointer is moving. */
  sprinkles?: boolean;
};

const MAX_PARTICLES = 90;

/** Cold accents pulled from the design system. */
const PARTICLE_COLORS = ["#e76f51", "#2a9d8f", "#e9c46a", "#2b2d42", "#264653"];

/** Sprinkle lifecycle — faster pointer movement means a denser trail. */
const MAX_SPEED = 3; // px per ms at which the ring is fully stretched
const EMIT_THRESHOLD = 0.05; // normalized speed below which nothing is emitted
const RING_SIZE = 34;
const DOT_SIZE = 7;
const DOT_COLOR = "#e76f51"; // --color-coral
/** Resting ring ink. */
const RING_INK = "#2b2d42";

/**
 * Hover feedback: over anything clickable (or anything that reacts to hover)
 * the trailing ring collapses and the dot swells, both landing on one rounded
 * coral square. Its size sits between the resting dot and the resting ring, so
 * neither shape has to jump.
 */
const HOVER_SIZE = 22;
const HOVER_RADIUS = "5px";
const HOVER_FILL = DOT_COLOR;
const HOVER_HALO = `color-mix(in srgb, ${DOT_COLOR} 18%, transparent)`;

/**
 * Anything under the pointer that reads as "this responds to you". Buttons and
 * links are covered by their tags; cards and buttons on this site carry
 * `.craft-card` / `.craft-btn`, and everything else that opted into a pointer
 * cursor gets `.cursor-pointer`. `data-cursor='hover'` is the escape hatch for
 * a hover effect that is none of the above.
 */
const HOVER_SELECTOR = [
  "a[href]",
  "button",
  "summary",
  "label",
  "select",
  "input[type='submit']",
  "input[type='button']",
  "input[type='reset']",
  "input[type='checkbox']",
  "input[type='radio']",
  "input[type='range']",
  "[role='button']",
  "[role='link']",
  "[role='tab']",
  "[role='menuitem']",
  "[role='option']",
  ".cursor-pointer",
  ".craft-card",
  ".craft-btn",
  "[data-cursor='hover']",
].join(",");

/** Ring elongation at full speed, along the direction of travel. */
const STRETCH_LENGTH = 1.4;
/** Extra size added uniformly while stretched, so the ring keeps its mass. */
const STRETCH_SWELL = 0.22;
/** Cross-axis squash at full speed. */
const STRETCH_SQUASH = 0.45;

/**
 * The frame loop parks itself once everything has settled. These two constants
 * decide when: the ring is within a sub-pixel of the pointer and the stretch
 * has decayed to nothing.
 */
const REST_DISTANCE = 0.25; // px between the ring and the pointer
const REST_STRETCH = 0.004;

/**
 * Hiding the OS cursor is global (`cursor: none`) on purpose: it keeps every
 * child selector in the app out of the way, so components can use arbitrary
 * cursor utilities without fighting the overlay. Text fields opt back in
 * below, otherwise inserting a caret becomes guesswork.
 */
const NATIVE_CURSOR_CSS = `
  html, body, *, *::before, *::after { cursor: none !important; }
  html input,
  html textarea,
  html select,
  html [contenteditable='true'],
  html [contenteditable=''] { cursor: text !important; }
`;

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  maxLife: number;
  color: string;
  square: boolean;
  rot: number;
  spin: number;
};

type Rect = { x0: number; y0: number; x1: number; y1: number };

/**
 * Pointer overlay: a dot pinned to the pointer, a ring that trails it and a
 * short ink trail.
 *
 * The whole overlay is driven by the pointer, so it stays asleep until the
 * pointer moves and goes back to sleep as soon as the ring has caught up and
 * the last particle has died. A permanent 60 fps loop would repaint the
 * viewport for as long as the page is open — during hydration, while scrolling
 * and on an idle tab — which is exactly what makes the cursor feel heavy on a
 * loaded page. Nothing is allocated at all until a fine pointer actually moves,
 * and the trail canvas only clears the rectangle it drew into instead of the
 * whole screen.
 */
export function CustomCursor({
  hideNativeCursor = true,
  sprinkles = true,
}: CustomCursorProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const shadowRef = useRef<ShadowRoot | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!container || !dot || !ring) return;

    const finePointer = window.matchMedia("(pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    let enabled = finePointer.matches;
    let still = reducedMotion.matches;

    container.style.display = enabled ? "" : "none";

    // ---- pointer state ---------------------------------------------------
    const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ringPos = { x: pointer.x, y: pointer.y };
    let hasPointer = false;
    let lastMoveAt = 0;
    let speed = 0; // smoothed px / ms
    let moveAngle = 0; // raw direction of travel, radians
    let angle = 0; // smoothed render angle
    let stretch = 0; // smoothed 0..1
    let emitAccumulator = 0;

    // ---- hover state -----------------------------------------------------
    let hovered = false;
    /** Element target of the last pointermove, so `closest` runs only on change. */
    let hoverProbe: EventTarget | null = null;

    /**
     * The morph itself is a CSS transition on the ring (see the JSX style), so
     * it keeps animating even after the frame loop parks.
     */
    const applyHover = (next: boolean) => {
      if (!dot || !ring || next === hovered) return;
      hovered = next;

      // Ring: 34px circle -> 22px rounded square, same coral as the dot, so the
      // two shapes meet as one.
      ring.style.width = `${next ? HOVER_SIZE : RING_SIZE}px`;
      ring.style.height = `${next ? HOVER_SIZE : RING_SIZE}px`;
      ring.style.borderRadius = next ? HOVER_RADIUS : "50%";
      ring.style.backgroundColor = next ? HOVER_FILL : "transparent";
      ring.style.borderColor = next ? HOVER_FILL : RING_INK;
      ring.style.boxShadow = next ? `0 0 0 3px ${HOVER_HALO}` : "none";

      // Dot: 7px coral dot -> the same 22px rounded square, so it grows into
      // the ring's new footprint and takes over the shape.
      dot.style.width = `${next ? HOVER_SIZE : DOT_SIZE}px`;
      dot.style.height = `${next ? HOVER_SIZE : DOT_SIZE}px`;
      dot.style.borderRadius = next ? HOVER_RADIUS : "50%";
      dot.style.backgroundColor = next ? HOVER_FILL : DOT_COLOR;
    };

    // ---- canvas (created on the first real pointer move) ------------------
    let canvas: HTMLCanvasElement | null = null;
    let ctx: CanvasRenderingContext2D | null = null;
    let width = 0;
    let height = 0;
    /** Region painted by the previous frame, so we can erase just that much. */
    let dirty: Rect | null = null;

    const resizeCanvas = () => {
      if (!canvas || !ctx) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dirty = null;
    };

    const ensureCanvas = () => {
      if (ctx) return true;

      /**
       * The trail canvas lives in a closed shadow root instead of the page's
       * light DOM. Swarm Rebuild (a Chrome extension) hides every `html body *`,
       * screenshots the viewport and rebuilds from that shot whenever it finds a
       * visible `<canvas>` — this decorative overlay made it take that path, and
       * the resulting crop of the canvas blanketed the rebuild, leaving only the
       * header. Document-wide scans for page media now miss it; the slot keeps
       * the ring and dot (React's children) painted above the trail.
       */
      if (!shadowRef.current) {
        shadowRef.current = container.attachShadow({ mode: "closed" });
      }
      const shadow = shadowRef.current;
      const nextCanvas = document.createElement("canvas");
      nextCanvas.style.cssText =
        "position:absolute;left:0;top:0;display:block";
      shadow.replaceChildren(nextCanvas, document.createElement("slot"));

      const context = nextCanvas.getContext("2d");
      if (!context) return false;

      canvas = nextCanvas;
      ctx = context;
      resizeCanvas();
      return true;
    };

    const clearDirty = () => {
      if (!dirty || !ctx) return;
      ctx.clearRect(
        dirty.x0,
        dirty.y0,
        dirty.x1 - dirty.x0,
        dirty.y1 - dirty.y0,
      );
      dirty = null;
    };

    // ---- particles -------------------------------------------------------
    const particles: Particle[] = [];

    const pickColor = () =>
      PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)] ??
      "#e76f51";

    const emit = (count: number, intensity: number) => {
      const dirX = Math.cos(moveAngle);
      const dirY = Math.sin(moveAngle);

      for (let i = 0; i < count; i++) {
        if (particles.length >= MAX_PARTICLES) return;

        const spread = Math.random() * Math.PI * 2;
        const push = (0.45 + Math.random() * 1.9) * (0.65 + intensity);
        const back = 0.3 + Math.random() * 1;

        particles.push({
          x: pointer.x + (Math.random() - 0.5) * 14,
          y: pointer.y + (Math.random() - 0.5) * 14,
          vx: Math.cos(spread) * push - dirX * back,
          vy: Math.sin(spread) * push - dirY * back,
          size: 2 + Math.random() * 3.6,
          life: 0,
          maxLife: 700 + Math.random() * 900,
          color: pickColor(),
          square: Math.random() > 0.55,
          rot: Math.random() * Math.PI,
          spin: (Math.random() - 0.5) * 0.03,
        });
      }
    };

    // ---- render loop -----------------------------------------------------
    let raf = 0;
    let running = false;
    let lastFrame = 0;

    /** Paint one frame; returns true while there is still something to move. */
    const paint = (now: number): boolean => {
      const dt = Math.min(now - lastFrame, 48);
      lastFrame = now;
      const step = dt / 16.667;

      // let the velocity bleed off when the pointer stops moving
      speed *= Math.exp(-dt / 110);

      // Ring easing toward the pointer. Over a hover target it is pinned
      // outright: the dot has already grown into the same square, so any lag
      // would show a second, offset square shadowing the pointer.
      if (hovered) {
        ringPos.x = pointer.x;
        ringPos.y = pointer.y;
      } else {
        const follow = 1 - Math.pow(1 - 0.3, step);
        ringPos.x += (pointer.x - ringPos.x) * follow;
        ringPos.y += (pointer.y - ringPos.y) * follow;
      }

      // stretch easing — a hovered pointer keeps one square shape
      const targetStretch =
        still || hovered ? 0 : Math.min(speed / MAX_SPEED, 1);
      stretch += (targetStretch - stretch) * (1 - Math.pow(1 - 0.22, step));

      // angle easing along the shortest path
      if (speed > 0.08) {
        let diff = moveAngle - angle;
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        angle += diff * (1 - Math.pow(1 - 0.25, step));
      }

      // ring: elongated along the direction of travel, thinned across it.
      //
      // `rotate(angle) scale(along, across)` would also rotate the ring's own
      // box and its border, so instead the anisotropic scale is baked into the
      // travel frame:  R(angle) · S(along, across) · R(-angle).
      const alongScale =
        (1 + stretch * STRETCH_LENGTH) * (1 + stretch * STRETCH_SWELL);
      const acrossScale =
        (1 - stretch * STRETCH_SQUASH) * (1 + stretch * STRETCH_SWELL);

      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      // m12 === m21, so one value covers both
      const cross = (alongScale - acrossScale) * cos * sin;
      const m11 = alongScale * cos * cos + acrossScale * sin * sin;
      const m22 = alongScale * sin * sin + acrossScale * cos * cos;

      ring.style.transform =
        `translate3d(${ringPos.x}px, ${ringPos.y}px, 0) translate(-50%, -50%) ` +
        `matrix(${m11}, ${cross}, ${cross}, ${m22}, 0, 0)`;

      // emission
      if (sprinkles && !still && hasPointer) {
        const intensity = Math.min(speed / MAX_SPEED, 1);
        if (intensity > EMIT_THRESHOLD) {
          emitAccumulator += (0.25 + intensity * 3.2) * step;
          const count = Math.floor(emitAccumulator);
          if (count > 0) {
            emitAccumulator -= count;
            emit(count, intensity);
          }
        } else {
          emitAccumulator = 0;
        }
      }

      // draw: erase the previous frame's rectangle, then paint the particles
      if (ctx) {
        clearDirty();

        let x0 = Infinity;
        let y0 = Infinity;
        let x1 = -Infinity;
        let y1 = -Infinity;

        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.life += dt;

          if (p.life >= p.maxLife) {
            particles.splice(i, 1);
            continue;
          }

          const t = p.life / p.maxLife;
          const drag = Math.pow(0.92, step);

          p.vx *= drag;
          p.vy *= drag;
          p.vy += 0.03 * step;
          p.x += p.vx * step;
          p.y += p.vy * step;
          p.rot += p.spin * step;

          const alpha = Math.pow(1 - t, 1.6);
          const size = p.size * (1 - t * 0.4);

          ctx.globalAlpha = alpha;
          ctx.fillStyle = p.color;

          if (p.square) {
            ctx.beginPath();
            const half = size / 2;
            const c = Math.cos(p.rot);
            const s = Math.sin(p.rot);
            ctx.moveTo(p.x + c * -half - s * -half, p.y + s * -half + c * -half);
            ctx.lineTo(p.x + c * half - s * -half, p.y + s * half + c * -half);
            ctx.lineTo(p.x + c * half - s * half, p.y + s * half + c * half);
            ctx.lineTo(p.x + c * -half - s * half, p.y + s * -half + c * half);
            ctx.closePath();
            ctx.fill();
          } else {
            ctx.beginPath();
            ctx.arc(p.x, p.y, size / 2, 0, Math.PI * 2);
            ctx.fill();
          }

          if (p.x - size < x0) x0 = p.x - size;
          if (p.y - size < y0) y0 = p.y - size;
          if (p.x + size > x1) x1 = p.x + size;
          if (p.y + size > y1) y1 = p.y + size;
        }

        ctx.globalAlpha = 1;

        if (x1 > x0) {
          // pad by a pixel so antialiased edges never leave residue
          dirty = { x0: x0 - 1, y0: y0 - 1, x1: x1 + 1, y1: y1 + 1 };
        }
      }

      // Park the loop once the ring has caught up and the trail is gone.
      const settled =
        particles.length === 0 &&
        stretch < REST_STRETCH &&
        speed < 0.02 &&
        Math.abs(pointer.x - ringPos.x) < REST_DISTANCE &&
        Math.abs(pointer.y - ringPos.y) < REST_DISTANCE;

      if (settled) {
        ringPos.x = pointer.x;
        ringPos.y = pointer.y;
        clearDirty();
        return false;
      }

      return true;
    };

    const frame = (now: number) => {
      if (paint(now)) {
        raf = requestAnimationFrame(frame);
      } else {
        running = false;
        raf = 0;
      }
    };

    const wake = () => {
      if (!enabled || running) return;
      running = true;
      lastFrame = performance.now();
      raf = requestAnimationFrame(frame);
    };

    const sleep = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      running = false;
      clearDirty();
    };

    // ---- events ----------------------------------------------------------
    const onPointerMove = (event: PointerEvent) => {
      if (!enabled) return;

      const now = performance.now();
      const dt = Math.max(now - lastMoveAt, 1);
      lastMoveAt = now;

      // Re-probe only when the element under the pointer changes, so the
      // selector match never runs per frame.
      if (event.target !== hoverProbe) {
        hoverProbe = event.target;
        const match =
          event.target instanceof Element
            ? event.target.closest(HOVER_SELECTOR)
            : null;
        applyHover(Boolean(match));
      }

      const dx = event.clientX - pointer.x;
      const dy = event.clientY - pointer.y;
      pointer.x = event.clientX;
      pointer.y = event.clientY;

      const dist = Math.hypot(dx, dy);
      if (dist > 0.5) {
        const instant = dist / dt;
        speed = speed * 0.55 + instant * 0.45;
        moveAngle = Math.atan2(dy, dx);
      }

      if (!hasPointer) {
        hasPointer = true;
        ringPos.x = pointer.x;
        ringPos.y = pointer.y;
        angle = moveAngle;
        dot.style.opacity = "1";
        ring.style.opacity = "1";
        ensureCanvas();
      }

      // The dot is pinned to the pointer, so it is written straight from the
      // event: no frame of latency, and it keeps tracking while the trail loop
      // is parked.
      dot.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px, 0) translate(-50%, -50%)`;

      wake();
    };

    const onPointerLeave = () => {
      dot.style.opacity = "0";
      ring.style.opacity = "0";
      // Snap the ring to the last known point so re-entering the window does
      // not make it glide across the whole screen.
      ringPos.x = pointer.x;
      ringPos.y = pointer.y;
      sleep();
    };

    const onPointerEnter = () => {
      if (!hasPointer) return;
      dot.style.opacity = "1";
      ring.style.opacity = "1";
      wake();
    };

    const onResize = () => {
      resizeCanvas();
      wake();
    };

    const onPointerCapabilityChange = () => {
      enabled = finePointer.matches;
      container.style.display = enabled ? "" : "none";
      if (!enabled) sleep();
    };

    const onMotionChange = () => {
      still = reducedMotion.matches;
      if (still) {
        particles.length = 0;
        emitAccumulator = 0;
      }
      wake();
    };

    // The handlers bail out immediately when the device has no fine pointer, so
    // touch screens never allocate a canvas and never schedule a frame.
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("resize", onResize);
    document.addEventListener("pointerleave", onPointerLeave);
    document.addEventListener("pointerenter", onPointerEnter);

    finePointer.addEventListener("change", onPointerCapabilityChange);
    reducedMotion.addEventListener("change", onMotionChange);

    let styleEl: HTMLStyleElement | null = null;
    if (hideNativeCursor) {
      styleEl = document.createElement("style");
      styleEl.dataset.customCursor = "";
      styleEl.textContent = NATIVE_CURSOR_CSS;
      document.head.appendChild(styleEl);
    }

    return () => {
      sleep();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("pointerenter", onPointerEnter);
      finePointer.removeEventListener("change", onPointerCapabilityChange);
      reducedMotion.removeEventListener("change", onMotionChange);
      styleEl?.remove();
      canvas?.remove();
    };
  }, [hideNativeCursor, sprinkles]);

  return (
    <div
      ref={containerRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[2147483647] overflow-hidden"
    >
      <div
        ref={ringRef}
        className="absolute top-0 left-0 rounded-full border-2"
        style={{
          width: RING_SIZE,
          height: RING_SIZE,
          borderRadius: "50%",
          borderColor: RING_INK,
          backgroundColor: "transparent",
          transition:
            "width 400ms var(--ease-craft, ease-out), height 400ms var(--ease-craft, ease-out), border-radius 400ms var(--ease-craft, ease-out), background-color 320ms ease, border-color 320ms ease, box-shadow 320ms ease",
        }}
      />
      <div
        ref={dotRef}
        className="absolute top-0 left-0 rounded-full"
        style={{
          width: DOT_SIZE,
          height: DOT_SIZE,
          borderRadius: "50%",
          backgroundColor: DOT_COLOR,
          opacity: 0,
          transition:
            "width 400ms var(--ease-craft, ease-out), height 400ms var(--ease-craft, ease-out), border-radius 400ms var(--ease-craft, ease-out), background-color 320ms ease, opacity 160ms ease",
        }}
      />
    </div>
  );
}
