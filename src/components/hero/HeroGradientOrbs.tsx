"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const ORBS = [
  {
    color: "193,89,40",   // warm amber — brand primary
    opacity: 0.13,
    size: "72vmax",
    x0: "-18%", y0: "-22%",
    x1: "8%",   y1: "14%",
    x2: "-28%", y2: "6%",
    duration: 22,
  },
  {
    color: "0,255,157",   // green — hero accent
    opacity: 0.07,
    size: "60vmax",
    x0: "55%",  y0: "30%",
    x1: "30%",  y1: "-10%",
    x2: "70%",  y2: "50%",
    duration: 28,
  },
  {
    color: "0,180,255",   // blue — cool depth
    opacity: 0.055,
    size: "55vmax",
    x0: "20%",  y0: "60%",
    x1: "60%",  y1: "40%",
    x2: "10%",  y2: "80%",
    duration: 34,
  },
];

export default function HeroGradientOrbs({ reduceMotion }: { reduceMotion: boolean }) {
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (reduceMotion) return;

    const timelines = ORBS.map((orb, i) => {
      const el = refs.current[i];
      if (!el) return null;
      const d = orb.duration / 3;
      return gsap.timeline({ repeat: -1 })
        .to(el, { left: orb.x1, top: orb.y1, duration: d, ease: "sine.inOut" })
        .to(el, { left: orb.x2, top: orb.y2, duration: d, ease: "sine.inOut" })
        .to(el, { left: orb.x0, top: orb.y0, duration: d, ease: "sine.inOut" });
    });

    return () => { timelines.forEach(t => t?.kill()); };
  }, [reduceMotion]);

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
      {ORBS.map((orb, i) => (
        <div
          key={i}
          ref={el => { refs.current[i] = el; }}
          className="absolute rounded-full"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x0,
            top: orb.y0,
            background: `radial-gradient(circle, rgba(${orb.color},${orb.opacity}) 0%, transparent 70%)`,
            filter: "blur(56px)",
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}
    </div>
  );
}
