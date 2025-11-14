import GamificationCard from "./gamification-card"
import ChatCard from "./chat-card"

export default function ChatSection() {
  return (
    <main className="flex flex-col gap-4">
      <GamificationCard />
      <ChatCard />
    </main>
  )
} 