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

export default function GPAVisualization() {
    const avgGPA = (gpaData.reduce((sum, item) => sum + item.gpa, 0) / gpaData.length).toFixed(2);

    return (
        <section id="gpa" className="py-6 relative">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-4"
                >
                    <h2 className="text-3xl md:text-4xl font-bold">
                        <HoverLetters text="Academic" activeColor="hover:text-primary/80" />{" "}
                        <span className="text-primary">
                            <HoverLetters text="Progress" activeColor="hover:text-foreground hover:drop-shadow-[0_0_6px_rgba(193,89,40,0.6)]" />
                        </span>
                    </h2>
                </motion.div>

                        <div className="max-w-5xl mx-auto">
                    <div className="bg-card p-8 rounded-xl border border-border">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            <div className="group text-center p-3 bg-card/50 rounded-xl border border-primary/10 hover:border-primary/40 hover:bg-card/70 hover:shadow-md hover:shadow-primary/5 transition-all duration-300">
                                <p className="text-xs text-muted-foreground group-hover:text-foreground transition-colors duration-300">Average GPA</p>
                                <p className="text-2xl font-bold text-primary group-hover:scale-110 transition-transform duration-300 inline-block">{avgGPA}</p>
                            </div>
                            <div className="group text-center p-3 bg-card/50 rounded-xl border border-primary/10 hover:border-primary/40 hover:bg-card/70 hover:shadow-md hover:shadow-primary/5 transition-all duration-300">
                                <p className="text-xs text-muted-foreground group-hover:text-foreground transition-colors duration-300">Highest GPA</p>
                                <p className="text-2xl font-bold text-primary group-hover:scale-110 transition-transform duration-300 inline-block">3.88</p>
                            </div>
                            <div className="group text-center p-3 bg-card/50 rounded-xl border border-primary/10 hover:border-primary/40 hover:bg-card/70 hover:shadow-md hover:shadow-primary/5 transition-all duration-300">
                                <p className="text-xs text-muted-foreground group-hover:text-foreground transition-colors duration-300">Latest GPA</p>
                                <p className="text-2xl font-bold text-primary group-hover:scale-110 transition-transform duration-300 inline-block">3.88</p>
                            </div>
                            <div className="group text-center p-3 bg-card/50 rounded-xl border border-primary/10 hover:border-primary/40 hover:bg-card/70 hover:shadow-md hover:shadow-primary/5 transition-all duration-300">
                                <div className="flex flex-col items-center justify-center">
                                    <TrendingUp className="w-5 h-5 text-primary group-hover:scale-110 transition-transform duration-300 mb-1" />
                                    <p className="text-xs text-muted-foreground group-hover:text-foreground transition-colors duration-300">Consistent Growth</p>
                                </div>
                            </div>
                        </div>

                        {/* Graph */}
                        <div className="relative h-80 mb-8 pb-10">
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
                                                <div className="absolute -bottom-10 md:-bottom-8 left-1/2 -translate-x-1/2 text-[10px] md:text-xs text-muted-foreground whitespace-nowrap -rotate-45 md:rotate-0 origin-top-left md:origin-center">
                                                    Sem {data.semester}
                                                </div>
                                            </motion.div>
                                        );
                                    })}

                                    {/* Connecting line using SVG */}
                                    <svg className="absolute inset-0 pointer-events-none overflow-visible text-primary" style={{ width: '100%', height: '100%' }}>
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
                                            stroke="currentColor"
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
                        <div className="mt-6 flex flex-wrap justify-center gap-2">
                            <span className="group flex items-center gap-1.5 px-3 py-1.5 bg-card/50 rounded-full text-xs border border-primary/10 hover:border-primary/40 hover:bg-primary/10 hover:shadow-sm transition-all duration-300 cursor-default">
                                <TrendingUp className="w-3.5 h-3.5 text-primary group-hover:scale-110 transition-transform duration-300" />
                                <span className="text-muted-foreground group-hover:text-primary transition-colors duration-300">
                                    <span className="text-primary font-bold mr-1">Academic Excellence:</span> 
                                    Maintained upward trajectory in B.E. Computer Engineering, from 3.05 to 3.88 GPA.
                                </span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
