"use client";

import { useEffect, type RefObject } from "react";

interface RevealOpts {
  y?: number;
  duration?: number;
  stagger?: number;
  delay?: number;
}

/** Reveal headings and card grids once they enter the viewport. */
export function useGsapReveal(
  ref: RefObject<Element | null>,
  opts: RevealOpts = {}
) {
  const {
    y = 20,
    duration = 0.55,
    stagger = 0,
    delay = 0,
  } = opts;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const animations: Animation[] = [];
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        const targets = stagger > 0 ? Array.from(el.children) : [el];
        targets.forEach((target, index) => {
          const animation = target.animate(
            [
              { opacity: 0, transform: `translateY(${y}px)` },
              { opacity: 1, transform: "translateY(0)" },
            ],
            {
              duration: duration * 1000,
              delay: (delay + index * stagger) * 1000,
              easing: "ease-out",
              fill: "backwards",
            }
          );
          animation.onfinish = () => animation.cancel();
          animations.push(animation);
        });
      },
      { rootMargin: "0px 0px -12% 0px" }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      animations.forEach((animation) => animation.cancel());
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
}
