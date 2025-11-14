// ...existing code...
"use client";

import ProfileCard from "./profile-card";
import GamificationCard from "./gamification-card";
import StatisticCard from "./statistic-card";
// import AnalyticsPage yang berada di folder analytics (per struktur yang disarankan)
import AnalyticsPage from "./analitycs-card";
import type { SerializedAnalytics } from "../data/analitycs";

/* Contoh mock data (ganti dengan data nyata dari API / parent props) */
const mockAnalytics: SerializedAnalytics = {
  timeRange: { start: new Date().toISOString(), end: new Date().toISOString(), days: 7 },
  sessionStats: {
    totalSessions: 12,
    completedSessions: 9,
    averageDuration: 22,
    totalReflectionTime: 180,
    mostActiveDay: "Wednesday",
    mostActiveTimeOfDay: "Evening",
  },
  moodTrends: {
    moodImprovementRate: 12,
    averageStressScore: 48,
    stressScoreTrend: "improving",
    topEmotions: [
      { emotion: "calm", count: 15, percentage: 30 },
      { emotion: "anxious", count: 10, percentage: 20 },
    ],
    moodDistribution: { improved: 60, worsened: 25, unchanged: 15 },
  },
  gamificationSummary: {
    currentLevel: 3,
    totalXP: 1240,
    currentStreak: 5,
    longestStreak: 12,
    totalBadges: 4,
    recentBadges: [{ code: "BRONZE-1", name: "First Steps", earnedAt: new Date().toISOString() }],
  },
  summaryInsights: {
    mainInsight: "You are improving steadily",
    bulletPoints: ["More consistent sessions", "Lower average stress this week"],
    encouragement: "Great job — keep the daily habit!",
    nextSteps: ["Continue short daily reflections", "Try a breathing exercise on high-stress days"],
  },
};

export default function ProfileSection() {
  // Jika Anda meng-fetch analytics di parent atau server, lepas mock dan kirim analytics sebenarnya:
  // <AnalyticsPage analytics={analyticsFromServer} />
  return (
    <main className="flex flex-col gap-8">
      <ProfileCard />
      <GamificationCard />
      <StatisticCard />
      <AnalyticsPage analytics={mockAnalytics} />
    </main>
  );
}
// ...existing code...