"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Single place where motion respects the OS "reduce motion" setting.
 *
 * Without this, every `motion.*` / `whileInView` animation in the app keeps
 * running for users who asked their system for less motion. `reducedMotion="user"`
 * makes framer-motion drop transform/layout animations while keeping opacity
 * fades, which is the accessible default.
 */
export default function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
