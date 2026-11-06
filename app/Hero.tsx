"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AskBar from "./AskBar";
import Avatar from "./Avatar";
import FluidTrail from "./FluidTrail";
import Icon from "./Icons";
import PromptTiles from "./PromptTiles";
import ThemeToggle from "./ThemeToggle";
import { prefersReducedMotion } from "./lib/motion";
import { profile } from "./lib/profile";

export default function Hero() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    router.prefetch("/chat");
    const onScroll = () => {
      setScrolled(true);
      window.removeEventListener("scroll", onScroll);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [router]);

  /* The ask bar glides into its place on the chat page; browsers without view transitions just navigate. */
  const ask = (q: string) => {
    const url = `/chat?q=${encodeURIComponent(q)}`;
    if (!("startViewTransition" in document) || prefersReducedMotion()) {
      router.push(url);
      return;
    }
    document.startViewTransition(
      () =>
        new Promise<void>((resolve) => {
          const done = () => {
            window.removeEventListener("chat-ready", done);
            clearTimeout(timeout);
            resolve();
          };
          // never hold the page frozen on a slow navigation
          const timeout = setTimeout(done, 1500);
          window.addEventListener("chat-ready", done);
          router.push(url);
        }),
    );
  };

  return (
    <section
      id="top"
      data-loops
      className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-4 pb-16 md:pb-24"
    >
      <FluidTrail />

      {/* giant faded name behind everything */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center overflow-hidden">
        <div
          className="hidden bg-gradient-to-b from-zinc-500/10 to-zinc-500/0 bg-clip-text text-[10rem] leading-none font-black tracking-tight text-transparent select-none sm:block lg:text-[16rem]"
          style={{ marginBottom: "-2.5rem" }}
        >
          {profile.firstName}
        </div>
      </div>

      {/* resume pill, top-left */}
      <a
        href={profile.resume}
        download
        className="group absolute top-6 left-4 z-50 flex animate-pop items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 backdrop-blur-2xl transition duration-300 hover:shadow-xl sm:top-8 sm:left-6"
        style={{ animationDelay: "150ms" }}
      >
        <Icon name="download" className="h-4 w-4 text-accent" />
        <span className="text-sm font-medium">
          <span className="hidden sm:inline">Download </span>Resume
        </span>
        <Icon name="chevron-right" className="hidden h-4 w-4 transition-transform group-hover:translate-x-0.5 sm:block" />
      </a>

      {/* theme switch, top-right */}
      <ThemeToggle className="absolute top-6 right-4 z-50 flex h-11 w-11 animate-pop border border-border bg-card backdrop-blur-2xl sm:top-8 sm:right-6" />

      <div className="z-10 mt-24 mb-6 flex animate-fade-down flex-col items-center text-center md:mt-4 md:mb-10">
        <a
          href="#about"
          aria-label="About Ishan"
          className="mb-2 rounded-2xl border border-border bg-card p-3 shadow-lg shadow-black/5 backdrop-blur-lg transition hover:scale-105 hover:bg-card-strong"
        >
          <span className="flex h-6 w-6 items-center justify-center text-sm font-black tracking-tighter md:h-8 md:w-8 md:text-base">
            {profile.initials}
          </span>
        </a>
        <h2 className="mt-1 text-xl font-semibold text-foreground/80 md:text-2xl">Hey, I&apos;m {profile.firstName} 👋</h2>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">{profile.role}</h1>
        <p className="mt-3 max-w-xl text-sm text-muted md:text-base">
          &amp; AI researcher working across ML, deep learning, NLP, computer vision, multimodal AI and LLM applications.
        </p>
      </div>

      <div className="relative z-10">
        <Avatar />
      </div>

      <div className="z-10 mt-4 flex w-full animate-fade-up flex-col items-center" style={{ animationDelay: "100ms", animationDuration: "0.5s" }}>
        <AskBar onAsk={ask} className="max-w-lg" />
        <PromptTiles onPick={ask} />
      </div>

      <a
        href="#about"
        className={`absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1 text-xs font-medium text-muted transition duration-500 hover:text-foreground ${
          scrolled ? "pointer-events-none opacity-0" : ""
        }`}
      >
        Scroll to explore
        <Icon name="chevron-down" className={`h-4 w-4 ${scrolled ? "" : "animate-bounce"}`} />
      </a>
    </section>
  );
}
