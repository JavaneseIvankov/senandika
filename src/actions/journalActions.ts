"use server";

import { withAuth, type ActionError } from "@/lib/action-helpers";
import {
  createMemoryEntry,
  createSession,
  endSession,
  getRecentMemories,
  getSessionWithMessages,
  getUserSessions,
  validateSessionOwner,
  getLatestRollingSummary,
  saveRollingSummary,
  getSessionMessagesForSummary,
  getActiveSession,
  getMessagesBySession,
} from "@/lib/services/journalService";
import {
  CORE_SYSTEM_PROMPT,
  CRISIS_RESPONSE_ADDITION,
  buildCurhatPayload,
} from "@/lib/services/promptService";
import { generateRollingSummary } from "@/lib/services/rollingSummaryService";
import {
  processMessageReward,
  processSessionReward,
  getUserStats,
} from "@/lib/services/gamificationService";
import { invalidateAnalyticsCache } from "@/lib/services/analyticsService";
import { resilientGenerateObject } from "@/lib/ai/resilientAI";
import { z } from "zod";

/**
 * [WHAT] Send a message in a journal session dengan STREAMING
 * Returns UIMessageStream dengan TEXT streaming + JSON metadata as data parts
 */
export async function sendJournalMessage(sessionId: string, userText: string) {
  return withAuth(async (user) => {
    // 2. [WHAT] Authorization - validate session ownership
    const isValidOwner = await validateSessionOwner(sessionId, user.id);
    if (!isValidOwner) {
      throw new Error("Forbidden: Session does not belong to user");
    }

    // 3. [WHAT] Save user message
    await createMemoryEntry({
      userId: user.id,
      sessionId: sessionId,
      role: "user",
      text: userText,
    });

    // 4. [WHAT] Get RAG context - ROLLING SUMMARY STRATEGY
    // Strategy: Load previous summary + recent conversation (no search needed!)

    console.log("=== STARTING RAG WITH ROLLING SUMMARY ===");

    // 4a. Get recent conversation history (last 10 messages for current context)
    const recentMessages = await getRecentMemories(user.id, 10);

    // 4b. ⭐ ROLLING SUMMARY: Load previous summary for historical context
    const previousSummary = await getLatestRollingSummary(user.id);

    // 4c. Build memory_context with both recent + summary
    let dailySummaryText: string | null = null;
    let salientFacts: string[] = [];
    let safetyNote: string | null = null;

    if (previousSummary) {
      // Format summary as structured context
      dailySummaryText = previousSummary.dailySummary;
      salientFacts = previousSummary.keyPoints;

      if (previousSummary.safetyFlag) {
        safetyNote =
          "⚠️ Terdapat indikasi yang memerlukan perhatian khusus pada percakapan sebelumnya.";
      }

      console.log("=== LOADED PREVIOUS SUMMARY ===");
      console.log("Daily summary:", dailySummaryText.substring(0, 100) + "...");
      console.log("Key facts:", salientFacts.length);
      console.log("Safety flag:", previousSummary.safetyFlag);
    } else {
      console.log("=== NO PREVIOUS SUMMARY ===");
      console.log(
        "This might be the first conversation or summary hasn't been generated yet.",
      );
    }

    // 5. [WHAT] Build memory_context untuk injection
    const memoryContext = {
      recent_turns: recentMessages.map((m) => ({
        role: m.role,
        text: m.text,
      })),
      daily_summary: dailySummaryText,
      salient_facts: salientFacts,
      safety_note: safetyNote,
    };

    // DEBUG: Log comprehensive retrieval info
    console.log("\n=== RETRIEVAL RESULTS ===");
    console.log("User ID:", user.id);
    console.log("Recent messages loaded:", recentMessages.length);
    console.log("Has previous summary:", !!previousSummary);
    console.log("Salient facts count:", salientFacts.length);

    console.log("\n=== MEMORY CONTEXT ===");
    console.log("Memory context:", JSON.stringify(memoryContext, null, 2));

    // 6. [WHAT] Build payload PERSIS seperti model.py
    const payload = buildCurhatPayload(userText, {
      profile: {
        age_group: "mahasiswa",
        language: "id",
        context: "akademik",
      },
      moodEmoji: "normal",
      memoryContext,
      opening: false,
    });

    // DEBUG: Log full payload
    console.log("=== PAYLOAD DEBUG ===");
    console.log(payload);

    // 7. [WHAT] Generate structured response with resilient AI (2.5 Flash → 2.0 Flash fallback)
    const { object: coachResponse } = await resilientGenerateObject({
      schema: z.object({
        analysis: z.object({
          emotions: z
            .array(z.string())
            .describe("Array of emotions from the predefined list"),
          stress_score: z
            .number()
            .min(0)
            .max(100)
            .describe("Stress score 0-100"),
          topics: z
            .array(z.string())
            .describe("Array of topics from the predefined list"),
          risk_flag: z
            .enum(["none", "low", "moderate", "high", "critical"])
            .describe("Risk assessment flag"),
        }),
        conversation_control: z.object({
          need_clarification: z
            .boolean()
            .describe("Whether clarification is needed"),
          clarify_question: z
            .string()
            .optional()
            .describe("Clarification question if needed"),
          offer_suggestions: z
            .boolean()
            .describe("Whether to offer suggestions"),
          phase: z
            .enum(["listen", "suggest"])
            .describe("Current conversation phase"),
          confirm_endconv: z
            .boolean()
            .describe("Whether to confirm ending conversation"),
        }),
        coach_reply: z
          .string()
          .describe("Empathetic response in Bahasa Indonesia (≤120 words)"),
        suggested_actions: z
          .array(z.any())
          .describe(
            "0-3 suggested actions as objects with action name and params",
          ),
        actions_explained: z
          .string()
          .describe("Practical explanation paragraph for the actions"),
        gamification: z.object({
          streak_increment: z.boolean().describe("Whether to increment streak"),
          potential_badge: z
            .string()
            .optional()
            .describe("Badge name if applicable"),
        }),
      }),
      system: CORE_SYSTEM_PROMPT,
      prompt: payload,
    });

    // 8. [WHAT] Add crisis resources if needed
    let finalReply = `${coachResponse.coach_reply}${coachResponse.actions_explained ? `\n${coachResponse.actions_explained}` : ""}
  `;
    if (
      coachResponse.analysis.risk_flag === "high" ||
      coachResponse.analysis.risk_flag === "critical"
    ) {
      finalReply += CRISIS_RESPONSE_ADDITION;
    }

    // 9. [WHAT] Save to DB
    await createMemoryEntry({
      userId: user.id,
      sessionId: sessionId,
      role: "assistant",
      text: finalReply,
    });

    // 10. [WHAT] Process gamification rewards
    // Check if this is first message of the day
    const userStats = await getUserStats(user.id);
    const isFirstMessageOfDay =
      !userStats?.lastActiveDate ||
      new Date(userStats.lastActiveDate).toDateString() !==
        new Date().toDateString();

    const gamificationReward = await processMessageReward(
      user.id,
      sessionId,
      isFirstMessageOfDay,
    );

    // 11. [WHAT] Return plain object (not Response) for server action serialization
    return {
      message: {
        id: crypto.randomUUID(),
        role: "assistant" as const,
        content: finalReply,
      },
      metadata: {
        analysis: coachResponse.analysis,
        conversation_control: coachResponse.conversation_control,
        suggested_actions: coachResponse.suggested_actions,
        actions_explained: coachResponse.actions_explained,
        gamification: {
          ...coachResponse.gamification,
          reward: {
            xpGained: gamificationReward.xpGained,
            totalXP: gamificationReward.totalXP,
            level: gamificationReward.level,
            leveledUp: gamificationReward.leveledUp,
            streakDays: gamificationReward.streakDays,
            streakBroken: gamificationReward.streakBroken,
            badgesEarned: gamificationReward.badgesEarned,
          },
        },
      },
    };
  });
}

