"use client";

import { useState } from "react";
import type { ApaacMessage } from "@/types/chat";

/**
 * [WHAT] Custom hook untuk journal chat (non-streaming, JSON response)
 * Abstraksi semua business logic dari UI component
 *
 * @param sessionId - Session ID, use empty string if no session (hook will be inactive)
 */
export function useJournalChat(sessionId: string) {
  const [messages, setMessages] = useState<ApaacMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const sendMessage = async (content: string) => {
    if (!sessionId || !content.trim()) return;

    // Add user message
    const userMessage: ApaacMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: content.trim(),
      createdAt: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      // Call API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          message: content.trim(),
        }),
      });

      if (!response.ok) {
        console.error("API response not ok:", await response.text());
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      // Add assistant message with metadata
      const assistantMessage: ApaacMessage = {
        id: data.message.id,
        role: "assistant",
        content: data.message.content,
        createdAt: new Date(),
        metadata: data.metadata,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error("Unknown error");
      setError(errorObj);
      console.error("Chat error:", errorObj);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    // Chat state
    messages,
    isLoading,
    error,

    // Actions
    sendMessage,
    setMessages,

    // Helper untuk extract metadata dari message
    getAnalysis: (message: ApaacMessage) => {
      return message.metadata?.analysis;
    },
    getSuggestedActions: (message: ApaacMessage) => {
      return message.metadata?.suggested_actions;
    },
    getGamification: (message: ApaacMessage) => {
      return message.metadata?.gamification;
    },
    getConversationControl: (message: ApaacMessage) => {
      return message.metadata?.conversation_control;
    },
  };
}

/**
 * [WHAT] Type definitions untuk hook return
 */
export type UseJournalChatReturn = ReturnType<typeof useJournalChat>;
