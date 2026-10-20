import { communityEvents } from "@/data/community";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return communityEvents.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = communityEvents.find((item) => item.slug === slug);
  if (!event) return { title: "Community story not found" };

  return {
    title: `${event.title} | Pradip Bhatt`,
    description: event.description,
    alternates: { canonical: `/community/${event.slug}` },
    openGraph: {
      title: event.title,
      description: event.description,
      images: [{ url: event.image, alt: event.title }],
    },
  };
}

export default async function CommunityStoryPage({ params }: Props) {
  const { slug } = await params;
  const event = communityEvents.find((item) => item.slug === slug);
  if (!event) notFound();

  const sameYear = communityEvents.filter((item) => item.year === event.year && item.slug !== slug);
  const related = [...sameYear, ...communityEvents.filter((item) => item.year !== event.year)]
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-background pb-20 pt-28 md:pt-32">
      <article className="mx-auto max-w-6xl px-6">
        <Link
          href="/#community"
          className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft aria-hidden="true" size={17} /> Back to Community
        </Link>

        <header className="max-w-4xl pb-8 pt-7 md:pb-10">
          <div className="mb-5 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[var(--primary-on-surface)]">
            <span>Community / {event.year}</span>
            <span aria-hidden="true" className="text-muted-foreground">·</span>
            <span>{event.dateLabel}</span>
          </div>
          <h1 className="max-w-4xl text-4xl font-bold leading-tight tracking-tight text-foreground md:text-6xl">
            {event.title}
          </h1>
          <p className="mt-4 text-base font-medium text-[var(--primary-on-surface)] md:text-lg">
            {event.role}
          </p>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            {event.description}
          </p>
        </header>

        <figure className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="relative aspect-[4/3] w-full bg-secondary/30 md:aspect-[16/9]">
            <Image
              src={event.image}
              alt={event.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 1152px"
              className="object-contain"
            />
          </div>
          <figcaption className="border-t border-border px-5 py-3 text-sm text-muted-foreground">
            {event.title} · {event.dateLabel}
          </figcaption>
        </figure>

        <div className="grid gap-10 border-b border-border py-12 md:grid-cols-[minmax(0,1fr)_18rem] md:gap-16 md:py-16">
          <section aria-labelledby="story-highlights">
            <h2 id="story-highlights" className="text-2xl font-bold text-foreground md:text-3xl">
              Event details
            </h2>
            <ul className="mt-6 space-y-4">
              {event.highlights.map((highlight) => (
                <li key={highlight} className="flex gap-4 text-base leading-relaxed text-muted-foreground">
                  <span aria-hidden="true" className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </section>

          <aside className="h-fit rounded-xl border border-border bg-card/70 p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">At a glance</h2>
            <dl className="mt-5 space-y-5 text-sm">
              <div>
                <dt className="text-muted-foreground">When</dt>
                <dd className="mt-1 font-medium text-foreground">{event.dateLabel}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Involvement</dt>
                <dd className="mt-1 font-medium text-foreground">{event.role}</dd>
              </div>
            </dl>
            {event.postUrl && (
              <a
                href={event.postUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex min-h-11 items-center gap-2 border-t border-border pt-4 text-sm font-medium text-[var(--primary-on-surface)] hover:underline"
              >
                Original Facebook post <ArrowUpRight aria-hidden="true" size={16} />
              </a>
            )}
          </aside>
        </div>

        {event.gallery && event.gallery.length > 0 && (
          <section className="border-b border-border py-12 md:py-16" aria-labelledby="story-gallery">
            <h2 id="story-gallery" className="mb-6 text-2xl font-bold text-foreground md:text-3xl">
              More from this story
            </h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {event.gallery.map((item) => (
                <figure key={item.src} className="overflow-hidden rounded-xl border border-border bg-card">
                  <div className="relative aspect-[4/3] bg-secondary/30">
                    <Image src={item.src} alt={item.alt} fill sizes="(max-width: 640px) 100vw, 550px" className="object-contain" />
                  </div>
                  <figcaption className="border-t border-border px-4 py-3 text-sm text-muted-foreground">
                    {item.caption}
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        )}

        <section className="py-12 md:py-16" aria-labelledby="related-stories">
          <div className="mb-6 flex items-center justify-between gap-4">
            <h2 id="related-stories" className="text-2xl font-bold text-foreground md:text-3xl">
              More community stories
            </h2>
            <Link href="/#community" className="text-sm font-medium text-[var(--primary-on-surface)] hover:underline">
              View all
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {related.map((item) => (
              <Link
                key={item.slug}
                href={`/community/${item.slug}`}
                className="group overflow-hidden rounded-xl border border-border bg-card/70 transition-colors hover:border-primary/50"
              >
                <span className="relative block aspect-[16/9] overflow-hidden bg-secondary/30">
                  <Image src={item.image} alt="" fill sizes="(max-width: 768px) 100vw, 370px" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                </span>
                <span className="flex items-start justify-between gap-4 p-5">
                  <span>
                    <span className="block text-xs font-medium text-[var(--primary-on-surface)]">{item.dateLabel}</span>
                    <span className="mt-2 block font-semibold leading-snug text-foreground">{item.title}</span>
                  </span>
                  <ArrowRight aria-hidden="true" size={18} className="mt-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                </span>
              </Link>
            ))}
          </div>
        </section>
      </article>
    </div>
  );
}
