import { useState, useCallback, useTransition } from "react";
import type { CoachResponse } from "@/lib/services/promptService";
import {
  startJournalSession,
  endJournalSession,
  sendJournalMessage,
  getOpeningMessage,
} from "@/actions/journalActions";
import {
  getUserGamificationStats,
  getUserEarnedBadges,
} from "@/actions/gamificationActions";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string; // ISO string
  metadata?: CoachResponse | null;
};

type SessionInfo = {
  id: string;
  startedAt: string; // ISO string
  endedAt: string | null; // ISO string
};

type GamificationStats = {
  userId: string;
  xp: number;
  level: number;
  streakDays: number;
  lastActiveDate: string | null;
  progress: {
    currentLevelXP: number;
    nextLevelXP: number;
    xpInCurrentLevel: number;
    xpNeededForLevel: number;
    progressPercentage: number;
  };
};

type Badge = {
  code: string;
  name: string;
  description: string | null;
  icon: string | null;
  earnedAt?: string;
};

type GamificationReward = {
  xpGained: number;
  totalXP: number;
  level: number;
  leveledUp: boolean;
  streakDays: number;
  streakBroken?: boolean;
  badgesEarned: string[];
};

type DebugLog = {
  timestamp: string; // ISO string
  type: "info" | "error" | "success" | "warning";
  message: string;
  data?: unknown;
};

