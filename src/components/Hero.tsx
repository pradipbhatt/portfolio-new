"use client";

import HeroTerminal from "@/components/hero/HeroTerminal";
import HeroGradientOrbs from "@/components/hero/HeroGradientOrbs";
import { HeroPortraitDeck } from "@/components/hero/HeroPortraitDeck";
import HeroThreeScene, { type NodeHoverData } from "@/components/hero/HeroThreeScene";
import Link from "next/link";
import {
  Download,
  ArrowDown,
  Linkedin,
  Github,
  Instagram,
  Facebook,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion"; // motion kept for job-card scroll parallax only
import { SecurityJobCardPanel } from "@/components/SecurityJobCardPanel";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

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
  activeColor = "hover:text-[#00ff9d]",
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

/* ─── Node tooltip ────────────────────────────────────────────────────── */
function NodeTooltip({ data }: { data: NodeHoverData | null }) {
  const ref = useRef<HTMLDivElement>(null);
  const visibleRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (data) {
      el.style.left = `${data.screenX}px`;
      el.style.top  = `${data.screenY}px`;
      if (!visibleRef.current) {
        visibleRef.current = true;
        gsap.fromTo(el,
          { opacity: 0, scale: 0.88, y: 10 },
          { opacity: 1, scale: 1, y: 0, duration: 0.2, ease: "power2.out" }
        );
      }
    } else if (visibleRef.current) {
      visibleRef.current = false;
      gsap.to(el, { opacity: 0, scale: 0.92, y: 6, duration: 0.15, ease: "power2.in" });
    }
  }, [data]);

  /* keep rendered so GSAP can always target the DOM node */
  return (
    <div
      ref={ref}
      className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-[calc(100%+14px)]"
      style={{ opacity: 0 }}
    >
      {data && (
        <div
          className="min-w-[160px] max-w-[220px] rounded border px-3.5 py-2.5 backdrop-blur-md"
          style={{
            borderColor: `${data.cssColor}40`,
            background: `rgba(5,8,15,0.88)`,
            boxShadow: `0 0 18px ${data.cssColor}22, inset 0 0 0 1px ${data.cssColor}18`,
          }}
        >
          {/* Header */}
          <div className="mb-2 flex items-center gap-2">
            <span className="text-base leading-none">{data.icon}</span>
            <span
              className="text-[11px] font-semibold tracking-[0.18em] uppercase"
              style={{ color: data.cssColor, fontFamily: "var(--font-mono-terminal)" }}
            >
              {data.label}
            </span>
          </div>
          {/* Detail lines */}
          <ul className="space-y-0.5">
            {data.detail.map((line, i) => (
              <li
                key={i}
                className="flex items-start gap-1.5 text-[10px] text-[#a0b8b0]"
                style={{ fontFamily: "var(--font-mono-terminal)" }}
              >
                <span style={{ color: `${data.cssColor}90` }} className="mt-px shrink-0">›</span>
                {line}
              </li>
            ))}
          </ul>
          {/* Arrow */}
          <div
            className="absolute left-1/2 top-full -translate-x-1/2 border-x-4 border-t-4 border-x-transparent"
            style={{ borderTopColor: `${data.cssColor}40` }}
          />
        </div>
      )}
    </div>
  );
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [radar, setRadar] = useState({ x: "50%", y: "50%" });
  const [hoveredNode, setHoveredNode] = useState<NodeHoverData | null>(null);
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

  const portraitWrapRef = useRef<HTMLDivElement>(null);
  const textColRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const pradevRef = useRef<HTMLDivElement>(null);

  /* GSAP entrance — clean staggered reveal */
  useEffect(() => {
    if (reduceMotion) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      if (nameRef.current) {
        tl.from(nameRef.current, { y: 40, opacity: 0, duration: 0.8 }, 0.3);
      }
      if (badgeRef.current) {
        tl.from(badgeRef.current, { y: 16, opacity: 0, duration: 0.5 }, 0.7);
      }
      if (ctaRef.current) {
        tl.from(ctaRef.current.children, { y: 16, opacity: 0, stagger: 0.1, duration: 0.5 }, 0.9);
      }

      /* PRA.DEV — slow glow breathe */
      if (pradevRef.current) {
        gsap.to(pradevRef.current, {
          filter: "brightness(1.8)",
          duration: 3.5,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      }
    });
    return () => ctx.revert();
  }, [reduceMotion]);

  /* GSAP portrait 3D tilt on mouse move */
  useEffect(() => {
    if (reduceMotion) return;
    const el = portraitWrapRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const rx = ((e.clientY - cy) / (r.height / 2)) * -4;
      const ry = ((e.clientX - cx) / (r.width / 2)) * 4;
      gsap.to(el, { rotateX: rx, rotateY: ry, duration: 0.55, ease: "power2.out", transformPerspective: 1400 });
    };
    const onLeave = () => {
      gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.9, ease: "power3.out" });
    };
    window.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [reduceMotion]);

  /* GSAP scroll parallax on text column */
  useEffect(() => {
    if (reduceMotion) return;
    const el = textColRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.to(el, {
        y: -60,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.2,
        },
      });
    });
    return () => ctx.revert();
  }, [reduceMotion]);

  return (
    <section
      ref={sectionRef}
      id="home"
      aria-label="Introduction, biography, and interactive terminal"
      onMouseMove={onMouseMove}
      className="relative w-full overflow-x-clip overflow-y-visible bg-[#05080f] px-5 pb-14 pt-12 sm:px-6 md:px-10 md:pb-16 md:pt-16 lg:px-16 lg:pt-[4.5rem] xl:px-20 2xl:px-24"
      style={{ ["--rx" as string]: radar.x, ["--ry" as string]: radar.y } as React.CSSProperties}
    >
      {/* ── Gradient orbs (GSAP-animated, replaces Three.js stars) ── */}
      <HeroGradientOrbs reduceMotion={reduceMotion} />

      {/* ── Three.js scene (interactive node network only) ── */}
      <HeroThreeScene reduceMotion={reduceMotion} onHover={setHoveredNode} />

      {/* ── Node tooltip ── */}
      <NodeTooltip data={hoveredNode} />

      {/* ── PRA.DEV watermark — large bg overlay ── */}
      <div className="pointer-events-none absolute inset-0 z-[2] flex items-center justify-center overflow-hidden">
        <div
          ref={pradevRef}
          style={{
            fontFamily: "var(--font-orbitron), sans-serif",
            fontSize: "clamp(3.5rem, 11vw, 10rem)",
            fontWeight: 900,
            letterSpacing: "0.28em",
            color: "transparent",
            WebkitTextStroke: "1px color-mix(in srgb, var(--primary) 30%, transparent)",
            textShadow: [
              "0 0 30px color-mix(in srgb, var(--primary) 55%, transparent)",
              "0 0 80px color-mix(in srgb, var(--primary) 25%, transparent)",
              "0 0 160px color-mix(in srgb, var(--primary) 12%, transparent)",
            ].join(", "),
            filter: "brightness(1)",
            userSelect: "none",
            whiteSpace: "nowrap",
          }}
          aria-hidden
        >
          PRA.DEV
        </div>
      </div>

      {/* ── Depth fades ── */}
      <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-[#0a0f0d]/80 via-transparent to-[#0a0f0d]/95" />
      {/* left vignette — keeps text readable */}
      <div className="pointer-events-none absolute inset-0 z-[1]" style={{ background: "radial-gradient(ellipse 70% 100% at 30% 50%, transparent 30%, rgba(10,15,13,0.55) 100%)" }} />

      {/* ── Main content ── */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col">
        <div className="flex w-full min-w-0 max-w-full flex-col lg:flex-row lg:items-start lg:justify-center lg:gap-12 xl:gap-16">

          {/* ── Left: text content ── */}
          <div ref={textColRef} className="flex min-w-0 flex-1 flex-col pl-2 sm:pl-4 md:pl-6 lg:pl-8 xl:pl-10">

            {/* Hi, I'm — cursive greeting */}
            <div className="mb-2 flex items-center gap-3">
              <div className="h-px w-10 bg-gradient-to-r from-transparent to-[#00ff9d]/50" />
              <span className="font-cursive text-2xl md:text-3xl text-[#00ff9d]/80 leading-none">
                Hi, I&apos;m
              </span>
            </div>

            {/* Name */}
            <div ref={nameRef} className="font-hacker font-bold leading-[0.9] tracking-tight text-white">
              <h1 className="text-[clamp(2.8rem,7.5vw,5rem)] lg:text-[clamp(3.2rem,5.5vw,5rem)]">
                Pradip
              </h1>
              <h1 className="text-[clamp(2.8rem,7.5vw,5rem)] lg:text-[clamp(3.2rem,5.5vw,5rem)] bg-gradient-to-r from-primary via-orange-400 to-primary bg-clip-text text-transparent">
                Bhatt
              </h1>
            </div>

            {/* Role badge */}
            <div ref={badgeRef} className="mt-4 flex items-center gap-3">
              <div className="h-px w-6 bg-[#00ff9d]/40 shrink-0" />
              <div>
                <p className="text-sm md:text-base font-semibold tracking-widest uppercase text-white/80 leading-snug">
                  Security Researcher
                </p>
                <p className="text-xs text-white/40 tracking-wider mt-0.5">
                  SecurityPal AI · Full Stack Developer
                </p>
              </div>
            </div>

            {/* Bio */}
            <p className="mt-3 max-w-xl text-[13px] leading-relaxed text-white/55 md:text-sm lg:pr-1">
              I blend offensive-minded research with pragmatic engineering: vulnerability discovery,
              threat context, and shipping resilient interfaces and SDLC automation.
            </p>

            {/* Job card */}
            <div className="relative z-20 mt-4 w-full max-w-[16.5rem] min-h-[132px] min-[520px]:max-w-none">
              {reduceMotion ? (
                <div className="w-full max-w-[16.5rem] min-[520px]:max-w-none">
                  <SecurityJobCardPanel />
                </div>
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

            {/* CTA buttons */}
            <div ref={ctaRef} className="mt-5 flex flex-wrap items-center gap-3">
              <a
                href="/assets/CV Pradip.pdf"
                download="Pradip_Bhatt_CV.pdf"
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-primary px-5 py-2.5 font-researcher text-sm tracking-wide text-primary-foreground transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:shadow-primary/40"
              >
                {/* Anime shine sweep */}
                <span className="absolute inset-0 -translate-x-full skew-x-[-20deg] bg-white/20 transition-transform duration-500 group-hover:translate-x-[120%]" aria-hidden />
                Download CV
                <Download size={15} className="transition-transform group-hover:-translate-y-0.5" />
              </a>
              <a
                href="#projects"
                className="group inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/[0.05] px-5 py-2.5 font-researcher text-sm tracking-wide text-white/85 transition-all duration-300 hover:border-primary hover:bg-primary/10 hover:text-[#00ff9d]"
              >
                View Projects
                <ArrowDown size={14} className="transition-transform group-hover:translate-y-0.5" />
              </a>
            </div>

            {/* Stats */}
            <div className="mt-5 flex flex-wrap gap-3 border-t border-[#00ff9d]/10 pt-5">
              {[
                { k: "3+", v: "Years" },
                { k: "20+", v: "Projects" },
                { k: "5+", v: "Awards" },
                { k: "NEC", v: "Certified" },
              ].map((item) => (
                <span
                  key={item.k}
                  className="inline-flex items-baseline gap-2 rounded border border-[#00ff9d]/20 bg-[#00ff9d]/[0.04] px-4 py-2 text-sm text-white/60 transition-colors hover:border-[#00ff9d]/40 hover:bg-[#00ff9d]/[0.08]"
                >
                  <span className="text-base font-bold text-[#00ff9d]">{item.k}</span>
                  {item.v}
                </span>
              ))}
            </div>
          </div>

          {/* ── Right: portrait with anime frame ── */}
          <div className="mx-auto mt-8 flex w-full max-w-[300px] shrink-0 flex-col overflow-visible lg:mx-0 lg:mt-0 lg:max-w-[300px] lg:sticky lg:top-[5.5rem] lg:self-start">


            {/* Corner brackets — manga panel style */}
            <div ref={portraitWrapRef} className="relative" style={{ transformStyle: "preserve-3d" }}>
              {/* Corner brackets */}
              <div className="absolute -left-3 -top-3 z-20 h-7 w-7 border-l border-t border-[#00ff9d]/35" aria-hidden />
              <div className="absolute -right-3 -top-3 z-20 h-7 w-7 border-r border-t border-[#00ff9d]/35" aria-hidden />
              <div className="absolute -bottom-3 -left-3 z-20 h-7 w-7 border-b border-l border-[#00ff9d]/35" aria-hidden />
              <div className="absolute -bottom-3 -right-3 z-20 h-7 w-7 border-b border-r border-[#00ff9d]/35" aria-hidden />

              <HeroPortraitDeck
                variant="right-rail"
                reduceMotion={reduceMotion}
                socialLinks={socialLinks}
              />
            </div>

          </div>
        </div>
      </div>

      <HeroTerminal />

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 z-30 -translate-x-1/2 flex flex-col items-center gap-1.5 text-[#00ff9d]/35 lg:hidden">
        <div className="h-8 w-px bg-gradient-to-b from-transparent to-[#00ff9d]/40" />
        <ArrowDown size={14} />
      </div>

      {/* Social rail — desktop */}
      <div className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center lg:flex">
        <div className="flex flex-col items-center rounded-sm border border-[#00ff9d]/15 bg-[#05080f]/70 px-2 py-3 backdrop-blur-sm">
          {socialLinks.map((social) => (
            <Link
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative p-2.5 text-white/45 transition-colors duration-200 hover:text-[#00ff9d]"
            >
              <social.icon size={17} />
              <span className="pointer-events-none absolute right-full top-1/2 mr-2.5 -translate-y-1/2 translate-x-1 whitespace-nowrap rounded border border-[#00ff9d]/30 bg-[#05080f]/95 px-2 py-0.5 text-[10px] text-[#00ff9d] opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100" style={{ fontFamily: "var(--font-mono-terminal)" }}>
                {social.label}
              </span>
            </Link>
          ))}
        </div>
        <div className="mt-2 h-4 w-px bg-[#00ff9d]/20" />
      </div>

      {/* Social bar — mobile */}
      <div className="absolute bottom-5 left-0 right-0 z-30 flex justify-center lg:hidden">
        <div className="flex items-center gap-1 rounded-sm border border-[#00ff9d]/15 bg-[#05080f]/70 px-3 py-2 backdrop-blur-sm">
          {socialLinks.map((social) => (
            <Link
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-white/45 transition-colors hover:text-[#00ff9d]"
            >
              <social.icon size={17} />
            </Link>
          ))}
        </div>
      </div>

    </section>
  );
}
