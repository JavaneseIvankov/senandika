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
      <Card className={cn("w-full max-w-md", "shadow-2xl", className)}>
        <CardContent className="p-6 space-y-6">
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
