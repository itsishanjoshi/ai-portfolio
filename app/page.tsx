import Hero from "./Hero";
import SectionNav from "./SectionNav";
import Footer from "./Footer";
import PauseOffscreen from "./PauseOffscreen";
import About from "./sections/About";
import Contact from "./sections/Contact";
import Education from "./sections/Education";
import Experience from "./sections/Experience";
import Projects from "./sections/Projects";
import Research from "./sections/Research";
import Skills from "./sections/Skills";

export default function Home() {
  return (
    <>
      <main className="relative">
        {/* soft background glow shared by every section */}
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
          <div className="absolute top-[-10%] left-1/2 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-[#0171E3]/[0.04] blur-3xl" />
          <div className="absolute right-[-10%] bottom-[-10%] h-[30rem] w-[30rem] rounded-full bg-[#856ED9]/[0.05] blur-3xl" />
        </div>
        <Hero />
        <SectionNav />
        <About />
        <Experience />
        <Skills />
        <Projects />
        <Research />
        <Education />
        <Contact />
      </main>
      <Footer />
      <PauseOffscreen />
    </>
  );
}
