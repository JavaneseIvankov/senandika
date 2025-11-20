"use server";

import { withAuth } from "@/lib/action-helpers";
import { getUserAnalytics } from "@/lib/services/analyticsService";

/**
 * Server Action: Get User Analytics
 *
 * Retrieves comprehensive analytics data for the current user
 * including session stats, mood trends, gamification summary, and AI insights
 *
 * @param days - Time range in days (7, 30, or 90)
 * @returns UserAnalytics with serialized dates
 */
export async function getAnalytics(days: 7 | 30 | 90 = 7) {
  return withAuth(async (user) => {
    console.log("=== GET ANALYTICS ACTION ===");
    console.log("User ID:", user.id);
    console.log("Time range:", days, "days");

    try {
      // Get analytics data
      const analytics = await getUserAnalytics(user.id, days);

      // Serialize dates to ISO strings for client
      const serialized = {
        timeRange: {
          start: analytics.timeRange.start.toISOString(),
          end: analytics.timeRange.end.toISOString(),
          days: analytics.timeRange.days,
        },
        sessionStats: analytics.sessionStats,
        moodTrends: analytics.moodTrends,
        gamificationSummary: {
          ...analytics.gamificationSummary,
          recentBadges: analytics.gamificationSummary.recentBadges.map(
            (badge) => ({
              code: badge.code,
              name: badge.name,
              earnedAt: badge.earnedAt.toISOString(),
            }),
          ),
        },
        summaryInsights: analytics.summaryInsights,
      };

      console.log("=== ANALYTICS ACTION COMPLETE ===");
      console.log("Total sessions:", serialized.sessionStats.totalSessions);
      console.log(
        "Mood improvement:",
        serialized.moodTrends.moodImprovementRate + "%",
      );
      console.log(
        "Current level:",
        serialized.gamificationSummary.currentLevel,
      );

      return serialized;
    } catch (error) {
      console.error("Error in getAnalytics action:", error);
      throw new Error(
        error instanceof Error ? error.message : "Failed to get analytics",
      );
    }
  });
}

/**
 * Type for serialized analytics response (for client-side consumption)
 */
export type SerializedAnalytics = {
  timeRange: {
    start: string;
    end: string;
    days: number;
  };
  sessionStats: {
    totalSessions: number;
    completedSessions: number;
    averageDuration: number;
    totalReflectionTime: number;
    mostActiveDay: string;
    mostActiveTimeOfDay: string;
  };
  moodTrends: {
    moodImprovementRate: number;
    averageStressScore: number;
    stressScoreTrend: "improving" | "stable" | "worsening";
    topEmotions: {
      emotion: string;
      count: number;
      percentage: number;
    }[];
    moodDistribution: {
      improved: number;
      worsened: number;
      unchanged: number;
    };
  };
  gamificationSummary: {
    currentLevel: number;
    totalXP: number;
    currentStreak: number;
    longestStreak: number;
    totalBadges: number;
    recentBadges: {
      code: string;
      name: string;
      earnedAt: string;
    }[];
  };
  summaryInsights: {
    mainInsight: string;
    bulletPoints: string[];
    encouragement: string;
    nextSteps: string[];
  };
};
