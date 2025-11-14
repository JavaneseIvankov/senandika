import React from "react";
import { cn } from "@/lib/utils";
import { Flame } from "lucide-react";
import type { StreakDisplayProps } from "../../types";

export const StreakDisplay = React.memo(
  ({ streakDays, className }: StreakDisplayProps) => {
    return (
      <div
        className={cn(
          "flex items-center justify-center gap-2",
          "rounded-lg bg-orange-50 dark:bg-orange-950/20 px-4 py-2",
          "text-orange-600 dark:text-orange-400 font-medium",
          className,
        )}
      >
        <Flame className="h-4 w-4" />
        <span>Streak {streakDays} hari</span>
      </div>
    );
  },
);

StreakDisplay.displayName = "StreakDisplay";
