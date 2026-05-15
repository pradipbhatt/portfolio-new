"use client";

import { Github, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Footer() {
    const [year] = useState(() => new Date().getFullYear());

    return (
        <footer className="bg-secondary py-12 border-t border-white/10">
            <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-center md:text-left">
                    <p className="text-muted-foreground text-sm">
                        © {year} Pradip Bhatt. Crafted with passion. Let&apos;s build something amazing together!
                    </p>
                </div>

                <div className="flex items-center gap-6">
                    <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                        <Github size={20} />
                    </Link>
                    <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                        <Linkedin size={20} />
                    </Link>
                    <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                        <Twitter size={20} />
                    </Link>
                </div>
            </div>
        </footer>
    );
}
