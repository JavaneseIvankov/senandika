import React from "react";
import { cn } from "@/lib/utils";
import { TrophyIcon } from "lucide-react";
import type { LevelUpBadgeProps } from "../../types";

export const LevelUpBadge = React.memo(
  ({ level, className }: LevelUpBadgeProps) => {
    return (
      <div
        className={cn(
          "flex items-center justify-center gap-2",
          "rounded-lg bg-gradient-to-r from-yellow-400 to-orange-500",
          "px-4 py-3 text-white font-semibold",
          "animate-pulse",
          className,
        )}
      >
        <TrophyIcon className="h-5 w-5" />
        <span>Naik ke Level {level}!</span>
      </div>
    );
  },
);

LevelUpBadge.displayName = "LevelUpBadge";
