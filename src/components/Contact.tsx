"use client";

import emailjs from "@emailjs/browser";
import { Highlight } from "@/components/ui/Highlight";
import { HoverLetters } from "@/components/ui/HoverLetters";
import { useGsapReveal } from "@/lib/gsapReveal";
import { Check, Facebook, Github, Globe, Instagram, Linkedin, Mail, MapPin, Phone, X as XIcon } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";

const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!;
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!;
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!;

emailjs.init(EMAILJS_PUBLIC_KEY);

export default function Contact() {
    const headingRef = useRef<HTMLDivElement>(null);
    useGsapReveal(headingRef);
    const formRef = useRef<HTMLFormElement>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setLoading(true);
        setError("");
        setSuccess(false);

        try {
            if (!formRef.current) {
                setLoading(false);
                return;
            }

            // Get form data
            const formData = new FormData(formRef.current);

            // Prepare template parameters matching EmailJS template
            const templateParams = {
                title: 'New Contact Form Submission',
                name: formData.get('user_name') as string,
                email: formData.get('user_email') as string,
                time: new Date().toLocaleString('en-US', {
                    timeZone: 'Asia/Kathmandu',
                    dateStyle: 'full',
                    timeStyle: 'long'
                }),
                subject: formData.get('subject') as string,
                message: formData.get('message') as string
            };

            await emailjs.send(
                EMAILJS_SERVICE_ID,
                EMAILJS_TEMPLATE_ID,
                templateParams,
                EMAILJS_PUBLIC_KEY
            );

            setSuccess(true);
            formRef.current.reset();
            setTimeout(() => setSuccess(false), 5000);
        } catch (err: unknown) {
            const msg =
                err && typeof err === "object" && "text" in err && typeof (err as { text?: unknown }).text === "string"
                    ? (err as { text: string }).text
                    : err instanceof Error
                      ? err.message
                      : "Failed to send message. Please try again.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="contact" className="bg-background py-16">
            <div className="container mx-auto px-6">
                <div ref={headingRef} className="mb-10 text-center">
                    <h2 className="text-3xl font-bold md:text-4xl">
                        <HoverLetters text="Contact" activeColor="hover:text-primary/80" />{" "}
                        <span className="text-primary">
                            <HoverLetters text="Me" activeColor="hover:text-foreground hover:drop-shadow-[0_0_6px_rgba(193,89,40,0.6)]" />
                        </span>
                    </h2>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                    {/* Left Column - Contact Form */}
                    <div className="bg-card p-8 rounded-xl border border-border" suppressHydrationWarning>
                        <h3 className="text-2xl font-bold mb-6 font-display">Send a Message</h3>

                        {success && (
                            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-500 text-sm flex items-center gap-2">
                                <Check size={14} className="shrink-0" />
                                Message sent successfully! I&apos;ll get back to you soon.
                            </div>
                        )}

                        {error && (
                            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm flex items-center gap-2">
                                <XIcon size={14} className="shrink-0" />
                                {error}
                            </div>
                        )}

                        <form ref={formRef} className="space-y-6" onSubmit={handleSubmit}>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="user_name" className="block text-sm font-medium mb-2">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        id="user_name"
                                        name="user_name"
                                        required
                                        className="w-full px-4 py-3 rounded-lg bg-secondary border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                        placeholder="Your name"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="user_email" className="block text-sm font-medium mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="user_email"
                                        name="user_email"
                                        required
                                        className="w-full px-4 py-3 rounded-lg bg-secondary border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                        placeholder="your.email@example.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium mb-2">
                                    Subject
                                </label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    required
                                    className="w-full px-4 py-3 rounded-lg bg-secondary border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                    placeholder="What's this about?"
                                />
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-medium mb-2">
                                    Message
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows={5}
                                    required
                                    className="w-full px-4 py-3 rounded-lg bg-secondary border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
                                    placeholder="Your message here..."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 px-6 rounded-lg border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? "Sending..." : "Send Message"}
                            </button>
                        </form>
                    </div>

                    {/* Right Column - Contact Info */}
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-2xl font-bold mb-6 font-display">Get in Touch</h3>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-primary/10 rounded-lg">
                                        <Mail className="text-primary" size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold mb-1">Email</h4>
                                        <p className="text-muted-foreground">bhattsammar04@gmail.com</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-primary/10 rounded-lg">
                                        <MapPin className="text-primary" size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold mb-1">Location</h4>
                                        <p className="text-muted-foreground">Kathmandu, Nepal</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-primary/10 rounded-lg">
                                        <Phone className="text-primary" size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold mb-1">Phone</h4>
                                        <p className="text-muted-foreground">Available on request</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-primary/10 rounded-lg">
                                        <Globe className="text-primary" size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold mb-1">Website</h4>
                                        <p className="text-muted-foreground">pradipbhatt.com.np</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-bold mb-4">Connect with Me</h4>
                            <div className="flex gap-4">
                                <Link
                                    href="https://www.linkedin.com/in/pradipbhatt2126/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="LinkedIn"
                                    className="p-3 bg-foreground/5 hover:bg-primary/20 rounded-lg transition-colors"
                                >
                                    <Linkedin size={20} />
                                </Link>
                                <Link
                                    href="https://github.com/pradipbhatt"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="GitHub"
                                    className="p-3 bg-foreground/5 hover:bg-primary/20 rounded-lg transition-colors"
                                >
                                    <Github size={20} />
                                </Link>
                                <Link
                                    href="https://www.instagram.com/pradipbhatt/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Instagram"
                                    className="p-3 bg-foreground/5 hover:bg-primary/20 rounded-lg transition-colors"
                                >
                                    <Instagram size={20} />
                                </Link>
                                <Link
                                    href="https://www.facebook.com/pradipbhatt21/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Facebook"
                                    className="p-3 bg-foreground/5 hover:bg-primary/20 rounded-lg transition-colors"
                                >
                                    <Facebook size={20} />
                                </Link>
                            </div>
                        </div>

                        <div className="bg-card p-6 rounded-xl border border-border space-y-3">
                            <h4 className="font-bold text-primary">Availability</h4>
                            <p className="text-sm text-muted-foreground">
                                Full stack developer and AI researcher.{" "}
                                <Highlight delay={0.1}>Open to AI research collaborations, software development,</Highlight>{" "}
                                open-source projects, and full-stack freelance work.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
