import { interests } from "./lib/profile";

/* Interests as tiles: the tile lifts and the emoji wiggles on hover. Used on the page and in the chat. */
export default function InterestTiles({ compact = false }: { compact?: boolean }) {
  return (
    <ul className={`grid grid-cols-2 gap-3 ${compact ? "" : "md:grid-cols-4"}`}>
      {interests.map((it, i) => (
        <li
          key={it.name}
          className={`group relative overflow-hidden rounded-2xl border border-border bg-background/40 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5 ${
            compact ? "flex items-center gap-3 p-3 animate-fade-up" : "flex flex-col items-start gap-3 p-5"
          }`}
          style={compact ? { animationDelay: `${i * 80}ms`, animationDuration: "0.45s" } : undefined}
        >
          <span
            className="pointer-events-none absolute -right-8 -bottom-8 h-24 w-24 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
            style={{ background: `${it.color}33` }}
          />
          <span
            className={`relative flex shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110 ${
              compact ? "h-9 w-9 text-xl" : "h-12 w-12 text-2xl"
            }`}
            style={{ background: `${it.color}1a` }}
            aria-hidden="true"
          >
            {it.emoji}
          </span>
          <span className={`relative font-medium ${compact ? "text-sm" : "text-base"}`}>{it.name}</span>
        </li>
      ))}
    </ul>
  );
}
