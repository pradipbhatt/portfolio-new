"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
    Bot,
    Brain,
    Sparkles,
    Code2,
    Database
} from "lucide-react";
import {
    SiArduino,
    SiCloudinary,
    SiCplusplus,
    SiDocker,
    SiExpress,
    SiFigma,
    SiGit,
    SiMongodb,
    SiNextdotjs,
    SiNodedotjs,
    SiPostman,
    SiPython,
    SiReact,
    SiRemix,
    SiTailwindcss
} from "react-icons/si";

const skillCategories = {
    "Frontend": [
        {
            title: "React JS",
            subtitle: "Hooks, Context, State Management",
            icon: <SiReact size={20} />,
            color: "text-cyan-400",
            level: 90,
            gradient: "from-cyan-500/20 to-blue-500/20"
        },
        {
            title: "Next.js",
            subtitle: "SSR, SSG, App Router",
            icon: <SiNextdotjs size={20} />,
            color: "text-white",
            level: 85,
            gradient: "from-gray-500/20 to-slate-500/20"
        },
        {
            title: "Remix.js",
            subtitle: "Full-stack React",
            icon: <SiRemix size={20} />,
            color: "text-blue-500",
            level: 80,
            gradient: "from-blue-500/20 to-indigo-500/20"
        },
        {
            title: "Tailwind",
            subtitle: "Responsive Design",
            icon: <SiTailwindcss size={20} />,
            color: "text-cyan-500",
            level: 95,
            gradient: "from-cyan-500/20 to-teal-500/20"
        },
    ],
    "Backend": [
        {
            title: "Node.js",
            subtitle: "Express, REST APIs",
            icon: <SiNodedotjs size={20} />,
            color: "text-green-600",
            level: 85,
            gradient: "from-green-500/20 to-emerald-500/20"
        },
        {
            title: "Express",
            subtitle: "Middleware, Routing",
            icon: <SiExpress size={20} />,
            color: "text-gray-400",
            level: 85,
            gradient: "from-gray-500/20 to-zinc-500/20"
        },
        {
            title: "MongoDB",
            subtitle: "Schemas, Aggregations",
            icon: <SiMongodb size={20} />,
            color: "text-green-500",
            level: 80,
            gradient: "from-green-500/20 to-lime-500/20"
        },
        {
            title: "Cloudinary",
            subtitle: "Media Management",
            icon: <SiCloudinary size={20} />,
            color: "text-blue-300",
            level: 75,
            gradient: "from-blue-500/20 to-sky-500/20"
        },
    ],
    "AI/ML": [
        {
            title: "ML",
            subtitle: "Neural Networks",
            icon: <Bot size={20} />,
            color: "text-indigo-500",
            level: 75,
            gradient: "from-indigo-500/20 to-purple-500/20"
        },
        {
            title: "AI",
            subtitle: "NLP, CV",
            icon: <Brain size={20} />,
            color: "text-rose-500",
            level: 70,
            gradient: "from-rose-500/20 to-pink-500/20"
        },
        {
            title: "Python",
            subtitle: "Keras, TensorFlow",
            icon: <SiPython size={20} />,
            color: "text-purple-500",
            level: 80,
            gradient: "from-purple-500/20 to-violet-500/20"
        },
        {
            title: "C/C++",
            subtitle: "DS, Algorithms",
            icon: <SiCplusplus size={20} />,
            color: "text-blue-400",
            level: 75,
            gradient: "from-blue-500/20 to-indigo-500/20"
        },
    ],
    "Tools": [
        {
            title: "Git",
            subtitle: "Collaboration",
            icon: <SiGit size={20} />,
            color: "text-orange-500",
            level: 90,
            gradient: "from-orange-500/20 to-amber-500/20"
        },
        {
            title: "Docker",
            subtitle: "Containerization",
            icon: <SiDocker size={20} />,
            color: "text-blue-400",
            level: 80,
            gradient: "from-blue-500/20 to-cyan-500/20"
        },
        {
            title: "Postman",
            subtitle: "API Testing",
            icon: <SiPostman size={20} />,
            color: "text-orange-400",
            level: 85,
            gradient: "from-orange-500/20 to-red-500/20"
        },
        {
            title: "UI/UX",
            subtitle: "Figma, Prototyping",
            icon: <SiFigma size={20} />,
            color: "text-pink-500",
            level: 85,
            gradient: "from-pink-500/20 to-rose-500/20"
        },
        {
            title: "IoT",
            subtitle: "Arduino, ESP8266",
            icon: <SiArduino size={20} />,
            color: "text-emerald-500",
            level: 70,
            gradient: "from-emerald-500/20 to-teal-500/20"
        },
    ],
};

