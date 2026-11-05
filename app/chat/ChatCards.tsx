"use client";

import Link from "next/link";
import { useState } from "react";
import ContactCard from "../ContactCard";
import Icon from "../Icons";
import Portrait from "../Portrait";
import ProjectCards from "../ProjectCards";
import PublicationList from "../PublicationList";
import type { CardKind } from "../lib/assistant";
import { certifications, education, experience, highlights, profile, skills } from "../lib/profile";

const shell = "rounded-3xl border border-border bg-card p-5 backdrop-blur-lg";

function AboutCard({ photo }: { photo?: string | null }) {
  return (
    <div className={shell}>
      <div className="flex items-center gap-4">
        <Portrait size={56} src={photo ?? undefined} />
        <div className="min-w-0">
          <div className="text-lg font-semibold">{profile.name}</div>
          <div className="text-sm text-muted">{profile.headline}</div>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {highlights.map((h) => (
          <div key={h.label} className="rounded-2xl bg-subtle/70 p-3">
            <div className="text-xl font-bold">{h.value}</div>
            <div className="text-xs leading-snug text-muted">{h.label}</div>
          </div>
        ))}
      </div>
      <Link
        href="/#about"
        className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
      >
        Read the full profile <Icon name="arrow-right" className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}

function ExperienceCard() {
  const [open, setOpen] = useState(0);
  return (
    <div className={`${shell} p-2`}>
      {experience.map((e, i) => (
        <div key={e.role} className={i ? "border-t border-border" : ""}>
          <button
            type="button"
            onClick={() => setOpen(open === i ? -1 : i)}
            aria-expanded={open === i}
            className="flex w-full cursor-pointer items-center gap-3 rounded-2xl p-3 text-left transition-colors hover:bg-subtle/60"
          >
            <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${e.current ? "bg-emerald-500" : "bg-border-strong"}`} />
            <span className="min-w-0 flex-1">
              <span className="block font-semibold">{e.role}</span>
              <span className="block text-sm text-muted">
                {e.org} · {e.start} – {e.end}
              </span>
            </span>
            <Icon name="chevron-down" className={`h-4 w-4 shrink-0 text-muted transition-transform ${open === i ? "rotate-180" : ""}`} />
          </button>
          {open === i && (
            <ul className="animate-fade-up space-y-2 px-4 pb-4 pl-9" style={{ animationDuration: "0.4s" }}>
              {e.points.map((p) => (
                <li key={p} className="list-disc text-sm leading-relaxed text-foreground/85 marker:text-muted">
                  {p}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}

function SkillsCard() {
  return (
    <div className={`${shell} grid gap-4 sm:grid-cols-2`}>
      {skills.map((g) => (
        <div key={g.id}>
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
            <span className="h-2 w-2 rounded-full" style={{ background: g.color }} />
            {g.title}
          </div>
          <div className="flex flex-wrap gap-1">
            {g.items.map((s) => (
              <span key={s} className="rounded-full border border-border px-2 py-0.5 text-xs">
                {s}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function EducationCard() {
  return (
    <div className={shell}>
      <ul className="space-y-3">
        {education.map((e) => (
          <li key={e.degree} className="flex items-start gap-3">
            <Icon name="cap" color="#B95F9C" className="mt-0.5 h-5 w-5 shrink-0" />
            <span className="min-w-0 flex-1">
              <span className="block font-semibold">{e.degree}</span>
              <span className="block text-sm text-muted">
                {e.school}, {e.place} · {e.start} – {e.end}
              </span>
            </span>
            <span className="shrink-0 rounded-full bg-subtle px-2.5 py-1 text-xs font-semibold">{e.grade}</span>
          </li>
        ))}
      </ul>
      <div className="mt-4 border-t border-border pt-4">
        <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
          <Icon name="award" color="#C19433" className="h-4 w-4" /> Certifications
        </div>
        <ul className="grid gap-1.5 sm:grid-cols-2">
          {certifications.map((c) => (
            <li key={c.name} className="text-sm text-muted">
              <span className="font-medium text-foreground">{c.issuer}</span> · {c.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function ResumeCard() {
  return (
    <a
      href={profile.resume}
      download
      className={`${shell} group flex items-center gap-4 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/5`}
    >
      <span className="flex h-14 w-11 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-[10px] font-bold text-red-500">
        PDF
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-semibold">Ishan_Joshi_AI_Engineer_Resume.pdf</span>
        <span className="block text-sm text-muted">PDF · 2 pages</span>
      </span>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-white transition-transform group-hover:scale-110">
        <Icon name="download" className="h-4 w-4" />
      </span>
    </a>
  );
}

export default function ChatCard({ kind, photo }: { kind: CardKind; photo?: string | null }) {
  switch (kind) {
    case "about":
      return <AboutCard photo={photo} />;
    case "experience":
      return <ExperienceCard />;
    case "projects":
      return <ProjectCards layout="carousel" />;
    case "skills":
      return <SkillsCard />;
    case "research":
      return <PublicationList compact />;
    case "education":
      return <EducationCard />;
    case "contact":
      return <ContactCard compact />;
    case "resume":
      return <ResumeCard />;
  }
}
