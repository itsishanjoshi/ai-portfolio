import ContactCard from "../ContactCard";
import Reveal from "../Reveal";
import SectionHeading from "../SectionHeading";

export default function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-6xl px-4 pt-24 pb-16 md:px-8 md:pt-32">
      <SectionHeading
        icon="mail"
        color="#C19433"
        eyebrow="Contact"
        title="Let's build something."
        intro="Reach me by email, or find me on LinkedIn, GitHub and Google Scholar. For anything personal, say hi on Instagram."
      />
      <Reveal>
        <ContactCard />
      </Reveal>
    </section>
  );
}
