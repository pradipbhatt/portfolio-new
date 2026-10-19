"use client";

import { useRef } from "react";
import { useGsapReveal } from "@/lib/gsapReveal";
import { HoverLetters } from "@/components/ui/HoverLetters";
import { Code, GraduationCap, Award, Camera, Lightbulb, Mail, ExternalLink, BadgeCheck } from "lucide-react";
import { Highlight } from "@/components/ui/Highlight";
import Image from "next/image";

const aboutContent = {
    name: "Pradip Bhatt",
    title: "Full Stack Developer & AI Researcher",
    bio: "Full stack developer and AI researcher focused on AI-powered applications, intelligent automation, and practical software engineering. B.E. Computer Engineering graduate from Far Western University, Mahendranagar. Former President of ICEC FWU, NASA Space Apps 2024 regional finalist, and open source community builder across Sudurpaschim Province.",
    education: {
        degree: "B.E. Computer Engineering",
        school: "Far Western University, Mahendranagar"
    },
    certification: "NEC Certified Engineer",
    interests: [
        { icon: Award, label: "AI Research" },
        { icon: Code, label: "Open Source" },
        { icon: Camera, label: "Photography" },
        { icon: Lightbulb, label: "Community" }
    ]
};

export default function About() {
    const headingRef = useRef<HTMLDivElement>(null);
    useGsapReveal(headingRef);

    return (
        <section id="about" className="py-6 relative">
            <div className="container mx-auto px-4">
                <div ref={headingRef} className="text-center mb-4">
                    <h2 className="text-3xl md:text-4xl font-bold">
                        <HoverLetters text="About" activeColor="hover:text-primary/80" />{" "}
                        <span className="text-primary">
                            <HoverLetters text="Me" activeColor="hover:text-foreground hover:drop-shadow-[0_0_6px_rgba(193,89,40,0.6)]" />
                        </span>
                    </h2>
                </div>

                <div className="grid md:grid-cols-12 gap-6 items-start">
                    <div className="md:col-span-4 lg:col-span-4">
                        <div className="relative aspect-[3/4] max-w-[280px] mx-auto rounded-2xl overflow-hidden border-2 border-primary/20 shadow-lg shadow-primary/10">
                            <Image
                                src="https://avatars.githubusercontent.com/pradipbhatt?size=560"
                                alt={aboutContent.name}
                                fill
                                sizes="(max-width: 768px) 240px, 280px"
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        </div>
                        
                        <div className="max-w-[280px] mx-auto mt-3 space-y-2">
                            <div className="flex items-center justify-center gap-2 bg-card/80 backdrop-blur-sm rounded-lg p-2 border border-primary/10 hover:border-primary/40 hover:bg-card/90 transition-all duration-300">
                                <GraduationCap className="w-4 h-4 text-primary" />
                                <span className="text-sm">{aboutContent.education.degree}, {aboutContent.education.school}</span>
                            </div>
                            <div className="flex items-center justify-center gap-2 bg-card/80 backdrop-blur-sm rounded-lg p-2 border border-primary/10 hover:border-primary/40 hover:bg-card/90 transition-all duration-300">
                                <BadgeCheck className="w-4 h-4 text-primary" />
                                <span className="text-sm">{aboutContent.certification}</span>
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-8 lg:col-span-8 space-y-4">
                        <div>
                            <h3 className="text-2xl md:text-3xl font-bold mb-1">
                                <HoverLetters text="Hi, I'm" activeColor="hover:text-muted-foreground" />{" "}
                                <span className="text-primary">
                                    <HoverLetters text={aboutContent.name} activeColor="hover:text-foreground hover:drop-shadow-[0_0_8px_rgba(193,89,40,0.5)]" />
                                </span>
                            </h3>
                            <p className="text-lg font-medium text-primary/90">
                                <HoverLetters text={aboutContent.title} activeColor="hover:text-primary" />
                            </p>
                        </div>

                        <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                            Full stack developer and AI researcher focused on{" "}
                            <Highlight delay={0.1}>AI-powered applications, intelligent automation, and practical software engineering.</Highlight>{" "}
                            B.E. Computer Engineering graduate from Far Western University, Mahendranagar. Former President of ICEC FWU,{" "}
                            <Highlight delay={0.2}>NASA Space Apps 2024 regional finalist,</Highlight>{" "}
                            and open source community builder across Sudurpaschim Province.
                        </p>

                        <div className="rounded-xl border border-primary/20 bg-card/50 p-4">
                            <h4 className="font-semibold mb-3">Past Work Experience</h4>
                            <h5 className="text-primary font-semibold">Security Research Analyst</h5>
                            <p className="text-sm font-medium">SecurityPal AI · Full-time</p>
                            <p className="mt-1 text-xs text-muted-foreground">April 15 – October 15, 2026 · Kathmandu · On-site</p>
                            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                                Worked on Fortune-scale customer assurance, AI-driven GRC reviews, and security assessments.
                            </p>
                        </div>

                        <div className="grid grid-cols-3 gap-3 py-2">
                            <div className="group text-center p-3 bg-card/50 rounded-xl border border-primary/10 hover:border-primary/40 hover:bg-card/70 hover:shadow-md hover:shadow-primary/5 transition-all duration-300">
                                <div className="text-2xl font-bold text-primary group-hover:scale-110 transition-transform duration-300 inline-block">3+</div>
                                <div className="text-xs text-muted-foreground group-hover:text-foreground transition-colors duration-300">Yrs. Exp.</div>
                            </div>
                            <div className="group text-center p-3 bg-card/50 rounded-xl border border-primary/10 hover:border-primary/40 hover:bg-card/70 hover:shadow-md hover:shadow-primary/5 transition-all duration-300">
                                <div className="text-2xl font-bold text-primary group-hover:scale-110 transition-transform duration-300 inline-block">20+</div>
                                <div className="text-xs text-muted-foreground group-hover:text-foreground transition-colors duration-300">Projects</div>
                            </div>
                            <div className="group text-center p-3 bg-card/50 rounded-xl border border-primary/10 hover:border-primary/40 hover:bg-card/70 hover:shadow-md hover:shadow-primary/5 transition-all duration-300">
                                <div className="text-2xl font-bold text-primary group-hover:scale-110 transition-transform duration-300 inline-block">5+</div>
                                <div className="text-xs text-muted-foreground group-hover:text-foreground transition-colors duration-300">Awards</div>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-2">
                                <HoverLetters text="What I" activeColor="hover:text-muted-foreground" />{" "}
                                <span className="text-primary">
                                    <HoverLetters text="Love" activeColor="hover:text-foreground hover:drop-shadow-[0_0_6px_rgba(193,89,40,0.4)]" />
                                </span>
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {aboutContent.interests.map((item, index) => (
                                    <span 
                                        key={index}
                                        className="group flex items-center gap-1.5 px-3 py-1.5 bg-card/50 rounded-full text-sm border border-primary/10 hover:border-primary/40 hover:bg-primary/10 hover:shadow-sm transition-all duration-300 cursor-default"
                                    >
                                        <item.icon className="w-4 h-4 text-primary group-hover:scale-110 transition-transform duration-300" />
                                        <span className="group-hover:text-primary transition-colors duration-300">{item.label}</span>
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <a 
                                href="#contact"
                                className="group flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 transition-all duration-300 text-sm font-medium"
                            >
                                <Mail className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                                Get In Touch
                            </a>
                            <a 
                                href="/assets/CV Pradip.pdf"
                                download
                                className="group flex items-center gap-2 px-4 py-2 bg-card border border-primary/20 rounded-lg hover:bg-card/80 hover:border-primary/50 hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 text-sm font-medium"
                            >
                                <ExternalLink className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                                Download CV
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
