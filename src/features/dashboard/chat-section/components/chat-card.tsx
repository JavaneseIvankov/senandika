"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { useJournalChat } from "../use-journal-chat";
import { ChatHeader } from "./chat-header";
import { ChatMessages } from "./chat-messages";
import { ChatInput } from "./chat-input";
import { ChatErrorDisplay } from "./chat-error-display";
import { MoodSelectionModal } from "./mood-selection-modal";
import type { ChatCardProps } from "../types";

export default function ChatCard({
  className,
  maxHeight = "600px",
  onMessageSent,
  onSessionStart,
  onSessionEnd,
}: ChatCardProps) {
  const [showMoodModal, setShowMoodModal] = useState(true);

  const {
    messages,
    input,
    isLoading,
    isLoadingSession,
    error,
    session,
    setInput,
    sendMessage,
    clearError,
    startNewSession,
    confirmEndSession,
    messagesEndRef,
  } = useJournalChat();

  const handleSendMessage = async (text: string) => {
    await sendMessage(text);
    onMessageSent?.(text);
  };

  const handleStartSession = () => {
    setShowMoodModal(true);
  };

  const handleMoodSelect = async (mood: string) => {
    await startNewSession(mood);
    setShowMoodModal(false);
    onSessionStart?.();
  };

  const handleEndSession = async () => {
    await confirmEndSession();
    onSessionEnd?.();
  };

  const isDisabled = !session || !!session.endedAt;
  const placeholder = !session
    ? "Start a session first..."
    : session.endedAt
      ? "Session ended. Start a new one..."
      : "Type a message...";

  if (isLoadingSession) {
    return (
      <Card
        className={cn(
          "flex flex-col items-center justify-center p-8",
          className,
        )}
      >
        <p className="text-muted-foreground">Loading session...</p>
      </Card>
    );
  }

  return (
    <>
      <Card className={cn("flex flex-col", className)}>
        <ChatHeader session={session} messageCount={messages.length} />

        {!session && (
          <div className="flex flex-col items-center justify-center p-8 gap-4">
            <p className="text-muted-foreground text-center">
              No active session. Start a new one to begin chatting.
            </p>
            <Button onClick={handleStartSession}>Start New Session</Button>
          </div>
        )}

        {session && (
          <>
            <ChatMessages
              messages={messages}
              isLoading={isLoading}
              hasSession={!!session}
              scrollRef={messagesEndRef}
              maxHeight={maxHeight}
              onEndSession={handleEndSession}
            />

            {error && <ChatErrorDisplay error={error} onDismiss={clearError} />}

            <ChatInput
              value={input}
              onChange={setInput}
              onSubmit={handleSendMessage}
              isLoading={isLoading}
              disabled={isDisabled}
              placeholder={placeholder}
            />
          </>
        )}
      </Card>

      <MoodSelectionModal
        open={showMoodModal}
        onMoodSelect={handleMoodSelect}
        onClose={() => setShowMoodModal(false)}
      />
    </>
  );
}
