"use client";

import { Github, Linkedin, Instagram, Facebook } from "lucide-react";
import Link from "next/link";

const YEAR = new Date().getFullYear();

const socialLinks = [
  {
    icon: Github,
    href: "https://github.com/pradipbhatt",
    label: "GitHub",
  },
  {
    icon: Linkedin,
    href: "https://www.linkedin.com/in/pradipbhatt2126/",
    label: "LinkedIn",
  },
  {
    icon: Instagram,
    href: "https://www.instagram.com/pradipbhatt/",
    label: "Instagram",
  },
  {
    icon: Facebook,
    href: "https://www.facebook.com/pradipbhatt/",
    label: "Facebook",
  },
];

export default function Footer() {
  return (
    <footer className="bg-secondary py-12 border-t border-white/10">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <p className="text-muted-foreground text-sm">
            © {YEAR} Pradip Bhatt. Crafted with passion. Let&apos;s build something amazing together!
          </p>
        </div>

        <div className="flex items-center gap-6">
          {socialLinks.map(({ icon: Icon, href, label }) => (
            <Link
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Icon size={20} />
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
