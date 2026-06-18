"use client";

import { useGsapReveal } from "@/lib/gsapReveal";
import { Highlight } from "@/components/ui/Highlight";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { communityEvents, type CommunityEvent } from "../data/community";

const eventsByYear: Record<number, CommunityEvent[]> = communityEvents.reduce(
  (acc, event) => {
    if (!acc[event.year]) acc[event.year] = [];
    acc[event.year].push(event);
    return acc;
  },
  {} as Record<number, CommunityEvent[]>
);

const sortedYears = Object.keys(eventsByYear)
  .map(Number)
  .sort((a, b) => b - a);

export default function Community() {
  const headingRef = useRef<HTMLDivElement>(null);
  useGsapReveal(headingRef);

  return (
    <section id="community" className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div ref={headingRef} className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold font-squid tracking-wider">
            C<span className="text-primary">o</span>mmunity I
            <span className="text-primary">n</span>volvement
          </h2>
          <p className="max-w-2xl mx-auto text-sm md:text-base text-muted-foreground">
            A visual journey of how I&apos;ve contributed to tech communities over the years —{" "}
            <Highlight delay={0.12}>speaking, mentoring, organizing and building together.</Highlight>
          </p>
        </div>

        <div className="relative">
          {/* Vertical timeline line */}
          <div className="pointer-events-none hidden md:block absolute left-6 top-0 bottom-0">
            <div className="w-px h-full bg-primary/25" />
          </div>

          <div className="space-y-12 md:space-y-16">
            {sortedYears.map((year) => (
              <div
                key={year}
                className="relative"
              >
                <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-10">
                  {/* Timeline node + year chip */}
                  <div className="flex md:flex-col items-center md:items-start gap-3 md:w-40">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="relative"
                    >
                      <svg
                        width="36"
                        height="36"
                        viewBox="0 0 36 36"
                        className="drop-shadow-[0_0_18px_rgba(0,0,0,0.5)]"
                      >
                        <circle cx="18" cy="18" r="9" fill="currentColor" className="text-primary" />
                        <circle
                          cx="18"
                          cy="18"
                          r="13"
                          stroke="rgba(255,255,255,0.35)"
                          strokeWidth="1"
                          fill="none"
                          strokeDasharray="4 6"
                        />
                      </svg>
                      <motion.span
                        className="absolute inset-0 rounded-full border border-primary/50"
                        initial={{ scale: 1, opacity: 0.7 }}
                        animate={{ scale: 1.3, opacity: 0 }}
                        transition={{
                          duration: 1.8,
                          repeat: Infinity,
                          ease: "easeOut",
                        }}
                      />
                    </motion.div>

                    <div className="inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-primary/90">
                      {year}
                    </div>
                  </div>

                  {/* Events for this year */}
                  <div className="flex-1">
                    <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-7">
                      {eventsByYear[year].map((event) => (
                        <article
                          key={event.title}
                          className="group relative overflow-hidden rounded-2xl bg-card border border-border hover:border-primary/40 shadow-[0_18px_45px_rgba(0,0,0,0.65)]"
                        >
                          <div className="relative h-52 overflow-hidden">
                            <Image
                              src={event.image}
                              alt={event.title}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                            <div className="absolute top-3 left-3">
                              <span className="rounded-full bg-black/60 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur">
                                {event.dateLabel}
                              </span>
                            </div>

                            <div className="absolute bottom-3 left-3 right-3">
                              <h3 className="text-base md:text-lg font-semibold text-foreground dark:text-white drop-shadow">
                                {event.title}
                              </h3>
                            </div>
                          </div>

                          <div className="relative p-4 md:p-5 space-y-2">
                            <p className="text-xs font-semibold text-primary/90 uppercase tracking-[0.15em]">
                              {event.role}
                            </p>
                            <p className="text-xs text-muted-foreground/90 leading-relaxed line-clamp-3">
                              {event.description}
                            </p>
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
