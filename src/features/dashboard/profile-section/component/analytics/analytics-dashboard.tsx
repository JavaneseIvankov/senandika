"use client";

import { SessionStatsGrid } from "./session-stats-grid";
import { MoodChart } from "./mood-chart";
import { MoodDistributionCard } from "./mood-distribution-card";
import { EmotionList } from "./emotion-list";
import { GamificationProgress } from "./gamification-progress";
import { BadgeGrid } from "./badge-grid";
import { InsightsCard } from "./insights-card";
import { TimeRangeSelector } from "./time-range-selector";
import { LoadingState } from "./loading-state";
import { ErrorState } from "./error-state";
import { Separator } from "@/shared/components/ui/separator";
import type { SerializedAnalytics } from "@/actions/analyticsActions";

interface AnalyticsDashboardProps {
  analytics: SerializedAnalytics | null;
  isLoading: boolean;
  error: string | null;
  timeRange: 7 | 30 | 90;
  onTimeRangeChange: (range: 7 | 30 | 90) => void;
  onRetry: () => void;
}

export function AnalyticsDashboard({
  analytics,
  isLoading,
  error,
  timeRange,
  onTimeRangeChange,
  onRetry,
}: AnalyticsDashboardProps) {
  // Loading State
  if (isLoading) {
    return <LoadingState />;
  }

  // Error State
  if (error) {
    return <ErrorState message={error} onRetry={onRetry} />;
  }

  // No Data State
  if (!analytics) {
    return (
      <ErrorState
        message="No analytics data available. Start journaling to see your insights!"
        onRetry={onRetry}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Analytics Overview</h2>
        <TimeRangeSelector selected={timeRange} onChange={onTimeRangeChange} />
      </div>

      <Separator />

      {/* Session Stats */}
      <SessionStatsGrid stats={analytics.sessionStats} />

      {/* Mood & Emotions */}
      <div className="grid gap-6 md:grid-cols-2">
        <MoodChart moodTrends={analytics.moodTrends} days={analytics.timeRange.days} />
        <MoodDistributionCard distribution={analytics.moodTrends.moodDistribution} />
      </div>

      {/* Emotions List */}
      <EmotionList emotions={analytics.moodTrends.topEmotions} />

      {/* Gamification */}
      <div className="grid gap-6 md:grid-cols-2">
        <GamificationProgress summary={analytics.gamificationSummary} />
        <BadgeGrid badges={analytics.gamificationSummary.recentBadges} />
      </div>

      {/* Insights */}
      <InsightsCard insights={analytics.summaryInsights} />
    </div>
  );
}
