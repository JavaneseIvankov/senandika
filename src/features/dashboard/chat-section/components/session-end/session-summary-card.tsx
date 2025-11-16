import React from "react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { cn } from "@/lib/utils";
import { SessionEndHeader } from "./session-end-header";
import { SessionStatsGrid } from "./session-stats-grid";
import { GamificationRewardsSection } from "./gamification-rewards-section";
import { SessionEndActions } from "./session-end-actions";
import type { SessionSummaryCardProps } from "../../types";

export const SessionSummaryCard = React.memo(
  ({
    stats,
    gamificationReward,
    onStartNewSession,
    onViewHistory,
    onClose,
    className,
  }: SessionSummaryCardProps) => {
    return (
      <Card className={cn("w-full", "shadow-2xl border-purple-200 bg-linear-to-br from-white to-purple-50/20", className)}>
        <CardContent className="p-4 sm:p-5 md:p-6 space-y-4 sm:space-y-5 md:space-y-6">
          {/* Header */}
          <SessionEndHeader />

          {/* Stats Grid */}
          <SessionStatsGrid stats={stats} />

          {/* Gamification Rewards */}
          {gamificationReward && (
            <GamificationRewardsSection reward={gamificationReward} />
          )}

          {/* Action Buttons */}
          <SessionEndActions
            onStartNewSession={onStartNewSession}
            onViewHistory={onViewHistory}
            onClose={onClose}
          />
        </CardContent>
      </Card>
    );
  },
);

SessionSummaryCard.displayName = "SessionSummaryCard";
