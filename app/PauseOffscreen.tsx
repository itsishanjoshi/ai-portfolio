"use client";

import { useEffect } from "react";

/* Pauses looping animations inside [data-loops] elements while they are off-screen (see globals.css). */
export default function PauseOffscreen() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) (e.target as HTMLElement).dataset.offscreen = String(!e.isIntersecting);
      },
      { rootMargin: "100px" },
    );
    document.querySelectorAll("[data-loops]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return null;
}
