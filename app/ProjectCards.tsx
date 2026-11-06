"use client";

import { useEffect, useId, useRef, useState } from "react";
import Icon from "./Icons";
import { projects, type Project } from "./lib/profile";

/* The lead project: a full-width card on the landing page. */
const FEATURED = "clinical-platform";

/* Generated cover art per project, so cards need no screenshots. */
function ProjectArt({ project, wide = false, className = "" }: { project: Project; wide?: boolean; className?: string }) {
  const [a, b] = project.palette;
  const gradient = `g${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const [w, h] = wide ? [800, 340] : [320, 400];
  const hub = wide ? { x: 610, y: 170, r: 84 } : { x: 160, y: 225, r: 62 };
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid slice" className={`absolute inset-0 h-full w-full ${className}`} aria-hidden="true">
      <defs>
        <linearGradient id={gradient} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={a} />
          <stop offset="100%" stopColor={b} />
        </linearGradient>
      </defs>
      <rect width={w} height={h} fill={`url(#${gradient})`} />
      <g fill="#fff" stroke="#fff" className="transition-transform duration-700 group-hover:scale-105" style={{ transformOrigin: `${hub.x}px ${hub.y}px` }}>
        {project.id === "clinical-platform" && (
          /* agents around a shared coordinator */
          <>
            {Array.from({ length: 6 }, (_, i) => {
              const ang = (i / 6) * Math.PI * 2 - Math.PI / 2;
              const x = hub.x + Math.cos(ang) * hub.r;
              const y = hub.y + Math.sin(ang) * hub.r;
              return (
                <g key={i}>
                  <line x1={hub.x} y1={hub.y} x2={x} y2={y} strokeOpacity={0.4} strokeWidth="2" />
                  <circle cx={x} cy={y} r={hub.r * 0.15} fillOpacity={0.3 + (i % 3) * 0.2} stroke="none" />
                </g>
              );
            })}
            <circle cx={hub.x} cy={hub.y} r={hub.r * 0.33} fillOpacity={0.9} stroke="none" />
          </>
        )}
        {project.id === "insight-extraction" &&
          /* three clusters of embedding points */
          [
            [90, 250, 0],
            [215, 220, 1],
            [170, 320, 2],
          ].flatMap(([cx, cy, k]) =>
            Array.from({ length: 14 }, (_, i) => {
              const ang = i * 2.39996 + k;
              const r = 6 + (i % 7) * 6;
              return (
                <circle key={`${k}-${i}`} cx={cx + Math.cos(ang) * r} cy={cy + Math.sin(ang) * r} r={i % 3 ? 3 : 5} fillOpacity={0.35 + (i % 4) * 0.15} stroke="none" />
              );
            }),
          )}
        {project.id === "fer" &&
          /* stacked convolution feature maps */
          Array.from({ length: 5 }, (_, i) => (
            <rect key={i} x={70 + i * 26} y={200 + i * 14} width={120 - i * 12} height={120 - i * 12} rx="8" fill="none" strokeOpacity={0.25 + i * 0.15} strokeWidth="2" />
          ))}
        {project.id === "sentiment" &&
          /* positive / neutral / negative bars */
          [0.85, 0.5, 0.3, 0.65, 0.4, 0.75].map((h, i) => (
            <rect key={i} x={60 + i * 35} y={350 - h * 160} width="22" height={h * 160} rx="6" fillOpacity={0.3 + (i % 3) * 0.2} stroke="none" />
          ))}
      </g>
    </svg>
  );
}

