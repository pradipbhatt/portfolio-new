"use client";

import { projects } from "@/data/projects";
import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

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

    return (
        <section id="projects" className="py-20 bg-background">
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-10"
                >
                    <h2 className="text-4xl md:text-5xl font-bold font-squid tracking-wider mb-6">
                        P<span className="text-primary">r</span>ojects
                    </h2>

                    <div className="flex flex-wrap justify-center gap-3">
                        {categories.map((category) => (
                            <button
                                key={category}
                                type="button"
                                onClick={() => handleCategoryChange(category)}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                                    activeCategory === category
                                        ? "bg-primary text-primary-foreground border-primary"
                                        : "bg-transparent text-muted-foreground border-white/10 hover:border-primary/50 hover:text-primary"
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {visibleProjects.map((project, index) => (
                        <motion.div
                            key={project.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.08 }}
                            className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card/90 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md cursor-pointer"
                            onClick={() => {
                                if (project.demoLink && project.demoLink !== "#") {
                                    window.open(project.demoLink, "_blank");
                                }
                            }}
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
                                <span className="inline-flex items-center text-[11px] uppercase tracking-[0.2em] text-muted-foreground/80 mb-1.5">
                                    {project.category}
                                </span>
                                <h3 className="text-lg font-semibold mb-2.5 font-display text-foreground group-hover:text-primary transition-colors">
                                    {project.title}
                                </h3>
                                <p className="text-muted-foreground text-sm mb-5 flex-1 leading-relaxed line-clamp-4">
                                    {project.description}
                                </p>
                                <div className="flex items-center justify-between gap-4 mt-auto pt-3 border-t border-border/60">
                                    <div className="flex gap-3">
                                        <Link
                                            href={project.repoLink ?? "#"}
                                            target="_blank"
                                            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <Github size={14} />
                                            <span>Code</span>
                                        </Link>
                                        <Link
                                            href={project.demoLink ?? "#"}
                                            target="_blank"
                                            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <ExternalLink size={14} />
                                            <span>Live</span>
                                        </Link>
                                    </div>
                                    {project.tags[0] && (
                                        <span className="text-[10px] px-2.5 py-1 rounded-full border border-border/80 text-muted-foreground/80">
                                            {project.tags[0]}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Show More/Less Buttons */}
                {filteredProjects.length > 6 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="flex justify-center mt-12"
                    >
                        <div className="flex gap-3">
                            {hasMoreProjects && (
                                <button
                                    onClick={loadMore}
                                    className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors"
                                >
                                    Show More ({filteredProjects.length - visibleProjects.length} remaining)
                                </button>
                            )}
                            {visibleCount > 6 && (
                                <button
                                    onClick={showLess}
                                    className="px-6 py-2.5 rounded-full border border-border text-foreground font-medium text-sm hover:border-primary/50 hover:text-primary transition-colors"
                                >
                                    Show Less
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}
            </div>
        </section>
    );
}

