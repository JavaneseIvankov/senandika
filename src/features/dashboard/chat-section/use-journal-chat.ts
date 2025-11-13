"use client";

import { useState, useCallback, useTransition, useRef, useEffect } from "react";
import type { Message, SessionInfo } from "./types";
import type { CoachResponse } from "@/lib/services/promptService";
import {
  sendJournalMessage,
  getActiveSessionWithMessages,
  confirmEndSession,
  startJournalSession,
} from "@/actions/journalActions";
import { checkAndAwardBadges } from "@/actions/gamificationActions";
import { toast } from "sonner";

export interface UseJournalChatReturn {
  // State
  messages: Message[];
  input: string;
  isLoading: boolean;
  isLoadingSession: boolean;
  error: string | null;
  session: SessionInfo | null;

  // Actions
  setInput: (value: string) => void;
  sendMessage: (text: string) => Promise<void>;
  clearError: () => void;
  startNewSession: (mood: string) => Promise<void>;
  confirmEndSession: () => Promise<void>;

  // Refs for scroll management
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

export function useJournalChat(): UseJournalChatReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [session, setSession] = useState<SessionInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isLoadingSession, setIsLoadingSession] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const badgeCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Badge checking with toast notifications
  const checkBadgesAndNotify = useCallback(async () => {
    try {
      const { newBadges } = await checkAndAwardBadges({
        type: "message_sent",
        sessionId: session?.id,
      });

      for (const badge of newBadges) {
        toast.success(`🏆 Badge Baru!`, {
          description: `${badge.name}: ${badge.description}`,
          duration: 5000,
        });
      }
    } catch (err) {
      console.error("Failed to check badges:", err);
    }
  }, [session]);

  // Load active session on mount
  useEffect(() => {
    async function loadActiveSession() {
      try {
        setIsLoadingSession(true);
        const data = await getActiveSessionWithMessages();

        if (data) {
          setSession({
            id: data.session.id,
            startedAt: data.session.startedAt,
            endedAt: data.session.endedAt,
          });

          setMessages(data.messages as Message[]);
        }
      } catch (err) {
        console.error("Failed to load active session:", err);
      } finally {
        setIsLoadingSession(false);
      }
    }

    loadActiveSession();
  }, []);

  // Badge checking interval (5 minutes)
  useEffect(() => {
    if (!session || session.endedAt) return;

    // Check immediately
    checkBadgesAndNotify();

    // Then check every 5 minutes
    badgeCheckIntervalRef.current = setInterval(
      () => {
        checkBadgesAndNotify();
      },
      5 * 60 * 1000,
    ); // 5 minutes

    return () => {
      if (badgeCheckIntervalRef.current) {
        clearInterval(badgeCheckIntervalRef.current);
      }
    };
  }, [session, checkBadgesAndNotify]);

  // Auto-scroll when messages change or loading state changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  });

  // Send a message
  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim()) return;
      if (!session?.id) {
        setError("No active session. Start a session first.");
        return;
      }

      // Add user message immediately
      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content: text,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setError(null);

      startTransition(async () => {
        try {
          // Server action returns plain object directly
          const data = await sendJournalMessage(session.id, text);

          // Add assistant message
          const assistantMessage: Message = {
            id: data.message.id,
            role: "assistant",
            content: data.message.content,
            timestamp: new Date().toISOString(),
            metadata: data.metadata as unknown as CoachResponse,
          };
          setMessages((prev) => [...prev, assistantMessage]);

          // Check badges after message
          checkBadgesAndNotify();

          // Check for gamification rewards in response
          if (data.metadata?.gamification?.reward) {
            const reward = data.metadata.gamification.reward;

            if (reward.leveledUp) {
              toast.success(`🎉 Level Up!`, {
                description: `Sekarang kamu level ${reward.level}!`,
                duration: 5000,
              });
            }

            if (reward.badgesEarned && reward.badgesEarned.length > 0) {
              for (const badgeCode of reward.badgesEarned) {
                toast.success(`🏆 Badge Baru!`, {
                  description: badgeCode,
                  duration: 5000,
                });
              }
            }
          }
        } catch (err) {
          const errorMessage =
            err instanceof Error ? err.message : "Failed to send message";
          setError(errorMessage);

          // Remove user message on error
          setMessages((prev) => prev.filter((m) => m.id !== userMessage.id));
        }
      });
    },
    [session, checkBadgesAndNotify],
  );

  // Start new session with mood
  const startNewSession = useCallback(async (mood: string) => {
    try {
      const sessionData = await startJournalSession(mood);

      setSession({
        id: sessionData.id,
        startedAt: sessionData.startedAt,
        endedAt: null,
      });
      setMessages([]);
      setError(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to start session";
      setError(errorMessage);
    }
  }, []);

  // Confirm end session
  const confirmEnd = useCallback(async () => {
    if (!session?.id) return;

    startTransition(async () => {
      try {
        const data = await confirmEndSession(session.id);

        // Add closing message
        const closingMessage: Message = {
          id: data.message.id,
          role: "assistant",
          content: data.message.content,
          timestamp: data.message.timestamp,
        };
        setMessages((prev) => [...prev, closingMessage]);

        // Update session to ended
        setSession((prev) =>
          prev ? { ...prev, endedAt: new Date().toISOString() } : null,
        );

        // Show gamification rewards
        if (data.gamification) {
          const reward = data.gamification;

          if (reward.leveledUp) {
            toast.success(`🎉 Level Up!`, {
              description: `Sekarang kamu level ${reward.level}!`,
              duration: 5000,
            });
          }

          if (reward.badgesEarned && reward.badgesEarned.length > 0) {
            for (const badgeCode of reward.badgesEarned) {
              toast.success(`🏆 Badge Baru!`, {
                description: badgeCode,
                duration: 5000,
              });
            }
          }
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to end session";
        setError(errorMessage);
      }
    });
  }, [session]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    messages,
    input,
    isLoading: isPending,
    isLoadingSession,
    error,
    session,
    setInput,
    sendMessage,
    clearError,
    startNewSession,
    confirmEndSession: confirmEnd,
    messagesEndRef,
  };
}
