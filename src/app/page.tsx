import About from "@/components/About";
import Awards from "@/components/Awards";
import Community from "@/components/Community";
import Contact from "@/components/Contact";
import Experience from "@/components/Experience";
import GitHubContributions from "@/components/GitHubContributions";
import GPAVisualization from "@/components/GPAVisualization";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";

export default function Home() {
  return (
    <>
      <Hero />
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
        <About />
        <Experience />
        <GPAVisualization />
        <Skills />
        <Projects />
        <Awards />
        <Community />
        <GitHubContributions />
        <Contact />
      </div>
    </>
  );
}
