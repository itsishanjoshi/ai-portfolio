"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Icon from "./Icons";
import Portrait from "./Portrait";
import { profile } from "./lib/profile";

export const sections = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "research", label: "Research" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
];

/*
 * Floating pill navigation. Hidden over the hero, slides in once you scroll,
 * and highlights the section currently in view. Sits at the bottom on phones.
 */
export default function SectionNav() {
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, []);

  return (
    <nav
      aria-label="Sections"
      className={`fixed inset-x-0 bottom-4 z-40 flex justify-center px-3 transition-all duration-500 lg:top-6 lg:bottom-auto ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0 lg:-translate-y-6"
      }`}
    >
      <div className="no-scrollbar flex max-w-full items-center gap-1 overflow-x-auto rounded-full border border-border bg-card-strong p-1.5 shadow-xl shadow-black/5 backdrop-blur-2xl">
        <a
          href="#top"
          aria-label="Back to top"
          className="flex shrink-0 items-center justify-center rounded-full transition-transform hover:scale-110"
        >
          <Portrait size={32} ring={false} />
        </a>
        {sections.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            aria-current={active === s.id ? "true" : undefined}
            className={`shrink-0 rounded-full px-3 py-1.5 text-sm font-medium transition-all ${
              active === s.id ? "bg-foreground text-background" : "text-muted hover:bg-subtle hover:text-foreground"
            }`}
          >
            {s.label}
          </a>
        ))}
        <Link
          href="/chat"
          className="ml-1 flex shrink-0 items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
        >
          <Icon name="chat" className="h-3.5 w-3.5" />
          Ask
        </Link>
        <a
          href={profile.resume}
          download
          aria-label="Download resume"
          title="Download resume"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-subtle"
        >
          <Icon name="download" className="h-4 w-4" />
        </a>
      </div>
    </nav>
  );
}
