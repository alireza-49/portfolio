"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Transition,
} from "motion/react";
import type { ReactNode } from "react";

const SPRING: Transition = {
  type: "spring",
  stiffness: 92,
  damping: 20,
  mass: 0.9,
};

/**
 * Spring reveal for a landing section.
 *
 * Only `y` is animated: `/create` is statically prerendered, so the initial
 * state must stay readable in the markup (no `opacity: 0` before hydration).
 * `useReducedMotion` only changes the *transition*, never the rendered style
 * tree, which keeps the server and client markup identical.
 */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={{ y: 18 }}
      whileInView={{ y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={reduce ? { duration: 0 } : { ...SPRING, delay }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Cross-fades content that is swapped by state (weekday, testimonial). The
 * first render matches the prerendered HTML (`initial={false}` on the
 * presence), later swaps animate.
 */
export function Swap({
  children,
  swapKey,
  className,
}: {
  children: ReactNode;
  swapKey: string | number;
  className?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <AnimatePresence mode='wait' initial={false}>
      <motion.div
        key={swapKey}
        className={className}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={
          reduce ? { duration: 0 } : { duration: 0.22, ease: [0.4, 0, 0.2, 1] }
        }
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * Springy hover/tap wrapper. It never animates the themed primitive itself, so
 * the preset's own `--cc-hover-translate` / `--cc-hover-rotate` stay intact.
 * Hover/tap variants produce no server styles, so they cannot cause a
 * hydration mismatch.
 */
export function Lift({
  children,
  className,
  hover = true,
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      whileHover={reduce || !hover ? undefined : { y: -3 }}
      whileTap={reduce ? undefined : { scale: 0.99 }}
      transition={{ type: "spring", stiffness: 340, damping: 24 }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Height-animated disclosure used by the shop's filter rail and the size
 * guide. Closed panels render nothing, so the prerendered markup is unchanged
 * by opening and closing — and `initial={false}` keeps the first open paint
 * from animating. `height: auto` is measured by motion, so the content can be
 * a table, a slider or a product grid.
 */
export function Collapse({
  open,
  children,
  className,
}: {
  open: boolean;
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <AnimatePresence initial={false}>
      {open ? (
        <motion.div
          key='panel'
          className={className}
          initial={{ height: 0 }}
          animate={{ height: "auto" }}
          exit={{ height: 0 }}
          transition={
            reduce
              ? { duration: 0 }
              : { duration: 0.26, ease: [0.4, 0, 0.2, 1] }
          }
          style={{ overflow: "hidden" }}
        >
          {children}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

/**
 * One removable row of a list (a bag line). The parent supplies an
 * `<AnimatePresence initial={false}>`, so the rows that exist at first paint
 * stay static while added/removed lines spring in and out.
 */
export function Row({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.li
      layout='position'
      className={className}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduce ? { opacity: 0 } : { opacity: 0, x: -14 }}
      transition={
        reduce
          ? { duration: 0 }
          : { type: "spring", stiffness: 260, damping: 26 }
      }
    >
      {children}
    </motion.li>
  );
}

/**
 * Count badge that pops whenever its value changes. `key` remounts the span so
 * the spring replays; the prerender always sees a resting scale.
 */
export function Bump({
  children,
  trigger,
  className,
}: {
  children: ReactNode;
  trigger: string | number;
  className?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.span
      key={trigger}
      className={className}
      style={{ display: "inline-flex" }}
      initial={reduce ? false : { scale: 0.7 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 520, damping: 18 }}
    >
      {children}
    </motion.span>
  );
}
