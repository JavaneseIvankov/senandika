"use client";

import { useEffect, useState } from "react";
import { getUserEarnedBadges } from "@/actions/gamificationActions";
import { Badge } from "@/shared/components/ui/badge";
import { Trophy, Zap, Target } from "lucide-react";

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

interface UserBadge {
  code: string;
  name: string;
  description: string | null;
  icon: string | null;
  earnedAt?: string;
}

interface GamificationStatsExpandedProps {
  stats: GamificationStats;
}

export default function GamificationStatsExpanded({
  stats,
}: GamificationStatsExpandedProps) {
  const [badges, setBadges] = useState<UserBadge[]>([]);
  const [loadingBadges, setLoadingBadges] = useState(true);

  // Fetch badges separately since they're not in the main stats
  useEffect(() => {
    async function loadBadges() {
      try {
        setLoadingBadges(true);
        const earnedBadges = await getUserEarnedBadges();
        setBadges(earnedBadges);
      } catch (error) {
        console.error("Failed to load badges:", error);
      } finally {
        setLoadingBadges(false);
      }
    }

    loadBadges();
  }, []);

  const xpPercentage = stats.progress.progressPercentage;

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
            {stats.progress.xpInCurrentLevel} / {stats.progress.xpNeededForLevel} XP
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
          <Zap className="h-4 w-4 text-orange-500 mt-0.5" />
          <div>
            <p className="text-xs text-muted-foreground">Current Streak</p>
            <p className="text-lg font-semibold">{stats.streakDays} days</p>
          </div>
        </div>

        <div className="flex items-start gap-2 p-3 bg-secondary/50 rounded-lg">
          <Target className="h-4 w-4 text-primary mt-0.5" />
          <div>
            <p className="text-xs text-muted-foreground">Total XP</p>
            <p className="text-lg font-semibold">{stats.xp}</p>
          </div>
        </div>
      </div>

      {/* Badges Section */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Trophy className="h-4 w-4 text-yellow-500" />
          <span className="text-sm font-semibold">
            Badges {loadingBadges ? "" : `(${badges.length})`}
          </span>
        </div>

        {loadingBadges ? (
          <p className="text-sm text-muted-foreground">Loading badges...</p>
        ) : badges.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No badges earned yet. Keep journaling!
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {badges.map((badge) => (
              <Badge
                key={badge.code}
                variant="secondary"
                className="cursor-help"
                title={badge.description || undefined}
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
