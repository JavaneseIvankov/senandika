import "server-only";
import { db } from "@/lib/db/db";
import { mood } from "@/lib/db/schema/schema";
import { eq, desc, and, gte, sql } from "drizzle-orm";

export type MoodEntry = {
  id: number;
  userId: string;
  mood: string;
  intensity: number;
  note: string | null;
  createdAt: Date;
};

export type CreateMoodDto = {
  userId: string;
  mood: string;
  intensity: number;
  note?: string;
};

export type MoodGraphData = {
  date: Date;
  intensity: number;
};

/**
 * [HOW] Create a mood log entry
 */
export async function createMoodLog(data: CreateMoodDto): Promise<MoodEntry> {
  const [newMood] = await db
    .insert(mood)
    .values({
      userId: data.userId,
      mood: data.mood,
      intensity: data.intensity,
      note: data.note || null,
    })
    .returning();

  return {
    id: newMood.id,
    userId: newMood.userId,
    mood: newMood.mood,
    intensity: newMood.intensity,
    note: newMood.note,
    createdAt: newMood.createdAt,
  };
}

/**
 * [HOW] Get recent mood entries for a user
 */
export async function getUserMoods(
  userId: string,
  limit = 10,
): Promise<MoodEntry[]> {
  const moods = await db
    .select()
    .from(mood)
    .where(eq(mood.userId, userId))
    .orderBy(desc(mood.createdAt))
    .limit(limit);

  return moods.map((m) => ({
    id: m.id,
    userId: m.userId,
    mood: m.mood,
    intensity: m.intensity,
    note: m.note,
    createdAt: m.createdAt,
  }));
}

/**
 * [HOW] Get mood data for graphing
 * Aggregates mood intensity by day for the specified range
 */
export async function getMoodGraphData(
  userId: string,
  range: "weekly" | "monthly",
): Promise<MoodGraphData[]> {
  const daysBack = range === "weekly" ? 7 : 30;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - daysBack);

  const results = await db
    .select({
      date: sql<Date>`DATE(${mood.createdAt})`,
      avgIntensity: sql<number>`AVG(${mood.intensity})::int`,
    })
    .from(mood)
    .where(and(eq(mood.userId, userId), gte(mood.createdAt, startDate)))
    .groupBy(sql`DATE(${mood.createdAt})`)
    .orderBy(sql`DATE(${mood.createdAt})`);

  return results.map((r) => ({
    date: r.date,
    intensity: r.avgIntensity,
  }));
}

/**
 * [HOW] Get the latest mood for a user
 */
export async function getLatestMood(userId: string): Promise<MoodEntry | null> {
  const [latestMood] = await db
    .select()
    .from(mood)
    .where(eq(mood.userId, userId))
    .orderBy(desc(mood.createdAt))
    .limit(1);

  if (!latestMood) {
    return null;
  }

  return {
    id: latestMood.id,
    userId: latestMood.userId,
    mood: latestMood.mood,
    intensity: latestMood.intensity,
    note: latestMood.note,
    createdAt: latestMood.createdAt,
  };
}
