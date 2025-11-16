import React from "react";
import { cn } from "@/lib/utils";
import { TrophyIcon } from "lucide-react";
import type { LevelUpBadgeProps } from "../../types";

export const LevelUpBadge = React.memo(
  ({ level, className }: LevelUpBadgeProps) => {
    return (
      <div
        className={cn(
          "flex items-center justify-center gap-1.5 sm:gap-2",
          "rounded-lg bg-linear-to-r from-yellow-400 to-orange-500",
          "px-3 py-2 sm:px-4 sm:py-3 text-white font-semibold text-xs sm:text-sm md:text-base",
          "animate-pulse shadow-lg",
          className,
        )}
      >
        <TrophyIcon className="h-4 w-4 sm:h-5 sm:w-5" />
        <span>Naik ke Level {level}!</span>
      </div>
    );
  },
);

LevelUpBadge.displayName = "LevelUpBadge";
