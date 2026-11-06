# Ishan Joshi · Portfolio

Next.js 16 + React 19 + Tailwind 4. No other runtime dependencies.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Where things live

| What | File |
|---|---|
| All personal content (from the resume) | `app/lib/profile.ts` |
| Chat answers and question matching | `app/lib/assistant.ts` |
| Quick-question tiles and suggestions | `app/lib/prompts.ts` |
| Landing page sections | `app/Hero.tsx`, `app/sections/*` |
| Chat page (`/chat`) | `app/chat/*` |
| Design tokens (colours, fonts, animations) | `app/globals.css` |
| Downloadable resume | `public/Ishan_Joshi_AI_Engineer_Resume.pdf` |

## Images

| File | Used for |
|---|---|
| `public/avatar-full.png` | Full-body Bitmoji in the hero (transparent PNG) |
| `public/avatar-head.png` | Round avatar in the nav, chat, and as the link-preview image |
| `public/profile.jpg` (optional) | Your real photo. If present, it replaces the Bitmoji head in the About card and the chat's profile card. `.png`/`.webp` also work. Rebuild after adding it. |

`assets-src/avatar-source.jpeg` is the original Snapchat screenshot the Bitmoji was cut from. It's kept outside
`public/` on purpose because it shows a username and QR code.

To update the site, update the resume first, then mirror the change in `profile.ts`.
Replace the PDF in `public/` with the same file name.

## The chat

The "Ask me anything" chat runs entirely in the browser. It matches the question to a topic and replies
with text written from the resume plus a card (projects, experience, research…). There is no LLM or API
key, so it can't make anything up. Unknown questions get an "I can only answer from my resume" reply.

## Deploying

Works on Vercel as-is: share previews, `robots.txt` and `sitemap.xml` use the project's production domain.
Set `NEXT_PUBLIC_SITE_URL` (for example `https://ishanjoshi.dev`) only to override it with a custom domain.

Tailwind is pinned to 4.2.1 because newer 4.x releases need Node 20.19+; unpin it once Node is upgraded.
