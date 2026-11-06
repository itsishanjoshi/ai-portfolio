"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Icon from "./Icons";
import Portrait from "./Portrait";
import { prefersReducedMotion } from "./lib/motion";
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
 * Floating pill navigation. Hidden over the hero, slides in once you scroll, and a highlight
 * slides to the section in view. Sits at the bottom on phones, where the section list scrolls
 * sideways to keep the active one visible and Ask stays pinned at the end.
 */
export default function SectionNav() {
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState("");
  const scroller = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const pill = useRef<HTMLSpanElement>(null);

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

  useEffect(() => {
    const link = track.current?.querySelector<HTMLElement>(`[data-section="${active}"]`);
    if (!link || !track.current) return;

    const place = () => {
      if (!pill.current) return;
      pill.current.style.width = `${link.offsetWidth}px`;
      pill.current.style.transform = `translateX(${link.offsetLeft}px)`;
      pill.current.style.opacity = "1";
    };
    place();

    // wait for the section to settle, so a fast page scroll doesn't start a sideways scroll per section
    const follow = setTimeout(() => {
      const list = scroller.current;
      list?.scrollTo({
        left: link.offsetLeft - (list.clientWidth - link.offsetWidth) / 2,
        behavior: prefersReducedMotion() ? "auto" : "smooth",
      });
    }, 150);

    // labels can change width when the web font loads
    const ro = new ResizeObserver(place);
    ro.observe(track.current);
    return () => {
      clearTimeout(follow);
      ro.disconnect();
    };
  }, [active]);

  return (
    <nav
      aria-label="Sections"
      className={`fixed inset-x-0 bottom-4 z-40 flex justify-center px-3 transition duration-500 lg:top-6 lg:bottom-auto ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0 lg:-translate-y-6"
      }`}
    >
      <div className="flex max-w-full items-center gap-1 rounded-full border border-border bg-card-strong p-1.5 shadow-xl shadow-black/5 backdrop-blur-2xl">
        <a
          href="#top"
          aria-label="Back to top"
          className="flex shrink-0 items-center justify-center rounded-full transition-transform hover:scale-110"
        >
          <Portrait size={32} ring={false} />
        </a>
        <div ref={scroller} className="no-scrollbar min-w-0 flex-1 overflow-x-auto">
          <div ref={track} className="relative flex w-max items-center gap-1">
            <span
              ref={pill}
              aria-hidden="true"
              className="absolute top-0 left-0 h-full rounded-full bg-foreground opacity-0 transition-[transform,width,opacity] duration-300 ease-out"
            />
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                data-section={s.id}
                aria-current={active === s.id ? "true" : undefined}
                className={`relative shrink-0 rounded-full px-3 py-1.5 text-sm font-medium transition-colors duration-300 ${
                  active === s.id ? "text-background" : "text-muted hover:bg-subtle hover:text-foreground"
                }`}
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
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
          className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-subtle sm:flex"
        >
          <Icon name="download" className="h-4 w-4" />
        </a>
      </div>
    </nav>
  );
}
