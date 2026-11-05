import Icon from "./Icons";
import { publications } from "./lib/profile";

/* Publications as numbered rows with a DOI link. Used on the page and in the chat. */
export default function PublicationList({ compact = false }: { compact?: boolean }) {
  return (
    <ol className={compact ? "space-y-3" : "space-y-4"}>
      {publications.map((p, i) => (
        <li key={p.doi}>
          <a
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`group flex gap-4 rounded-3xl border border-border bg-card backdrop-blur-lg transition-all duration-300 hover:-translate-y-0.5 hover:border-border-strong hover:shadow-xl hover:shadow-black/5 ${
              compact ? "p-4" : "p-6 md:gap-6 md:p-8"
            }`}
          >
            <span className={`shrink-0 font-mono font-semibold text-[#D97706] ${compact ? "text-sm" : "text-lg"}`}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="min-w-0 flex-1">
              <span className="mb-2 flex flex-wrap items-center gap-2 text-xs text-muted">
                <span className="rounded-full bg-[#D97706]/10 px-2 py-0.5 font-medium text-[#B45309] dark:text-[#F59E0B]">
                  {p.publisher}
                </span>
                {p.venue}
              </span>
              <span className={`block font-semibold leading-snug ${compact ? "text-base" : "text-lg md:text-xl"}`}>{p.title}</span>
              {!compact && <span className="mt-2 block leading-relaxed text-muted">{p.summary}</span>}
              <span className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                <span className="inline-flex items-center gap-1.5 font-mono text-xs text-accent group-hover:underline">
                  DOI: {p.doi}
                  <Icon name="external" className="h-3 w-3" />
                </span>
                {!compact &&
                  p.tags.map((t) => (
                    <span key={t} className="text-xs text-muted">
                      #{t.replace(/\s+/g, "")}
                    </span>
                  ))}
              </span>
            </span>
          </a>
        </li>
      ))}
    </ol>
  );
}
