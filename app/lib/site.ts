/*
 * The public URL of the site, for share previews, robots.txt and the sitemap.
 * NEXT_PUBLIC_SITE_URL wins (set it for a custom domain); otherwise use the production domain
 * Vercel provides at build time.
 */
const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? (vercelUrl ? `https://${vercelUrl}` : "http://localhost:3000");
