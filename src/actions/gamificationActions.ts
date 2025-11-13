"use server";

import { getCurrentUser } from "@/lib/auth";
import {
  getUserStats,
  getUserBadges,
  getXPForNextLevel,
  getXPForCurrentLevel,
} from "@/lib/services/gamificationService";

/**
 * Get current user's gamification stats
 */
export async function getUserGamificationStats() {
  const user = await getCurrentUser();

  const stats = await getUserStats(user.id);

  if (!stats) {
    // User has no stats yet, return defaults
    return {
      userId: user.id,
      xp: 0,
      level: 1,
      streakDays: 0,
      lastActiveDate: null,
      progress: {
        currentLevelXP: 0,
        nextLevelXP: 100,
        progressPercentage: 0,
      },
    };
  }

  // Calculate progress to next level
  const currentLevel = stats.level;
  const currentLevelXP = getXPForCurrentLevel(currentLevel);
  const nextLevelXP = getXPForNextLevel(currentLevel);
  const xpInCurrentLevel = stats.xp - currentLevelXP;
  const xpNeededForLevel = nextLevelXP - currentLevelXP;
  const progressPercentage = Math.floor(
    (xpInCurrentLevel / xpNeededForLevel) * 100,
  );

  return {
    userId: stats.userId,
    xp: stats.xp,
    level: stats.level,
    streakDays: stats.streakDays,
    lastActiveDate: stats.lastActiveDate ? stats.lastActiveDate.toISOString() : null,
    progress: {
      currentLevelXP,
      nextLevelXP,
      xpInCurrentLevel,
      xpNeededForLevel,
      progressPercentage,
    },
  };
}

/**
 * Get current user's earned badges
 */
export async function getUserEarnedBadges() {
  const user = await getCurrentUser();

  const badges = await getUserBadges(user.id);

  // Convert Date objects to ISO strings for serialization
  return badges.map((badge) => ({
    code: badge.code,
    name: badge.name,
    description: badge.description,
    icon: badge.icon,
    earnedAt: badge.earnedAt ? badge.earnedAt.toISOString() : undefined,
  }));
}

/**
 * Get badge progress for locked badges (not implemented yet)
 * This is a placeholder for future UI implementation
 */
export async function getBadgeProgress() {
  // Validate authentication
  await getCurrentUser();

  // TODO: Implement badge progress tracking
  // For now, return empty array
  return [];
}
