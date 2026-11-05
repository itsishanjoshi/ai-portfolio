import { existsSync } from "node:fs";
import { join } from "node:path";

/*
 * Real profile photo (e.g. your LinkedIn picture). Drop it into public/ as profile.jpg,
 * profile.png or profile.webp and it replaces the Bitmoji head in the About card and the
 * chat's profile card. Checked at build time, so rebuild after adding it.
 */
const candidates = ["profile.jpg", "profile.jpeg", "profile.png", "profile.webp"];

export function getProfilePhoto(): string | null {
  const found = candidates.find((f) => existsSync(join(process.cwd(), "public", f)));
  return found ? `/${found}` : null;
}
