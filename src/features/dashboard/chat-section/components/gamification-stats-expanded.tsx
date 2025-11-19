"use client";

import { useEffect, useState } from "react";
import { getUserEarnedBadges } from "@/actions/gamificationActions";
import { Badge } from "@/shared/components/ui/badge";
import { Trophy, Zap, Target } from "lucide-react";
import { useServerActionError } from "@/hooks/use-server-action-error";

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
  const { handleAction } = useServerActionError();

  // Fetch badges separately since they're not in the main stats
  useEffect(() => {
    async function loadBadges() {
      try {
        setLoadingBadges(true);
        const earnedBadges = await handleAction(() => getUserEarnedBadges());
        if (earnedBadges) {
          setBadges(earnedBadges);
        }
      } catch (error) {
        console.error("Failed to load badges:", error);
      } finally {
        setLoadingBadges(false);
      }
    }

    loadBadges();
  }, [handleAction]);

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
            {stats.progress.xpInCurrentLevel} /{" "}
            {stats.progress.xpNeededForLevel} XP
          </span>
        </div>

        {/* XP Progress Bar */}
        <div className="w-full bg-purple-100 rounded-full h-3">
          <div
            className="bg-linear-to-r from-purple-400 to-pink-400 h-3 rounded-full transition-all duration-500 ease-out flex items-center justify-end pr-2"
            style={{ width: `${xpPercentage}%` }}
          >
            <span className="text-xs text-white font-medium">
              {Math.round(xpPercentage)}%
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-start gap-2 p-3 bg-linear-to-br from-orange-50 to-amber-50 rounded-lg border border-orange-100">
          <Zap className="h-4 w-4 text-orange-500 mt-0.5" />
          <div>
            <p className="text-xs text-orange-600/70">Current Streak</p>
            <p className="text-lg font-semibold text-orange-700">
              {stats.streakDays} days
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2 p-3 bg-linear-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-100">
          <Target className="h-4 w-4 text-purple-500 mt-0.5" />
          <div>
            <p className="text-xs text-purple-600/70">Total XP</p>
            <p className="text-lg font-semibold text-purple-700">{stats.xp}</p>
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
