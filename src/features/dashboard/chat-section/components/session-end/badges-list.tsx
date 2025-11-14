import React from "react";
import { cn } from "@/lib/utils";
import { BadgeItem } from "./badge-item";
import type { BadgesListProps } from "../../types";

export const BadgesList = React.memo(
  ({ badges, className }: BadgesListProps) => {
    return (
      <div className={cn("space-y-2", className)}>
        <p className="text-xs font-medium text-muted-foreground">Badge Baru:</p>
        <div className="flex flex-wrap gap-2">
          {badges.map((badge) => (
            <BadgeItem key={badge} name={badge} />
          ))}
        </div>
      </div>
    );
  },
);

BadgesList.displayName = "BadgesList";
