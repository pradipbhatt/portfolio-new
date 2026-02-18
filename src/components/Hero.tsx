"use client";

import { Download, Facebook, Github, Instagram, Linkedin, ArrowDown, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const roles = ["Full Stack Developer", "UI/UX Designer", "Creative Photographer", "Problem Solver"];

const socialLinks = [
    { icon: Linkedin, href: "https://www.linkedin.com/in/pradipbhatt2126/", label: "LinkedIn" },
    { icon: Github, href: "https://github.com/pradipbhatt", label: "GitHub" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Facebook, href: "#", label: "Facebook" },
];

export default function Hero() {
    const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
    const [displayText, setDisplayText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [mounted, setMounted] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end start"]
    });

    const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
    const bgOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
    const bgScale = useTransform(scrollYProgress, [0, 1], [1, 0.88]);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        const currentRole = roles[currentRoleIndex];
        const updateText = () => {
            if (!isDeleting) {
                setDisplayText(currentRole.substring(0, displayText.length + 1));
                if (displayText === currentRole) {
                    setTimeout(() => setIsDeleting(true), 2500);
                }
            } else {
                setDisplayText(currentRole.substring(0, displayText.length - 1));
                if (displayText === "") {
                    setIsDeleting(false);
                    setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
                }
            }
        };

        const typingSpeed = isDeleting ? 40 : 120;
        const timer = setTimeout(updateText, typingSpeed);

        return () => clearTimeout(timer);
    }, [displayText, isDeleting, currentRoleIndex, mounted]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.12, delayChildren: 0.3 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 25 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const }
        }
    };

    const floatVariants = {
        initial: { y: 0 },
        animate: {
            y: [-8, 8, -8],
            transition: { duration: 5, repeat: Infinity, ease: "easeInOut" as const }
        }
    };

    const glowVariants = {
        initial: { scale: 0.8, opacity: 0.2 },
        animate: {
            scale: [0.8, 1.1, 0.8],
            opacity: [0.2, 0.4, 0.2],
            transition: { duration: 4, repeat: Infinity, ease: "easeInOut" as const }
        }
    };

    return (
        <section ref={sectionRef} id="home" className="min-h-[55vh] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 bg-background overflow-hidden relative pt-20">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-background via-[#0a0a0a] to-background" />
            
            <div className="absolute inset-0 opacity-[0.03]" 
                style={{ 
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                                     linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                    backgroundSize: '50px 50px'
                }} 
            />

            {/* PRA.DEV Background Watermark */}
            <motion.div
                initial={{ opacity: 0, scale: 1.08 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.8, delay: 0.3, ease: "easeOut" }}
                style={{ y: bgY, scale: bgScale }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-[1] overflow-hidden px-6"
            >
                <motion.span
                    style={{ opacity: bgOpacity }}
                    className="font-squid text-[3rem] sm:text-[4.5rem] md:text-[6rem] lg:text-[8rem] xl:text-[10rem] tracking-[0.12em] font-black whitespace-nowrap leading-none"
                >
                    <span style={{ color: 'rgba(255, 255, 255, 0.08)', textShadow: '0 0 60px rgba(255, 255, 255, 0.02)' }}>PRA</span>
                    <span style={{ color: 'rgba(224, 96, 49, 0.12)', textShadow: '0 0 12px rgba(224, 96, 49, 0.15), 0 0 30px rgba(224, 96, 49, 0.08), 0 0 60px rgba(224, 96, 49, 0.04)' }}>.DEV</span>
                </motion.span>
            </motion.div>

            {/* Floating Orbs */}
            <motion.div 
                variants={glowVariants}
                initial="initial"
                animate="animate"
                className="absolute top-24 left-0 w-64 h-64 bg-[#E06031]/8 rounded-full blur-[100px]"
            />
            <motion.div 
                variants={glowVariants}
                initial="initial"
                animate="animate"
                style={{ animationDelay: '1.5s' }}
                className="absolute bottom-32 right-0 w-72 h-72 bg-purple-500/8 rounded-full blur-[100px]"
            />

            {/* Main Content */}
            <div className="relative w-full max-w-6xl mx-auto min-h-[55vh] flex flex-col lg:flex-row justify-center items-center gap-6 lg:gap-8">
                
                {/* Left Content */}
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="flex flex-col items-center lg:items-start text-center lg:text-left z-10 flex-1 max-w-xl"
                >
                    <motion.div variants={itemVariants} className="mb-5">
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.08] text-sm text-gray-500">
                            <Sparkles size={12} className="text-[#E06031]" />
                            <span className="text-gray-400">Welcome to my portfolio</span>
                        </span>
                    </motion.div>

                    <motion.h1 variants={itemVariants} className="font-researcher text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-5 leading-[1.15]">
                        <span className="text-white">Hi, I'm </span>
                        <span className="text-[#E06031] relative">
                            Pradip Bhatt
                            <motion.span 
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ delay: 0.8, duration: 0.6 }}
                                className="absolute -bottom-1.5 left-0 w-full h-0.5 bg-[#E06031]/60 rounded-full"
                            />
                        </span>
                    </motion.h1>

                    <motion.div variants={itemVariants} className="h-10 md:h-12 mb-6">
                        <p className="text-lg md:text-2xl text-gray-400 font-researcher tracking-wide">
                            {mounted ? (
                                <span className="text-white">
                                    {displayText}
                                    <motion.span
                                        animate={{ opacity: [1, 0] }}
                                        transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
                                        className="text-[#E06031] ml-0.5"
                                    >
                                        |
                                    </motion.span>
                                </span>
                            ) : (
                                "Full Stack Developer"
                            )}
                        </p>
                    </motion.div>

                    <motion.p variants={itemVariants} className="text-gray-500 text-sm md:text-base max-w-md mb-8 leading-relaxed">
                        I craft exceptional digital experiences with modern technologies. 
                        Passionate about building scalable applications and creating intuitive user interfaces.
                    </motion.p>

                    <motion.div variants={itemVariants} className="flex flex-wrap justify-center lg:justify-start gap-3 mb-4">
                        <a
                            href="/Pradip-Bhatt-cv.pdf"
                            download="Pradip-Bhatt-cv.pdf"
                            className="group relative overflow-hidden bg-[#E06031] text-white px-6 py-2.5 rounded-full font-researcher text-sm tracking-wide transition-all duration-300 hover:shadow-[0_0_20px_rgba(224,96,49,0.3)] hover:scale-[1.02]"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                Download CV
                                <Download size={16} className="transition-transform group-hover:-translate-y-0.5" />
                            </span>
                        </a>
                        
                        <a
                            href="#projects"
                            className="px-6 py-2.5 rounded-full border border-white/15 text-white font-researcher text-sm tracking-wide transition-all duration-300 hover:border-[#E06031]/50 hover:text-[#E06031] flex items-center gap-2"
                        >
                            View Projects
                            <ArrowDown size={14} />
                        </a>
                    </motion.div>

                    <motion.div variants={itemVariants} className="flex flex-wrap justify-center lg:justify-start gap-6 md:gap-10">
                        <div className="text-center">
                            <h3 className="text-2xl md:text-3xl font-bold text-white font-researcher">3+</h3>
                            <p className="text-gray-600 text-xs">Years</p>
                        </div>
                        <div className="text-center">
                            <h3 className="text-2xl md:text-3xl font-bold text-white font-researcher">20+</h3>
                            <p className="text-gray-600 text-xs">Projects</p>
                        </div>
                        <div className="text-center">
                            <h3 className="text-2xl md:text-3xl font-bold text-white font-researcher">10+</h3>
                            <p className="text-gray-600 text-xs">Clients</p>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Right Content - Image */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.4 }}
                    className="relative flex justify-center items-center w-full max-w-sm lg:max-w-md mt-6 lg:mt-0"
                >
                    {/* Glow */}
                    <motion.div 
                        variants={glowVariants}
                        initial="initial"
                        animate="animate"
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] lg:w-[380px] lg:h-[380px] bg-[#E06031]/15 rounded-full blur-[70px]"
                    />

                    <motion.div 
                        variants={floatVariants}
                        initial="initial"
                        animate="animate"
                        className="relative w-full aspect-[3/4] max-h-[380px] lg:max-h-[500px]"
                    >
                        {/* Frame */}
                        <div className="absolute -inset-3 border border-white/[0.06] rounded-3xl" />
                        
                        <div className="relative w-full h-full rounded-2xl overflow-hidden">
                            <Image
                                src="/assets/me-hero.png"
                                alt="Pradip Bhatt"
                                fill
                                className="object-cover object-top"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
                        </div>

                        {/* Floating Badge */}
                        <motion.div 
                            initial={{ opacity: 0, x: 15 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1.2 }}
                            className="absolute -right-2 top-6 bg-white/[0.06] backdrop-blur-md border border-white/[0.08] px-3 py-2 rounded-lg"
                        >
                            <p className="text-[10px] text-gray-500">Available for</p>
                            <p className="text-xs text-[#E06031] font-medium">Freelance</p>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </div>

            {/* Desktop Social Sidebar - Elegant Thin Design */}
            <motion.div 
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.5 }}
                className="fixed right-5 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center z-40"
            >
                {/* Thin vertical container */}
                <div className="flex flex-col items-center py-3 px-2 bg-white/[0.02] border border-white/[0.06] rounded-full backdrop-blur-sm">
                    {socialLinks.map((social, index) => (
                        <Link 
                            key={social.label}
                            href={social.href} 
                            target="_blank"
                            className="p-2.5 text-gray-500 hover:text-white transition-colors duration-200 group relative"
                        >
                            <social.icon size={18} />
                            <span className="absolute right-full mr-2.5 top-1/2 -translate-y-1/2 px-2 py-1 bg-[#E06031] rounded-md text-[10px] text-white opacity-0 group-hover:opacity-100 group-hover:translate-x-0 translate-x-1 transition-all duration-200 whitespace-nowrap">
                                {social.label}
                            </span>
                        </Link>
                    ))}
                </div>
                
                {/* Vertical line */}
                <div className="w-px h-4 bg-white/[0.1] mt-2" />
            </motion.div>

            {/* Mobile Social Bar - Clean & Compact */}
            <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 }}
                className="flex lg:hidden justify-center items-center gap-1 absolute bottom-5 left-0 right-0 z-30"
            >
                <div className="flex items-center gap-1 py-2 px-3 bg-white/[0.03] border border-white/[0.06] rounded-full backdrop-blur-sm">
                    {socialLinks.map((social) => (
                        <Link 
                            key={social.label}
                            href={social.href} 
                            target="_blank"
                            className="p-2.5 text-gray-500 hover:text-white transition-colors duration-200"
                        >
                            <social.icon size={18} />
                        </Link>
                    ))}
                </div>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 lg:hidden"
            >
                <motion.div
                    animate={{ y: [0, 6, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="flex flex-col items-center gap-1.5 text-gray-600"
                >
                    <span className="text-[10px] uppercase tracking-widest">Scroll</span>
                    <ArrowDown size={14} />
                </motion.div>
            </motion.div>
        </section>
    );
}
