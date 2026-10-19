"use client";

import HeroTerminal from "@/components/hero/HeroTerminal";
import { HeroPortraitDeck } from "@/components/hero/HeroPortraitDeck";
import { HoverLetters } from "@/components/ui/HoverLetters";
import Link from "next/link";
import {
  Download,
  ArrowDown,
  Linkedin,
  Github,
  Instagram,
  Facebook,
} from "lucide-react";
import { useEffect, useRef, useSyncExternalStore } from "react";
import gsap from "gsap";

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

export default function Hero() {
  const reduceMotion = useSyncExternalStore(
    subscribeReducedMotion,
    reducedMotionSnapshot,
    () => false
  );
  const portraitWrapRef = useRef<HTMLDivElement>(null);

  /* GSAP portrait 3D tilt on mouse move */
  useEffect(() => {
    if (reduceMotion) return;
    const el = portraitWrapRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const rx = Math.max(-4, Math.min(4, ((e.clientY - cy) / (r.height / 2)) * -4));
      const ry = Math.max(-4, Math.min(4, ((e.clientX - cx) / (r.width / 2)) * 4));
      gsap.to(el, { rotateX: rx, rotateY: ry, duration: 0.55, ease: "power2.out", transformPerspective: 1400 });
    };
    const onLeave = () => {
      gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.9, ease: "power3.out" });
    };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [reduceMotion]);

  return (
    <section
      id="home"
      aria-label="Introduction, biography, and interactive terminal"
      className="relative flex w-full flex-col overflow-x-clip overflow-y-visible bg-[#eef1f5] pb-16 pt-28 dark:bg-[#05080f] md:pb-20 md:pt-32"
    >
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_65%_55%_at_75%_35%,rgba(67,80,91,0.09),transparent_75%)] dark:bg-[radial-gradient(ellipse_65%_55%_at_75%_35%,rgba(42,58,71,0.16),transparent_75%)]" aria-hidden />

      {/* ── Depth fades — dark ── */}
      <div className="pointer-events-none absolute inset-0 z-[1] hidden dark:block bg-gradient-to-b from-[#0a0f0d]/80 via-transparent to-[#0a0f0d]/95" />
      <div className="pointer-events-none absolute inset-0 z-[1] hidden dark:block" style={{ background: "radial-gradient(ellipse 70% 100% at 30% 50%, transparent 30%, rgba(10,15,13,0.55) 100%)" }} />
      {/* ── Depth fades — light ── */}
      <div className="pointer-events-none absolute inset-0 z-[1] block dark:hidden bg-gradient-to-b from-[#eef1f5]/90 via-transparent to-[#eef1f5]/90" />
      <div className="pointer-events-none absolute inset-0 z-[1] block dark:hidden" style={{ background: "radial-gradient(ellipse 70% 100% at 30% 50%, transparent 30%, rgba(238,241,245,0.45) 100%)" }} />
      <div className="hero-grid pointer-events-none absolute inset-0 z-[2]" aria-hidden />

      {/* ── Main content ── */}
      <div className="container relative z-10 mx-auto flex w-full max-w-6xl flex-col px-6">
        <div className="flex w-full min-w-0 max-w-full flex-col lg:flex-row lg:items-center lg:justify-between lg:gap-12 xl:gap-20">

          {/* ── Left: text content ── */}
          <div className="flex min-w-0 flex-1 flex-col">

            {/* Hi, I'm — cursive greeting */}
            <div className="mb-2">
              <span className="font-cursive text-2xl leading-none text-foreground/70 md:text-3xl dark:text-white/65">
                <HoverLetters text="Hi, I'm" activeColor="hover:text-primary" />
              </span>
            </div>

            {/* Name */}
            <h1 className="font-hacker text-[clamp(2.8rem,7.5vw,5.5rem)] font-bold leading-[0.9] tracking-tight text-foreground dark:text-white lg:text-[clamp(3.2rem,5.5vw,5.5rem)]">
              <span className="block">
                <HoverLetters text="Pradip" activeColor="hover:text-primary" />
              </span>
              <span
                className="block"
                style={{ color: "color-mix(in srgb, var(--primary) 55%, var(--foreground))" }}
              >
                <HoverLetters text="Bhatt" activeColor="hover:text-foreground dark:hover:text-white" />
              </span>
            </h1>

            <div className="mt-9">
              <div>
                <p className="text-sm font-semibold uppercase leading-snug tracking-[0.12em] text-foreground/85 dark:text-white/85 md:text-base">
                  Full Stack Developer & AI Researcher
                </p>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3">
              <a
                href="/assets/CV Pradip.pdf"
                download="Pradip_Bhatt_CV.pdf"
                className="group relative inline-flex min-h-11 items-center gap-2 overflow-hidden rounded-full bg-primary px-5 py-2.5 font-researcher text-sm tracking-wide text-primary-foreground transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:shadow-primary/40"
              >
                <span className="absolute inset-0 -translate-x-full skew-x-[-20deg] bg-white/20 transition-transform duration-500 group-hover:translate-x-[120%]" aria-hidden />
                Download CV
                <Download size={15} className="transition-transform group-hover:-translate-y-0.5" />
              </a>
              <a
                href="#projects"
                className="group inline-flex min-h-11 items-center gap-2 rounded-full border border-primary/40 bg-primary/[0.05] px-5 py-2.5 font-researcher text-sm tracking-wide text-foreground dark:text-white/85 transition-all duration-300 hover:border-primary hover:bg-primary/10 hover:text-emerald-600 dark:hover:text-[#00ff9d]"
              >
                View Projects
                <ArrowDown size={14} className="transition-transform group-hover:translate-y-0.5" />
              </a>
              </div>

              <div className="mt-6 grid w-full max-w-[34rem] grid-cols-2 gap-px overflow-hidden rounded-xl border border-primary/20 bg-primary/20 p-px shadow-sm sm:grid-cols-4">
              {[
                { k: "3+", v: "Years Exp." },
                { k: "20+", v: "Projects" },
                { k: "5+", v: "Awards" },
                { k: "NEC", v: "Certified" },
              ].map((item) => (
                <div
                  key={item.k}
                  className="flex flex-col items-center bg-background/90 px-3 py-3 text-center"
                >
                  <span className="text-lg font-bold leading-none text-primary">{item.k}</span>
                  <span className="mt-1 text-[10px] uppercase tracking-[0.12em] text-foreground/70 dark:text-white/70">{item.v}</span>
                </div>
              ))}
              </div>
            </div>
          </div>

          {/* ── Right: background-free portrait gallery ── */}
          <div className="mx-auto mt-10 flex w-full max-w-[280px] shrink-0 flex-col overflow-visible lg:mx-0 lg:mt-0 lg:sticky lg:top-[5.5rem] lg:self-center">


            <div ref={portraitWrapRef} className="relative" style={{ transformStyle: "preserve-3d" }}>
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
      <div className="absolute bottom-6 left-1/2 z-30 -translate-x-1/2 flex flex-col items-center gap-1.5 text-emerald-500/50 dark:text-[#00ff9d]/35 lg:hidden">
        <div className="h-8 w-px bg-gradient-to-b from-transparent to-emerald-500/40 dark:to-[#00ff9d]/40" />
        <ArrowDown size={14} />
      </div>

      {/* Social rail — desktop */}
      <div className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center lg:flex">
        <div className="flex flex-col items-center rounded-sm border border-emerald-500/20 dark:border-[#00ff9d]/15 bg-background/80 dark:bg-[#05080f]/70 px-2 py-3 backdrop-blur-sm shadow-sm dark:shadow-none">
          {socialLinks.map((social) => (
            <Link
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              className="group relative p-3.5 text-foreground/55 dark:text-white/60 transition-colors duration-200 hover:text-emerald-600 dark:hover:text-[#00ff9d]"
            >
              <social.icon size={17} />
              <span className="pointer-events-none absolute right-full top-1/2 mr-2.5 -translate-y-1/2 translate-x-1 whitespace-nowrap rounded border border-emerald-500/30 dark:border-[#00ff9d]/30 bg-background/95 dark:bg-[#05080f]/95 px-2 py-0.5 text-[10px] text-emerald-600 dark:text-[#00ff9d] opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100" style={{ fontFamily: "var(--font-mono-terminal)" }}>
                {social.label}
              </span>
            </Link>
          ))}
        </div>
        <div className="mt-2 h-4 w-px bg-emerald-500/20 dark:bg-[#00ff9d]/20" />
      </div>

      {/* Social bar — mobile */}
      <div className="absolute bottom-5 left-0 right-0 z-30 flex justify-center lg:hidden">
        <div className="flex items-center gap-1 rounded-sm border border-emerald-500/20 dark:border-[#00ff9d]/15 bg-background/80 dark:bg-[#05080f]/70 px-3 py-2 backdrop-blur-sm shadow-sm dark:shadow-none">
          {socialLinks.map((social) => (
            <Link
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              className="p-3.5 text-foreground/55 dark:text-white/60 transition-colors hover:text-emerald-600 dark:hover:text-[#00ff9d]"
            >
              <social.icon size={17} />
            </Link>
          ))}
        </div>
      </div>

    </section>
  );
}
