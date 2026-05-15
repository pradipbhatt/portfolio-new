"use client";

import HeroTerminal from "@/components/hero/HeroTerminal";
import { HeroPortraitDeck } from "@/components/hero/HeroPortraitDeck";
import Link from "next/link";
import {
  Download,
  ArrowDown,
  Linkedin,
  Github,
  Instagram,
  Facebook,
} from "lucide-react";
import { useCallback, useRef, useState, useSyncExternalStore } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { SecurityJobCardPanel } from "@/components/SecurityJobCardPanel";

function subscribeReducedMotion(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", onStoreChange);
  return () => mq.removeEventListener("change", onStoreChange);
}

function reducedMotionSnapshot() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

const socialLinks = [
  { icon: Linkedin, href: "https://www.linkedin.com/in/pradipbhatt2126/", label: "LinkedIn" },
  { icon: Github, href: "https://github.com/pradipbhatt", label: "GitHub" },
  { icon: Instagram, href: "https://www.instagram.com/pradipbhatt/", label: "Instagram" },
  { icon: Facebook, href: "https://www.facebook.com/pradipbhatt/", label: "Facebook" },
];

function HoverLetters({
  text,
  activeColor = "hover:text-primary",
}: {
  text: string;
  activeColor?: string;
}) {
  return (
    <>
      {text.split("").map((letter, i) => (
        <span
          key={i}
          className={`inline-block cursor-default transition-[transform,color,filter] duration-200 ${
            letter === " "
              ? "w-[0.25em]"
              : `${activeColor} hover:-translate-y-[2px] hover:scale-110`
          }`}
        >
          {letter === " " ? "\u00A0" : letter}
        </span>
      ))}
    </>
  );
}

