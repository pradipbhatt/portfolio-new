"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const communityEvents = [
    // 2025 Events (Most Recent First)
    {
        title: "Sikaiverse Project Hackathon",
        role: "Hackathon Project Showcase",
        date: "2025",
        image: "/assets/sikaiverse project hakathon.png",
    },

    // 2024 Events
    {
        title: "Software Freedom Day Speaker",
        role: "Linux & Hacktoberfest Talk | Far West",
        date: "Sep 2024",
        image: "/assets/speaker in software freedom day 2024 far west.jpg",
    },
    {
        title: "Software Freedom Day 2024",
        role: "Open Source Celebration",
        date: "Sep 2024",
        image: "/assets/software freedom day 2024.jpg",
    },
    {
        title: "Software Freedom Day Cover",
        role: "Open Source Event Promotion",
        date: "Sep 2024",
        image: "/assets/software freedom day cover image.jpg",
    },
    {
        title: "GitHub Field Day Guide",
        role: "Application Guidance Session",
        date: "2024",
        image: "/assets/information sharing session after github field visit.jpg",
    },
    {
        title: "MERN Bootcamp Instructor",
        role: "Minor Project Training for 6th Semester",
        date: "2024",
        image: "/assets/mern workshop.jpg",
    },
    {
        title: "UI/UX Workshop Mentor",
        role: "3-Day Design Workshop | SNSC IT Club",
        date: "2024",
        image: "/assets/design workshop at snsc mentor.jpeg",
    },
    {
        title: "Git & GitHub Workshop",
        role: "Open Source Training | ICEC",
        date: "2024",
        image: "/assets/git and github workshop.jpg",
    },
    {
        title: "President - ICEC FWU",
        role: "Innovative Computer Engineering Club",
        date: "Feb 2024",
        image: "/assets/president last day.jpg",
    },

    // 2023 Events
    {
        title: "Province Level Ideathon Winner",
        role: "Provincial Innovation Competition",
        date: "2023",
        image: "/assets/provence level ideathon winner.jpg",
    },
    {
        title: "GitHub Field Visit Poster",
        role: "Information Session Promotion | SNSC",
        date: "2023",
        image: "/assets/poster for imformation session in snsc for github field visit 2023.jpg",
    },
    {
        title: "Information Session",
        role: "GitHub Field Visit Experience Sharing",
        date: "2023",
        image: "/assets/imformation session after github field visit 2023.jpg",
    },
    {
        title: "GitHub Fielder 2023",
        role: "GitHub Field Day Participant",
        date: "2023",
        image: "/assets/github fielder 2023.jpg",
    },
    {
        title: "Designing Event 2023",
        role: "Design Community Event",
        date: "2023",
        image: "/assets/designing event 2023.jpg",
    },
    {
        title: "Design Workshop SNSC",
        role: "UI/UX Design Training",
        date: "2023",
        image: "/assets/snsc design workshop.jpg",
    },
    {
        title: "CodeFest 2023 Hackathon",
        role: "Hackathon Participant",
        date: "2023",
        image: "/assets/codefest 2023 hakathon.jpg",
    },
];

export default function Community() {
    return (
        <section id="community" className="py-20 bg-background">
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold font-squid tracking-wider">
                        C<span className="text-primary">o</span>mmunity I<span className="text-primary">n</span>volvement
                    </h2>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {communityEvents.map((event, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="bg-[#1a1a1a] rounded-xl overflow-hidden flex flex-col group border border-white/5 hover:border-primary/30 transition-all duration-500 hover:scale-105"
                        >
                            <div className="relative h-64 overflow-hidden">
                                <Image
                                    src={event.image}
                                    alt={event.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute top-4 left-4">
                                    <span className="bg-primary/90 text-white text-xs font-bold px-3 py-1 rounded shadow-lg">
                                        {event.date}
                                    </span>
                                </div>
                            </div>

                            <div className="p-6 flex-1 flex flex-col justify-center">
                                <h3 className="text-2xl font-bold mb-2 font-display text-white group-hover:text-primary transition-colors">
                                    {event.title}
                                </h3>
                                <p className="text-muted-foreground text-sm font-medium text-[#C15928]">
                                    {event.role}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
