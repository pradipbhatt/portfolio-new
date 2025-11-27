import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import { Michroma, Orbitron, Rajdhani } from "next/font/google";
import "./globals.css";

const michroma = Michroma({
  weight: "400",
  variable: "--font-michroma",
  subsets: ["latin"],
});

const rajdhani = Rajdhani({
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-rajdhani",
  subsets: ["latin"],
});

const orbitron = Orbitron({
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-orbitron",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Portfolio | Creative Artist",
  description: "A showcase of my work and skills.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${michroma.variable} ${rajdhani.variable} ${orbitron.variable} antialiased bg-background text-foreground font-body selection:bg-primary/30 selection:text-primary-foreground`}
        suppressHydrationWarning
      >
        <Navbar />
        <div className="w-full max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
          <main className="min-h-screen">
            {children}
          </main>
        </div>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
