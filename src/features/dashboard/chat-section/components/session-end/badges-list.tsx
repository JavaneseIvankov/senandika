import React from "react";
import { cn } from "@/lib/utils";
import { BadgeItem } from "./badge-item";
import type { BadgesListProps } from "../../types";

export const BadgesList = React.memo(
  ({ badges, className }: BadgesListProps) => {
    return (
      <div className={cn("space-y-1.5 sm:space-y-2", className)}>
        <p className="text-[10px] sm:text-xs font-medium text-purple-700">Badge Baru:</p>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {badges.map((badge) => (
            <BadgeItem key={badge} name={badge} />
          ))}
        </div>
      </div>
    );
  },
);

BadgesList.displayName = "BadgesList";
