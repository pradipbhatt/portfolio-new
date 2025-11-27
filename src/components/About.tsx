"use client";

import { motion } from "framer-motion";
import { Code, Database, GraduationCap, Palette, Server } from "lucide-react";
import Image from "next/image";

export default function About() {
    return (
        <section id="about" className="py-8 mb-20 bg-background relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[10%] left-[5%] w-[300px] h-[300px] bg-primary/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-[10%] right-[5%] w-[300px] h-[300px] bg-primary/5 rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-6"
                >
                    <h2 className="text-4xl md:text-5xl font-bold font-squid tracking-wider">
                        A<span className="text-primary">b</span>out <span className="text-primary">M</span>e
                    </h2>
                </motion.div>

                <div className="grid lg:grid-cols-12 gap-6 items-stretch">
                    {/* Left Column - Image */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="lg:col-span-5 relative h-full"
                    >
                        <div className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-full min-h-[300px] rounded-2xl overflow-hidden border border-white/10 group">
                            <Image
                                src="/assets/me formal.png"
                                alt="Pradip Bhatt"
                                fill
                                className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                            />
                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                        </div>
                    </motion.div>

                    {/* Right Column - Content */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="lg:col-span-7 space-y-6"
                    >
                        <div>
                            <h3 className="text-2xl font-bold text-primary mb-2 font-display tracking-wide">PRADIP BHATT</h3>
                            <p className="text-muted-foreground leading-relaxed text-base">
                                Recent Computer Engineering graduate with hands-on experience in modern web technologies (JavaScript, React, Node, Express, GSAP, Framer Motion, Tailwind, Vite). Started as an Associate Software Engineer at CloudTech Nepal (Jun-Aug 2025) and currently working as a Software Engineer at Hyperce (Sep 2025-Present), building headless ecommerce solutions using Vendure, GraphQL, Next.js, and Nest.js. Passionate about building solutions that empower students and streamline learning.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4">
                            {/* Education Card */}
                            <div className="bg-secondary/30 p-4 rounded-xl border border-white/5 hover:border-primary/30 transition-colors">
                                <h4 className="text-primary font-bold mb-3 flex items-center gap-2 font-display text-sm">
                                    <GraduationCap size={18} />
                                    EDUCATION
                                </h4>
                                <div className="space-y-2 text-xs">
                                    <div>
                                        <p className="font-semibold text-white">Far Western University</p>
                                        <p className="text-muted-foreground">B.E. Computer Engineering</p>
                                        <p className="text-[10px] text-muted-foreground">2021 - 2025 | Grade: A</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-white">Radiant Secondary School</p>
                                        <p className="text-muted-foreground">Intermediate</p>
                                        <p className="text-[10px] text-muted-foreground">2020 - 2022</p>
                                    </div>
                                </div>
                            </div>

                            {/* Skills Card */}
                            <div className="bg-secondary/30 p-4 rounded-xl border border-white/5 hover:border-primary/30 transition-colors">
                                <h4 className="text-primary font-bold mb-3 font-display text-sm">SKILLS</h4>
                                <div className="flex flex-wrap gap-1.5">
                                    {["Full Stack Dev", "UI/UX Design", "Leadership", "Problem Solving", "Project Management"].map((skill) => (
                                        <span
                                            key={skill}
                                            className="text-[10px] px-2 py-1 bg-primary/10 text-primary rounded-full border border-primary/20"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Tech Stack Card */}
                            <div className="bg-secondary/30 p-4 rounded-xl border border-white/5 hover:border-primary/30 transition-colors">
                                <h4 className="text-primary font-bold mb-3 font-display text-sm">TECH STACK</h4>
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        { name: "React", icon: <Code size={14} /> },
                                        { name: "Next.js", icon: <Code size={14} /> },
                                        { name: "Node.js", icon: <Server size={14} /> },
                                        { name: "GraphQL", icon: <Database size={14} /> },
                                        { name: "TypeScript", icon: <Code size={14} /> },
                                        { name: "Figma", icon: <Palette size={14} /> },
                                    ].map((tech) => (
                                        <div key={tech.name} className="flex flex-col items-center gap-1">
                                            <div className="text-primary">{tech.icon}</div>
                                            <span className="text-[10px] text-muted-foreground">{tech.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
