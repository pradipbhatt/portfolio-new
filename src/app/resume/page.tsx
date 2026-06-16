"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Download } from "lucide-react";
import Link from "next/link";

export default function ResumePage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Header with Back Button */}
            <div className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
                <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-medium">Back to Portfolio</span>
                    </Link>

                    <a
                        href="/assets/CV Pradip.pdf"
                        download="Pradip_Bhatt_Resume.pdf"
                        className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-semibold transition-all duration-300 shadow-lg"
                    >
                        <Download className="w-4 h-4" />
                        <span>Download PDF</span>
                    </a>
                </div>
            </div>

            {/* Main Content - PDF Preview */}
            <div className="pt-20 pb-6 px-6">
                <div className="container mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="max-w-6xl mx-auto"
                    >
                        {/* Title */}
                        <div className="text-center mb-6">
                            <h1 className="text-4xl md:text-5xl font-bold font-display tracking-wider mb-2">
                                R<span className="text-primary">e</span>sum<span className="text-primary">e</span>
                            </h1>
                            <p className="text-muted-foreground">Pradip Bhatt - Full Stack Developer</p>
                        </div>

                        {/* PDF Viewer — hidden on mobile where iframes don't render PDFs */}
                        <div className="hidden sm:block relative rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm shadow-2xl">
                            <iframe
                                src="/assets/CV Pradip.pdf"
                                className="w-full h-[calc(100vh-200px)] min-h-[600px]"
                                title="Pradip Bhatt Resume"
                            />
                        </div>

                        {/* Mobile fallback — browsers on phones don't render PDF iframes */}
                        <div className="sm:hidden flex flex-col items-center gap-6 py-12 px-4 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm text-center">
                            <p className="text-muted-foreground text-sm max-w-xs">
                                PDF preview isn&apos;t supported on mobile browsers. Download the PDF to view it in your device&apos;s PDF reader.
                            </p>
                            <a
                                href="/assets/CV Pradip.pdf"
                                download="Pradip_Bhatt_Resume.pdf"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-semibold transition-all duration-300 shadow-lg"
                            >
                                <Download className="w-5 h-5" />
                                <span>Download Resume</span>
                            </a>
                        </div>

                        {/* Download Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="mt-6 text-center"
                        >
                            <a
                                href="/assets/CV Pradip.pdf"
                                download="Pradip_Bhatt_Resume.pdf"
                                className="inline-flex items-center gap-3 px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-primary/50"
                            >
                                <Download className="w-5 h-5" />
                                <span>Download Resume (PDF)</span>
                            </a>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
