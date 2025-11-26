"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const awards = [
    {
        title: "Top 10 - 100XNepal Hackathon",
        subtitle: "SOEIntel Platform | Selected from 50 Teams",
        image: "/assets/100x hakathon award for top 10.png",
    },
    {
        title: "Software Engineer",
        subtitle: "Hyperce | Sep 2025 - Present",
        image: "/assets/hyperce_acheivement.png",
    },
    {
        title: "Associate Software Engineer",
        subtitle: "CloudTech Nepal Pvt. Ltd. | Jun 2025",
        image: "/assets/associate software developer at cloud tech services.jpeg",
    },
    {
        title: "3rd Place - NASA Space Apps",
        subtitle: "Dhangadhi Region 2024 | Team CELESTIALS",
        image: "/assets/acheivement nasa space apps challene local winner.png",
    },
    {
        title: "GitHub Field Day 2023",
        subtitle: "Selected Participant | Open Source Community",
        image: "/assets/github fielder 2023.jpg",
    },
];

export default function Awards() {
    return (
        <section id="awards" className="py-20 bg-background">
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold font-squid tracking-wider">
                        A<span className="text-primary">w</span>ards & A<span className="text-primary">c</span>hievements
                    </h2>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8">
                    {awards.map((award, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="bg-[#1a1a1a] rounded-xl overflow-hidden flex flex-col group border border-white/5 hover:border-primary/30 transition-all duration-300"
                        >
                            <div className="relative h-64 overflow-hidden">
                                <Image
                                    src={award.image}
                                    alt={award.title}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                            </div>

                            <div className="p-6 flex-1 flex flex-col justify-center">
                                <h3 className="text-xl font-bold mb-2 font-display text-primary">{award.title}</h3>
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
