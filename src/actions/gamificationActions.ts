"use server";

import { getCurrentUser } from "@/lib/auth";
import {
  getUserStats as getServiceUserStats,
  getUserBadges,
  getXPForNextLevel,
  getXPForCurrentLevel,
  checkBadgeEligibility,
  awardBadge,
  type AchievementContext,
} from "@/lib/services/gamificationService";
import { db } from "@/lib/db/db";
import { badge } from "@/lib/db/schema/schema";
import { eq } from "drizzle-orm";

/**
 * Get current user's gamification stats
 */
export async function getUserGamificationStats() {
  const user = await getCurrentUser();

  const stats = await getServiceUserStats(user.id);

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
    lastActiveDate: stats.lastActiveDate
      ? stats.lastActiveDate.toISOString()
      : null,
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

/**
 * Check and award new badges
 * Uses existing checkBadgeEligibility + awardBadge
 */
export async function checkAndAwardBadges(
  trigger: AchievementContext["trigger"],
) {
  const user = await getCurrentUser();

  // Check eligibility
  const eligibleBadges = await checkBadgeEligibility(user.id, trigger);

  // Award eligible badges
  const newBadges: Array<{
    code: string;
    name: string;
    description: string | null;
  }> = [];

  for (const badgeCode of eligibleBadges) {
    const awarded = await awardBadge(user.id, badgeCode);

    if (awarded) {
      // Get badge details
      const badgeInfo = await db
        .select()
        .from(badge)
        .where(eq(badge.code, badgeCode))
        .then((rows) => rows[0]);

      if (badgeInfo) {
        newBadges.push({
          code: badgeInfo.code,
          name: badgeInfo.name,
          description: badgeInfo.description,
        });
      }
    }
  }

  return { newBadges };
}

/**
 * Get user stats for components
 */
export async function getUserStats() {
  const user = await getCurrentUser();
  const stats = await getUserGamificationStats();
  const badges = await getUserBadges(user.id);
  const serviceStats = await getServiceUserStats(user.id);

  return {
    level: stats.level,
    xp: serviceStats?.xp || 0,
    xpToNextLevel: stats.progress.nextLevelXP,
    totalSessions: 0, // TODO: Get from database
    totalMessages: 0, // TODO: Get from database
    streak: stats.streakDays,
    longestStreak: stats.streakDays, // TODO: Track separately
    badges: badges.map((b) => ({
      code: b.code,
      name: b.name,
      description: b.description,
    })),
  };
}
