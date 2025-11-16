import React from "react";
import { cn } from "@/lib/utils";
import { Progress } from "@/shared/components/ui/progress";
import { getXPForNextLevel } from "../../utils/sessionHelpers";
import type { XPProgressBarProps } from "../../types";

export const XPProgressBar = React.memo(
  ({ level, xpGained, totalXP, className }: XPProgressBarProps) => {
    const xpForNextLevel = getXPForNextLevel(level);
    const progressPercentage = (totalXP / xpForNextLevel) * 100;

    return (
      <div className={cn("space-y-1.5 sm:space-y-2", className)}>
        <div className="flex items-center justify-between text-xs sm:text-sm">
          <span className="font-medium text-gray-700">Level {level}</span>
          <span className="font-semibold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">+{xpGained} XP</span>
        </div>
        <Progress value={progressPercentage} className="h-1.5 sm:h-2 bg-purple-100" />
        <p className="text-[10px] sm:text-xs text-muted-foreground text-center">
          {totalXP} / {xpForNextLevel} XP
        </p>
      </div>
    );
  },
);

XPProgressBar.displayName = "XPProgressBar";
