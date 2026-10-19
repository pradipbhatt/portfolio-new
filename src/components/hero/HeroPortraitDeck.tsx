"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

export type HeroPortraitSocial = {
  icon: LucideIcon;
  href: string;
  label: string;
};

const AUTO_MS = 5000;

/** Crossfade duration — keep below AUTO_MS so each image reads clearly */
const CROSSFADE_S = 1.15;
const EASE_SMOOTH = [0.45, 0, 0.55, 1] as const;

/** Background-free portraits supplied for the hero. */
const PORTRAIT_SLIDES = [
  { src: "/assets/hero-portrait-folded-cutout.png", alt: "Pradip Bhatt in a navy blazer, arms folded" },
  { src: "/assets/hero-portrait-pockets-cutout.png", alt: "Pradip Bhatt in a navy blazer, hands in pockets" },
  { src: "/assets/hero-portrait-lapel-cutout.png", alt: "Pradip Bhatt in a navy blazer, holding his lapel" },
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
      <div className="hero-portrait-stage relative aspect-[3/4] w-full overflow-hidden rounded-[1.75rem]">
        {reduceMotion ? (
          <Image
            src={PORTRAIT_SLIDES[0].src}
            alt={PORTRAIT_SLIDES[0].alt}
            fill
            className="hero-portrait-image object-cover object-top"
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
            {PORTRAIT_SLIDES.map((slide, i) => (
              <motion.div
                key={slide.src}
                className="absolute inset-0 overflow-hidden"
                initial={false}
                animate={{ opacity: i === active ? 1 : 0 }}
                transition={fadeTransition}
                aria-hidden={i !== active}
              >
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  className="hero-portrait-image object-cover object-top select-none"
                  sizes={sizes}
                  priority={i === 0}
                  loading={i === 0 ? undefined : "eager"}
                  draggable={false}
                />
              </motion.div>
            ))}
          </div>
        )}

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

    </motion.div>
  );
}
