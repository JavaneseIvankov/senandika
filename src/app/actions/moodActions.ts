"use server";

import { getCurrentUser } from "@/lib/auth";
import {
  createMoodLog,
  getUserMoods,
  getMoodGraphData,
  getLatestMood,
} from "@/lib/services/moodService";

/**
 * [WHAT] Log a quick mood entry
 */
export async function logQuickMood(formData: FormData) {
  const user = await getCurrentUser();

  const mood = formData.get("mood") as string;
  const intensity = Number.parseInt(formData.get("intensity") as string, 10);
  const note = formData.get("note") as string | undefined;

  if (!mood || Number.isNaN(intensity)) {
    throw new Error("Invalid mood data");
  }

  if (intensity < 1 || intensity > 10) {
    throw new Error("Intensity must be between 1 and 10");
  }

  await createMoodLog({
    userId: user.id,
    mood,
    intensity,
    note,
  });

  return { success: true };
}

/**
 * [WHAT] Get recent mood entries
 */
export async function getRecentMoods(limit = 10) {
  const user = await getCurrentUser();
  return await getUserMoods(user.id, limit);
}

/**
 * [WHAT] Get mood data for graphing
 */
export async function getMoodGraph(range: "weekly" | "monthly" = "weekly") {
  const user = await getCurrentUser();
  return await getMoodGraphData(user.id, range);
}

/**
 * [WHAT] Get the user's latest mood
 */
export async function getLatestUserMood() {
  const user = await getCurrentUser();
  return await getLatestMood(user.id);
}