/** Gradient headline letters — same hover motion as section titles, tuned for bg-clip text */
function HoverGradientLetters({ text }: { text: string }) {
  const letterClass =
    "inline-block cursor-default bg-gradient-to-r from-primary via-primary to-orange-400/90 bg-clip-text text-transparent transition-[transform,filter] duration-200 hover:-translate-y-[2px] hover:scale-110 hover:brightness-110 hover:drop-shadow-[0_0_10px_rgba(147,51,234,0.4)]";
  return (
    <>
      {text.split("").map((letter, i) => (
        <span key={i} className={letter === " " ? "inline-block w-[0.25em]" : letterClass}>
          {letter === " " ? "\u00A0" : letter}
        </span>
      ))}
    </>
  );
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [radar, setRadar] = useState({ x: "50%", y: "50%" });
  const reduceMotion = useSyncExternalStore(
    subscribeReducedMotion,
    reducedMotionSnapshot,
    () => false
  );
  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const heroMotion = useSpring(heroScrollProgress, {
    stiffness: 150,
    damping: 34,
    mass: 0.42,
  });
  const jobCardX = useTransform(heroMotion, [0, 0.32, 0.68, 1], [0, 18, 34, 46]);
  const jobCardY = useTransform(heroMotion, [0, 0.38, 0.72, 1], [0, -6, -16, -26]);
  const jobCardRotate = useTransform(heroMotion, [0, 0.48, 1], [0, 7, 12]);
  const jobCardOpacity = useTransform(
    heroMotion,
    [0, 0.48, 0.78, 1],
    [1, 1, 0.45, 0]
  );

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (reduceMotion) return;
    const el = sectionRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    setRadar({ x: `${x}%`, y: `${y}%` });
  }, [reduceMotion]);

  return (
    <section
      ref={sectionRef}
      id="home"
      aria-label="Introduction, biography, and interactive terminal"
      onMouseMove={onMouseMove}
      className="relative min-h-[100dvh] w-full overflow-x-clip overflow-y-visible bg-background px-5 pb-5 pt-12 sm:px-6 md:px-10 md:pb-7 md:pt-16 lg:px-16 lg:pt-[4.5rem] xl:px-20 2xl:px-24"
      style={
        {
          ["--rx" as string]: radar.x,
          ["--ry" as string]: radar.y,
        } as React.CSSProperties
      }
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.35) 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-500"
        style={{
          background: reduceMotion
            ? undefined
            : `radial-gradient(520px at var(--rx) var(--ry), rgba(0,217,126,0.12), transparent 65%)`,
          opacity: reduceMotion ? 0 : 1,
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/80 via-transparent to-background" />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col">
        <div className="flex w-full min-w-0 max-w-full flex-col lg:flex-row lg:items-start lg:justify-center lg:gap-12 xl:gap-16">
          <div className="flex min-w-0 flex-1 flex-col pl-6 sm:pl-8 md:pl-12 lg:pl-14 xl:pl-16">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.05, duration: 0.45 }}
            className="mb-1.5 text-sm text-muted-foreground"
          >
            Hi, I&apos;m
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.5 }}
            className="font-hacker font-bold leading-[0.92] tracking-[0.04em] text-foreground"
          >
            <h1 className="text-[clamp(2rem,6.5vw,3.25rem)] lg:text-[clamp(2.75rem,4.8vw,3.85rem)]">
              {reduceMotion ? (
                "Pradip"
              ) : (
                <HoverLetters text="Pradip" activeColor="hover:text-primary" />
              )}
            </h1>
            <h1 className="text-[clamp(2rem,6.5vw,3.25rem)] lg:text-[clamp(2.75rem,4.8vw,3.85rem)]">
              {reduceMotion ? (
                <span className="bg-gradient-to-r from-primary via-primary to-orange-400/90 bg-clip-text text-transparent">
                  Bhatt
                </span>
              ) : (
                <HoverGradientLetters text="Bhatt" />
              )}
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.12, duration: 0.45 }}
            className="mt-2 max-w-2xl text-[13px] leading-snug text-muted-foreground md:mt-3 md:text-sm md:leading-relaxed lg:pr-1"
          >
            I blend offensive-minded research with pragmatic engineering: vulnerability discovery,
            threat context, and shipping resilient interfaces and SDLC automation.
          </motion.p>

          <div className="relative z-20 mt-3.5 w-full max-w-[16.5rem] min-h-[132px] min-[520px]:max-w-none">
            {reduceMotion ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.16, duration: 0.45 }}
                className="w-full max-w-[16.5rem] min-[520px]:max-w-none"
              >
                <SecurityJobCardPanel />
              </motion.div>
            ) : (
              <motion.div
                aria-hidden
                className="pointer-events-none absolute left-0 top-0 w-full max-w-[16.5rem] min-[520px]:max-w-none min-[520px]:w-[min(13.5rem,34vw)] will-change-transform"
                style={{
                  x: jobCardX,
                  y: jobCardY,
                  rotate: jobCardRotate,
                  opacity: jobCardOpacity,
                  transformOrigin: "left top",
                }}
              >
                <SecurityJobCardPanel interactive={false} />
              </motion.div>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32, duration: 0.5 }}
            className="mt-4 flex flex-wrap items-center gap-2.5 md:mt-5 md:gap-3"
          >
            <a
              href="/Pradip-Bhatt-cv.pdf"
              download="Pradip-Bhatt-cv.pdf"
              data-cursor-pointer
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-primary px-5 py-2.5 font-researcher text-sm tracking-wide text-primary-foreground transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/30"
            >
              Download CV
              <Download
                size={16}
                className="transition-transform group-hover:-translate-y-0.5"
              />
            </a>
            <a
              href="#projects"
              data-cursor-pointer
              className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 font-researcher text-sm tracking-wide text-foreground transition-all duration-300 hover:border-primary/50 hover:text-primary"
            >
              View Projects
              <ArrowDown size={14} />
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-3 flex flex-wrap gap-1.5 border-t border-white/[0.08] pt-3 md:mt-3.5 md:gap-2 md:pt-3.5"
            style={{
              fontFamily: "var(--font-mono-terminal), ui-monospace, monospace",
            }}
          >
            {[
              { k: "3+", v: "yrs" },
              { k: "20+", v: "projects" },
              { k: "CompTIA", v: "Security+" },
            ].map((item) => (
              <span
                key={item.k}
                className="inline-flex items-baseline gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-[11px] text-muted-foreground md:text-xs"
              >
                <span className="font-medium text-foreground">{item.k}</span>
                <span>{item.v}</span>
              </span>
            ))}
          </motion.div>
          </div>

          <div className="mx-auto flex w-full max-w-[280px] shrink-0 flex-col overflow-visible pt-3 sm:mx-auto lg:sticky lg:top-[5.5rem] lg:mx-0 lg:max-w-[min(100%,280px)] lg:self-start lg:pt-1">
            <HeroPortraitDeck
              variant="right-rail"
              reduceMotion={reduceMotion}
              socialLinks={socialLinks}
            />
          </div>
        </div>
      </div>

      <HeroTerminal />

      <motion.div
        initial={{ opacity: 0, x: 12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center lg:flex"
      >
        <div className="flex flex-col items-center rounded-full border border-white/[0.06] bg-white/[0.02] px-2 py-3 backdrop-blur-sm">
          {socialLinks.map((social) => (
            <Link
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor-pointer
              className="group relative p-2.5 text-muted-foreground transition-colors duration-200 hover:text-foreground"
            >
              <social.icon size={18} />
              <span className="pointer-events-none absolute right-full top-1/2 mr-2.5 -translate-y-1/2 translate-x-1 whitespace-nowrap rounded-md bg-primary px-2 py-1 text-[10px] text-primary-foreground opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100">
                {social.label}
              </span>
            </Link>
          ))}
        </div>
        <div className="mt-2 h-4 w-px bg-white/[0.1]" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="absolute bottom-6 left-0 right-0 z-30 flex justify-center lg:hidden"
      >
        <div className="flex items-center gap-1 rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-2 backdrop-blur-sm">
          {socialLinks.map((social) => (
            <Link
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor-pointer
              className="p-2.5 text-muted-foreground transition-colors hover:text-foreground"
            >
              <social.icon size={18} />
            </Link>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 z-30 flex -translate-x-1/2 flex-col items-center gap-1 text-muted-foreground lg:hidden"
      >
        <span className="text-[10px] uppercase tracking-widest">Scroll</span>
        <ArrowDown size={14} />
      </motion.div>
    </section>
  );
}
