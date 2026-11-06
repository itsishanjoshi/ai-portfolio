"use client";

import { useState } from "react";
import Reveal from "../Reveal";
import SectionHeading from "../SectionHeading";
import { skills } from "../lib/profile";

/* Skill groups as cards; hovering or tapping a group lights its chips up in the group colour. */
export default function Skills() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <section id="skills" className="mx-auto max-w-6xl px-4 py-24 md:px-8 md:py-32">
      <SectionHeading
        icon="layers"
        color="#856ED9"
        eyebrow="Skills"
        title="My toolkit."
        intro="The models, frameworks and infrastructure I work with, grouped the way I use them."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {skills.map((g, i) => {
          const lit = hovered === g.id;
          return (
            <Reveal key={g.id} delay={i * 70}>
              <div
                onMouseEnter={() => setHovered(g.id)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => setHovered(lit ? null : g.id)}
                className="group relative h-full overflow-hidden rounded-3xl border border-border bg-card p-6 backdrop-blur-lg transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5"
                style={lit ? { borderColor: `${g.color}66` } : undefined}
              >
                <div
                  className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
                  style={{ background: `${g.color}33` }}
                />
                <div className="relative mb-4 flex items-center gap-3">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: g.color }} />
                  <h3 className="font-semibold">{g.title}</h3>
                  <span className="ml-auto font-mono text-xs text-muted">{String(g.items.length).padStart(2, "0")}</span>
                </div>
                <div className="relative flex flex-wrap gap-1.5">
                  {g.items.map((s, j) => (
                    <span
                      key={s}
                      className="rounded-full border px-2.5 py-1 text-[13px] font-medium transition duration-300"
                      style={
                        lit
                          ? {
                              borderColor: `${g.color}55`,
                              background: `${g.color}14`,
                              color: g.color,
                              transitionDelay: `${j * 25}ms`,
                            }
                          : { borderColor: "var(--border)" }
                      }
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
