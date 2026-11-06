import ProjectCards from "../ProjectCards";
import Reveal from "../Reveal";
import SectionHeading from "../SectionHeading";

export default function Projects() {
  return (
    <section id="projects" className="mx-auto max-w-6xl px-4 py-24 md:px-8 md:py-32">
      <SectionHeading
        icon="code"
        color="#0171E3"
        eyebrow="Projects"
        title="Things I've built."
        intro="LLM systems, NLP and computer vision work. Open a card for the full write-up."
      />
      <Reveal>
        <ProjectCards />
      </Reveal>
    </section>
  );
}
