"use client";
import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

interface RevealOpts {
  y?: number;
  duration?: number;
  stagger?: number;
  start?: string;
  delay?: number;
}

/**
 * Single-use scroll reveal — only animates transform + opacity (GPU compositing only).
 * Respects prefers-reduced-motion automatically.
 * Use on section headings and card grids only — not on individual paragraphs or buttons.
 */
export function useGsapReveal(
  ref: RefObject<Element | null>,
  opts: RevealOpts = {}
) {
  const {
    y = 20,
    duration = 0.55,
    stagger = 0,
    start = "top 88%",
    delay = 0,
  } = opts;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const targets = stagger > 0 ? Array.from(el.children) : el;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration,
          stagger,
          delay,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start,
            once: true,
          },
        }
      );
    });

    return () => ctx.revert();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
}
