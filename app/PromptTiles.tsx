"use client";

import Icon from "./Icons";
import { quickPrompts } from "./lib/prompts";

/* The square glass tiles under the ask bar (Me, Experience, Projects…). */
export default function PromptTiles({
  onPick,
  compact = false,
}: {
  onPick: (question: string) => void;
  compact?: boolean;
}) {
  if (compact) {
    return (
      <div className="no-scrollbar flex gap-2 overflow-x-auto">
        {quickPrompts.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => onPick(p.question)}
            className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-2 text-sm font-medium backdrop-blur-lg transition hover:border-border-strong hover:bg-subtle active:scale-95"
          >
            <Icon name={p.icon} color={p.color} className="h-4 w-4" />
            {p.label}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="mt-4 grid w-full max-w-3xl grid-cols-3 gap-3 md:grid-cols-6">
      {quickPrompts.map((p, i) => (
        <button
          key={p.label}
          type="button"
          onClick={() => onPick(p.question)}
          style={{ animationDelay: `${180 + i * 35}ms`, animationDuration: "0.45s" }}
          className="group flex aspect-square w-full animate-fade-up cursor-pointer flex-col items-center justify-center gap-1.5 rounded-2xl border border-border bg-card backdrop-blur-lg transition duration-300 hover:-translate-y-1 hover:border-border-strong hover:shadow-xl hover:shadow-black/5 active:scale-95"
        >
          <span className="transition-transform duration-300 group-hover:scale-110">
            <Icon name={p.icon} color={p.color} className="h-[22px] w-[22px]" />
          </span>
          <span className="text-xs font-medium text-foreground/80 sm:text-sm">{p.label}</span>
        </button>
      ))}
    </div>
  );
}
