"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getAnalytics,
  type SerializedAnalytics,
} from "@/actions/analyticsActions";
import { useServerActionError } from "@/hooks/use-server-action-error";

type TimeRange = 7 | 30 | 90;

interface UseAnalyticsReturn {
  analytics: SerializedAnalytics | null;
  isLoading: boolean;
  error: string | null;
  timeRange: TimeRange;
  setTimeRange: (range: TimeRange) => void;
  refresh: () => Promise<void>;
}

/**
 * Custom hook for managing analytics data
 *
 * Fetches and manages analytics data with support for different time ranges
 *
 * @param initialTimeRange - Initial time range (default: 7 days)
 * @returns Analytics data with loading/error states and controls
 */
export function useAnalytics(
  initialTimeRange: TimeRange = 7,
): UseAnalyticsReturn {
  const [analytics, setAnalytics] = useState<SerializedAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>(initialTimeRange);
  const { handleAction } = useServerActionError();

  const fetchAnalytics = useCallback(
    async (days: TimeRange) => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await handleAction(() => getAnalytics(days));
        if (data) {
          setAnalytics(data);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch analytics";
        setError(errorMessage);
        console.error("Error fetching analytics:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [handleAction],
  );

  // Fetch analytics when timeRange changes
  useEffect(() => {
    fetchAnalytics(timeRange);
  }, [timeRange, fetchAnalytics]);

  // Refresh function to manually refetch data
  const refresh = useCallback(async () => {
    await fetchAnalytics(timeRange);
  }, [timeRange, fetchAnalytics]);

  return {
    analytics,
    isLoading,
    error,
    timeRange,
    setTimeRange,
    refresh,
  };
}