/**
 * [WHAT] Generate an opening message based on the session's moodAtStart
 * Uses CORE_SYSTEM_PROMPT with empty user prompt to get a contextual greeting
 */
export async function getOpeningMessage(sessionId: string) {
  return withAuth(async (user) => {
    // 2. [WHAT] Validate ownership and get session
    const isValidOwner = await validateSessionOwner(sessionId, user.id);
    if (!isValidOwner) {
      throw new Error("Forbidden: Session does not belong to user");
    }

    const sessionData = await getSessionWithMessages(sessionId);
    if (!sessionData) {
      throw new Error("Session not found");
    }

    const mood = sessionData.session.moodAtStart || "normal";

    console.log("=== GENERATING OPENING MESSAGE ===");
    console.log("User ID:", user.id);
    console.log("Session ID:", sessionId);
    console.log("Mood from session:", mood);

    // 3. [WHAT] Generate opening message with resilient AI (2.5 Flash → 2.0 Flash fallback)
    const { object: openingResponse } = await resilientGenerateObject({
      schema: z.object({
        greeting: z
          .string()
          .describe(
            "Warm, empathetic opening message in Bahasa Indonesia (≤80 words)",
          ),
        prompt_suggestion: z
          .string()
          .describe("Gentle prompt to encourage user to share (≤40 words)"),
      }),
      system: CORE_SYSTEM_PROMPT,
      prompt: `User is starting a new reflection session with mood: "${mood}". Generate a warm, personalized opening message that acknowledges their mood and invites them to share what's on their mind. Keep it conversational and supportive.`,
    });

    console.log("=== OPENING MESSAGE GENERATED ===");
    console.log("Greeting:", openingResponse.greeting);
    console.log("Prompt:", openingResponse.prompt_suggestion);

    // 4. [WHAT] Return the opening message
    return {
      greeting: openingResponse.greeting,
      promptSuggestion: openingResponse.prompt_suggestion,
      fullMessage: `${openingResponse.greeting}\n\n${openingResponse.prompt_suggestion}`,
    };
  });
}

