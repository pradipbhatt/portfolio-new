"use client";

import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

const gpaData = [
    { semester: 1, gpa: 3.05 },
    { semester: 2, gpa: 3.08 },
    { semester: 3, gpa: 3.10 },
    { semester: 4, gpa: 3.14 },
    { semester: 5, gpa: 3.45 },
    { semester: 6, gpa: 3.35 },
    { semester: 7, gpa: 3.78 },
    { semester: 8, gpa: 3.88 },
];

const maxGPA = 4.0;
const minGPA = 2.5;

export default function GPAVisualization() {
    const avgGPA = (gpaData.reduce((sum, item) => sum + item.gpa, 0) / gpaData.length).toFixed(2);

    return (
        <section id="gpa" className="py-20 bg-background">
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold font-squid tracking-wider mb-4">
                        A<span className="text-primary">c</span>ademic P<span className="text-primary">r</span>ogress
                    </h2>
                    <p className="text-xl text-primary/80 font-medium mb-2">Bachelor of Engineering (B.E.) in Computer Engineering</p>
                    <p className="text-muted-foreground">Comprehensive academic performance analysis over 4 years</p>
                </motion.div>

                <div className="max-w-5xl mx-auto">
                    <div className="bg-[#1a1a1a] p-8 rounded-xl border border-white/5">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            <div className="bg-secondary/30 p-4 rounded-lg border border-white/5">
                                <p className="text-xs text-muted-foreground mb-1">Average GPA</p>
                                <p className="text-2xl font-bold text-primary">{avgGPA}</p>
                            </div>
                            <div className="bg-secondary/30 p-4 rounded-lg border border-white/5">
                                <p className="text-xs text-muted-foreground mb-1">Highest GPA</p>
                                <p className="text-2xl font-bold text-green-500">3.88</p>
                            </div>
                            <div className="bg-secondary/30 p-4 rounded-lg border border-white/5">
                                <p className="text-xs text-muted-foreground mb-1">Latest GPA</p>
                                <p className="text-2xl font-bold text-blue-500">3.88</p>
                            </div>
                            <div className="bg-secondary/30 p-4 rounded-lg border border-white/5 flex items-center gap-2">
                                <TrendingUp className="text-green-500" size={20} />
                                <div>
                                    <p className="text-xs text-muted-foreground">Trend</p>
                                    <p className="text-sm font-bold text-green-500">Consistent Growth</p>
                                </div>
                            </div>
                        </div>

                        {/* Graph */}
                        <div className="relative h-80 mb-8">
                            {/* Y-axis labels */}
                            <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-between text-xs text-muted-foreground">
                                <span>4.0</span>
                                <span>3.5</span>
                                <span>3.0</span>
                                <span>2.5</span>
                            </div>

                            {/* Graph area */}
                            <div className="ml-14 h-full relative">
                                {/* Grid lines */}
                                <div className="absolute inset-0 flex flex-col justify-between">
                                    {[4.0, 3.5, 3.0, 2.5].map((value) => (
                                        <div key={value} className="border-t border-white/5" />
                                    ))}
                                </div>

                                {/* Container for bars and dots */}
                                <div className="absolute inset-0">
                                    {gpaData.map((data, index) => {
                                        const totalBars = gpaData.length;
                                        const barWidth = 100 / totalBars; // percentage width for each bar
                                        const leftPosition = (index / totalBars) * 100 + barWidth / 2; // center of each bar
                                        const height = ((data.gpa - minGPA) / (maxGPA - minGPA)) * 100;
                                        const delay = index * 0.1;

                                        return (
                                            <motion.div
                                                key={data.semester}
                                                initial={{ height: 0, opacity: 0 }}
                                                whileInView={{ height: `${height}%`, opacity: 1 }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 0.5, delay }}
                                                className="absolute bottom-0 group"
                                                style={{
                                                    left: `${(index / totalBars) * 100}%`,
                                                    width: `${barWidth * 0.8}%`, // 80% of available space for gap
                                                }}
                                            >
                                                {/* Bar */}
                                                <div className="absolute bottom-0 w-full h-full bg-gradient-to-t from-primary/80 to-primary/40 rounded-t-lg border-t-2 border-primary hover:from-primary hover:to-primary/60 transition-all duration-300">
                                                    {/* GPA Label on hover */}
                                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-primary text-white text-xs px-2 py-1 rounded whitespace-nowrap z-20">
                                                        {data.gpa}
                                                    </div>
                                                </div>

                                                {/* Dot positioned at top of bar */}
                                                <div className="absolute -top-[4px] left-1/2 -translate-x-1/2 z-10">
                                                    <motion.div
                                                        initial={{ scale: 0 }}
                                                        whileInView={{ scale: 1 }}
                                                        viewport={{ once: true }}
                                                        transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                                                        className="relative"
                                                    >
                                                        {/* Glow effect */}
                                                        <div className="absolute inset-0 w-6 h-6 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 bg-primary rounded-full blur-md opacity-60" />
                                                        {/* Main dot */}
                                                        <div className="relative w-4 h-4 bg-primary rounded-full border-[3px] border-white shadow-lg" />
                                                    </motion.div>
                                                </div>

                                                {/* Semester label */}
                                                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-muted-foreground whitespace-nowrap">
                                                    Sem {data.semester}
                                                </div>
                                            </motion.div>
                                        );
                                    })}

                                    {/* Connecting line using SVG */}
                                    <svg className="absolute inset-0 pointer-events-none overflow-visible" style={{ width: '100%', height: '100%' }}>
                                        <motion.path
                                            initial={{ pathLength: 0 }}
                                            whileInView={{ pathLength: 1 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 1.5, delay: 0.5 }}
                                            d={(() => {
                                                const totalBars = gpaData.length;
                                                const barWidth = 100 / totalBars;

                                                return gpaData
                                                    .map((data, index) => {
                                                        const x = ((index / totalBars) * 100 + barWidth / 2);
                                                        const y = 100 - ((data.gpa - minGPA) / (maxGPA - minGPA)) * 100;
                                                        return index === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
                                                    })
                                                    .join(' ');
                                            })()}
                                            fill="none"
                                            stroke="#E06031"
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            vectorEffect="non-scaling-stroke"
                                            style={{
                                                transform: 'scale(1)',
                                                transformOrigin: 'top left',
                                            }}
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Achievement Note */}
                        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 text-center">
                            <p className="text-sm text-muted-foreground">
                                <span className="text-primary font-bold">Academic Excellence:</span> Maintained a strong upward trajectory in the B.E. Computer Engineering program, improving from 3.05 to a stellar 3.88 GPA.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
