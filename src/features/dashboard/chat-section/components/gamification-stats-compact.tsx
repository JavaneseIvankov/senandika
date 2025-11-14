"use client";

import { Zap, Target } from "lucide-react";

interface GamificationStats {
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

interface GamificationStatsCompactProps {
  stats: GamificationStats;
}

export default function GamificationStatsCompact({
  stats,
}: GamificationStatsCompactProps) {
  const xpPercentage = stats.progress.progressPercentage;

  return (
    <div className="space-y-3">
      {/* Level & XP */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">Level {stats.level}</span>
        </div>
        <span className="text-xs text-muted-foreground">
          {stats.progress.xpInCurrentLevel} / {stats.progress.xpNeededForLevel} XP
        </span>
      </div>

      {/* XP Progress Bar */}
      <div className="w-full bg-secondary rounded-full h-2">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{ width: `${xpPercentage}%` }}
        />
      </div>

      {/* Streak */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-1.5">
          <Zap className="h-4 w-4 text-orange-500" />
          <span className="text-muted-foreground">
            {stats.streakDays} Day Streak
          </span>
        </div>
      </div>
    </div>
  );
}
