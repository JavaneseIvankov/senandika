import React from "react";
import { cn } from "@/lib/utils";
import type { BadgeItemProps } from "../../types";

export const BadgeItem = React.memo(({ name, className }: BadgeItemProps) => {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5",
        "rounded-full bg-primary/10 px-3 py-1.5",
        "text-xs font-medium text-primary",
        "border border-primary/20",
        className,
      )}
    >
      <span>🏆</span>
      <span>{name}</span>
    </div>
  );
});

BadgeItem.displayName = "BadgeItem";
