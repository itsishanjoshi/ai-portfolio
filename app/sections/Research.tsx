import Icon from "../Icons";
import PublicationList from "../PublicationList";
import Reveal from "../Reveal";
import SectionHeading from "../SectionHeading";
import { links } from "../lib/profile";

export default function Research() {
  return (
    <section id="research" className="mx-auto max-w-6xl px-4 py-24 md:px-8 md:py-32">
      <SectionHeading
        icon="book"
        color="#D97706"
        eyebrow="Research & publications"
        title="Published work."
        intro="Peer-reviewed papers on multimodal emotion recognition, predictive modelling and image watermarking."
      />
      <Reveal>
        <PublicationList />
      </Reveal>
      <Reveal delay={100} className="mt-6">
        <a
          href={links.scholar}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-sm font-medium backdrop-blur-lg transition hover:border-border-strong hover:shadow-lg"
        >
          <Icon name="scholar" className="h-4 w-4 text-accent" />
          View on Google Scholar
          <Icon name="arrow-up-right" className="h-3.5 w-3.5" />
        </a>
      </Reveal>
    </section>
  );
}
