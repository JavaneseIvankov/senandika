// ...existing code...
"use client";

import ProfileCard from "./profile-card";
import { AnalyticsDashboard } from "./analytics/analytics-dashboard";
import { useAnalytics } from "@/hooks/use-analytics";

export default function ProfileSection() {
  const { analytics, isLoading, error, timeRange, setTimeRange, refresh } = useAnalytics(7);

  return (
    <main className="flex flex-col gap-4 sm:gap-6 md:gap-8 p-4 sm:p-0">
      <ProfileCard />
      <AnalyticsDashboard
        analytics={analytics}
        isLoading={isLoading}
        error={error}
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
        onRetry={refresh}
      />
    </main>
  );
}
// ...existing code...
