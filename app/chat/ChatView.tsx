"use client";

import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import AskBar from "../AskBar";
import Avatar from "../Avatar";
import Icon from "../Icons";
import Portrait from "../Portrait";
import PromptTiles from "../PromptTiles";
import { answer, type CardKind } from "../lib/assistant";
import { prefersReducedMotion } from "../lib/motion";
import { suggestedQuestions } from "../lib/prompts";
import { profile } from "../lib/profile";
import ChatCard from "./ChatCards";

/* One streamed word (with its trailing space); `b` marks **bold** text. */
type Token = { t: string; b: boolean };

type Message =
  | { id: number; role: "user"; text: string }
  | {
      id: number;
      role: "assistant";
      tokens: Token[];
      shown: number;
      card?: CardKind;
      focus?: number;
      followUps: string[];
      thinking: boolean;
    };

/* Splits an answer into words, keeping **bold** spans marked. */
function tokenize(text: string): Token[] {
  return text
    .split(/(\*\*[^*]+\*\*)/g)
    .filter(Boolean)
    .flatMap((part) => {
      const b = part.startsWith("**");
      const body = b ? part.slice(2, -2) : part;
      return (body.match(/\S+\s*|\s+/g) ?? []).map((t) => ({ t, b }));
    });
}

const WORD_MS = 28; // delay between streamed words
const MAX_STREAM_MS = 1000; // long answers reveal several words per tick to finish within this
const THINK_MS = 200; // "typing…" pause before the answer starts

