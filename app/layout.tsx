import type { Metadata, Viewport } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { profile } from "./lib/profile";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap" });

// Set NEXT_PUBLIC_SITE_URL to the deployed domain so share previews use absolute URLs.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

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
    images: [{ url: "/avatar-head.png", width: 320, height: 320, alt: profile.name }],
  },
  twitter: { card: "summary", title: `${profile.name} · AI Engineer`, description: profile.tagline, images: ["/avatar-head.png"] },
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
    <html lang="en">
      <body className={`${inter.variable} ${geistMono.variable} min-h-screen font-sans antialiased`}>{children}</body>
    </html>
  );
}