function HoverLetters({ text, activeColor = "hover:text-primary" }: { text: string; activeColor?: string }) {
    return (
        <>
            {text.split("").map((letter, i) => (
                <span
                    key={i}
                    className={`inline-block transition-[transform,color,filter] duration-200 cursor-default ${letter === " " ? "w-[0.25em]" : `${activeColor} hover:-translate-y-[2px] hover:scale-110`}`}
                >
                    {letter === " " ? "\u00A0" : letter}
                </span>
            ))}
        </>
    );
}

const categoryIcons = {
    "Frontend": Code2,
    "Backend": Database,
    "AI/ML": Brain,
    "Tools": Sparkles,
} as const;

export default function Skills() {
    const [activeTab, setActiveTab] = useState<keyof typeof skillCategories>("Frontend");

    return (
        <section id="skills" className="py-6 relative overflow-hidden">
            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-6"
                >
                    <h2 className="text-3xl md:text-4xl font-bold">
                        <HoverLetters text="Skills &" activeColor="hover:text-primary/80" />{" "}
                        <span className="text-primary">
                            <HoverLetters text="Expertise" activeColor="hover:text-foreground hover:drop-shadow-[0_0_6px_rgba(193,89,40,0.6)]" />
                        </span>
                    </h2>
                </motion.div>

                {/* Tabs */}
                <div className="flex flex-wrap justify-center gap-2 mb-8">
                    {Object.keys(skillCategories).map((category) => {
                        const Icon = categoryIcons[category as keyof typeof categoryIcons];
                        const isActive = activeTab === category;
                        return (
                            <button
                                key={category}
                                onClick={() => setActiveTab(category as keyof typeof skillCategories)}
                                className={`group flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                                    isActive 
                                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                                    : "bg-card/50 border border-primary/10 text-muted-foreground hover:border-primary/40 hover:text-primary"
                                }`}
                            >
                                <Icon className={`w-4 h-4 transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"}`} />
                                {category}
                            </button>
                        );
                    })}
                </div>

                {/* Skills Grid */}
                <div className="max-w-4xl mx-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                        >
                            {skillCategories[activeTab].map((skill, index) => (
                                <motion.div
                                    key={skill.title}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                    className={`group relative p-4 rounded-xl border border-primary/10 bg-card/50 hover:border-primary/40 hover:bg-card/70 transition-all duration-300 overflow-hidden text-center`}
                                >
                                    <div className={`mx-auto p-2 bg-white/5 rounded-lg w-fit group-hover:bg-white/10 transition-all duration-300 mb-3 ${skill.color}`}>
                                        {skill.icon}
                                    </div>
                                    <h4 className={`text-sm font-bold mb-1 ${skill.color}`}>
                                        {skill.title}
                                    </h4>
                                    <p className="text-[10px] text-muted-foreground line-clamp-1">
                                        {skill.subtitle}
                                    </p>
                                    
                                    {/* Progress line indicator (Subtle) */}
                                    <div className="mt-3 w-full h-[2px] bg-primary/5 rounded-full overflow-hidden">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${skill.level}%` }}
                                            transition={{ duration: 1, delay: 0.5 }}
                                            className="h-full bg-primary/40"
                                        />
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}
