import { ChatCard } from "@/features/dashboard/chat-section/chat-card";
import { GamificationStatsCard } from "@/features/dashboard/chat-page/components/gamification-stats-card";

export default function ChatPage() {
  return (
    <main className="flex flex-col min-h-screen">
      <div className="container mx-auto p-4 space-y-4 max-w-6xl">
        {/* Page Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Journal Chat</h1>
          <p className="text-muted-foreground">
            Have a conversation with your AI companion
          </p>
        </div>

        {/* Gamification Stats - Collapsible */}
        <GamificationStatsCard />

        {/* Chat Card */}
        <ChatCard maxHeight="calc(100vh - 400px)" />
      </div>
    </main>
  );
}