function ProjectDialog({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (project && !d.open) d.showModal();
    if (!project && d.open) d.close();
  }, [project]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      className="m-auto w-[calc(100%-2rem)] max-w-2xl overflow-hidden rounded-3xl border border-border bg-background p-0 text-foreground shadow-2xl backdrop:bg-black/40 backdrop:backdrop-blur-sm open:animate-pop"
    >
      {project && (
        <div className="max-h-[85svh] overflow-y-auto">
          <div className="relative h-44 overflow-hidden md:h-56">
            <ProjectArt project={project} wide={project.id === FEATURED} />
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute top-4 right-4 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-md transition hover:bg-black/50"
            >
              <Icon name="close" className="h-4 w-4" />
            </button>
          </div>
          <div className="p-6 md:p-8">
            <div className="text-sm font-medium text-muted">{project.category}</div>
            <h3 className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">{project.title}</h3>
            <p className="mt-3 text-muted">{project.blurb}</p>
            {project.results && (
              <div className="mt-5 flex flex-wrap gap-3">
                {project.results.map((r) => (
                  <div key={r.label} className="rounded-2xl border border-border bg-subtle/60 px-4 py-3">
                    <div className="text-2xl font-bold tracking-tight">{r.value}</div>
                    <div className="text-xs text-muted">{r.label}</div>
                  </div>
                ))}
              </div>
            )}
            <h4 className="mt-6 mb-3 text-sm font-semibold tracking-wide uppercase text-muted">What I did</h4>
            <ul className="space-y-3">
              {project.points.map((p) => (
                <li key={p} className="flex gap-3 leading-relaxed">
                  <Icon name="check" color={project.palette[0]} className="mt-1 h-4 w-4 shrink-0" />
                  {p}
                </li>
              ))}
            </ul>
            <h4 className="mt-6 mb-3 text-sm font-semibold tracking-wide uppercase text-muted">Built with</h4>
            <div className="flex flex-wrap gap-1.5">
              {project.stack.map((s) => (
                <span key={s} className="rounded-md bg-subtle px-2 py-1 font-mono text-xs">
                  {s}
                </span>
              ))}
            </div>
            {project.links && (
              <div className="mt-6 flex flex-wrap gap-2">
                {project.links.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:border-border-strong hover:bg-subtle"
                  >
                    {l.label}
                    <Icon name="arrow-up-right" className="h-3.5 w-3.5" />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </dialog>
  );
}

/* Tall "Apple card" style project cards; click one to open its full write-up. */
export default function ProjectCards({ layout = "grid" }: { layout?: "grid" | "carousel" }) {
  const [open, setOpen] = useState<Project | null>(null);

  const wrap =
    layout === "grid"
      ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      : "no-scrollbar -mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-2";

  return (
    <>
      <div className={wrap}>
        {projects.map((p, i) => {
          const featured = layout === "grid" && p.id === FEATURED;
          return (
          <button
            key={p.id}
            type="button"
            onClick={() => setOpen(p)}
            style={{ animationDelay: `${i * 90}ms` }}
            className={`group relative cursor-pointer snap-start overflow-hidden rounded-3xl text-left shadow-lg shadow-black/5 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl ${
              layout !== "grid"
                ? "h-80 w-64 shrink-0 animate-fade-up"
                : featured
                  ? "aspect-[4/5] w-full sm:col-span-2 sm:aspect-[16/7] lg:col-span-3 lg:aspect-[3/1]"
                  : "aspect-[4/5] w-full"
            }`}
          >
            {featured ? (
              <>
                <ProjectArt project={p} className="sm:hidden" />
                <ProjectArt project={p} wide className="hidden sm:block" />
              </>
            ) : (
              <ProjectArt project={p} />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/0 to-black/55" />
            <div className="relative flex h-full flex-col p-6 text-white">
              <div className="text-sm font-medium text-white/80">{p.category}</div>
              <h3 className={`mt-2 font-bold tracking-tight ${featured ? "text-2xl sm:max-w-md sm:text-3xl" : layout === "grid" ? "text-2xl" : "text-xl"}`}>{p.title}</h3>
              <div className="mt-auto flex items-end justify-between gap-3">
                <p
                  className={`line-clamp-3 text-sm text-white/85 transition-all duration-500 ${
                    featured ? "sm:max-w-md" : "opacity-0 group-hover:opacity-100 max-lg:opacity-100"
                  }`}
                >
                  {p.blurb}
                </p>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 backdrop-blur-md transition-transform duration-300 group-hover:rotate-45">
                  <Icon name="arrow-up-right" className="h-4 w-4" />
                </span>
              </div>
            </div>
          </button>
          );
        })}
      </div>
      <ProjectDialog project={open} onClose={() => setOpen(null)} />
    </>
  );
}