export function useJournalTest() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [session, setSession] = useState<SessionInfo | null>(null);
  const [debugLogs, setDebugLogs] = useState<DebugLog[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Gamification state
  const [gamificationStats, setGamificationStats] =
    useState<GamificationStats | null>(null);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [lastReward, setLastReward] = useState<GamificationReward | null>(null);

  const [isPending, startTransition] = useTransition();

  // Add debug log
  const addDebugLog = useCallback(
    (type: DebugLog["type"], message: string, data?: unknown) => {
      setDebugLogs((prev) => [
        ...prev,
        { timestamp: new Date().toISOString(), type, message, data },
      ]);
    },
    [],
  );

  // Fetch gamification data
  const fetchGamificationData = useCallback(async () => {
    try {
      const [stats, userBadges] = await Promise.all([
        getUserGamificationStats(),
        getUserEarnedBadges(),
      ]);

      setGamificationStats(stats as GamificationStats);
      setBadges(userBadges);

      addDebugLog("success", "Fetched gamification data", {
        level: stats.level,
        xp: stats.xp,
        streak: stats.streakDays,
        badgeCount: userBadges.length,
      });
    } catch (err) {
      addDebugLog("error", "Failed to fetch gamification data", {
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }, [addDebugLog]);

  // Get opening message
  const handleGetOpeningMessage = useCallback(async () => {
    if (!session?.id) {
      addDebugLog("warning", "No active session. Start a session first.");
      setError("No active session. Start a session first.");
      return;
    }

    startTransition(async () => {
      try {
        addDebugLog("info", "Generating opening message from session mood...");

        const openingData = await getOpeningMessage(session.id);

        addDebugLog("success", "Opening message generated", {
          greeting: openingData.greeting,
          promptSuggestion: openingData.promptSuggestion,
        });

        // Add opening message as system message
        const openingMsg: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: openingData.fullMessage,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, openingMsg]);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to generate opening message";
        setError(errorMessage);
        addDebugLog("error", errorMessage, {
          error: err instanceof Error ? err.message : String(err),
          stack: err instanceof Error ? err.stack : undefined,
        });
      }
    });
  }, [session, addDebugLog]);

  // Start a new session
  const handleStartSession = useCallback(async () => {
    startTransition(async () => {
      try {
        addDebugLog("info", "Starting new session...");

        const sessionData = await startJournalSession("normal");

        // sessionData already has ISO strings from server action
        setSession({
          id: sessionData.id,
          startedAt: sessionData.startedAt, // Already ISO string
          endedAt: null,
        });

        addDebugLog("success", "Session started", {
          sessionId: sessionData.id,
        });
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to start session";
        setError(errorMessage);
        addDebugLog("error", errorMessage, {
          error: err instanceof Error ? err.message : String(err),
          stack: err instanceof Error ? err.stack : undefined,
        });
      }
    });
  }, [addDebugLog]);

  // End current session
  const handleEndSession = useCallback(async () => {
    if (!session?.id) {
      addDebugLog("warning", "No active session to end");
      return;
    }

    startTransition(async () => {
      try {
        addDebugLog("info", "Ending session and generating summary...", {
          sessionId: session.id,
        });

        const result = await endJournalSession(session.id, "normal");

        setSession((prev) =>
          prev ? { ...prev, endedAt: new Date().toISOString() } : null,
        );
        addDebugLog("success", "Session ended and rolling summary generated");

        // Process session gamification rewards
        if (result.gamification) {
          const reward = result.gamification;
          setLastReward(reward as GamificationReward);

          addDebugLog("success", "🎮 Session Completion Reward", {
            xpGained: reward.xpGained,
            totalXP: reward.totalXP,
            level: reward.level,
            leveledUp: reward.leveledUp,
            badgesEarned: reward.badgesEarned,
          });

          if (reward.leveledUp) {
            addDebugLog(
              "success",
              `🎉 LEVEL UP! You're now level ${reward.level}!`,
            );
          }

          if (reward.badgesEarned && reward.badgesEarned.length > 0) {
            for (const badgeCode of reward.badgesEarned) {
              addDebugLog("success", `🏆 New Badge Earned: ${badgeCode}`);
            }
          }

          // Refresh gamification data
          await fetchGamificationData();
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to end session";
        setError(errorMessage);
        addDebugLog("error", errorMessage, {
          error: err instanceof Error ? err.message : String(err),
          stack: err instanceof Error ? err.stack : undefined,
        });
      }
    });
  }, [session, addDebugLog, fetchGamificationData]);

  // Send a message
  const handleSendMessage = useCallback(
    async (text: string) => {
      if (!text.trim()) return;
      if (!session?.id) {
        setError("No active session. Start a session first.");
        addDebugLog(
          "error",
          "Attempted to send message without active session",
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

      addDebugLog("info", "Sending message via server action...", { text });

      startTransition(async () => {
        try {
          // Server action returns plain object directly, not Response
          const data = await sendJournalMessage(session.id, text);

          addDebugLog("success", "Received AI response", {
            messageLength: data.message.content.length,
            hasMetadata: !!data.metadata,
          });

          // Add assistant message
          const assistantMessage: Message = {
            id: data.message.id,
            role: "assistant",
            content: data.message.content,
            timestamp: new Date().toISOString(),
            metadata: data.metadata as unknown as CoachResponse,
          };
          setMessages((prev) => [...prev, assistantMessage]);

          // Log metadata if available
          if (data.metadata) {
            addDebugLog("info", "Metadata received", {
              emotions: data.metadata.analysis.emotions,
              stressScore: data.metadata.analysis.stress_score,
              riskFlag: data.metadata.analysis.risk_flag,
              topics: data.metadata.analysis.topics,
            });

            // Process gamification reward
            if (data.metadata.gamification?.reward) {
              const reward = data.metadata.gamification.reward;
              setLastReward(reward);

              // Log XP and rewards
              addDebugLog("success", "🎮 Gamification Reward", {
                xpGained: reward.xpGained,
                totalXP: reward.totalXP,
                level: reward.level,
                leveledUp: reward.leveledUp,
                streakDays: reward.streakDays,
                badgesEarned: reward.badgesEarned,
              });

              // Show level up notification
              if (reward.leveledUp) {
                addDebugLog(
                  "success",
                  `🎉 LEVEL UP! You're now level ${reward.level}!`,
                );
              }

              // Show new badges
              if (reward.badgesEarned && reward.badgesEarned.length > 0) {
                for (const badgeCode of reward.badgesEarned) {
                  addDebugLog("success", `🏆 New Badge Earned: ${badgeCode}`);
                }
              }

              // Show streak notification
              if (reward.streakBroken) {
                addDebugLog("warning", "⚠️ Streak broken! Starting fresh.");
              } else if (reward.streakDays > 1) {
                addDebugLog("info", `🔥 Streak: ${reward.streakDays} days!`);
              }

              // Refresh gamification data
              fetchGamificationData();
            }
          }
        } catch (err) {
          const errorMessage =
            err instanceof Error ? err.message : "Failed to send message";
          setError(errorMessage);
          addDebugLog("error", errorMessage, {
            error: err instanceof Error ? err.message : String(err),
            stack: err instanceof Error ? err.stack : undefined,
          });

          // Remove user message on error
          setMessages((prev) => prev.filter((m) => m.id !== userMessage.id));
        }
      });
    },
    [session, addDebugLog, fetchGamificationData],
  );

  // Clear messages
  const clearMessages = useCallback(() => {
    setMessages([]);
    addDebugLog("info", "Messages cleared");
  }, [addDebugLog]);

  // Clear debug logs
  const clearDebugLogs = useCallback(() => {
    setDebugLogs([]);
  }, []);

  return {
    // State
    messages,
    input,
    isLoading: isPending,
    error,
    session,
    debugLogs,

    // Gamification State
    gamificationStats,
    badges,
    lastReward,

    // Actions
    setInput,
    sendMessage: handleSendMessage,
    getOpeningMessage: handleGetOpeningMessage,
    startSession: handleStartSession,
    endSession: handleEndSession,
    clearMessages,
    clearDebugLogs,
    fetchGamificationData,
  };
}
