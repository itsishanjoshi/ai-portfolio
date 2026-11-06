"use client";

import { useState } from "react";
import Icon from "./Icons";

/* The pill-shaped "Ask me anything…" input with the round blue send button. */
export default function AskBar({
  onAsk,
  autoFocus = false,
  placeholder = "Ask me anything…",
  className = "",
}: {
  onAsk: (question: string) => void;
  autoFocus?: boolean;
  placeholder?: string;
  className?: string;
}) {
  const [value, setValue] = useState("");

  return (
    <form
      className={`relative w-full ${className}`}
      style={{ viewTransitionName: "ask-bar" }}
      onSubmit={(e) => {
        e.preventDefault();
        const q = value.trim();
        if (!q) return;
        onAsk(q);
        setValue("");
      }}
    >
      <div className="mx-auto flex items-center rounded-full border border-border bg-card py-2.5 pr-2 pl-6 backdrop-blur-lg transition hover:border-border-strong focus-within:border-border-strong focus-within:shadow-lg focus-within:shadow-black/5">
        <label htmlFor="ask" className="sr-only">
          Ask a question about Ishan
        </label>
        <input
          id="ask"
          type="text"
          value={value}
          autoFocus={autoFocus}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          autoComplete="off"
          className="w-full border-none bg-transparent text-base text-foreground placeholder:text-muted focus:outline-none"
        />
        <button
          type="submit"
          disabled={!value.trim()}
          aria-label="Submit question"
          className="flex shrink-0 cursor-pointer items-center justify-center rounded-full bg-accent p-2.5 text-white transition hover:bg-accent-hover active:scale-90 disabled:cursor-default disabled:opacity-70"
        >
          <Icon name="arrow-right" className="h-5 w-5" />
        </button>
      </div>
    </form>
  );
}
