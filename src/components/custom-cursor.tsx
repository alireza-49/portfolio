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

/** Ring elongation at full speed, along the direction of travel. */
const STRETCH_LENGTH = 1.4;
/** Extra size added uniformly while stretched, so the ring keeps its mass. */
const STRETCH_SWELL = 0.22;
/** Cross-axis squash at full speed. */
const STRETCH_SQUASH = 0.45;

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

export function CustomCursor({
  hideNativeCursor = true,
  sprinkles = true,
}: CustomCursorProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const dot = dotRef.current;
    const ring = ringRef.current;
    const canvas = canvasRef.current;
    if (!container || !dot || !ring || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

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

    // ---- canvas sizing ---------------------------------------------------
    let width = 0;
    let height = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

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

    // ---- events ----------------------------------------------------------
    const onPointerMove = (event: PointerEvent) => {
      if (!enabled) return;

      const now = performance.now();
      const dt = Math.max(now - lastMoveAt, 1);
      lastMoveAt = now;

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
      }
    };

    const onPointerLeave = () => {
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    };

    const onPointerEnter = () => {
      if (!hasPointer) return;
      dot.style.opacity = "1";
      ring.style.opacity = "1";
    };

    // ---- render loop -----------------------------------------------------
    let raf = 0;
    let lastFrame = performance.now();

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);

      const dt = Math.min(now - lastFrame, 48);
      lastFrame = now;
      const step = dt / 16.667;

      // let the velocity bleed off when the pointer stops moving
      speed *= Math.exp(-dt / 110);

      // ring easing toward the pointer
      const follow = 1 - Math.pow(1 - 0.17, step);
      ringPos.x += (pointer.x - ringPos.x) * follow;
      ringPos.y += (pointer.y - ringPos.y) * follow;

      // stretch easing
      const targetStretch = still ? 0 : Math.min(speed / MAX_SPEED, 1);
      stretch += (targetStretch - stretch) * (1 - Math.pow(1 - 0.22, step));

      // angle easing along the shortest path
      if (speed > 0.08) {
        let diff = moveAngle - angle;
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        angle += diff * (1 - Math.pow(1 - 0.25, step));
      }

      // dot: pinned, no lag
      dot.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px, 0) translate(-50%, -50%)`;

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

      // draw
      ctx.clearRect(0, 0, width, height);

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
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          ctx.fillRect(-size / 2, -size / 2, size, size);
          ctx.restore();
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, size / 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.globalAlpha = 1;
    };

    raf = requestAnimationFrame(frame);

    // ---- wiring ----------------------------------------------------------
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("resize", resize);
    document.addEventListener("pointerleave", onPointerLeave);
    document.addEventListener("pointerenter", onPointerEnter);

    const onPointerCapabilityChange = () => {
      enabled = finePointer.matches;
      container.style.display = enabled ? "" : "none";
    };
    const onMotionChange = () => {
      still = reducedMotion.matches;
    };

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
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", resize);
      document.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("pointerenter", onPointerEnter);
      finePointer.removeEventListener("change", onPointerCapabilityChange);
      reducedMotion.removeEventListener("change", onMotionChange);
      styleEl?.remove();
    };
  }, [hideNativeCursor, sprinkles]);

  return (
    <div
      ref={containerRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[2147483647] overflow-hidden"
    >
      <canvas ref={canvasRef} className="absolute inset-0" />
      <div
        ref={ringRef}
        className="absolute top-0 left-0 rounded-full border-2 border-[#2b2d42]"
        style={{
          width: RING_SIZE,
          height: RING_SIZE,
          borderRadius: "50%",
          opacity: 0,
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
        }}
      />
    </div>
  );
}