/**
 * [WHAT] Start a new journal session
 */
export async function startJournalSession(moodAtStart: string | null = null) {
  return withAuth(async (user) => {
    const session = await createSession(user.id, moodAtStart);

    // Convert Date objects to ISO strings for client serialization
    return {
      id: session.id,
      userId: session.userId,
      topic: session.topic,
      startedAt: session.startedAt.toISOString(),
      endedAt: session.endedAt ? session.endedAt.toISOString() : null,
      moodAtStart: session.moodAtStart,
      moodAtEnd: session.moodAtEnd,
    };
  });
}

/**
 * [WHAT] End a journal session and generate rolling summary
 */
export async function endJournalSession(
  sessionId: string,
  moodAtEnd: string | null = null,
) {
  return withAuth(async (user) => {
    // Validate ownership
    const isValidOwner = await validateSessionOwner(sessionId, user.id);
    if (!isValidOwner) {
      throw new Error("Forbidden: Session does not belong to user");
    }

    // End the session
    await endSession(sessionId, moodAtEnd);

    // ⭐ GENERATE ROLLING SUMMARY after session ends
    console.log("=== GENERATING ROLLING SUMMARY FOR SESSION ===");
    console.log("Session ID:", sessionId);

    let sessionMessageCount = 0;
    let averageStressScore: number | undefined;

    try {
      // Get all messages from this session
      const sessionMessages = await getSessionMessagesForSummary(sessionId);
      sessionMessageCount = sessionMessages.length;

      if (sessionMessages.length > 0) {
        // Calculate average stress score from session (from assistant messages only)
        const stressScores: number[] = [];
        for (const msg of sessionMessages) {
          if (
            msg.role === "assistant" &&
            typeof (msg as unknown as Record<string, unknown>).meta === "object"
          ) {
            const meta = (
              msg as unknown as {
                meta?: { analysis?: { stress_score?: number } };
              }
            ).meta;
            if (meta?.analysis?.stress_score) {
              stressScores.push(meta.analysis.stress_score);
            }
          }
        }

        if (stressScores.length > 0) {
          averageStressScore =
            stressScores.reduce((sum, score) => sum + score, 0) /
            stressScores.length;
        }

        // Get previous summary for carry-over notes
        const previousSummary = await getLatestRollingSummary(user.id);
        const carryOverNotes = previousSummary?.dailySummary;

        // Generate new rolling summary
        const newSummary = await generateRollingSummary(
          sessionMessages,
          undefined, // TODO: Add analytics if available
          carryOverNotes,
        );

        // Save the summary
        await saveRollingSummary(user.id, sessionId, newSummary);

        console.log("=== ROLLING SUMMARY SAVED ===");
        console.log("Summary length:", newSummary.dailySummary.length);
        console.log("Key points:", newSummary.keyPoints.length);
        console.log("Safety flag:", newSummary.safetyFlag);
      } else {
        console.log("=== NO MESSAGES TO SUMMARIZE ===");
      }
    } catch (error) {
      console.error("Error generating rolling summary:", error);
      // Don't fail the session end if summary generation fails
    }

    // ⭐ PROCESS GAMIFICATION REWARDS
    console.log("=== PROCESSING GAMIFICATION REWARDS ===");
    let gamificationReward:
      | Awaited<ReturnType<typeof processSessionReward>>
      | undefined;

    try {
      gamificationReward = await processSessionReward(user.id, sessionId, {
        messageCount: sessionMessageCount,
        stressScore: averageStressScore,
      });

      console.log("=== GAMIFICATION REWARDS CALCULATED ===");
      console.log("XP gained:", gamificationReward.xpGained);
      console.log("Level:", gamificationReward.level);
      console.log("Leveled up:", gamificationReward.leveledUp);
      console.log("Badges earned:", gamificationReward.badgesEarned);
    } catch (error) {
      console.error("Error processing gamification rewards:", error);
      // Don't fail session end if gamification fails
    }

    return {
      success: true,
      gamification: gamificationReward
        ? {
            xpGained: gamificationReward.xpGained,
            totalXP: gamificationReward.totalXP,
            level: gamificationReward.level,
            leveledUp: gamificationReward.leveledUp,
            streakDays: gamificationReward.streakDays,
            badgesEarned: gamificationReward.badgesEarned,
          }
        : undefined,
    };
  });
}

