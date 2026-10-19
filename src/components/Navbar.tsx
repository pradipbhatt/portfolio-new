"use client";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { Menu, X, Sun, Moon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useTheme } from "@/lib/ThemeProvider";

const navItems = [
    { name: "Home", href: "#home" },
    { name: "About Me", href: "#about" },
    { name: "Projects", href: "#projects" },
    { name: "Resume", href: "/resume" },
    { name: "Awards", href: "#awards" },
    // { name: "Arts", href: "#arts" },
    { name: "Community", href: "#community" },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { theme, toggleTheme } = useTheme();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            id="site-navbar"
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                scrolled ? "glass py-2 border-none" : "bg-transparent py-3"
            )}
        >
            <div className="container mx-auto px-6 flex items-center justify-center md:justify-between">
                {/* Desktop Menu - Centered */}
                <div className="hidden md:flex items-center gap-8 mx-auto">
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="inline-flex min-h-11 items-center text-lg font-medium font-squid text-muted-foreground hover:text-primary transition-colors tracking-wide"
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>

                {/* Contact Button & Theme Toggle - Right */}
                <div className="hidden md:flex items-center gap-3 absolute right-6">
                    <button
                        onClick={toggleTheme}
                        className="p-3 rounded-full hover:bg-foreground/10 transition-colors text-muted-foreground hover:text-primary"
                        aria-label="Toggle theme"
                    >
                        {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                    <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground uppercase tracking-widest" asChild>
                        <Link href="#contact">Contact Me</Link>
                    </Button>
                </div>

                {/* Mobile: Theme Toggle & Menu Toggle */}
                <div className="md:hidden flex items-center gap-2 absolute right-6">
                    <button
                        onClick={toggleTheme}
                        className="p-3 rounded-full hover:bg-foreground/10 transition-colors text-foreground"
                        aria-label="Toggle theme"
                    >
                        {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                    <button
                        className="p-2.5 text-foreground rounded-md hover:bg-foreground/10 transition-colors"
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label={isOpen ? "Close menu" : "Open menu"}
                        aria-expanded={isOpen}
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 z-[60] glass border-t border-border p-6 flex flex-col gap-4 animate-in slide-in-from-top-5">
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="text-lg font-medium text-foreground hover:text-primary transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            {item.name}
                        </Link>
                    ))}
                    <Button className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground" variant="outline" asChild>
                        <Link href="#contact" onClick={() => setIsOpen(false)}>
                            Contact Me
                        </Link>
                    </Button>
                </div>
            )}
        </nav>
    );
}
