"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import AskBar from "../AskBar";
import Avatar from "../Avatar";
import Icon from "../Icons";
import Portrait from "../Portrait";
import PromptTiles from "../PromptTiles";
import { answer, type CardKind } from "../lib/assistant";
import { suggestedQuestions } from "../lib/prompts";
import { profile } from "../lib/profile";
import ChatCard from "./ChatCards";

type Message =
  | { id: number; role: "user"; text: string }
  | { id: number; role: "assistant"; text: string; shown: number; card?: CardKind; followUps: string[]; thinking: boolean };

/* Renders **bold** spans; that's the only formatting the answers use. */
function RichText({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
        part.startsWith("**") ? (
          <strong key={i} className="font-semibold">
            {part.slice(2, -2)}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

export default function ChatView({ initialQuery, photo }: { initialQuery?: string; photo?: string | null }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [drawer, setDrawer] = useState(false);
  const busy = useRef(false);
  const nextId = useRef(1);
  const started = useRef(false);

  const ask = useCallback((question: string) => {
    if (busy.current) return;
    busy.current = true;
    setDrawer(false);

    const reply = answer(question);
    const userId = nextId.current++;
    const botId = nextId.current++;
    setMessages((m) => [
      ...m,
      { id: userId, role: "user", text: question },
      { id: botId, role: "assistant", text: reply.text, shown: 0, card: reply.card, followUps: reply.followUps, thinking: true },
    ]);

    // short "thinking" pause, then stream the answer in word by word
    const words = reply.text.split(/(\s+)/);
    let i = 0;
    setTimeout(() => {
      const tick = setInterval(() => {
        i = Math.min(words.length, i + 3);
        const shown = words.slice(0, i).join("").length;
        setMessages((m) => m.map((msg) => (msg.id === botId ? { ...msg, thinking: false, shown } : msg)));
        if (i >= words.length) {
          clearInterval(tick);
          busy.current = false;
        }
      }, 35);
    }, 550);
  }, []);

  // answer the question passed from the landing page, then drop it from the URL so a refresh starts clean
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    if (initialQuery) {
      ask(initialQuery);
      window.history.replaceState(null, "", "/chat");
    }
  }, [ask, initialQuery]);

  // when a new question is asked, bring it to the top of the screen so the answer reads from its start
  useEffect(() => {
    if (!messages.length) return;
    const users = document.querySelectorAll("[data-user-msg]");
    users[users.length - 1]?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [messages.length]);

  const empty = messages.length === 0;

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
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Answers from my resume
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
              About my work, research, projects or skills. Every answer comes straight from my resume.
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
                        <RichText text={m.text.slice(0, m.shown)} />
                        {m.shown < m.text.length && <span className="ml-0.5 inline-block h-4 w-0.5 animate-blink bg-foreground align-middle" />}
                      </p>
                    )}
                    {m.shown >= m.text.length && (
                      <>
                        {m.card && (
                          <div className="animate-fade-up" style={{ animationDuration: "0.5s" }}>
                            <ChatCard kind={m.card} photo={photo} />
                          </div>
                        )}
                        <div className="flex animate-fade-up flex-wrap gap-2" style={{ animationDelay: "150ms" }}>
                          {m.followUps.map((f) => (
                            <button
                              key={f}
                              type="button"
                              onClick={() => ask(f)}
                              className="cursor-pointer rounded-full border border-border px-3 py-1.5 text-sm text-muted transition-all hover:border-border-strong hover:text-foreground active:scale-95"
                            >
                              {f}
                            </button>
                          ))}
                        </div>
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
                className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-2 text-sm font-medium backdrop-blur-lg transition-all hover:bg-subtle"
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
