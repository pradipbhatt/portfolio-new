import { ThemeProvider } from "@/lib/ThemeProvider";
import ClientAppShell from "@/components/ClientAppShell";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ThemeColorSwitcher from "@/components/ThemeColorSwitcher";
import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import {
  Dancing_Script,
  JetBrains_Mono,
  Michroma,
  Orbitron,
  Rajdhani,
  Share_Tech_Mono,
} from "next/font/google";
import Script from "next/script";
import type { ReactNode } from "react";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-terminal",
});

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

const dancingScript = Dancing_Script({
  weight: ['400', '500', '600', '700'],
  variable: '--font-cursive',
  subsets: ['latin'],
});

/** Hero / “hacker” display - sharp tech terminal headline. */
const shareTechMono = Share_Tech_Mono({
  weight: "400",
  variable: "--font-share-tech-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pradip Bhatt — Full Stack Developer & AI Researcher",
  description:
    "Full stack developer and AI researcher exploring intelligent systems, AI-powered applications, and workflow automation. Based in Kathmandu, Nepal.",
  metadataBase: new URL("https://pradipbhatt.com.np"),
  openGraph: {
    title: "Pradip Bhatt — Full Stack Developer & AI Researcher",
    description:
      "Full stack developer and AI researcher exploring intelligent systems, AI-powered applications, and workflow automation.",
    url: "https://pradipbhatt.com.np",
    siteName: "Pradip Bhatt",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pradip Bhatt — Full Stack Developer & AI Researcher",
    description:
      "Full stack developer and AI researcher exploring intelligent systems, AI-powered applications, and workflow automation.",
  },
  icons: {
    icon: [{ url: "/icon", type: "image/png" }],
    shortcut: "/icon",
    apple: [{ url: "/apple-icon", sizes: "180x180", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth dark" suppressHydrationWarning>
      <body
        className={`${jetbrainsMono.variable} ${michroma.variable} ${rajdhani.variable} ${orbitron.variable} ${shareTechMono.variable} ${dancingScript.variable} antialiased bg-background text-foreground font-body selection:bg-primary/30 selection:text-primary-foreground`}
        suppressHydrationWarning
      >
        {/* Bitdefender and similar tools inject bis_skin_checked before React hydrates; strip early to avoid Head/metadata mismatches. */}
        <Script id="strip-av-injected-attrs" strategy="beforeInteractive">
          {`(function(){
function strip(){
  try{
    document.querySelectorAll("[bis_skin_checked]").forEach(function(n){
      n.removeAttribute("bis_skin_checked");
    });
  }catch(e){}
}
strip();
if(typeof MutationObserver!=="undefined"){
  var o=new MutationObserver(strip);
  o.observe(document.documentElement,{subtree:true,attributes:true,attributeFilter:["bis_skin_checked"]});
  setTimeout(function(){try{o.disconnect();}catch(e){}},10000);
}
})();`}
        </Script>
        <ThemeProvider>
          <ClientAppShell>
            <Navbar />
            <main className="min-h-screen w-full">{children}</main>
            <Footer />
            <ThemeColorSwitcher />
          </ClientAppShell>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
