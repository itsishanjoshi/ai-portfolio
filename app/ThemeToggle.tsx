"use client";

import Icon from "./Icons";
import { prefersReducedMotion } from "./lib/motion";

/* Switches between light and dark. The icon comes from CSS so it is right before React loads. */
export default function ThemeToggle({ className = "" }: { className?: string }) {
  const toggle = () => {
    const root = document.documentElement;
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    const apply = () => {
      root.dataset.theme = next;
    };

    try {
      localStorage.setItem("theme", next);
    } catch {
      // private windows can block storage: the switch still works for this visit
    }

    if ("startViewTransition" in document && !prefersReducedMotion()) document.startViewTransition(apply);
    else apply();
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Switch between light and dark mode"
      title="Switch between light and dark mode"
      className={`shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-subtle ${className}`}
    >
      <Icon name="moon" className="h-4 w-4 dark:hidden" />
      <Icon name="sun" className="hidden h-4 w-4 dark:block" />
    </button>
  );
}
