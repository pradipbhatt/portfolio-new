"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const artworks = [
    "/assets/image2.png",
    "/assets/image3.png",
    "/assets/image4.png",
    "/assets/image5.png",
    "/assets/image6.png",
    "/assets/image7.png",
    "/assets/image8.png",
];

export default function ArtGallery() {
    return (
        <section id="arts" className="py-20 bg-background overflow-hidden">
            <div className="container mx-auto px-6 mb-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center"
                >
                    <h2 className="text-4xl md:text-5xl font-bold font-squid tracking-wider">
                        A<span className="text-primary">r</span>t G<span className="text-primary">a</span>llery
                    </h2>
                </motion.div>
            </div>

            {/* Marquee Container */}
            <div className="relative w-full flex overflow-hidden">
                <div className="flex animate-scroll whitespace-nowrap">
                    {/* First set of images */}
                    <div className="flex gap-4 mx-2">
                        {artworks.map((art, index) => (
                            <div
                                key={`art-1-${index}`}
                                className="relative w-[300px] h-[400px] rounded-xl overflow-hidden border border-white/5 hover:border-primary/50 transition-colors shrink-0"
                            >
                                <Image
                                    src={art}
                                    alt={`Artwork ${index + 1}`}
                                    fill
                                    className="object-cover hover:scale-110 transition-transform duration-500"
                                />
                            </div>
                        ))}
                    </div>

                    {/* Duplicate set for seamless loop */}
                    <div className="flex gap-4 mx-2">
                        {artworks.map((art, index) => (
                            <div
                                key={`art-2-${index}`}
                                className="relative w-[300px] h-[400px] rounded-xl overflow-hidden border border-white/5 hover:border-primary/50 transition-colors shrink-0"
                            >
                                <Image
                                    src={art}
                                    alt={`Artwork ${index + 1}`}
                                    fill
                                    className="object-cover hover:scale-110 transition-transform duration-500"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