/**
 * [WHAT] Get all journal sessions for the current user
 */
export async function getJournalSessions() {
  return withAuth(async (user) => {
    const sessions = await getUserSessions(user.id);

    // Convert Date objects to ISO strings for client serialization
    return sessions.map((session) => ({
      id: session.id,
      userId: session.userId,
      topic: session.topic,
      startedAt: session.startedAt.toISOString(),
      endedAt: session.endedAt ? session.endedAt.toISOString() : null,
      moodAtStart: session.moodAtStart,
      moodAtEnd: session.moodAtEnd,
    }));
  });
}

/**
 * [WHAT] Get a specific journal session with all its messages
 */
export async function getJournalSessionDetails(sessionId: string) {
  return withAuth(async (user) => {
    // Validate ownership
    const isValidOwner = await validateSessionOwner(sessionId, user.id);
    if (!isValidOwner) {
      throw new Error("Forbidden: Session does not belong to user");
    }

    const data = await getSessionWithMessages(sessionId);
    if (!data) {
      throw new Error("Session not found");
    }

    // Convert Date objects to ISO strings for client serialization
    return {
      session: {
        id: data.session.id,
        userId: data.session.userId,
        topic: data.session.topic,
        startedAt: data.session.startedAt.toISOString(),
        endedAt: data.session.endedAt
          ? data.session.endedAt.toISOString()
          : null,
        moodAtStart: data.session.moodAtStart,
        moodAtEnd: data.session.moodAtEnd,
      },
      messages: data.messages.map((msg) => ({
        ...msg,
        createdAt: msg.createdAt.toISOString(),
      })),
    };
  });
}

/**
 * [WHAT] Get active session with messages for current user
 * Used for auto-attaching to existing session
 */
export async function getActiveSessionWithMessages() {
  return withAuth(async (user) => {
    const activeSession = await getActiveSession(user.id);

    if (!activeSession) {
      return null;
    }

    const messages = await getMessagesBySession(activeSession.id);

    return {
      session: {
        id: activeSession.id,
        startedAt: activeSession.startedAt.toISOString(),
        endedAt: activeSession.endedAt?.toISOString() || null,
      },
      messages: messages.map((m) => ({
        id: m.id,
        role: m.role,
        content: m.text,
        timestamp: m.createdAt.toISOString(),
      })),
    };
  });
}

/**
 * [WHAT] Confirm and end conversation
 * Called when user clicks "Ya" on end session confirmation
 */
export async function confirmEndSession(sessionId: string) {
  return withAuth(async (user) => {
    // Validate ownership
    const isValidOwner = await validateSessionOwner(sessionId, user.id);
    if (!isValidOwner) {
      throw new Error("Forbidden: Session does not belong to user");
    }

    // Send special message to AI indicating user confirmed ending
    const payload = buildCurhatPayload("", {
      profile: {
        age_group: "mahasiswa",
        language: "id",
        context: "akademik",
      },
      moodEmoji: "normal",
      memoryContext: undefined,
      opening: false,
      endConvResponse: true, // Signal to AI for closing message
    });

    // Define response schema
    const schema = z.object({
      analysis: z.object({
        emotions: z.array(z.string()),
        stress_score: z.number().min(0).max(100),
        topics: z.array(z.string()),
        risk_flag: z.enum(["none", "low", "moderate", "high", "critical"]),
      }),
      conversation_control: z.object({
        need_clarification: z.boolean(),
        clarify_question: z.string().optional(),
        offer_suggestions: z.boolean(),
        phase: z.enum(["listen", "suggest"]),
        confirm_endconv: z.boolean(),
      }),
      coach_reply: z.string(),
      suggested_actions: z.array(z.any()),
      actions_explained: z.string(),
      gamification: z.object({
        streak_increment: z.boolean(),
        potential_badge: z.string().optional(),
      }),
    });

    // Get AI's closing message with resilient AI (2.5 Flash → 2.0 Flash fallback)
    const { object: coachResponse } = await resilientGenerateObject({
      schema,
      system: CORE_SYSTEM_PROMPT,
      prompt: payload,
    });

    // Save closing message
    await createMemoryEntry({
      userId: user.id,
      sessionId: sessionId,
      role: "assistant",
      text: coachResponse.coach_reply,
    });

    // End the session
    const result = await endJournalSession(sessionId, "normal");

    // Handle nested auth error
    if ("error" in result) {
      return result;
    }

    // Invalidate analytics cache since session data changed
    await invalidateAnalyticsCache(user.id);

    return {
      message: {
        id: crypto.randomUUID(),
        content: coachResponse.coach_reply,
        timestamp: new Date().toISOString(),
      },
      gamification: result.gamification,
    };
  });
}
