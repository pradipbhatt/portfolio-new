"use client";

import { useRef } from "react";
import { useReveal } from "@/lib/useReveal";
import { Highlight } from "@/components/ui/Highlight";
import { awards, type AwardType } from "@/data/awards";
import Image from "next/image";

/**
 * Awards as an editorial grid: hairline-ruled entries, no boxes, no colour
 * coding. Motion is a staggered reveal as the grid enters view — the same
 * restrained treatment used elsewhere on the page.
 */
const TYPE_LABEL: Record<AwardType, string> = {
    Hackathon: "Hackathon",
    Career: "Career",
    Community: "Community",
    Recognition: "Recognition",
};

function HoverLetters({ text, activeColor = "hover:text-primary" }: { text: string; activeColor?: string }) {
    return (
        <>
            {text.split("").map((letter, i) => (
                <span
                    key={i}
                    className={`inline-block transition-[transform,color,filter] duration-200 cursor-default ${letter === " " ? "w-[0.25em]" : `${activeColor} hover:-translate-y-[2px] hover:scale-110`}`}
                >
                    {letter === " " ? " " : letter}
                </span>
            ))}
        </>
    );
}

export default function Awards() {
    const headingRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);
    useReveal(headingRef);
    useReveal(gridRef, { stagger: 0.08, y: 26 });

    return (
        <section id="awards" className="bg-background pb-24 pt-16">
            <div className="container mx-auto px-6">
                <div ref={headingRef} className="mb-14 text-center">
                    <h2 className="mb-3 text-3xl font-bold md:text-4xl">
                        <HoverLetters text="Awards &" activeColor="hover:text-primary/80" />{" "}
                        <span className="text-primary">
                            <HoverLetters text="Achievements" activeColor="hover:text-foreground hover:drop-shadow-[0_0_6px_rgba(193,89,40,0.6)]" />
                        </span>
                    </h2>
                    <p className="mx-auto max-w-xl text-sm text-muted-foreground">
                        <Highlight delay={0.1}>Hackathon placements, career milestones,</Highlight> and open-source community recognition across Nepal and beyond.
                    </p>
                </div>

                <div ref={gridRef} className="grid gap-x-10 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
                    {awards.map((award, index) => (
                        <article
                            key={index}
                            className="group flex flex-col border-t border-border pt-7" data-spotlight
                        >
                            <div className="relative mb-6 aspect-[4/3] w-full overflow-hidden">
                                <Image
                                    src={award.image}
                                    alt={award.title}
                                    fill
                                    sizes="(max-width: 768px) 90vw, (max-width: 1024px) 45vw, 30vw"
                                    className="object-contain opacity-80 transition-all duration-500 ease-out group-hover:scale-[1.02] group-hover:opacity-100"
                                />
                            </div>

                            <p className="text-sm text-muted-foreground">
                                {TYPE_LABEL[award.type]} · {award.year}
                            </p>

                            <h3 className="mt-2 text-xl font-semibold leading-snug text-foreground transition-colors duration-300 group-hover:text-primary">
                                {award.title}
                            </h3>
                            <p className="mt-2 text-[15px] leading-snug text-muted-foreground">
                                {award.subtitle}
                            </p>
                            <p className="mt-3 line-clamp-3 text-[15px] leading-relaxed text-muted-foreground/90">
                                {award.description}
                            </p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
