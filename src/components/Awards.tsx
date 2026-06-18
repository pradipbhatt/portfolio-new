"use client";

import { useRef } from "react";
import { useGsapReveal } from "@/lib/gsapReveal";
import { Highlight } from "@/components/ui/Highlight";
import { awards } from "@/data/awards";
import Image from "next/image";
import { Trophy, Briefcase, Users, Star } from "lucide-react";

const typeConfig = {
    Hackathon: { label: "Hackathon Win", icon: Trophy, color: "text-yellow-400", bg: "bg-yellow-400/10 border-yellow-400/20" },
    Career: { label: "Career", icon: Briefcase, color: "text-blue-400", bg: "bg-blue-400/10 border-blue-400/20" },
    Community: { label: "Community", icon: Users, color: "text-green-400", bg: "bg-green-400/10 border-green-400/20" },
    Recognition: { label: "Recognition", icon: Star, color: "text-purple-400", bg: "bg-purple-400/10 border-purple-400/20" },
} as const;

function HoverLetters({ text, activeColor = "hover:text-primary" }: { text: string; activeColor?: string }) {
    return (
        <>
            {text.split("").map((letter, i) => (
                <span
                    key={i}
                    className={`inline-block transition-[transform,color,filter] duration-200 cursor-default ${letter === " " ? "w-[0.25em]" : `${activeColor} hover:-translate-y-[2px] hover:scale-110`}`}
                >
                    {letter === " " ? " " : letter}
                </span>
            ))}
        </>
    );
}

export default function Awards() {
    const headingRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);
    useGsapReveal(headingRef);
    useGsapReveal(gridRef, { stagger: 0.07 });

    return (
        <section id="awards" className="py-16 bg-background">
            <div className="container mx-auto px-6">
                <div ref={headingRef} className="text-center mb-10">
                    <h2 className="text-3xl md:text-4xl font-bold mb-3">
                        <HoverLetters text="Awards &" activeColor="hover:text-primary/80" />{" "}
                        <span className="text-primary">
                            <HoverLetters text="Achievements" activeColor="hover:text-foreground hover:drop-shadow-[0_0_6px_rgba(193,89,40,0.6)]" />
                        </span>
                    </h2>
                    <p className="max-w-xl mx-auto text-sm text-muted-foreground">
                        <Highlight delay={0.1}>Hackathon placements, career milestones,</Highlight> and open-source community recognition across Nepal and beyond.
                    </p>
                </div>

                <div ref={gridRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {awards.map((award, index) => {
                        const cfg = typeConfig[award.type];
                        const Icon = cfg.icon;
                        return (
                            <div
                                key={index}
                                className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card/90 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
                            >
                                <div className="relative h-48 overflow-hidden">
                                    <Image
                                        src={award.image}
                                        alt={award.title}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                                    <div className="absolute top-3 left-3">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border backdrop-blur-sm ${cfg.bg} ${cfg.color}`}>
                                            <Icon size={11} />
                                            {cfg.label}
                                        </span>
                                    </div>
                                    <div className="absolute top-3 right-3">
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-black/50 text-white/80 backdrop-blur-sm border border-white/10">
                                            {award.year}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-5 flex-1 flex flex-col gap-2">
                                    <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors leading-snug">
                                        {award.title}
                                    </h3>
                                    <p className="text-xs text-muted-foreground font-medium">
                                        {award.subtitle}
                                    </p>
                                    <p className="text-xs text-muted-foreground/80 leading-relaxed mt-1 flex-1">
                                        {award.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
