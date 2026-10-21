"use client";

import { useSyncExternalStore } from "react";

export type Estimate = {
  typeTitle: string;
  timeline: string;
  min: string;
  max: string;
  addonsCount: number;
};

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
