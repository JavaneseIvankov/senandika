import GamificationCard from "./gamification-card"
import ChatCard from "./chat-card"

export default function ChatSection() {
  return (
    <main className="flex flex-col gap-3 sm:gap-4 md:gap-6 p-4 sm:p-0">
      <GamificationCard />
      <ChatCard />
    </main>
  )
} 