"use client";

import { useEffect, useState } from "react";
import { getUserStats } from "@/actions/gamificationActions";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Trophy, Zap, Target } from "lucide-react";

interface GamificationStatsCompactProps {
  userId?: string;
}

export default function GamificationStatsCompact({
  userId,
}: GamificationStatsCompactProps) {
  const [stats, setStats] = useState<{
    level: number;
    xp: number;
    xpToNextLevel: number;
    badgeCount: number;
    streak: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true);
        const data = await getUserStats();
        setStats({
          level: data.level,
          xp: data.xp,
          xpToNextLevel: data.xpToNextLevel,
          badgeCount: data.badges.length,
          streak: data.streak,
        });
      } catch (error) {
        console.error("Failed to load stats:", error);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, [userId]);

  if (loading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    );
  }

  if (!stats) {
    return <p className="text-sm text-muted-foreground">No stats available</p>;
  }

  const xpPercentage = (stats.xp / stats.xpToNextLevel) * 100;

  return (
    <div className="space-y-3">
      {/* Level & XP */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">Level {stats.level}</span>
        </div>
        <span className="text-xs text-muted-foreground">
          {stats.xp} / {stats.xpToNextLevel} XP
        </span>
      </div>

      {/* XP Progress Bar */}
      <div className="w-full bg-secondary rounded-full h-2">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{ width: `${xpPercentage}%` }}
        />
      </div>

      {/* Badges & Streak */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-1.5">
          <Trophy className="h-4 w-4 text-yellow-500" />
          <span className="text-muted-foreground">
            {stats.badgeCount} Badges
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Zap className="h-4 w-4 text-orange-500" />
          <span className="text-muted-foreground">
            {stats.streak} Day Streak
          </span>
        </div>
      </div>
    </div>
  );
}
