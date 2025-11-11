"use client";

import { useState, useRef, useEffect } from "react";
import { startJournalSession, endJournalSession } from "@/actions/journalActions";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useJournalChat } from "@/hooks/useJournalChat";
import type { ApaacMessage } from "@/shared/types/chat";

export function JournalChat() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const [isEnding, setIsEnding] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Use custom hook untuk streaming chat - ALWAYS call hook (Rules of Hooks)
  // Use empty string as placeholder when no session
  const chat = useJournalChat(sessionId || "");

  // biome-ignore lint/correctness/useExhaustiveDependencies: Only trigger on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat?.messages.length]);

  const handleStartSession = async () => {
    setIsStarting(true);
    try {
      const session = await startJournalSession();
      setSessionId(session.id);
    } catch (error) {
      console.error("Failed to start session:", error);
      alert("Failed to start session. Please try again.");
    } finally {
      setIsStarting(false);
    }
  };

  const handleEndSession = async () => {
    if (!sessionId) return;

    setIsEnding(true);
    try {
      await endJournalSession(sessionId);
      setSessionId(null);
    } catch (error) {
      console.error("Failed to end session:", error);
      alert("Failed to end session. Please try again.");
    } finally {
      setIsEnding(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Failed to sign out:", error);
      alert("Failed to sign out. Please try again.");
    }
  };

  if (!sessionId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="max-w-md w-full text-center space-y-6">
          <h1 className="text-3xl font-bold">AI Reflective Journal</h1>
          <p className="text-gray-600">
            Start a new journaling session to reflect on your thoughts and
            feelings
          </p>
          <button
            type="button"
            onClick={handleStartSession}
            disabled={isStarting}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isStarting ? "Starting..." : "Start Journaling Session"}
          </button>
          <button
            type="button"
            onClick={handleSignOut}
            className="w-full px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h1 className="text-xl font-semibold">Journal Session</h1>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleEndSession}
            disabled={isEnding}
            className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
          >
            {isEnding ? "Ending..." : "End Session"}
          </button>
          <button
            type="button"
            onClick={handleSignOut}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded hover:bg-gray-50"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chat.messages.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            <p>Start by sharing what's on your mind...</p>
          </div>
        )}
        {chat.messages.map((message: ApaacMessage) => {
          const isUser = message.role === "user";
          const analysis = chat.getAnalysis(message);
          const suggestedActions = chat.getSuggestedActions(message);
          const gamification = chat.getGamification(message);

          return (
            <div
              key={message.id}
              className={`flex ${isUser ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-4 ${
                  isUser
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                {/* Render message content */}
                <div className="whitespace-pre-wrap">{message.content}</div>

                {/* Analysis metadata (AI messages only) */}
                {!isUser && analysis && (
                  <div className="mt-3 pt-3 border-t border-gray-700 space-y-2">
                    {/* Emotions */}
                    {analysis.emotions.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {analysis.emotions.map((emotion: string) => (
                          <span
                            key={emotion}
                            className="px-2 py-1 bg-blue-200 text-blue-800 text-xs rounded-full"
                          >
                            {emotion}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Topics */}
                    {analysis.topics.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {analysis.topics.map((topic: string) => (
                          <span
                            key={topic}
                            className="px-2 py-1 bg-green-200 text-green-800 text-xs rounded-full"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Stress score */}
                    <div className="text-xs text-gray-600">
                      Stress: {analysis.stress_score}/100
                    </div>

                    {/* Risk flag */}
                    {analysis.risk_flag !== "none" && (
                      <div
                        className={`text-xs font-medium ${
                          analysis.risk_flag === "critical"
                            ? "text-red-600"
                            : analysis.risk_flag === "high"
                              ? "text-orange-600"
                              : "text-yellow-600"
                        }`}
                      >
                        ⚠️ Risk: {analysis.risk_flag}
                      </div>
                    )}
                  </div>
                )}

                {/* Suggested actions */}
                {!isUser && suggestedActions && suggestedActions.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-700">
                    <div className="text-xs font-medium mb-2">Saran:</div>
                    <ul className="space-y-1 text-sm">
                      {/* biome-ignore lint/suspicious/noExplicitAny: Action type from AI */}
                      {suggestedActions.map((action: any) => (
                        <li key={JSON.stringify(action)}>
                          • {JSON.stringify(action)}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Gamification badge */}
                {!isUser && gamification?.potential_badge && (
                  <div className="mt-3 pt-3 border-t border-gray-700">
                    <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full">
                      🏆 {gamification.potential_badge}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Loading indicator */}
        {chat.isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg p-4">
              <p className="text-gray-500">Thinking...</p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const messageText = formData.get("message") as string;
          if (messageText.trim()) {
            chat.sendMessage(messageText);
            e.currentTarget.reset();
          }
        }}
        className="border-t p-4"
      >
        {/* Error display */}
        {chat.error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {chat.error.message}
          </div>
        )}

        <div className="flex gap-2">
          <input
            type="text"
            name="message"
            placeholder="Share your thoughts..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            disabled={chat.isLoading}
          />
          <button
            type="submit"
            disabled={chat.isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {chat.isLoading ? "⏳" : "Send"}
          </button>
        </div>
      </form>
    </div>
  );
}
