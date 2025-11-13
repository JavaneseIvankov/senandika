import ChatContainer from "@/features/dashboard/chat-section/container/chat-container";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen overscroll-y-contain ">
      <ChatContainer />
    </main>
  );
}
