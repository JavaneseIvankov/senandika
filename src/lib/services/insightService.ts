import "server-only";

import { db } from "@/lib/db/db";
import { insight } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { gemini } from "@/app/lib/ai";
import { generateText } from "ai";
import { SUMMARY_SYSTEM_PROMPT, buildSummaryPrompt } from "./promptService";

/**
 * Insight Service - Daily Summary Generation
 * Based on summarizer.py implementation
 */

export interface DailySummaryInput {
  userId: string;
  sessionId: string;
  messages: Array<{ role: string; text: string; timestamp: Date }>;
  analytics?: {
    avgStress?: number;
    maxStress?: number;
    topEmotions?: string[];
    topTopics?: string[];
  };
  carryOverNotes?: string;
}

export interface DailySummaryOutput {
  daily_summary: string;
  key_points: string[];
  follow_up_tomorrow: string[];
  safety_flag: boolean;
}

/**
 * Generate daily summary for a journal session
 */
export async function generateDailySummary(
  input: DailySummaryInput,
): Promise<DailySummaryOutput> {
  try {
    // 1. Build the summary prompt
    const prompt = buildSummaryPrompt(
      input.messages,
      input.analytics,
      input.carryOverNotes,
    );

    // 2. Call Gemini API to generate summary
    const result = await generateText({
      model: gemini("gemini-2.0-flash"),
      system: SUMMARY_SYSTEM_PROMPT,
      prompt: prompt,
    });

    // 3. Parse the JSON response
    const summaryData: DailySummaryOutput = JSON.parse(result.text);

    // 4. Validate the structure
    if (
      !summaryData.daily_summary ||
      !Array.isArray(summaryData.key_points) ||
      !Array.isArray(summaryData.follow_up_tomorrow) ||
      typeof summaryData.safety_flag !== "boolean"
    ) {
      throw new Error("Invalid summary structure from AI");
    }

    return summaryData;
  } catch (error) {
    console.error("Failed to generate daily summary:", error);
    throw new Error("Failed to generate insight summary");
  }
}

/**
 * Save daily summary to the database
 * Note: Current schema uses 'type' instead of 'insightType' and 'content' as text (stores JSON)
 */
export async function saveDailyInsight(
  userId: string,
  memoryId: string | null,
  summaryData: DailySummaryOutput,
  insightType:
    | "daily_summary"
    | "weekly_summary"
    | "monthly_summary" = "daily_summary",
): Promise<string> {
  try {
    const [newInsight] = await db
      .insert(insight)
      .values({
        userId: userId,
        memoryId: memoryId,
        type: insightType,
        content: JSON.stringify({
          summary: summaryData.daily_summary,
          keyPoints: summaryData.key_points,
          followUp: summaryData.follow_up_tomorrow,
          safetyFlag: summaryData.safety_flag,
        }),
      })
      .returning();

    return newInsight.id;
  } catch (error) {
    console.error("Failed to save daily insight:", error);
    throw new Error("Failed to save insight to database");
  }
}

/**
 * Retrieve all insights for a user
 */
export async function getUserInsights(
  userId: string,
  insightType?: "daily_summary" | "weekly_summary" | "monthly_summary",
) {
  try {
    const insights = await db
      .select()
      .from(insight)
      .where(eq(insight.userId, userId));

    // Filter by type if specified
    const filtered = insightType
      ? insights.filter((i) => i.type === insightType)
      : insights;

    // Parse JSON content
    return filtered.map((i) => ({
      ...i,
      content: JSON.parse(i.content),
    }));
  } catch (error) {
    console.error("Failed to retrieve insights:", error);
    throw new Error("Failed to retrieve insights");
  }
}

/**
 * Retrieve insights for a specific memory
 */
export async function getMemoryInsight(memoryId: string) {
  try {
    const insights = await db
      .select()
      .from(insight)
      .where(eq(insight.memoryId, memoryId));

    if (insights.length === 0) return null;

    return {
      ...insights[0],
      content: JSON.parse(insights[0].content),
    };
  } catch (error) {
    console.error("Failed to retrieve memory insight:", error);
    throw new Error("Failed to retrieve memory insight");
  }
}

/**
 * Generate and save daily summary in one operation
 */
export async function generateAndSaveDailySummary(
  input: DailySummaryInput,
  memoryId: string | null = null,
): Promise<{ insightId: string; summary: DailySummaryOutput }> {
  // 1. Generate the summary
  const summary = await generateDailySummary(input);

  // 2. Save to database
  const insightId = await saveDailyInsight(input.userId, memoryId, summary);

  return { insightId, summary };
}
