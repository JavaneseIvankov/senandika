"use server";

import { getCurrentUser } from "@/lib/auth";
import {
  generateAndSaveDailySummary,
  getUserInsights,
  getMemoryInsight,
} from "@/lib/services/insightService";
import { getSessionWithMessages } from "@/lib/services/journalService";

/**
 * [WHAT] Generate daily summary for a session
 */
export async function generateSessionSummary(sessionId: string) {
  const user = await getCurrentUser();

  // 1. Get all messages from the session
  const sessionData = await getSessionWithMessages(sessionId);

  if (!sessionData || sessionData.session.userId !== user.id) {
    throw new Error("Forbidden: Session does not belong to user");
  }

  // 2. Generate and save summary
  const result = await generateAndSaveDailySummary({
    userId: user.id,
    sessionId: sessionId,
    messages: sessionData.messages.map((m) => ({
      role: m.role,
      text: m.text,
      timestamp: m.createdAt,
    })),
  });

  return result;
}

/**
 * [WHAT] Get all insights for current user
 */
export async function getMyInsights(
  insightType?: "daily_summary" | "weekly_summary" | "monthly_summary",
) {
  const user = await getCurrentUser();
  return await getUserInsights(user.id, insightType);
}

/**
 * [WHAT] Get insight for a specific memory
 */
export async function getInsightForMemory(memoryId: string) {
  // Get current user to ensure authorization
  await getCurrentUser();

  const insight = await getMemoryInsight(memoryId);

  if (!insight) {
    return null;
  }

  // TODO: Validate that the memory belongs to the user
  return insight;
}
