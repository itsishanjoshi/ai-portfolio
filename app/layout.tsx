import type { Metadata, Viewport } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { profile } from "./lib/profile";
import { siteUrl } from "./lib/site";
import { themeScript } from "./lib/theme";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: `${profile.name} · AI Engineer`,
  description: `${profile.name} is an AI Engineer working across machine learning, deep learning, NLP, computer vision, multimodal AI and LLM applications. Ask the interactive portfolio anything.`,
  authors: [{ name: profile.name }],
  keywords: ["Ishan Joshi", "AI Engineer", "Machine Learning", "Deep Learning", "NLP", "Computer Vision", "Multimodal AI", "LLM", "MLOps", "Portfolio"],
  openGraph: {
    title: `${profile.name} · AI Engineer`,
    description: profile.tagline,
    siteName: `${profile.name} Portfolio`,
    type: "website",
    locale: "en_IN",
    images: [{ url: "/profile.jpg", width: 400, height: 400, alt: profile.name }],
  },
  twitter: { card: "summary", title: `${profile.name} · AI Engineer`, description: profile.tagline, images: ["/profile.jpg"] },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${inter.variable} ${geistMono.variable} min-h-screen font-sans antialiased`}>
        {/* scroll reveals need JavaScript, so without it the sections just show */}
        <noscript>
          <style dangerouslySetInnerHTML={{ __html: ".reveal{opacity:1;transform:none}" }} />
        </noscript>
        {children}
      </body>
    </html>
  );
}
