import React from "react";
import { cn } from "@/lib/utils";
import { XPProgressBar } from "./xp-progress-bar";
import { LevelUpBadge } from "./level-up-badge";
import { BadgesList } from "./badges-list";
import { StreakDisplay } from "./streak-display";
import type { GamificationRewardsSectionProps } from "../../types";

export const GamificationRewardsSection = React.memo(
  ({ reward, className }: GamificationRewardsSectionProps) => {
    return (
      <div
        className={cn(
          "space-y-4 rounded-lg border border-primary/20 p-4",
          "bg-gradient-to-br from-primary/5 to-primary/10",
          className,
        )}
      >
        <h4 className="text-sm font-semibold text-center">
          Pencapaian Hari Ini
        </h4>

        {/* XP Progress */}
        <XPProgressBar
          level={reward.level}
          xpGained={reward.xpGained}
          totalXP={reward.totalXP}
        />

        {/* Level Up Badge */}
        {reward.leveledUp && <LevelUpBadge level={reward.level} />}

        {/* Badges Earned */}
        {reward.badgesEarned.length > 0 && (
          <BadgesList badges={reward.badgesEarned} />
        )}

        {/* Streak */}
        <StreakDisplay streakDays={reward.streakDays} />
      </div>
    );
  },
);

GamificationRewardsSection.displayName = "GamificationRewardsSection";
