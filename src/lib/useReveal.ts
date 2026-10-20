"use client";

import { useEffect, type RefObject } from "react";

interface RevealOpts {
  y?: number;
  duration?: number;
  stagger?: number;
  delay?: number;
  blur?: number;
  scale?: number;
}

// expo-out: quick start, long settle. Reads as "physical" rather than linear.
const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

/**
 * Reveal an element (or each of its children in sequence) when it scrolls into
 * view, using the Web Animations API + IntersectionObserver.
 *
 * Premium feel comes from three things working together:
 *  - a spring-like expo-out curve instead of linear/ease-out,
 *  - blur + slight scale, not just a translate,
 *  - a longer settle time (0.9s) so motion reads as weight, not a snap.
 *
 * Reduced-motion users get no animation at all.
 */
export function useReveal(ref: RefObject<Element | null>, opts: RevealOpts = {}) {
  const { y = 28, duration = 0.9, stagger = 0, delay = 0, blur = 4, scale = 0.985 } = opts;

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
              {
                opacity: 0,
                transform: `translate3d(0, ${y}px, 0) scale(${scale})`,
                filter: `blur(${blur}px)`,
              },
              {
                opacity: 1,
                transform: "translate3d(0, 0, 0) scale(1)",
                filter: "blur(0px)",
              },
            ],
            {
              duration: duration * 1000,
              delay: (delay + index * stagger) * 1000,
              easing: EASE,
              fill: "backwards",
            }
          );
          animation.onfinish = () => animation.cancel();
          animations.push(animation);
        });
      },
      { rootMargin: "0px 0px -10% 0px" }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      animations.forEach((animation) => animation.cancel());
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
}
