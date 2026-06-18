"use client";

import { motion } from "framer-motion";
import { Download, FileText } from "lucide-react";
import Image from "next/image";

export default function Resume() {
    return (
        <section id="resume" className="py-20 bg-background relative overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-4xl md:text-5xl font-bold font-display tracking-wider mb-4">
                        R<span className="text-primary">e</span>sum<span className="text-primary">e</span>
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Download my complete CV or view it below
                    </p>
                </motion.div>

                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="relative group"
                    >
                        {/* CV Card */}
                        <div className="relative rounded-2xl overflow-hidden border border-border bg-card/60 backdrop-blur-sm shadow-2xl">
                            {/* CV Image */}
                            <div className="relative w-full aspect-[8.5/11] overflow-hidden">
                                <Image
                                    src="/assets/cv-page.png"
                                    alt="Pradip Bhatt Resume"
                                    fill
                                    className="object-contain object-top transition-transform duration-500 group-hover:scale-105"
                                    priority
                                />

                                {/* Hover overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>

                            {/* Download Button Overlay */}
                            <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                <a
                                    href="/assets/CV Pradip.pdf"
                                    download="Pradip_Bhatt_Resume.pdf"
                                    className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-primary/50 group/btn"
                                >
                                    <Download className="w-5 h-5 group-hover/btn:animate-bounce" />
                                    <span>Download Resume (PDF)</span>
                                </a>
                            </div>
                        </div>

                        {/* Floating Download Button (Mobile) */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="mt-6 md:hidden"
                        >
                            <a
                                href="/assets/CV Pradip.pdf"
                                download="Pradip_Bhatt_Resume.pdf"
                                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-semibold transition-all duration-300 shadow-lg"
                            >
                                <Download className="w-5 h-5" />
                                <span>Download Resume (PDF)</span>
                            </a>
                        </motion.div>

                        {/* Info Cards */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                            className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4"
                        >
                            <div className="p-6 rounded-xl border border-border bg-card/60 backdrop-blur-sm">
                                <div className="flex items-center gap-3 mb-2">
                                    <FileText className="w-5 h-5 text-primary" />
                                    <h3 className="font-semibold">Format</h3>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    PDF Document <span className="mx-1 opacity-40" aria-hidden>·</span> Professional Layout
                                </p>
                            </div>

                            <div className="p-6 rounded-xl border border-border bg-card/60 backdrop-blur-sm">
                                <div className="flex items-center gap-3 mb-2">
                                    <Download className="w-5 h-5 text-primary" />
                                    <h3 className="font-semibold">Quick Access</h3>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Click to download <span className="mx-1 opacity-40" aria-hidden>·</span> Ready to share
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
