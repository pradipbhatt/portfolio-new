import About from "@/components/About";
// import ArtGallery from "@/components/ArtGallery";
import Awards from "@/components/Awards";
import Community from "@/components/Community";
import Contact from "@/components/Contact";
import GitHubContributions from "@/components/GitHubContributions";
import GPAVisualization from "@/components/GPAVisualization";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import ThemeColorSwitcher from "@/components/ThemeColorSwitcher";

export default function Home() {
  return (
    <>
      <Hero />
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
        <About />
        <GPAVisualization />
        <Skills />
        <Projects />
        <Awards />
        {/* <ArtGallery /> */}
        <Community />
        <GitHubContributions />
        <Contact />
        <ThemeColorSwitcher />
      </div>
    </>
  );
}
