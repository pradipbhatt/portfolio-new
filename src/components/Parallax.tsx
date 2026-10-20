"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { useRef, type ReactNode } from "react";

/**
 * Scroll-linked parallax: the child drifts against the scroll direction and the
 * movement is spring-smoothed, so it lags slightly instead of tracking the
 * wheel 1:1 (that lag is what makes it feel physical).
 */
export default function Parallax({
  children,
  distance = 40,
  className,
}: {
  children: ReactNode;
  distance?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);
  const smoothY = useSpring(y, { stiffness: 80, damping: 24, mass: 0.45 });

  return (
    <motion.div ref={ref} className={className} style={reduce ? undefined : { y: smoothY }}>
      {children}
    </motion.div>
  );
}
