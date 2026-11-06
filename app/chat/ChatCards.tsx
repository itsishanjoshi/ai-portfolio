"use client";

import Link from "next/link";
import { useState } from "react";
import ContactCard from "../ContactCard";
import Icon from "../Icons";
import InterestTiles from "../InterestTiles";
import Portrait from "../Portrait";
import ProjectCards from "../ProjectCards";
import PublicationList from "../PublicationList";
import type { CardKind } from "../lib/assistant";
import { certifications, education, experience, highlights, instagramHandle, links, profile, skills } from "../lib/profile";

const shell = "rounded-3xl border border-border bg-card p-5 backdrop-blur-lg";

function AboutCard() {
  return (
    <div className={shell}>
      <div className="flex items-center gap-4">
        <Portrait size={56} />
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

/* Where personal questions go: a link to Instagram. */
function InstagramCard() {
  return (
    <a
      href={links.instagram}
      target="_blank"
      rel="noopener noreferrer"
      className={`${shell} group flex items-center gap-4 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/5`}
    >
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#FEDA75] via-[#D62976] to-[#4F5BD5] text-white shadow-lg shadow-[#D62976]/25 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
        <Icon name="instagram" className="h-6 w-6" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-semibold">{instagramHandle}</span>
        <span className="block text-sm text-muted">Personal questions? Let&apos;s chat on Instagram.</span>
      </span>
      <span className="flex shrink-0 items-center gap-1 rounded-full bg-foreground px-3.5 py-2 text-sm font-medium text-background transition-transform group-hover:translate-x-0.5">
        Connect <Icon name="arrow-up-right" className="h-3.5 w-3.5" />
      </span>
    </a>
  );
}

/* Compact "current role" card: the answer to "What do you do?". */
function RoleCard() {
  const job = experience[0];
  return (
    <div className={`${shell} relative overflow-hidden`}>
      <div className="pointer-events-none absolute -top-20 -right-20 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <span className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inset-0 animate-ping rounded-full bg-emerald-500/60" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </span>
            Current role
          </span>
          <div className="text-lg font-semibold">{job.role}</div>
          <div className="text-sm text-muted">
            {job.org}, {job.place} · since {job.start}
          </div>
        </div>
      </div>
      <div className="relative mt-4 grid grid-cols-3 gap-2">
        {highlights.slice(0, 3).map((h, i) => (
          <div
            key={h.label}
            className="animate-fade-up rounded-2xl bg-subtle/70 p-3"
            style={{ animationDelay: `${120 + i * 90}ms`, animationDuration: "0.5s" }}
          >
            <div className="text-xl font-bold tracking-tight">{h.value}</div>
            <div className="text-xs leading-snug text-muted">{h.label}</div>
          </div>
        ))}
      </div>
      <div className="relative mt-4 flex flex-wrap gap-1.5">
        {job.stack.map((s, i) => (
          <span
            key={s}
            className="animate-fade-up rounded-md bg-subtle px-2 py-1 font-mono text-xs text-muted"
            style={{ animationDelay: `${380 + i * 35}ms`, animationDuration: "0.4s" }}
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}

/* All roles as an accordion. Starts collapsed unless `focus` names a role; rows open with a height animation. */
function ExperienceCard({ focus }: { focus?: number }) {
  const [open, setOpen] = useState(focus ?? -1);
  return (
    <div className={`${shell} p-2`}>
      {experience.map((e, i) => {
        const on = open === i;
        return (
          <div
            key={e.role}
            className={`animate-fade-up ${i ? "border-t border-border" : ""}`}
            style={{ animationDelay: `${i * 70}ms`, animationDuration: "0.45s" }}
          >
            <button
              type="button"
              onClick={() => setOpen(on ? -1 : i)}
              aria-expanded={on}
              className="flex w-full cursor-pointer items-center gap-3 rounded-2xl p-3 text-left transition-colors hover:bg-subtle/60"
            >
              <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${e.current ? "bg-emerald-500" : "bg-border-strong"}`} />
              <span className="min-w-0 flex-1">
                <span className="block font-semibold">{e.role}</span>
                <span className="block text-sm text-muted">
                  {e.org} · {e.start} – {e.end}
                </span>
              </span>
              <Icon name="chevron-down" className={`h-4 w-4 shrink-0 text-muted transition-transform duration-300 ${on ? "rotate-180" : ""}`} />
            </button>
            {/* grid-rows 0fr -> 1fr animates to the content's real height */}
            <div
              className={`grid transition-[grid-template-rows,opacity] duration-400 ease-out ${
                on ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <ul className="space-y-2 px-4 pb-4 pl-9">
                  {e.points.map((p) => (
                    <li key={p} className="list-disc text-sm leading-relaxed text-foreground/85 marker:text-muted">
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        );
      })}
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
      className={`${shell} group flex items-center gap-4 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/5`}
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

export default function ChatCard({ kind, focus }: { kind: CardKind; focus?: number }) {
  switch (kind) {
    case "about":
      return <AboutCard />;
    case "role":
      return <RoleCard />;
    case "instagram":
      return <InstagramCard />;
    case "interests":
      return (
        <div className="rounded-3xl border border-border bg-card p-4 backdrop-blur-lg">
          <InterestTiles compact />
        </div>
      );
    case "experience":
      return <ExperienceCard focus={focus} />;
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
