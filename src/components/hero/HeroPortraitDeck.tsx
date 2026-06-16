"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

export type HeroPortraitSocial = {
  icon: LucideIcon;
  href: string;
  label: string;
};

const AUTO_MS = 2600;

/** Crossfade duration — keep below AUTO_MS so each image reads clearly */
const CROSSFADE_S = 1.12;
const EASE_SMOOTH = [0.4, 0, 0.2, 1] as const;

/** Exactly four portrait variants in `public/assets/` */
const PORTRAIT_SLIDES = [
  { src: "/assets/second variant poze.png", alt: "Pradip Bhatt — portrait variant 1" },
  { src: "/assets/third variant poze.png", alt: "Pradip Bhatt — portrait variant 2" },
  { src: "/assets/perpelexity third variant.png", alt: "Pradip Bhatt — portrait variant 3" },
  {
    src: "/assets/perpelexity third variant second poze.png",
    alt: "Pradip Bhatt — portrait variant 4",
  },
] as const;

type HeroPortraitDeckProps = {
  variant: "under-cta" | "right-rail";
  reduceMotion: boolean;
  socialLinks: HeroPortraitSocial[];
};

export function HeroPortraitDeck({
  variant,
  reduceMotion,
  socialLinks,
}: HeroPortraitDeckProps) {
  const n = PORTRAIT_SLIDES.length;
  const [active, setActive] = useState(0);
  const deckRef = useRef<HTMLDivElement>(null);

  const fadeTransition = reduceMotion
    ? { duration: 0 }
    : { duration: CROSSFADE_S, ease: EASE_SMOOTH };

  const advance = useCallback(() => {
    setActive((a) => (a + 1) % n);
  }, [n]);

  const goTo = useCallback((i: number) => {
    setActive(((i % n) + n) % n);
  }, [n]);

  const goPrev = useCallback(() => {
    setActive((a) => (a - 1 + n) % n);
  }, [n]);

  useEffect(() => {
    if (reduceMotion) return;
    const el = deckRef.current;
    if (!el) return;
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === "ArrowRight" || ev.key === "Enter" || ev.key === " ") {
        ev.preventDefault();
        advance();
      }
      if (ev.key === "ArrowLeft") {
        ev.preventDefault();
        goPrev();
      }
    };
    el.addEventListener("keydown", onKey);
    return () => el.removeEventListener("keydown", onKey);
  }, [advance, goPrev, reduceMotion]);

  useEffect(() => {
    if (reduceMotion) return;
    let timer: number | undefined;
    const start = () => {
      if (timer !== undefined) window.clearInterval(timer);
      timer = undefined;
      if (document.visibilityState !== "visible") return;
      timer = window.setInterval(() => advance(), AUTO_MS);
    };
    start();
    const onVis = () => {
      start();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      if (timer !== undefined) window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [advance, reduceMotion]);

  const sizes = variant === "under-cta" ? "260px" : "280px";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45, duration: 0.55 }}
      className={cn(
        "flex flex-col gap-2",
        variant === "under-cta" && "mt-4 max-w-[220px] sm:max-w-[260px]",
        variant === "right-rail" && "w-full max-w-[280px] lg:mx-0"
      )}
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-white/[0.12] bg-[#0d1420]/60 shadow-[0_8px_40px_rgba(0,0,0,0.35)] ring-1 ring-white/[0.06]">
        {reduceMotion ? (
          <Image
            src={PORTRAIT_SLIDES[0].src}
            alt={PORTRAIT_SLIDES[0].alt}
            fill
            className="object-cover object-top"
            sizes={sizes}
            priority
          />
        ) : (
          <div
            ref={deckRef}
            role="group"
            aria-label="Portrait gallery. Images crossfade automatically. Click the image or use arrow keys to change."
            tabIndex={0}
            className="relative h-full w-full cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            onClick={advance}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                advance();
              }
            }}
          >
            <AnimatePresence initial={false} mode="sync">
              <motion.div
                key={PORTRAIT_SLIDES[active].src}
                className="absolute inset-0 overflow-hidden rounded-2xl"
                initial={{ opacity: 0, scale: 1.035 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.01 }}
                transition={fadeTransition}
              >
                <Image
                  src={PORTRAIT_SLIDES[active].src}
                  alt={PORTRAIT_SLIDES[active].alt}
                  fill
                  className="object-cover object-top select-none"
                  sizes={sizes}
                  priority={active === 0}
                  draggable={false}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#05080f]/70 via-transparent to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#00d97e]/[0.07] to-transparent" />

        <div className="pointer-events-none absolute inset-y-4 right-2 z-[70] flex items-center lg:hidden">
          <div
            className="pointer-events-auto flex flex-col items-center gap-1 rounded-full border border-white/[0.1] bg-black/45 px-1.5 py-2 shadow-lg backdrop-blur-sm"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            {socialLinks.map((social) => (
              <Link
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor-pointer
                aria-label={social.label}
                className="rounded-full p-2 text-white/45 transition-colors hover:text-primary"
              >
                <social.icon size={16} />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {!reduceMotion ? (
        <div
          className="flex justify-center gap-1.5"
          role="tablist"
          aria-label="Jump to a portrait"
        >
          {PORTRAIT_SLIDES.map((slide, i) => (
            <button
              key={slide.src}
              type="button"
              role="tab"
              aria-selected={i === active}
              data-cursor-pointer
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i === active
                  ? "w-5 bg-primary"
                  : "w-1.5 bg-white/25 hover:bg-white/45"
              )}
              onClick={(e) => {
                e.stopPropagation();
                goTo(i);
              }}
            />
          ))}
        </div>
      ) : null}

      {!reduceMotion ? (
        <p className="text-center text-[10px] text-white/40">
          Smooth crossfade · auto {(AUTO_MS / 1000).toFixed(1)}s
        </p>
      ) : null}

      <p className="text-center text-[10px] uppercase tracking-[0.12em] text-white/40">
        SecurityPal · Engineering · Research
      </p>
    </motion.div>
  );
}