export default function ChatView({ initialQuery }: { initialQuery?: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [drawer, setDrawer] = useState(false);
  const nextId = useRef(1);
  const started = useRef(false);
  // the answer currently streaming, so a new question can finish it instead of being dropped
  const stream = useRef<{ id: number; timeout?: ReturnType<typeof setTimeout>; interval?: ReturnType<typeof setInterval> } | null>(null);

  const finishStreaming = useCallback(() => {
    const s = stream.current;
    if (!s) return;
    clearTimeout(s.timeout);
    clearInterval(s.interval);
    stream.current = null;
    setMessages((m) =>
      m.map((msg) => (msg.id === s.id && msg.role === "assistant" ? { ...msg, thinking: false, shown: msg.tokens.length } : msg)),
    );
  }, []);

  const ask = useCallback(
    (question: string) => {
      finishStreaming();
      setDrawer(false);

      const reply = answer(question);
      const tokens = tokenize(reply.text);
      const userId = nextId.current++;
      const botId = nextId.current++;
      const instant = prefersReducedMotion();
      setMessages((m) => [
        ...m,
        { id: userId, role: "user", text: question },
        {
          id: botId,
          role: "assistant",
          tokens,
          shown: instant ? tokens.length : 0,
          card: reply.card,
          focus: reply.focus,
          followUps: reply.followUps,
          thinking: !instant,
        },
      ]);
      if (instant) return;

      // short "thinking" pause, then stream the answer one word at a time
      const s: NonNullable<typeof stream.current> = { id: botId };
      stream.current = s;
      s.timeout = setTimeout(() => {
        const step = Math.max(1, Math.ceil((tokens.length * WORD_MS) / MAX_STREAM_MS));
        let shown = 0;
        s.interval = setInterval(() => {
          shown = Math.min(shown + step, tokens.length);
          setMessages((m) => m.map((msg) => (msg.id === botId ? { ...msg, thinking: false, shown } : msg)));
          if (shown >= tokens.length) {
            clearInterval(s.interval);
            if (stream.current === s) stream.current = null;
          }
        }, WORD_MS);
      }, THINK_MS);
    },
    [finishStreaming],
  );

  // lets the landing page finish its view transition once this page is in the DOM
  useLayoutEffect(() => {
    window.dispatchEvent(new Event("chat-ready"));
  }, []);

  // stop timers if the visitor leaves the page mid-answer
  useEffect(() => () => {
    clearTimeout(stream.current?.timeout);
    clearInterval(stream.current?.interval);
  }, []);

  // answer the question passed from the landing page, then drop it from the URL so a refresh starts clean
  useEffect(() => {
    if (!initialQuery) return;
    const t = setTimeout(() => {
      if (started.current) return;
      started.current = true;
      ask(initialQuery);
      window.history.replaceState(null, "", "/chat");
    }, 0);
    return () => clearTimeout(t);
  }, [ask, initialQuery]);

  // when a new question is asked, bring it to the top of the screen so the answer reads from its start
  useEffect(() => {
    if (!messages.length) return;
    const users = document.querySelectorAll("[data-user-msg]");
    users[users.length - 1]?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
  }, [messages.length]);

  const empty = messages.length === 0;
  const lastId = messages[messages.length - 1]?.id;

  return (
    <div className="relative flex min-h-svh flex-col">
      {/* header */}
      <header className="fixed inset-x-0 top-0 z-30 border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-3xl items-center gap-3 px-4">
          <Link
            href="/"
            aria-label="Back to portfolio"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border transition-colors hover:bg-subtle"
          >
            <Icon name="chevron-left" className="h-4 w-4" />
          </Link>
          <div className="flex min-w-0 flex-1 items-center gap-2.5">
            <Portrait size={38} />
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold">{profile.name}</span>
              <span className="flex items-center gap-1.5 text-xs text-muted">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Answers from my profile
              </span>
            </span>
          </div>
          <a
            href={profile.resume}
            download
            className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-subtle"
          >
            <Icon name="download" className="h-4 w-4" />
            <span className="hidden sm:inline">Resume</span>
          </a>
        </div>
      </header>

      {/* conversation */}
      <main className={`mx-auto w-full max-w-3xl flex-1 px-4 pt-24 ${empty ? "pb-56" : "pb-[70svh]"}`}>
        {empty ? (
          <div className="flex flex-col items-center pt-6 text-center">
            <Avatar />
            <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">Ask me anything</h1>
            <p className="mt-2 max-w-md text-muted">
              About my work, research, projects, skills or interests. Every answer comes from my own profile.
            </p>
            <PromptTiles onPick={ask} />
          </div>
        ) : (
          <div className="space-y-8">
            {messages.map((m) =>
              m.role === "user" ? (
                <div key={m.id} data-user-msg className="flex scroll-mt-24 animate-fade-up justify-end" style={{ animationDuration: "0.4s" }}>
                  <div className="max-w-[85%] rounded-3xl rounded-br-lg bg-accent px-4 py-2.5 text-white">{m.text}</div>
                </div>
              ) : (
                <div key={m.id} className="flex gap-3">
                  <Portrait size={34} className="mt-0.5" />
                  <div className="min-w-0 flex-1 space-y-4">
                    {m.thinking ? (
                      <div className="flex h-8 items-center gap-1" aria-label="Thinking">
                        {[0, 150, 300].map((d) => (
                          <span key={d} className="h-2 w-2 animate-bounce rounded-full bg-muted" style={{ animationDelay: `${d}ms` }} />
                        ))}
                      </div>
                    ) : (
                      <p className="text-[17px] leading-relaxed">
                        {m.tokens.slice(0, m.shown).map((tk, i) => (
                          <span key={i} className={`animate-word ${tk.b ? "font-semibold" : ""}`}>
                            {tk.t}
                          </span>
                        ))}
                      </p>
                    )}
                    {!m.thinking && m.shown >= m.tokens.length && (
                      <>
                        {m.card && (
                          <div className="animate-fade-up" style={{ animationDuration: "0.6s" }}>
                            <ChatCard kind={m.card} focus={m.focus} />
                          </div>
                        )}
                        {m.id === lastId && (
                        <div className="flex animate-fade-up flex-wrap gap-2" style={{ animationDelay: "250ms" }}>
                          {m.followUps.map((f) => (
                            <button
                              key={f}
                              type="button"
                              onClick={() => ask(f)}
                              className="cursor-pointer rounded-full border border-border px-3 py-1.5 text-sm text-muted transition hover:border-border-strong hover:text-foreground active:scale-95"
                            >
                              {f}
                            </button>
                          ))}
                        </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ),
            )}
          </div>
        )}
      </main>

      {/* composer */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 bg-gradient-to-t from-background via-background/95 to-background/0 pt-10 pb-4">
        <div className="pointer-events-auto mx-auto max-w-3xl space-y-3 px-4">
          {drawer && (
            <div className="max-h-[45svh] animate-fade-up overflow-y-auto rounded-3xl border border-border bg-card-strong p-4 shadow-2xl shadow-black/10 backdrop-blur-2xl" style={{ animationDuration: "0.35s" }}>
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-semibold">Suggested questions</span>
                <button type="button" onClick={() => setDrawer(false)} aria-label="Close suggestions" className="cursor-pointer rounded-full p-1 hover:bg-subtle">
                  <Icon name="close" className="h-4 w-4" />
                </button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {suggestedQuestions.map((g) => (
                  <div key={g.group}>
                    <div className="mb-1.5 text-xs font-medium tracking-wide text-muted uppercase">{g.group}</div>
                    <div className="space-y-1">
                      {g.questions.map((q) => (
                        <button
                          key={q}
                          type="button"
                          onClick={() => ask(q)}
                          className="block w-full cursor-pointer rounded-xl px-2.5 py-1.5 text-left text-sm transition-colors hover:bg-subtle"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {!empty && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setDrawer((d) => !d)}
                aria-expanded={drawer}
                className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-2 text-sm font-medium backdrop-blur-lg transition hover:bg-subtle"
              >
                <Icon name="sparkles" color="#856ED9" className="h-4 w-4" />
                <span className="hidden sm:inline">Need inspiration?</span>
              </button>
              <div className="min-w-0 flex-1">
                <PromptTiles onPick={ask} compact />
              </div>
            </div>
          )}
          <AskBar onAsk={ask} autoFocus={!initialQuery} placeholder="Ask about my work, research or skills…" />
        </div>
      </div>
    </div>
  );
}
