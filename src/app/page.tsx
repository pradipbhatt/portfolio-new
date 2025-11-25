import About from "@/components/About";
import ArtGallery from "@/components/ArtGallery";
import Awards from "@/components/Awards";
import Community from "@/components/Community";
import Contact from "@/components/Contact";
import GitHubContributions from "@/components/GitHubContributions";
import GPAVisualization from "@/components/GPAVisualization";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <GPAVisualization />
      <Skills />
      <Projects />
      <Awards />
      <ArtGallery />
      <Community />
      <GitHubContributions />
      <Contact />
    </>
  );
}
