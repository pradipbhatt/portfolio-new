"use client";

import { Download, Facebook, Github, Instagram, Linkedin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const roles = ["Full Stack Developer", "Designer", "Photographer"];

export default function Hero() {
    const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
    const [displayText, setDisplayText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [mounted, setMounted] = useState(false);

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
                    setTimeout(() => setIsDeleting(true), 2000); // Wait before deleting
                }
            } else {
                setDisplayText(currentRole.substring(0, displayText.length - 1));
                if (displayText === "") {
                    setIsDeleting(false);
                    setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
                }
            }
        };

        const typingSpeed = isDeleting ? 50 : 150;
        const timer = setTimeout(updateText, typingSpeed);

        return () => clearTimeout(timer);
    }, [displayText, isDeleting, currentRoleIndex, mounted]);

    return (
        <section id="home" className="min-h-screen flex flex-col justify-center items-center pt-0 md:pt-16 px-4 bg-background overflow-hidden relative">
            <div className="relative w-full max-w-7xl mx-auto min-h-screen flex justify-center items-start md:items-end pb-0 md:pb-12">

                {/* Background Text Layer - The "Pra.dev" */}
                <div className="absolute top-[25%] md:top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center z-0 select-none pointer-events-none">
                    <h1 className="font-yapari text-[18vw] sm:text-[15vw] md:text-[14rem] text-white tracking-[0.1em] whitespace-nowrap font-black opacity-100 leading-none">
                        PRA.DEV
                    </h1>
                </div>

                {/* Central Image and Halo Layer */}
                <div className="relative z-10 mt-0 pt-16 md:pt-0 pointer-events-none">
                    {/* Halo Glow Effect */}
                    <div className="absolute top-[45%] md:top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-[#E06031] rounded-full opacity-20 blur-[100px] -z-10" />
                    <div className="absolute top-[45%] md:top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] sm:w-[350px] h-[200px] sm:h-[350px] bg-[#E06031] rounded-full opacity-30 blur-[80px] -z-10" />
                    <div className="absolute top-[45%] md:top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100px] sm:w-[200px] h-[100px] sm:h-[200px] bg-[#E06031] rounded-full opacity-50 blur-[40px] -z-10" />

                    <div className="relative h-[60vh] sm:h-[70vh] md:h-[90vh] aspect-[3/4] md:aspect-[2/3] flex justify-center items-end">
                        <Image
                            src="/assets/me-hero.png"
                            alt="Pra.dev"
                            fill
                            className="object-contain object-bottom drop-shadow-2xl"
                            priority
                        />
                    </div>
                </div>

                {/* Foreground Content Layer - Role and Button */}
                <div className="absolute bottom-20 sm:bottom-24 md:bottom-20 left-4 right-4 md:left-12 md:right-auto z-20 flex flex-col items-center md:items-start gap-3 sm:gap-4 md:gap-6">
                    {/* Role text with typewriter effect */}
                    <div className="h-[24px] md:h-[40px]" suppressHydrationWarning>
                        <p className="text-white text-lg md:text-3xl tracking-wider font-light opacity-90 font-researcher">
                            {mounted ? (
                                <>
                                    {displayText}
                                    <span className="animate-pulse">|</span>
                                </>
                            ) : (
                                "Full Stack Developer"
                            )}
                        </p>
                    </div>

                    {/* Download CV Button */}
                    <a
                        href="/Pradip-Bhatt-cv.pdf"
                        download="Pradip-Bhatt-cv.pdf"
                        className="group relative overflow-hidden border-[1px] border-[#E06031] text-[#E06031] hover:bg-[#E06031] transition-all duration-300 font-researcher tracking-wide whitespace-nowrap inline-flex items-center justify-center px-6 md:px-8 py-2 md:py-3 text-base md:text-lg"
                    >
                        <span className="transform transition-all duration-300 group-hover:opacity-0">Download CV</span>
                        <Download className="absolute transform translate-y-[-20px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 group-hover:text-white transition-all duration-300" size={20} />
                    </a>
                </div>
            </div>

            {/* Social Icons - Desktop Fixed Right */}
            <div className="fixed right-8 top-1/2 transform -translate-y-1/2 hidden md:flex flex-col space-y-6 z-30">
                <Link href="https://www.linkedin.com/in/pradipbhatt2126/" target="_blank" className="text-white hover:text-[#E06031] transition-colors">
                    <Linkedin size={24} />
                </Link>
                <Link href="https://github.com/pradipbhatt" target="_blank" className="text-white hover:text-[#E06031] transition-colors">
                    <Github size={24} />
                </Link>
                <Link href="#" target="_blank" className="text-white hover:text-[#E06031] transition-colors">
                    <Instagram size={24} />
                </Link>
                <Link href="#" target="_blank" className="text-white hover:text-[#E06031] transition-colors">
                    <Facebook size={24} />
                </Link>
            </div>

            {/* Social Icons - Mobile Bottom */}
            <div className="flex md:hidden justify-center space-x-6 absolute bottom-4 left-0 right-0 z-30">
                <Link href="https://www.linkedin.com/in/pradipbhatt2126/" target="_blank" className="text-white hover:text-[#E06031] transition-colors">
                    <Linkedin size={20} />
                </Link>
                <Link href="https://github.com/pradipbhatt" target="_blank" className="text-white hover:text-[#E06031] transition-colors">
                    <Github size={20} />
                </Link>
                <Link href="#" target="_blank" className="text-white hover:text-[#E06031] transition-colors">
                    <Instagram size={20} />
                </Link>
                <Link href="#" target="_blank" className="text-white hover:text-[#E06031] transition-colors">
                    <Facebook size={20} />
                </Link>
            </div>
        </section>
    );
}
