"use client";

import { motion } from "framer-motion";
import { Calendar, GitCommit, GitFork, Github, Star } from "lucide-react";
import { useEffect, useState } from "react";

interface GitHubStats {
    publicRepos: number;
    followers: number;
    following: number;
}

export default function GitHubContributions() {
    const [stats, setStats] = useState<GitHubStats | null>(null);
    const username = "pradipbhatt";

    useEffect(() => {
        // Fetch basic GitHub stats from public API
        fetch(`https://api.github.com/users/${username}`)
            .then(res => res.json())
            .then(data => {
                setStats({
                    publicRepos: data.public_repos || 0,
                    followers: data.followers || 0,
                    following: data.following || 0
                });
            })
            .catch(err => console.error("Error fetching GitHub stats:", err));
    }, []);

    const statCards = [
        {
            icon: <GitCommit size={24} />,
            label: "Public Repos",
            value: stats?.publicRepos || "...",
            color: "text-blue-400",
            gradient: "from-blue-500/20 to-cyan-500/20"
        },
        {
            icon: <Star size={24} />,
            label: "Followers",
            value: stats?.followers || "...",
            color: "text-yellow-400",
            gradient: "from-yellow-500/20 to-orange-500/20"
        },
        {
            icon: <GitFork size={24} />,
            label: "Following",
            value: stats?.following || "...",
            color: "text-green-400",
            gradient: "from-green-500/20 to-emerald-500/20"
        }
    ];

    return (
        <section id="github" className="py-20 bg-background relative overflow-hidden">
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
                    <h2 className="text-4xl md:text-5xl font-bold font-display tracking-wider mb-4">
                        Git<span className="text-primary">H</span>ub Contributi<span className="text-primary">o</span>ns
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        A visual representation of my coding journey and open-source contributions
                    </p>
                </motion.div>

                {/* Stats Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12"
                >
                    {statCards.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            whileHover={{ scale: 1.05, y: -5 }}
                            className={`relative bg-gradient-to-br ${stat.gradient} backdrop-blur-sm p-6 rounded-2xl border border-white/10 group overflow-hidden`}
                        >
                            {/* Glow effect */}
                            <div className={`absolute -inset-1 bg-gradient-to-r ${stat.gradient} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`} />

                            <div className="relative z-10 flex items-center gap-4">
                                <div className={`p-3 bg-white/5 rounded-xl group-hover:bg-white/10 transition-all duration-300 ${stat.color}`}>
                                    {stat.icon}
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground font-body">{stat.label}</p>
                                    <p className={`text-2xl font-bold font-display ${stat.color}`}>{stat.value}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Contribution Graph */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="relative bg-gradient-to-br from-primary/10 to-transparent backdrop-blur-sm p-8 rounded-2xl border border-white/10 overflow-hidden group"
                >
                    {/* Animated gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <Calendar className="text-primary" size={24} />
                            <h3 className="text-2xl font-bold font-display text-white">
                                Contribution Activity
                            </h3>
                        </div>

                        {/* Contribution Graph Image */}
                        <div className="bg-white/5 rounded-xl p-6 overflow-x-auto">
                            <img
                                src={`https://ghchart.rshah.org/39d353/${username}`}
                                alt="GitHub Contribution Graph"
                                className="w-full min-w-[600px] rounded-lg"
                                loading="lazy"
                            />
                        </div>

                        {/* GitHub Profile Link */}
                        <motion.a
                            href={`https://github.com/${username}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary/20 to-primary/10 hover:from-primary/30 hover:to-primary/20 border border-primary/30 rounded-xl text-white font-semibold transition-all duration-300 group/btn"
                        >
                            <Github size={20} />
                            <span>View Full Profile</span>
                            <motion.span
                                initial={{ x: 0 }}
                                whileHover={{ x: 5 }}
                                transition={{ duration: 0.2 }}
                            >
                                →
                            </motion.span>
                        </motion.a>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
