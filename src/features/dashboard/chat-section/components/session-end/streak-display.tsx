import React from "react";
import { cn } from "@/lib/utils";
import { Flame } from "lucide-react";
import type { StreakDisplayProps } from "../../types";

export const StreakDisplay = React.memo(
  ({ streakDays, className }: StreakDisplayProps) => {
    return (
      <div
        className={cn(
          "flex items-center justify-center gap-1.5 sm:gap-2",
          "rounded-lg bg-linear-to-r from-orange-50 to-red-50 px-3 py-1.5 sm:px-4 sm:py-2",
          "text-orange-600 font-medium text-xs sm:text-sm border border-orange-200",
          className,
        )}
      >
        <Flame className="h-3 w-3 sm:h-4 sm:w-4" />
        <span>Streak {streakDays} hari</span>
      </div>
    );
  },
);

StreakDisplay.displayName = "StreakDisplay";
