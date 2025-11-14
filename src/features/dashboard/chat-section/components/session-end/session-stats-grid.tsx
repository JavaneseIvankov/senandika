import React from "react";
import { cn } from "@/lib/utils";
import { StatCard } from "./stat-card";
import { Clock, MessageSquare, Heart } from "lucide-react";
import { getMoodEmoji } from "../../utils/sessionHelpers";
import type { SessionStatsGridProps } from "../../types";

export const SessionStatsGrid = React.memo(
  ({ stats, className }: SessionStatsGridProps) => {
    const hasMoodJourney = stats.moodAtStart && stats.moodAtEnd;

    return (
      <div className={cn("grid grid-cols-2 gap-3", className)}>
        {/* Duration */}
        <StatCard
          icon={<Clock className="h-5 w-5" />}
          label="Durasi"
          value={stats.duration}
        />

        {/* Message Count */}
        <StatCard
          icon={<MessageSquare className="h-5 w-5" />}
          label="Pesan"
          value={stats.messageCount.toString()}
        />

        {/* Mood Journey (if available) */}
        {hasMoodJourney && stats.moodAtStart && stats.moodAtEnd && (
          <div className="col-span-2">
            <StatCard
              icon={<Heart className="h-5 w-5" />}
              label="Perjalanan Mood"
              value={
                <div className="flex items-center justify-center gap-2 text-2xl">
                  <span>{getMoodEmoji(stats.moodAtStart)}</span>
                  <span className="text-sm text-muted-foreground">→</span>
                  <span>{getMoodEmoji(stats.moodAtEnd)}</span>
                </div>
              }
            />
          </div>
        )}
      </div>
    );
  },
);

SessionStatsGrid.displayName = "SessionStatsGrid";
