"use client";

import { useSyncExternalStore } from "react";

/**
 * Reads the OS "reduce motion" preference from a real matchMedia listener.
 * Used instead of framer-motion's `useReducedMotion` where the value gates
 * *rendering* (not just an animation), because a wrong initial value there
 * would flash motion at users who asked for none.
 */
export function usePrefersReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}

function subscribe(onChange: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function getSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
