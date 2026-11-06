import Icon from "../Icons";
import Reveal from "../Reveal";
import SectionHeading from "../SectionHeading";
import { certifications, education } from "../lib/profile";

export default function Education() {
  return (
    <section id="education" className="mx-auto max-w-6xl px-4 py-24 md:px-8 md:py-32">
      <SectionHeading
        icon="cap"
        color="#B95F9C"
        eyebrow="Education"
        title="Where I studied."
        intro="A civil engineering foundation, then a master's in data science."
      />

      <div className="grid gap-4 md:grid-cols-2">
        {education.map((e, i) => (
          <Reveal key={e.degree} delay={i * 100}>
            <div className="group h-full rounded-3xl border border-border bg-card p-6 backdrop-blur-lg transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5 md:p-8">
              <div className="flex items-start justify-between gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#B95F9C]/10 transition-transform duration-300 group-hover:scale-110">
                  <Icon name="cap" color="#B95F9C" className="h-6 w-6" />
                </span>
                <span className="font-mono text-xs text-muted">
                  {e.start} – {e.end}
                </span>
              </div>
              <h3 className="mt-5 text-xl font-bold tracking-tight md:text-2xl">{e.degree}</h3>
              <div className="mt-1 text-muted">
                {e.school}, {e.place}
              </div>
              <div className="mt-5 inline-flex rounded-full bg-subtle px-3 py-1 text-sm font-semibold">{e.grade}</div>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={150} className="mt-4">
        <div className="rounded-3xl border border-border bg-card p-6 backdrop-blur-lg md:p-8">
          <h3 className="mb-4 flex items-center gap-2 font-semibold">
            <Icon name="award" color="#C19433" className="h-5 w-5" />
            Certifications
          </h3>
          <ul className="grid gap-3 sm:grid-cols-2">
            {certifications.map((c) => (
              <li key={c.name} className="flex items-center gap-3 rounded-2xl bg-subtle/70 px-4 py-3">
                <span className="text-sm font-semibold">{c.issuer}</span>
                <span className="h-1 w-1 rounded-full bg-muted" />
                <span className="text-sm text-muted">{c.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </section>
  );
}
