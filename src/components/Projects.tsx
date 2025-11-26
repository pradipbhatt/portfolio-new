"use client";

import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const projects = [
    {
        title: "SOEIntel - Edu-Tech Platform",
        description: "Fully customizable edu-tech platform with complete backend system. Selected as Top 10 from 50 teams at 100XNepal Hackathon. Designed to be flexible and scalable for academic use with every feature managed through backend.",
        image: "/assets/sikaiverse project hakathon.png",
        tags: ["Full Stack", "Backend", "Edu-Tech"],
        demoLink: "https://soeintel.vercel.app",
        repoLink: "#",
    },
    {
        title: "AstroYatra - NASA Space Apps 2025",
        description: "VR-powered web application taking users on a journey from the Big Bang to Earth's oceans. Combines NASA Earth observation data with immersive storytelling to illustrate ocean pollution and its impact. Built with team members Jelina Bhatt and Manoj.",
        image: "/assets/nasa spacce apps challenge 2025.png",
        tags: ["VR", "NASA", "WebGL"],
        demoLink: "https://yatra.earth",
        repoLink: "#",
    },
    {
        title: "Orrery Web App - NASA Space Apps 2024",
        description: "3D visualization of Near-Earth Objects, planets, satellites, and asteroids using Three.js. Won 3rd place in Dhangadhi region at NASA International Space Apps Challenge 2024 with Team CELESTIALS.",
        image: "/assets/nasa space apps 2024.jpg",
        tags: ["Three.js", "3D", "NASA"],
        demoLink: "https://team-celestials.vercel.app/",
        repoLink: "#",
    },
    {
        title: "कृषि Connect - Codefest 2024",
        description: "Farm-to-city platform connecting farmers from remote areas directly to city consumers. Bridges the gap between farmers and consumers with fresh produce delivery. Team Code With Her representing Sudurpaschim Province at National Level.",
        image: "/assets/codefest 2023 hakathon.jpg",
        tags: ["Agriculture", "E-commerce", "Social Impact"],
        demoLink: "#",
        repoLink: "#",
    },
    {
        title: "soeNotes",
        description: "A comprehensive web application for Far Western University School of Engineering students. Provides entrance exam preparation materials, notes, tutorials, syllabus, and practicals all in one platform.",
        image: "/assets/project1.png",
        tags: ["React.js", "Cloudinary", "MongoDB"],
        demoLink: "#",
        repoLink: "#",
    },
];

export default function Projects() {
    return (
        <section id="projects" className="py-20 bg-background">
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold font-squid tracking-wider">
                        P<span className="text-primary">r</span>ojects
                    </h2>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="bg-[#1a1a1a] rounded-xl overflow-hidden flex flex-col group border border-white/5 hover:border-primary/30 transition-all duration-300"
                        >
                            <div className="relative h-56 overflow-hidden">
                                <Image
                                    src={project.image}
                                    alt={project.title}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                                />
                                <div className="absolute top-4 right-4 flex gap-2">
                                    {project.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="text-xs font-bold px-3 py-1 rounded bg-[#C15928] text-white shadow-lg"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="p-6 flex-1 flex flex-col">
                                <h3 className="text-xl font-bold mb-3 font-display text-primary">{project.title}</h3>
                                <p className="text-muted-foreground text-sm mb-6 flex-1 leading-relaxed">
                                    {project.description}
                                </p>
                                <div className="flex gap-4 mt-auto">
                                    <Link href={project.repoLink} target="_blank" className="text-muted-foreground hover:text-white transition-colors">
                                        <Github size={20} />
                                    </Link>
                                    <Link href={project.demoLink} target="_blank" className="text-muted-foreground hover:text-white transition-colors">
                                        <ExternalLink size={20} />
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
