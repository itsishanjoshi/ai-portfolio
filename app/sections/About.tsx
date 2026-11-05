import Icon from "../Icons";
import Reveal from "../Reveal";
import SectionHeading from "../SectionHeading";
import Portrait from "../Portrait";
import { getProfilePhoto } from "../lib/photo";
import { highlights, links, profile } from "../lib/profile";

export default function About() {
  const photo = getProfilePhoto();
  return (
    <section id="about" className="mx-auto max-w-6xl px-4 py-24 md:px-8 md:py-32">
      <SectionHeading
        icon="smile"
        color="#329696"
        eyebrow="About me"
        title="Engineering AI from GPU to interface."
        intro={profile.tagline}
      />

      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <Reveal>
          <div className="h-full rounded-3xl border border-border bg-card p-6 backdrop-blur-lg md:p-9">
            <p className="text-lg leading-relaxed text-foreground/90 md:text-xl">{profile.summary}</p>
            <div className="mt-7 flex flex-wrap gap-2">
              {profile.focus.map((f) => (
                <span key={f} className="rounded-full border border-border bg-subtle px-3 py-1 text-sm font-medium">
                  {f}
                </span>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="flex h-full flex-col rounded-3xl border border-border bg-card p-6 backdrop-blur-lg md:p-8">
            <div className="flex items-center gap-4">
              <Portrait size={64} src={photo ?? undefined} />
              <div>
                <div className="text-lg font-semibold">{profile.name}</div>
                <div className="text-sm text-muted">{profile.role} · M.Tech Data Science</div>
              </div>
            </div>
            <div className="mt-5 flex items-center gap-2 text-sm text-muted">
              <Icon name="pin" className="h-4 w-4" />
              {profile.location}
              <span className="ml-auto flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                AI Engineer at Amity University
              </span>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              {highlights.map((h) => (
                <div key={h.label} className="rounded-2xl border border-border bg-subtle/60 p-4">
                  <div className="text-2xl font-bold tracking-tight">{h.value}</div>
                  <div className="mt-0.5 text-xs leading-snug text-muted">{h.label}</div>
                </div>
              ))}
            </div>

            <div className="mt-auto flex gap-2 pt-6">
              {[
                { href: links.linkedin, icon: "linkedin" as const, label: "LinkedIn" },
                { href: links.github, icon: "github" as const, label: "GitHub" },
                { href: links.scholar, icon: "scholar" as const, label: "Google Scholar" },
              ].map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={l.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border transition-all hover:-translate-y-0.5 hover:border-border-strong hover:bg-subtle"
                >
                  <Icon name={l.icon} className="h-4 w-4" />
                </a>
              ))}
              <a
                href={profile.resume}
                download
                className="ml-auto flex items-center gap-2 rounded-full bg-foreground px-4 text-sm font-medium text-background transition-opacity hover:opacity-85"
              >
                <Icon name="download" className="h-4 w-4" />
                Resume
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
