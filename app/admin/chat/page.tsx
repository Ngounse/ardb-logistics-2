import ChatPageClient from "@/components/Chat/ChatPageClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Team Chat - ARDB Dashboard",
  description:
    "Real-time messaging and communication platform for fleet management teams. Connect with drivers, dispatchers, and operations staff instantly.",
  keywords:
    "team chat, fleet communication, logistics messaging, real-time chat, driver communication",
};

export default function ChatPage() {
  return <ChatPageClient />;
}
