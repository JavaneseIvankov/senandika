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