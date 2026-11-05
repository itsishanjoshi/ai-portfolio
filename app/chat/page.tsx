import type { Metadata } from "next";
import { getProfilePhoto } from "../lib/photo";
import ChatView from "./ChatView";

export const metadata: Metadata = {
  title: "Ask Ishan · AI Engineer",
  description: "Ask about Ishan Joshi's experience, research, projects and skills.",
};

export default async function ChatPage({ searchParams }: { searchParams: Promise<{ q?: string | string[] }> }) {
  const { q } = await searchParams;
  const query = Array.isArray(q) ? q[0] : q;
  return <ChatView initialQuery={query?.slice(0, 300)} photo={getProfilePhoto()} />;
}
