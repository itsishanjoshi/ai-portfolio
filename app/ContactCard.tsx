"use client";

import { useState } from "react";
import Icon, { type IconName } from "./Icons";
import { links, profile } from "./lib/profile";

const channels: { label: string; value: string; href: string; icon: IconName }[] = [
  { label: "LinkedIn", value: "ishan-joshi", href: links.linkedin, icon: "linkedin" },
  { label: "GitHub", value: "itsishanjoshi", href: links.github, icon: "github" },
  { label: "Google Scholar", value: "Publications", href: links.scholar, icon: "scholar" },
];

/* Email (with copy), social links and resume download. Used on the page and in the chat. */
export default function ContactCard({ compact = false }: { compact?: boolean }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = links.email;
    }
  };

  return (
    <div className={`rounded-3xl border border-border bg-card backdrop-blur-lg ${compact ? "p-5" : "p-6 md:p-10"}`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <a
          href={links.email}
          className={`group flex min-w-0 flex-1 items-center gap-3 font-semibold tracking-tight transition-colors hover:text-accent ${
            compact ? "text-lg" : "text-xl md:text-3xl"
          }`}
        >
          <Icon name="mail" className={`shrink-0 text-accent ${compact ? "h-5 w-5" : "h-6 w-6 md:h-7 md:w-7"}`} />
          <span className="truncate">{profile.email}</span>
        </a>
        <button
          type="button"
          onClick={copy}
          className="flex shrink-0 cursor-pointer items-center justify-center gap-1.5 self-start rounded-full border border-border px-3.5 py-2 text-sm font-medium transition-all hover:bg-subtle active:scale-95 sm:self-auto"
        >
          <Icon name={copied ? "check" : "copy"} className="h-4 w-4" color={copied ? "#3E9858" : "currentColor"} />
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <div className={`grid gap-3 sm:grid-cols-2 ${compact ? "mt-4" : "mt-8 lg:grid-cols-4"}`}>
        {channels.map((c) => (
          <a
            key={c.label}
            href={c.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 rounded-2xl border border-border bg-background/40 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-border-strong hover:shadow-lg hover:shadow-black/5"
          >
            <Icon name={c.icon} className="h-5 w-5" />
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold">{c.label}</span>
              <span className="block truncate text-xs text-muted">{c.value}</span>
            </span>
            <Icon name="arrow-up-right" className="h-4 w-4 text-muted transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        ))}
        <a
          href={profile.resume}
          download
          className="group flex items-center gap-3 rounded-2xl bg-foreground p-4 text-background transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
        >
          <Icon name="download" className="h-5 w-5" />
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold">Resume</span>
            <span className="block text-xs opacity-70">PDF · 2 pages</span>
          </span>
          <Icon name="arrow-right" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </a>
      </div>

      {!compact && (
        <div className="mt-6 flex items-center gap-2 text-sm text-muted">
          <Icon name="pin" className="h-4 w-4" />
          Based in {profile.location}
        </div>
      )}
    </div>
  );
}
