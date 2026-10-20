"use client";

import { useGsapReveal } from "@/lib/gsapReveal";
import { HoverLetters } from "@/components/ui/HoverLetters";
import Image from "next/image";
import { useRef } from "react";
import { communityEvents, type CommunityEvent } from "../data/community";

const months: Record<string, number> = {
  Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6,
  Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12,
};

function knownMonth(event: CommunityEvent) {
  return months[event.dateLabel.slice(0, 3)] ?? -1;
}

const sortedYears = [...new Set(communityEvents.map((event) => event.year))]
  .sort((a, b) => b - a);

const eventsByYear = Object.fromEntries(
  sortedYears.map((year) => [
    year,
    communityEvents
      .filter((event) => event.year === year)
      // Dated events are chronological; undated events keep their source order.
      .sort((a, b) => knownMonth(b) - knownMonth(a)),
  ])
) as Record<number, CommunityEvent[]>;

export default function Community() {
  const headingRef = useRef<HTMLDivElement>(null);
  useGsapReveal(headingRef);

  return (
    <section id="community" className="scroll-mt-20 bg-background py-16">
      <div className="container mx-auto px-6">
        <div ref={headingRef} className="mb-8 text-center">
          <h2 className="mb-3 text-3xl font-bold md:text-4xl">
            <HoverLetters text="Community" activeColor="hover:text-primary/80" />{" "}
            <span className="text-primary">
              <HoverLetters text="Involvement" activeColor="hover:text-foreground" />
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-sm text-muted-foreground">
            Talks, workshops, hackathons, and open-source community work.
          </p>
        </div>

        <nav aria-label="Community years" className="mb-12 flex flex-wrap justify-center gap-2">
          {sortedYears.map((year) => (
            <a
              key={year}
              href={`#community-${year}`}
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-card/70 px-4 text-sm font-medium transition-colors hover:border-primary/50 hover:text-primary"
            >
              {year}
              <span className="text-xs text-muted-foreground">{eventsByYear[year].length}</span>
            </a>
          ))}
        </nav>

        <div className="mx-auto max-w-6xl space-y-14">
          {sortedYears.map((year) => {
            const events = eventsByYear[year];
            return (
              <section key={year} id={`community-${year}`} className="scroll-mt-24">
                <div className="mb-5 flex items-baseline justify-between gap-4 border-b border-primary/25 pb-3">
                  <h3 className="text-2xl font-bold text-[var(--primary-on-surface)] md:text-3xl">{year}</h3>
                  <span className="text-sm text-muted-foreground">
                    {events.length} {events.length === 1 ? "event" : "events"}
                  </span>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                  {events.map((event, index) => {
                    const wide = events.length === 1 || (events.length % 2 === 1 && index === events.length - 1);
                    return (
                      <article
                        key={event.title}
                        className={`group flex min-w-0 flex-col overflow-hidden rounded-xl border border-border bg-card/80 transition-colors hover:border-primary/40 sm:flex-row ${wide ? "lg:col-span-2" : ""}`}
                      >
                        <div className="relative aspect-[16/9] shrink-0 overflow-hidden sm:aspect-auto sm:w-[38%]">
                          <Image
                            src={event.image}
                            alt=""
                            fill
                            sizes={wide ? "(max-width: 640px) calc(100vw - 48px), 400px" : "(max-width: 640px) calc(100vw - 48px), 220px"}
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                        <div className="flex min-w-0 flex-1 flex-col p-5">
                          <span className="mb-2 text-xs font-semibold text-[var(--primary-on-surface)]">{event.dateLabel}</span>
                          <h4 className="text-lg font-semibold leading-snug text-foreground">{event.title}</h4>
                          <p className="mt-1 text-xs font-medium uppercase tracking-wider text-[var(--primary-on-surface)]">{event.role}</p>
                          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{event.description}</p>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </section>
  );
}
