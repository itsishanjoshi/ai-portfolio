import Icon from "./Icons";
import { links, profile } from "./lib/profile";

export default function Footer() {
  return (
    <footer className="mx-auto max-w-6xl px-4 pt-8 pb-28 md:px-8 lg:pb-10">
      <div className="flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-sm text-muted sm:flex-row">
        <span>
          © {new Date().getFullYear()} {profile.name}
        </span>
        <div className="flex items-center gap-4">
          <a href={links.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="transition-colors hover:text-foreground">
            <Icon name="linkedin" className="h-4 w-4" />
          </a>
          <a href={links.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="transition-colors hover:text-foreground">
            <Icon name="github" className="h-4 w-4" />
          </a>
          <a href={links.scholar} target="_blank" rel="noopener noreferrer" aria-label="Google Scholar" className="transition-colors hover:text-foreground">
            <Icon name="scholar" className="h-4 w-4" />
          </a>
          <a href={links.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="transition-colors hover:text-foreground">
            <Icon name="instagram" className="h-4 w-4" />
          </a>
          <a href={links.email} aria-label="Email" className="transition-colors hover:text-foreground">
            <Icon name="mail" className="h-4 w-4" />
          </a>
          <a href="#top" className="flex items-center gap-1 transition-colors hover:text-foreground">
            Top <Icon name="arrow-up" className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
