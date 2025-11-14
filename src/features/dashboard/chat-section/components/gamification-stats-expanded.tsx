"use client";

import { useEffect, useState } from "react";
import { getUserStats } from "@/actions/gamificationActions";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Badge } from "@/shared/components/ui/badge";
import { Trophy, Zap, Target, Star, Calendar } from "lucide-react";

interface GamificationStatsExpandedProps {
  userId?: string;
}

export default function GamificationStatsExpanded({
  userId,
}: GamificationStatsExpandedProps) {
  const [stats, setStats] = useState<{
    level: number;
    xp: number;
    xpToNextLevel: number;
    totalSessions: number;
    totalMessages: number;
    streak: number;
    longestStreak: number;
    badges: Array<{ code: string; name: string; description: string }>;
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
          totalSessions: data.totalSessions,
          totalMessages: data.totalMessages,
          streak: data.streak,
          longestStreak: data.longestStreak,
          badges: data.badges,
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
      <div className="space-y-4">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (!stats) {
    return <p className="text-sm text-muted-foreground">No stats available</p>;
  }

  const xpPercentage = (stats.xp / stats.xpToNextLevel) * 100;

  return (
    <div className="space-y-4">
      {/* Level & XP Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            <span className="text-lg font-semibold">Level {stats.level}</span>
          </div>
          <span className="text-sm text-muted-foreground">
            {stats.xp} / {stats.xpToNextLevel} XP
          </span>
        </div>

        {/* XP Progress Bar */}
        <div className="w-full bg-secondary rounded-full h-3">
          <div
            className="bg-primary h-3 rounded-full transition-all duration-300 flex items-center justify-end pr-2"
            style={{ width: `${xpPercentage}%` }}
          >
            <span className="text-xs text-primary-foreground font-medium">
              {Math.round(xpPercentage)}%
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-start gap-2 p-3 bg-secondary/50 rounded-lg">
          <Calendar className="h-4 w-4 text-blue-500 mt-0.5" />
          <div>
            <p className="text-xs text-muted-foreground">Total Sessions</p>
            <p className="text-lg font-semibold">{stats.totalSessions}</p>
          </div>
        </div>

        <div className="flex items-start gap-2 p-3 bg-secondary/50 rounded-lg">
          <Star className="h-4 w-4 text-purple-500 mt-0.5" />
          <div>
            <p className="text-xs text-muted-foreground">Messages</p>
            <p className="text-lg font-semibold">{stats.totalMessages}</p>
          </div>
        </div>

        <div className="flex items-start gap-2 p-3 bg-secondary/50 rounded-lg">
          <Zap className="h-4 w-4 text-orange-500 mt-0.5" />
          <div>
            <p className="text-xs text-muted-foreground">Current Streak</p>
            <p className="text-lg font-semibold">{stats.streak} days</p>
          </div>
        </div>

        <div className="flex items-start gap-2 p-3 bg-secondary/50 rounded-lg">
          <Trophy className="h-4 w-4 text-yellow-500 mt-0.5" />
          <div>
            <p className="text-xs text-muted-foreground">Longest Streak</p>
            <p className="text-lg font-semibold">{stats.longestStreak} days</p>
          </div>
        </div>
      </div>

      {/* Badges Section */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-3">
          <Trophy className="h-4 w-4 text-yellow-500" />
          <span className="text-sm font-semibold">
            Badges ({stats.badges.length})
          </span>
        </div>

        {stats.badges.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No badges earned yet. Keep journaling!
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {stats.badges.map((badge) => (
              <Badge
                key={badge.code}
                variant="secondary"
                className="cursor-pointer"
                title={badge.description}
              >
                {badge.name}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
