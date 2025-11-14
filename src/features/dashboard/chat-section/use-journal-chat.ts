"use client";

import {
  useState,
  useCallback,
  useTransition,
  useRef,
  useEffect,
  useMemo,
} from "react";
import type {
  Message,
  SessionInfo,
  SessionStats,
  GamificationReward,
} from "./types";
import type { CoachResponse } from "@/lib/services/promptService";
import {
  sendJournalMessage,
  getActiveSessionWithMessages,
  confirmEndSession,
  startJournalSession,
  getOpeningMessage,
} from "@/actions/journalActions";
import { checkAndAwardBadges } from "@/actions/gamificationActions";
import { toast } from "sonner";
import {
  getUserFriendlyError,
  logErrorDetails,
} from "@/lib/utils/errorMessages";
import {
  emitGamificationUpdate,
  emitLevelUp,
  emitBadgeEarned,
  emitXPGained,
} from "@/lib/events/gamificationEvents";
import { formatDuration, calculateAverageStress } from "./utils/sessionHelpers";

export interface UseJournalChatReturn {
  // State
  messages: Message[];
  input: string;
  isLoading: boolean;
  isLoadingSession: boolean;
  error: string | null;
  session: SessionInfo | null;

  // Session End related
  sessionStats: SessionStats | null;
  showSessionEndOverlay: boolean;
  lastGamificationReward: GamificationReward | null;

  // Actions
  setInput: (value: string) => void;
  sendMessage: (text: string) => Promise<void>;
  clearError: () => void;
  startNewSession: (mood: string) => Promise<void>;
  confirmEndSession: () => Promise<void>;
  closeSessionEndOverlay: () => void;
  toggleSessionEndOverlay: () => void;

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

  // Session End state
  const [showSessionEndOverlay, setShowSessionEndOverlay] = useState(false);
  const [lastGamificationReward, setLastGamificationReward] =
    useState<GamificationReward | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const badgeCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Computed session stats
  const sessionStats = useMemo((): SessionStats | null => {
    if (!session || !session.endedAt) return null;

    const startedAt = new Date(session.startedAt);
    const endedAt = new Date(session.endedAt);
    const durationMs = endedAt.getTime() - startedAt.getTime();
    const durationMinutes = Math.floor(durationMs / 60000);

    return {
      startedAt: session.startedAt,
      endedAt: session.endedAt,
      duration: formatDuration(durationMinutes),
      messageCount: messages.length,
      moodAtStart: session.moodAtStart ?? null,
      moodAtEnd: session.moodAtEnd ?? null,
      averageStressScore: calculateAverageStress(messages),
    };
  }, [session, messages]);

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
          const sessionData = data.session as {
            id: string;
            startedAt: string;
            endedAt: string | null;
            moodAtStart?: string | null;
            moodAtEnd?: string | null;
          };

          setSession({
            id: sessionData.id,
            startedAt: sessionData.startedAt,
            endedAt: sessionData.endedAt,
            moodAtStart: sessionData.moodAtStart ?? null,
            moodAtEnd: sessionData.moodAtEnd ?? null,
          });

          setMessages(data.messages as Message[]);
        }
      } catch (err) {
        // Log internal error details for debugging
        logErrorDetails(err, "loadActiveSession");

        // Show user-friendly error message
        const userFriendlyMessage = getUserFriendlyError(err);
        setError(userFriendlyMessage);
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
        setError(
          "Tidak ada sesi aktif. Silakan mulai percakapan terlebih dahulu.",
        );
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

            // Emit gamification events for real-time updates
            if (reward.xpGained) {
              emitXPGained(reward.xpGained, reward.totalXP || 0);
            }

            if (reward.leveledUp) {
              toast.success(`🎉 Level Up!`, {
                description: `Sekarang kamu level ${reward.level}!`,
                duration: 5000,
              });
              emitLevelUp(reward.level || 1, reward.totalXP || 0);
            }

            if (reward.badgesEarned && reward.badgesEarned.length > 0) {
              for (const badgeCode of reward.badgesEarned) {
                toast.success(`🏆 Badge Baru!`, {
                  description: badgeCode,
                  duration: 5000,
                });
                emitBadgeEarned(badgeCode);
              }
            }

            // General stats update event
            emitGamificationUpdate();
          }
        } catch (err) {
          // Log internal error details for debugging
          logErrorDetails(err, "sendMessage");

          // Show user-friendly error message
          const userFriendlyMessage = getUserFriendlyError(err);
          setError(userFriendlyMessage);

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
        moodAtStart: mood,
        moodAtEnd: null,
      });
      setMessages([]);
      setError(null);

      // Fetch and display opening message from AI
      try {
        const openingData = await getOpeningMessage(sessionData.id);

        // Add opening message to chat
        const openingMessage: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: openingData.fullMessage,
          timestamp: new Date().toISOString(),
        };
        setMessages([openingMessage]);
      } catch (openingErr) {
        // Log but don't fail the session creation if opening message fails
        logErrorDetails(openingErr, "getOpeningMessage");
        console.error("Failed to get opening message:", openingErr);
        // Session is still created successfully, just without opening message
      }
    } catch (err) {
      // Log internal error details for debugging
      logErrorDetails(err, "startNewSession");

      // Show user-friendly error message
      const userFriendlyMessage = getUserFriendlyError(err);
      setError(userFriendlyMessage);
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

        // Store gamification reward and show overlay
        if (data.gamification) {
          setLastGamificationReward(data.gamification);

          // Emit gamification events for real-time updates
          if (data.gamification.xpGained) {
            emitXPGained(data.gamification.xpGained, data.gamification.totalXP || 0);
          }

          if (data.gamification.leveledUp) {
            emitLevelUp(data.gamification.level || 1, data.gamification.totalXP || 0);
          }

          if (data.gamification.badgesEarned && data.gamification.badgesEarned.length > 0) {
            for (const badgeCode of data.gamification.badgesEarned) {
              emitBadgeEarned(badgeCode);
            }
          }

          // General stats update event
          emitGamificationUpdate();
        }

        // Show overlay after a brief delay for closing message to appear
        setTimeout(() => {
          setShowSessionEndOverlay(true);
        }, 1000);
      } catch (err) {
        // Log internal error details for debugging
        logErrorDetails(err, "confirmEndSession");

        // Show user-friendly error message
        const userFriendlyMessage = getUserFriendlyError(err);
        setError(userFriendlyMessage);
      }
    });
  }, [session]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Close session end overlay
  const closeSessionEndOverlay = useCallback(() => {
    setShowSessionEndOverlay(false);
  }, []);

  // Toggle session end overlay
  const toggleSessionEndOverlay = useCallback(() => {
    setShowSessionEndOverlay((prev) => !prev);
  }, []);

  return {
    messages,
    input,
    isLoading: isPending,
    isLoadingSession,
    error,
    session,
    sessionStats,
    showSessionEndOverlay,
    lastGamificationReward,
    setInput,
    sendMessage,
    clearError,
    startNewSession,
    confirmEndSession: confirmEnd,
    closeSessionEndOverlay,
    toggleSessionEndOverlay,
    messagesEndRef,
  };
}
