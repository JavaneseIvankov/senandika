import React from "react";
import { cn } from "@/lib/utils";
import type { BadgeItemProps } from "../../types";

export const BadgeItem = React.memo(({ name, className }: BadgeItemProps) => {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 sm:gap-1.5",
        "rounded-full bg-linear-to-r from-purple-100 to-pink-100 px-2 py-1 sm:px-3 sm:py-1.5",
        "text-[10px] sm:text-xs font-medium text-purple-700",
        "border border-purple-200 shadow-sm",
        className,
      )}
    >
      <span className="text-xs sm:text-sm">🏆</span>
      <span>{name}</span>
    </div>
  );
});

BadgeItem.displayName = "BadgeItem";
