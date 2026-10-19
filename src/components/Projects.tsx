"use client";

import { projects } from "@/data/projects";
import { useGsapReveal } from "@/lib/gsapReveal";
import { HoverLetters } from "@/components/ui/HoverLetters";
import { ExternalLink, Trophy } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";

export default function Projects() {
    const [activeCategory, setActiveCategory] = useState<string>("All");
    const [visibleCount, setVisibleCount] = useState<number>(6);

    const categories = useMemo(
        () => ["All", ...Array.from(new Set(projects.map((project) => project.category)))],
        []
    );

    const filteredProjects = useMemo(
        () =>
            activeCategory === "All"
                ? projects
                : projects.filter((project) => project.category === activeCategory),
        [activeCategory]
    );

    const visibleProjects = useMemo(
        () => filteredProjects.slice(0, visibleCount),
        [filteredProjects, visibleCount]
    );

    const hasMoreProjects = visibleProjects.length < filteredProjects.length;

    const loadMore = () => {
        setVisibleCount(prev => Math.min(prev + 6, filteredProjects.length));
    };

    const showLess = () => {
        setVisibleCount(6);
    };

    // Reset visible count when category changes
    const handleCategoryChange = (category: string) => {
        setActiveCategory(category);
        setVisibleCount(6);
    };

    const headingRef = useRef<HTMLDivElement>(null);
    useGsapReveal(headingRef);

    return (
        <section id="projects" className="py-20 bg-background">
            <div className="container mx-auto px-6">
                <div ref={headingRef} className="text-center mb-10">
                    <h2 className="text-3xl md:text-4xl font-bold mb-3">
                        <HoverLetters text="My" activeColor="hover:text-primary/80" />{" "}
                        <span className="text-primary">
                            <HoverLetters text="Projects" activeColor="hover:text-foreground hover:drop-shadow-[0_0_6px_rgba(193,89,40,0.6)]" />
                        </span>
                    </h2>

                    <div className="flex flex-wrap justify-center gap-3">
                        {categories.map((category) => (
                            <button
                                key={category}
                                type="button"
                                onClick={() => handleCategoryChange(category)}
                                className={`min-h-11 px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                                    activeCategory === category
                                        ? "bg-primary text-primary-foreground border-primary"
                                        : "bg-transparent text-muted-foreground border-border hover:border-primary/50 hover:text-primary"
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {visibleProjects.map((project) => (
                        <div
                            key={project.title}
                            className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card/90 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
                        >
                            <div className="relative h-56 overflow-hidden">
                                <Image
                                    src={project.image}
                                    alt={project.title}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute top-3 right-3 flex flex-wrap gap-1.5">
                                    {project.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-background/80 text-foreground/80 border border-border/60 backdrop-blur-sm"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="p-5 flex-1 flex flex-col">
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="inline-flex items-center text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                                        {project.category}
                                    </span>
                                    {project.outcome && (
                                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 px-2 py-0.5 rounded-full">
                                            <Trophy size={10} />
                                            {project.outcome}
                                        </span>
                                    )}
                                </div>
                                <h3 className="text-lg font-semibold mb-2.5 font-display text-foreground group-hover:text-primary transition-colors">
                                    {project.title}
                                </h3>
                                <p className="text-muted-foreground text-sm mb-5 flex-1 leading-relaxed line-clamp-4">
                                    {project.description}
                                </p>
                                <div className="flex items-center justify-between gap-4 mt-auto pt-3 border-t border-border/60">
                                    <div className="flex gap-3">
                                        {project.demoLink && project.demoLink !== "#" && (
                                            <Link
                                                href={project.demoLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                aria-label={`Open live demo of ${project.title}`}
                                                className="inline-flex min-h-11 items-center gap-1.5 px-2 text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
                                            >
                                                <ExternalLink size={14} />
                                                <span>Live demo</span>
                                            </Link>
                                        )}
                                    </div>
                                    {project.tags[0] && (
                                        <span className="text-[10px] px-2.5 py-1 rounded-full border border-border/80 text-muted-foreground">
                                            {project.tags[0]}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Show More/Less Buttons */}
                {filteredProjects.length > 6 && (
                    <div className="flex justify-center mt-12">
                        <div className="flex gap-3">
                            {hasMoreProjects && (
                                <button
                                    onClick={loadMore}
                                    className="min-h-11 px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors"
                                >
                                    Show More ({filteredProjects.length - visibleProjects.length} remaining)
                                </button>
                            )}
                            {visibleCount > 6 && (
                                <button
                                    onClick={showLess}
                                    className="min-h-11 px-6 py-2.5 rounded-full border border-border text-foreground font-medium text-sm hover:border-primary/50 hover:text-primary transition-colors"
                                >
                                    Show Less
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
