"use client";

import React from "react";
import  TimeRangeCard  from "./time-range-card";
import SessionStats  from "./session-stats-card";
import MoodTrends from "./mood-trend-card";
import GamificationSummary from "./gamification-card";
import SummaryInsights from "./summary-card";
import type { SerializedAnalytics } from "../data/analitycs";

interface Props {
  analytics: SerializedAnalytics;
}

export default function AnalyticsPage({ analytics }: Props) {
  return (
    <main className="space-y-6">
      <TimeRangeCard {...analytics.timeRange} />

      <section>
        <h2 className="sr-only">Session Stats</h2>
        <SessionStats stats={analytics.sessionStats} />
      </section>

      <section>
        <MoodTrends moodTrends={analytics.moodTrends} days={analytics.timeRange.days} />
      </section>

      <section>
        <GamificationSummary summary={analytics.gamificationSummary} />
      </section>

      <section>
        <SummaryInsights insights={analytics.summaryInsights} />
      </section>
    </main>
  );
}