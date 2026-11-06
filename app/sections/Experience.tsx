"use client";

import { useState } from "react";
import Icon from "../Icons";
import Reveal from "../Reveal";
import SectionHeading from "../SectionHeading";
import { experience, type Experience as Job } from "../lib/profile";

function Details({ job }: { job: Job }) {
  return (
    <div key={job.role} className="animate-fade-up" style={{ animationDuration: "0.45s" }}>
      <p className="text-base text-muted">{job.summary}</p>
      <ul className="mt-5 space-y-3">
        {job.points.map((p) => (
          <li key={p} className="flex gap-3 text-[15px] leading-relaxed text-foreground/90">
            <Icon name="check" color="#3E9858" className="mt-1 h-4 w-4 shrink-0" />
            {p}
          </li>
        ))}
      </ul>
      <div className="mt-6 flex flex-wrap gap-1.5">
        {job.stack.map((s) => (
          <span key={s} className="rounded-md bg-subtle px-2 py-1 font-mono text-xs text-muted">
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Experience() {
  const [active, setActive] = useState(0);
  const job = experience[active];

  /* On phones the open role collapses as the new one opens: hold the tapped row still on screen meanwhile. */
  const holdInPlace = (row: HTMLElement) => {
    if (window.matchMedia("(min-width: 1024px)").matches) return;
    const top = row.getBoundingClientRect().top;
    const end = performance.now() + 450;
    const hold = () => {
      window.scrollBy({ top: row.getBoundingClientRect().top - top, behavior: "instant" });
      if (performance.now() < end) requestAnimationFrame(hold);
    };
    requestAnimationFrame(hold);
  };

  return (
    <section id="experience" className="mx-auto max-w-6xl px-4 py-24 md:px-8 md:py-32">
      <SectionHeading
        icon="briefcase"
        color="#3E9858"
        eyebrow="Experience"
        title="Where I've worked."
        intro="From front-end engineering to analytics to running AI infrastructure. Pick a role to see what I did there."
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <Reveal className="relative">
          {/* draws down the timeline as you scroll, in browsers with scroll-driven animations */}
          <div className="timeline-track absolute top-4 bottom-4 left-[18px] w-[3px]" aria-hidden="true">
            <div className="timeline-fill h-full w-full rounded-full bg-[#3E9858]" />
          </div>
          <ol data-loops className="relative space-y-2 before:absolute before:top-4 before:bottom-4 before:left-[19px] before:w-px before:bg-border">
            {experience.map((e, i) => {
              const on = i === active;
              return (
                <li key={e.role}>
                  <button
                    type="button"
                    onClick={(ev) => {
                      holdInPlace(ev.currentTarget);
                      setActive(i);
                    }}
                    aria-expanded={on}
                    className={`group relative flex w-full cursor-pointer items-start gap-4 rounded-2xl border p-3 pr-4 text-left transition duration-300 ${
                      on
                        ? "border-border bg-card-strong shadow-lg shadow-black/5"
                        : "border-transparent hover:border-border hover:bg-card"
                    }`}
                  >
                    <span
                      className={`relative z-10 mt-0.5 flex h-[14px] w-[14px] shrink-0 translate-x-[6px] items-center justify-center rounded-full border-2 transition ${
                        on ? "scale-125 border-[#3E9858] bg-[#3E9858]" : "border-border-strong bg-background group-hover:border-[#3E9858]"
                      }`}
                    >
                      {e.current && <span className="absolute inset-0 animate-ping rounded-full bg-[#3E9858]/50" />}
                    </span>
                    <span className="min-w-0 flex-1 pl-1">
                      <span className="flex flex-wrap items-baseline justify-between gap-x-3">
                        <span className="font-semibold">{e.role}</span>
                        <span className="font-mono text-xs text-muted">
                          {e.start} – {e.end}
                        </span>
                      </span>
                      <span className="block text-sm text-muted">
                        {e.org}
                        {e.place && `, ${e.place}`}
                      </span>
                    </span>
                    <Icon
                      name="chevron-down"
                      className={`mt-1 h-4 w-4 shrink-0 text-muted transition-transform lg:hidden ${on ? "rotate-180" : ""}`}
                    />
                  </button>
                  {/* phones and tablets: details open inline under the role */}
                  <div
                    aria-hidden={!on}
                    className={`grid transition-[grid-template-rows,opacity,visibility] duration-400 ease-out lg:hidden ${
                      on ? "grid-rows-[1fr] opacity-100" : "invisible grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="min-h-0 overflow-hidden">
                      <div className="px-4 pt-3 pb-5 pl-12">
                        <Details job={e} />
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </Reveal>

        {/* desktop: details in a sticky panel beside the timeline */}
        <Reveal delay={120} className="hidden lg:block">
          <div className="sticky top-28 rounded-3xl border border-border bg-card p-8 backdrop-blur-lg">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl font-bold tracking-tight">{job.role}</h3>
                <div className="mt-1 text-muted">
                  {job.org}
                  {job.place && ` · ${job.place}`}
                </div>
              </div>
              <span
                className={`shrink-0 rounded-full px-3 py-1 font-mono text-xs ${
                  job.current ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-subtle text-muted"
                }`}
              >
                {job.start} – {job.end}
              </span>
            </div>
            <Details key={job.role} job={job} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
