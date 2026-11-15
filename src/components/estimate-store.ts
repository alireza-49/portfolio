"use client";

import { useSyncExternalStore } from "react";
import type { Estimate } from "@/lib/estimator";

export type { Estimate };

let current: Estimate | null = null;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) {
    listener();
  }
}

export function setEstimate(next: Estimate | null) {
  current = next;
  emit();
}

export function subscribeEstimate(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getEstimateSnapshot() {
  return current;
}

export function useEstimate() {
  return useSyncExternalStore(
    subscribeEstimate,
    getEstimateSnapshot,
    () => null,
  );
}
