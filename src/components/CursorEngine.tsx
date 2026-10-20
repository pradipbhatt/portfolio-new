"use client";

import { useEffect } from "react";

/**
 * Global cursor engine for the hero globe and the per-card glow.
 * One pointer listener and one rAF loop, no React renders:
 *
 *   --tilt-x/y    : spring-smoothed globe rotation
 *   --eye-x/y     : spring-smoothed globe gaze
 *
 * A critically-damped spring is used instead of a plain lerp: it reacts quickly
 * to a fast flick but settles without overshoot, which reads as "smooth" rather
 * than "laggy". Nothing here triggers a React render — values are written
 * straight to CSS variables.
 *
 * Disabled for touch devices and reduced motion.
 */
export default function CursorEngine() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(hover: none)").matches) return;

    const root = document.documentElement;
    let px = window.innerWidth / 2;
    let py = window.innerHeight / 2;
    let vx = 0;
    let vy = 0;
    let tx = px;
    let ty = py;
    let frame = 0;
    let last = performance.now();
    let lastPointerX = tx;
    let lastPointerY = ty;
    let lastPointerTime = 0;
    let pointerSpeed = 0;
    let activeCard: HTMLElement | null = null;

    const onMove = (event: PointerEvent) => {
      if (lastPointerTime) {
        const elapsed = Math.max(8, event.timeStamp - lastPointerTime);
        pointerSpeed = Math.min(6000, Math.hypot(event.clientX - lastPointerX, event.clientY - lastPointerY) * 1000 / elapsed);
      }
      lastPointerX = event.clientX;
      lastPointerY = event.clientY;
      lastPointerTime = event.timeStamp;
      tx = event.clientX;
      ty = event.clientY;

      const el = event.target instanceof Element ? event.target.closest<HTMLElement>("[data-spotlight]") : null;
      if (el !== activeCard) activeCard = el;
      if (el) {
        const rect = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${event.clientX - rect.left}px`);
        el.style.setProperty("--my", `${event.clientY - rect.top}px`);
      }
    };

    let speed = 0; // smoothed pointer speed, px/s

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      // Measure pointer motion, rather than the spring's remaining distance.
      // The speed boost fades after a flick, while the spring settles cleanly.
      speed += (pointerSpeed - speed) * (1 - Math.exp(-dt * 16));
      pointerSpeed *= Math.exp(-dt * 12);
      const s = Math.min(1, speed / 1800);

      const stiffness = 210 + s * 390;
      const damping = 29 + s * 20;

      vx += ((tx - px) * stiffness - vx * damping) * dt;
      vy += ((ty - py) * stiffness - vy * damping) * dt;
      px += vx * dt;
      py += vy * dt;

      const nx = (px / window.innerWidth) * 2 - 1;
      const ny = (py / window.innerHeight) * 2 - 1;

      // inertia: tips away from the direction of travel, clamped
      const leanY = Math.max(-8, Math.min(8, vx * 0.0025));
      const leanX = Math.max(-7, Math.min(7, -vy * 0.0025));

      const amp = 0.85 + s * 0.45;
      root.style.setProperty("--tilt-y", `${(nx * 18 * amp + leanY).toFixed(2)}deg`);
      root.style.setProperty("--tilt-x", `${(-ny * 14 * amp + leanX).toFixed(2)}deg`);
      root.style.setProperty("--eye-x", `${(nx * 20 * (0.85 + s * 0.3)).toFixed(1)}px`);
      root.style.setProperty("--eye-y", `${(ny * 15 * (0.85 + s * 0.3)).toFixed(1)}px`);
      root.style.setProperty("--cursor-speed", s.toFixed(3));

      frame = requestAnimationFrame(loop);
    };

    frame = requestAnimationFrame(loop);
    window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      ["--tilt-x", "--tilt-y", "--eye-x", "--eye-y", "--cursor-speed"].forEach((p) =>
        root.style.removeProperty(p)
      );
    };
  }, []);

  return null;
}
