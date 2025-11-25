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
        <section id="home" className="min-h-screen flex flex-col justify-center items-center pt-16 px-4 bg-background overflow-hidden relative">
            <div className="relative w-full flex justify-center items-center">
                <div className="relative w-[450px] md:w-[600px] aspect-square flex justify-center items-center">
                    {/* Glow Effect */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#E06031]/20 rounded-full blur-[100px] -z-10" />

                    <Image
                        src="/assets/me-hero.png"
                        alt="Pra.dev"
                        fill
                        className="object-contain z-10 drop-shadow-2xl"
                        priority
                    />

                    {/* Text container */}
                    <div className="absolute top-[55%] md:left-[25%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 w-full z-20 px-8 text-center md:text-left">

                        {/* Pra.dev text */}
                        <h1 className="font-yapari text-5xl sm:text-6xl md:text-8xl lg:text-9xl text-white tracking-widest whitespace-nowrap font-bold">
                            Pra.dev
                        </h1>

                        {/* Role text with typewriter effect */}
                        <div className="h-[30px] md:h-[40px] mt-4" suppressHydrationWarning>
                            <p className="text-white text-lg md:text-4xl tracking-wider font-light opacity-80 inline font-researcher">
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
                            className="group relative mt-8 overflow-hidden border-[1px] border-[#E06031] text-[#E06031] hover:bg-[#E06031] transition-all duration-300 font-researcher tracking-wide whitespace-nowrap inline-flex items-center justify-center w-[200px] h-[50px] text-lg"
                        >
                            <span className="transform transition-all duration-300 group-hover:opacity-0">Download CV</span>
                            <Download className="absolute transform translate-y-[-20px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 group-hover:text-white transition-all duration-300" size={20} />
                        </a>
                    </div>
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
            <div className="flex md:hidden justify-center space-x-6 mt-12 z-30 pb-10">
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
        </section>
    );
}
