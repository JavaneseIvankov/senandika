"use client";

import { useState, useEffect, useCallback } from "react";
import { getUserGamificationStats } from "@/actions/gamificationActions";
import { addGamificationListener } from "@/lib/events/gamificationEvents";

// Types
export interface GamificationStats {
  userId: string;
  xp: number;
  level: number;
  streakDays: number;
  lastActiveDate: string | null;
  progress: {
    currentLevelXP: number;
    nextLevelXP: number;
    xpInCurrentLevel: number;
    xpNeededForLevel: number;
    progressPercentage: number;
  };
}

export interface UseGamificationStatsReturn {
  stats: GamificationStats | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook for managing gamification stats with real-time updates
 * 
 * Features:
 * - Fetches user's gamification stats on mount
 * - Automatically refetches when gamification events occur
 * - Provides loading and error states
 * - Manual refetch function
 * 
 * @returns Stats data, loading state, error, and refetch function
 */
export function useGamificationStats(): UseGamificationStatsReturn {
  const [stats, setStats] = useState<GamificationStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch stats function
  const fetchStats = useCallback(async () => {
    try {
      setError(null);
      const data = await getUserGamificationStats();
      setStats(data);
    } catch (err) {
      console.error("Failed to fetch gamification stats:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load statistics"
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch on mount
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Listen to gamification events for real-time updates
  useEffect(() => {
    const cleanup = addGamificationListener((event) => {
      console.log("🎮 Gamification event detected:", event.detail);
      // Refetch stats when event occurs
      fetchStats();
    });

    // Cleanup listener on unmount
    return cleanup;
  }, [fetchStats]);

  return {
    stats,
    isLoading,
    error,
    refetch: fetchStats,
  };
}
