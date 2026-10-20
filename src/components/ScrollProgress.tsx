"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

/** Hairline progress bar pinned to the top edge — quiet, but it ties the page to the scroll. */
export default function ScrollProgress() {
  const reduce = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });

  if (reduce) return null;

  return (
    <motion.div
      aria-hidden
      className="scroll-progress pointer-events-none fixed inset-x-0 top-0 z-[100] h-[2px] origin-left bg-primary/70"
      style={{ scaleX }}
    />
  );
}
