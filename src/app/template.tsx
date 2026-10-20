"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * App Router remounts `template.tsx` on navigation, which makes it the right
 * place for an enter transition. Keep it short and soft — a fast blur/rise
 * reads as polish, a long one reads as lag.
 *
 * No `filter` here on purpose: a filter/blur on this wrapper creates a
 * containing block, which breaks ScrollTrigger's pinning further down the tree.
 *
 * MotionConfig(reducedMotion="user") in the layout disables this for users who
 * asked for less motion.
 */
export default function Template({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
