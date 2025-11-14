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
      <div className={cn("space-y-2", className)}>
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">Level {level}</span>
          <span className="text-primary font-semibold">+{xpGained} XP</span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
        <p className="text-xs text-muted-foreground text-center">
          {totalXP} / {xpForNextLevel} XP
        </p>
      </div>
    );
  },
);

XPProgressBar.displayName = "XPProgressBar";
