"use client";

import { awards } from "@/data/awards";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Awards() {
    return (
        <section id="awards" className="py-20 bg-background">
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-4xl md:text-5xl font-bold font-squid tracking-wider mb-3">
                        A<span className="text-primary">w</span>ards & A<span className="text-primary">c</span>hievements
                    </h2>
                    <p className="max-w-2xl mx-auto text-sm md:text-base text-muted-foreground">
                        A few milestones that shaped my journey—from hackathons and open source events to industry
                        experience in software engineering.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {awards.map((award, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.08 }}
                            className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card/90 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
                        >
                            <div className="relative h-56 overflow-hidden">
                                <Image
                                    src={award.image}
                                    alt={award.title}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/10 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                            </div>

                            <div className="p-5 flex-1 flex flex-col justify-center gap-1">
                                <span className="inline-flex items-center text-[11px] uppercase tracking-[0.2em] text-muted-foreground/80">
                                    Award
                                </span>
                                <h3 className="text-lg font-semibold font-display text-foreground group-hover:text-primary transition-colors">
                                    {award.title}
                                </h3>
                                <p className="text-muted-foreground text-sm">
                                    {award.subtitle}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
