"use client";

import { motion } from "framer-motion";
import {
    Atom,
    Bot,
    Brain,
    Cloud,
    Code2,
    Container,
    Cpu,
    Database,
    GitBranch,
    Palette,
    Play,
    Send,
    Server,
    Sparkles,
    Terminal,
    Wifi,
    Wind
} from "lucide-react";



const skillCategories = {
    "Frontend Development": [
        {
            title: "React JS",
            subtitle: "Hooks, Context, State Management",
            icon: <Atom size={32} />,
            color: "text-cyan-400",
            level: 90,
            gradient: "from-cyan-500/20 to-blue-500/20"
        },
        {
            title: "Next.js",
            subtitle: "SSR, SSG, App Router",
            icon: <Code2 size={32} />,
            color: "text-white",
            level: 85,
            gradient: "from-gray-500/20 to-slate-500/20"
        },
        {
            title: "Remix.js",
            subtitle: "Full-stack React Framework",
            icon: <Code2 size={32} />,
            color: "text-blue-500",
            level: 80,
            gradient: "from-blue-500/20 to-indigo-500/20"
        },
        {
            title: "Tailwind CSS",
            subtitle: "Responsive Design, Custom Themes",
            icon: <Wind size={32} />,
            color: "text-cyan-500",
            level: 95,
            gradient: "from-cyan-500/20 to-teal-500/20"
        },
    ],
    "Backend Development": [
        {
            title: "Node.js",
            subtitle: "Express, REST APIs, Authentication",
            icon: <Server size={32} />,
            color: "text-green-600",
            level: 85,
            gradient: "from-green-500/20 to-emerald-500/20"
        },
        {
            title: "Express.js",
            subtitle: "Middleware, Routing, Error Handling",
            icon: <Terminal size={32} />,
            color: "text-gray-400",
            level: 85,
            gradient: "from-gray-500/20 to-zinc-500/20"
        },
        {
            title: "MongoDB",
            subtitle: "Aggregation, Indexing, Schemas",
            icon: <Database size={32} />,
            color: "text-green-500",
            level: 80,
            gradient: "from-green-500/20 to-lime-500/20"
        },
        {
            title: "Cloudinary",
            subtitle: "Media Management, Optimization",
            icon: <Cloud size={32} />,
            color: "text-blue-300",
            level: 75,
            gradient: "from-blue-500/20 to-sky-500/20"
        },
    ],
    "AI/ML & Programming": [
        {
            title: "Machine Learning",
            subtitle: "Classification, Regression, Neural Networks",
            icon: <Bot size={32} />,
            color: "text-indigo-500",
            level: 75,
            gradient: "from-indigo-500/20 to-purple-500/20"
        },
        {
            title: "Artificial Intelligence",
            subtitle: "NLP, Computer Vision, Deep Learning",
            icon: <Brain size={32} />,
            color: "text-rose-500",
            level: 70,
            gradient: "from-rose-500/20 to-pink-500/20"
        },
        {
            title: "Python",
            subtitle: "Pandas, NumPy, Keras, TensorFlow",
            icon: <Cpu size={32} />,
            color: "text-purple-500",
            level: 80,
            gradient: "from-purple-500/20 to-violet-500/20"
        },
        {
            title: "C/C++",
            subtitle: "OOP, Data Structures, Algorithms",
            icon: <Code2 size={32} />,
            color: "text-blue-400",
            level: 75,
            gradient: "from-blue-500/20 to-indigo-500/20"
        },
    ],
    "Tools & Others": [
        {
            title: "Git & GitHub",
            subtitle: "Version Control, Collaboration, CI/CD",
            icon: <GitBranch size={32} />,
            color: "text-orange-500",
            level: 90,
            gradient: "from-orange-500/20 to-amber-500/20"
        },
        {
            title: "Docker",
            subtitle: "Containerization, Deployment",
            icon: <Container size={32} />,
            color: "text-blue-400",
            level: 80,
            gradient: "from-blue-500/20 to-cyan-500/20"
        },
        {
            title: "Postman",
            subtitle: "API Testing, Documentation",
            icon: <Send size={32} />,
            color: "text-orange-400",
            level: 85,
            gradient: "from-orange-500/20 to-red-500/20"
        },
        {
            title: "Playground",
            subtitle: "Code Experimentation, Prototyping",
            icon: <Play size={32} />,
            color: "text-purple-400",
            level: 80,
            gradient: "from-purple-500/20 to-fuchsia-500/20"
        },
        {
            title: "UI/UX Design",
            subtitle: "Figma, Canva, Prototyping",
            icon: <Palette size={32} />,
            color: "text-pink-500",
            level: 85,
            gradient: "from-pink-500/20 to-rose-500/20"
        },
        {
            title: "IoT",
            subtitle: "Arduino, ESP8266, Sensors",
            icon: <Wifi size={32} />,
            color: "text-emerald-500",
            level: 70,
            gradient: "from-emerald-500/20 to-teal-500/20"
        },
    ],
};

export default function Skills() {
    return (
        <section id="skills" className="py-20 bg-background relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold font-squid tracking-wider mb-4">
                        S<span className="text-primary">k</span>ills & E<span className="text-primary">x</span>pertise
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        A comprehensive overview of my technical skills and proficiency levels
                    </p>
                </motion.div>

                <div className="space-y-12">
                    {Object.entries(skillCategories).map(([category, skills], categoryIndex) => (
                        <motion.div
                            key={category}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <Sparkles className="text-primary" size={24} />
                                <h3 className="text-2xl font-bold font-display text-white">
                                    {category}
                                </h3>
                                <div className="flex-1 h-px bg-gradient-to-r from-primary/50 to-transparent" />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {skills.map((skill, index) => (
                                    <motion.div
                                        key={skill.title}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.4, delay: index * 0.05 }}
                                        whileHover={{ scale: 1.05, y: -5 }}
                                        className={`relative bg-gradient-to-br ${skill.gradient} backdrop-blur-sm p-6 rounded-2xl flex flex-col gap-4 border border-white/10 group overflow-hidden`}
                                    >
                                        {/* Animated gradient overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                        {/* Glow effect */}
                                        <div className={`absolute -inset-1 bg-gradient-to-r ${skill.gradient} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`} />

                                        <div className="relative z-10">
                                            <div className={`p-3 bg-white/5 rounded-xl w-fit group-hover:bg-white/10 transition-all duration-300 ${skill.color}`}>
                                                {skill.icon}
                                            </div>

                                            <div className="mt-4">
                                                <h4 className={`text-xl font-bold font-display mb-1 ${skill.color}`}>
                                                    {skill.title}
                                                </h4>
                                                <p className="text-xs text-muted-foreground font-body">
                                                    {skill.subtitle}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
