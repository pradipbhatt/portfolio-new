"use client";

import emailjs from "@emailjs/browser";
import { motion } from "framer-motion";
import { Facebook, Github, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function Contact() {
    const formRef = useRef<HTMLFormElement>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    // Initialize EmailJS
    useEffect(() => {
        emailjs.init('FWwwe2jCb33Md84nB');
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setLoading(true);
        setError("");
        setSuccess(false);

        try {
            if (!formRef.current) {
                return;
            }

            const TEMPLATE_ID = 'template_iv8khtq';

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
                'service_q6mey2b',
                TEMPLATE_ID,
                templateParams,
                'FWwwe2jCb33Md84nB'
            );

            setSuccess(true);
            formRef.current.reset();
            setTimeout(() => setSuccess(false), 5000);
        } catch (err: any) {
            const errorMessage = err?.text || err?.message || "Failed to send message. Please try again.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="contact" className="py-20 bg-background">
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold font-squid tracking-wider">
                        C<span className="text-primary">o</span>ntact M<span className="text-primary">e</span>
                    </h2>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                    {/* Left Column - Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="bg-[#1a1a1a] p-8 rounded-xl border border-white/5"
                    >
                        <h3 className="text-2xl font-bold mb-6 font-display">Send a Message</h3>

                        {success && (
                            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-500 text-sm">
                                ✓ Message sent successfully! I'll get back to you soon.
                            </div>
                        )}

                        {error && (
                            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
                                ✗ {error}
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
                                        className="w-full px-4 py-3 rounded-lg bg-[#0a0a0a] border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
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
                                        className="w-full px-4 py-3 rounded-lg bg-[#0a0a0a] border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
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
                                    className="w-full px-4 py-3 rounded-lg bg-[#0a0a0a] border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
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
                                    className="w-full px-4 py-3 rounded-lg bg-[#0a0a0a] border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
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
                    </motion.div>

                    {/* Right Column - Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="space-y-8"
                    >
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
                                        <Mail className="text-primary" size={24} />
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
                                    className="p-3 bg-white/5 hover:bg-primary/20 rounded-lg transition-colors"
                                >
                                    <Linkedin size={20} />
                                </Link>
                                <Link
                                    href="https://github.com/pradipbhatt"
                                    target="_blank"
                                    className="p-3 bg-white/5 hover:bg-primary/20 rounded-lg transition-colors"
                                >
                                    <Github size={20} />
                                </Link>
                                <Link
                                    href="#"
                                    className="p-3 bg-white/5 hover:bg-primary/20 rounded-lg transition-colors"
                                >
                                    <Instagram size={20} />
                                </Link>
                                <Link
                                    href="#"
                                    className="p-3 bg-white/5 hover:bg-primary/20 rounded-lg transition-colors"
                                >
                                    <Facebook size={20} />
                                </Link>
                            </div>
                        </div>

                        <div className="bg-[#1a1a1a] p-6 rounded-xl border border-white/5">
                            <h4 className="font-bold mb-2 text-primary">Availability</h4>
                            <p className="text-sm text-muted-foreground">
                                I respond to messages within 24 hours. Open to freelance opportunities and
                                collaborations.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
