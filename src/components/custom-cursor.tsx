"use client";

import { useEffect, useRef } from "react";

type CustomCursorProps = {
  /** Hide the OS cursor while the custom one is active. */
  hideNativeCursor?: boolean;
  /** Disable the sprinkle particles. */
  sprinkles?: boolean;
};

const PARTICLE_COLORS = ["#e76f51", "#2a9d8f", "#2b2d42", "#e9c46a", "#f4a261"];

const MAX_PARTICLES = 260;
const MAX_SPEED = 3; // px per ms at which the ring is fully stretched
const EMIT_THRESHOLD = 0.05; // normalized speed below which nothing is emitted
const RING_SIZE = 34;
const DOT_SIZE = 7;

/** How much of the travel direction is turned into ring rotation. */
const ROTATION_FACTOR = 0.12;
/** Hard cap on the ring tilt, in radians (~8deg). */
const MAX_ROTATION = 0.14;

/** Elements the ring snaps around and grows to match. */
const MORPH_SELECTOR = [
  "a",
  "button",
  "[role='button']",
  "[data-cursor-morph]",
  "[data-slot='badge']",
  ".craft-card",
  ".craft-btn",
].join(",");

/** Breathing room between the ring and the element it wraps. */
const MORPH_PADDING = 8;

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

type MorphTarget = {
  el: Element;
  x: number;
  y: number;
  w: number;
  h: number;
  r: number;
  /** Cached border radius so we don't read computed style every frame. */
  radius: number;
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

    // ---- morph state -----------------------------------------------------
    let morphTarget: MorphTarget | null = null;
    let morphAmount = 0; // smoothed 0..1, damps stretch + rotation
    let ringW = RING_SIZE;
    let ringH = RING_SIZE;
    let ringR = RING_SIZE / 2;

    const readMorph = (el: Element): MorphTarget | null => {
      const rect = el.getBoundingClientRect();
      if (rect.width < 1 || rect.height < 1) return null;

      const radius = parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0;
      const w = rect.width + MORPH_PADDING * 2;
      const h = rect.height + MORPH_PADDING * 2;

      return {
        el,
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        w,
        h,
        r: Math.min(radius + MORPH_PADDING, Math.min(w, h) / 2),
        radius,
      };
    };

    /**
     * Re-measure the hovered element. Called every frame so the ring keeps
     * hugging elements that move while hovered (hover lifts, transitions,
     * layout shifts, carousels).
     */
    const syncMorph = () => {
      if (!morphTarget) return;

      const el = morphTarget.el;
      if (!el.isConnected) {
        morphTarget = null;
        return;
      }

      const rect = el.getBoundingClientRect();
      if (rect.width < 1 || rect.height < 1) {
        morphTarget = null;
        return;
      }

      const w = rect.width + MORPH_PADDING * 2;
      const h = rect.height + MORPH_PADDING * 2;

      morphTarget.x = rect.left + rect.width / 2;
      morphTarget.y = rect.top + rect.height / 2;
      morphTarget.w = w;
      morphTarget.h = h;
      morphTarget.r = Math.min(
        morphTarget.radius + MORPH_PADDING,
        Math.min(w, h) / 2,
      );
    };

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
      syncMorph();
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

    const onPointerOver = (event: PointerEvent) => {
      if (!enabled) return;

      const target = event.target;
      if (!(target instanceof Element)) return;

      const el = target.closest(MORPH_SELECTOR);
      if (el === morphTarget?.el) return;

      morphTarget = el ? readMorph(el) : null;
    };

    const onPointerLeave = () => {
      dot.style.opacity = "0";
      ring.style.opacity = "0";
      morphTarget = null;
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

      // keep the ring glued to elements that move while hovered
      syncMorph();

      // let the velocity bleed off when the pointer stops moving
      speed *= Math.exp(-dt / 110);

      // ---- morph easing --------------------------------------------------
      const morphing = morphTarget !== null;
      const morphEase = 1 - Math.pow(1 - 0.2, step);

      morphAmount += ((morphing ? 1 : 0) - morphAmount) * morphEase;

      const targetW = morphTarget ? morphTarget.w : RING_SIZE;
      const targetH = morphTarget ? morphTarget.h : RING_SIZE;
      const targetR = morphTarget ? morphTarget.r : RING_SIZE / 2;

      ringW += (targetW - ringW) * morphEase;
      ringH += (targetH - ringH) * morphEase;
      ringR += (targetR - ringR) * morphEase;

      // ring easing toward the pointer (or the hovered element)
      const follow = 1 - Math.pow(1 - 0.17, step);
      const followX = morphTarget ? morphTarget.x : pointer.x;
      const followY = morphTarget ? morphTarget.y : pointer.y;
      ringPos.x += (followX - ringPos.x) * follow;
      ringPos.y += (followY - ringPos.y) * follow;

      // stretch easing
      const targetStretch =
        still || morphing ? 0 : Math.min(speed / MAX_SPEED, 1);
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

      // ring: stretched along the travel axis, squashed across it
      const scaleX = (1 + stretch * 0.9) * (1 + stretch * 0.18);
      const scaleY = (1 - stretch * 0.32) * (1 + stretch * 0.18);

      // only a slight tilt in the direction of travel, hard-capped
      const rawRot = angle * ROTATION_FACTOR * (1 - morphAmount);
      const rot = Math.max(-MAX_ROTATION, Math.min(MAX_ROTATION, rawRot));

      ring.style.width = `${ringW}px`;
      ring.style.height = `${ringH}px`;
      ring.style.borderRadius = `${ringR}px`;
      ring.style.transform =
        `translate3d(${ringPos.x}px, ${ringPos.y}px, 0) translate(-50%, -50%) ` +
        `rotate(${rot}rad) scale(${scaleX}, ${scaleY})`;

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
    window.addEventListener("scroll", syncMorph, {
      passive: true,
      capture: true,
    });
    document.addEventListener("pointerover", onPointerOver, { passive: true });
    document.addEventListener("pointerleave", onPointerLeave);
    document.addEventListener("pointerenter", onPointerEnter);

    const onPointerCapabilityChange = () => {
      enabled = finePointer.matches;
      container.style.display = enabled ? "" : "none";
      if (!enabled) morphTarget = null;
    };
    const onMotionChange = () => {
      still = reducedMotion.matches;
    };

    finePointer.addEventListener("change", onPointerCapabilityChange);
    reducedMotion.addEventListener("change", onMotionChange);

    let styleEl: HTMLStyleElement | null = null;
    if (hideNativeCursor) {
      styleEl = document.createElement("style");
      styleEl.textContent = `
        html, body { cursor: none; }
        html input, html textarea, html select { cursor: text; }
      `;
      document.head.appendChild(styleEl);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", syncMorph, { capture: true });
      document.removeEventListener("pointerover", onPointerOver);
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
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden"
    >
      <canvas ref={canvasRef} className="absolute inset-0" />
      <div
        ref={ringRef}
        className="absolute left-0 top-0 border-2 will-change-transform"
        style={{
          width: RING_SIZE,
          height: RING_SIZE,
          borderRadius: RING_SIZE / 2,
          borderColor: "#2b2d42",
          opacity: 0,
          transition: "opacity 200ms ease",
        }}
      />
      <div
        ref={dotRef}
        className="absolute left-0 top-0 rounded-full will-change-transform"
        style={{
          width: DOT_SIZE,
          height: DOT_SIZE,
          backgroundColor: "#e76f51",
          opacity: 0,
          transition: "opacity 200ms ease",
        }}
      />
    </div>
  );
}
