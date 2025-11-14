import type { Message } from "../types";

/**
 * Format duration in minutes to Indonesian time string
 * @param minutes Duration in minutes
 * @returns Formatted string like "23 menit" or "1 jam 15 menit"
 */
export function formatDuration(minutes: number): string {
  if (minutes < 1) {
    return "< 1 menit";
  }

  if (minutes < 60) {
    return `${minutes} menit`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours} jam`;
  }

  return `${hours} jam ${remainingMinutes} menit`;
}

/**
 * Get emoji representation for mood
 * @param mood Mood string (e.g., "happy", "sad", "neutral")
 * @returns Emoji string
 */
export function getMoodEmoji(mood: string): string {
  const moodMap: Record<string, string> = {
    happy: "😊",
    sad: "😢",
    neutral: "😐",
    anxious: "😰",
    angry: "😠",
    excited: "😃",
    tired: "😴",
    stressed: "😫",
    calm: "😌",
    confused: "😕",
    grateful: "🙏",
    hopeful: "🌟",
  };

  return moodMap[mood.toLowerCase()] || "😐";
}

/**
 * Calculate average stress score from messages
 * @param messages Array of chat messages
 * @returns Average stress score or undefined
 */
export function calculateAverageStress(
  messages: Message[],
): number | undefined {
  const stressScores = messages
    .filter((msg) => {
      if (msg.role !== "assistant" || !msg.metadata) return false;
      const metadata = msg.metadata as unknown as Record<string, unknown>;
      return (
        "stressLevel" in metadata && typeof metadata.stressLevel === "number"
      );
    })
    .map((msg) => {
      const metadata = msg.metadata as unknown as Record<string, unknown>;
      return metadata.stressLevel as number;
    });

  if (stressScores.length === 0) {
    return undefined;
  }

  const sum = stressScores.reduce((acc, score) => acc + score, 0);
  return Math.round(sum / stressScores.length);
}

/**
 * Get XP required for next level
 * @param currentLevel Current level
 * @returns XP required for next level
 */
export function getXPForNextLevel(currentLevel: number): number {
  // Formula: 100 * level^1.5
  // Level 1 -> 100 XP
  // Level 2 -> 282 XP
  // Level 3 -> 519 XP
  // Level 5 -> 1118 XP
  // Level 10 -> 3162 XP
  return Math.floor(100 * Math.pow(currentLevel, 1.5));
}
