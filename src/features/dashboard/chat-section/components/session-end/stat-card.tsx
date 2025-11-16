import React from "react";
import { cn } from "@/lib/utils";
import type { StatCardProps } from "../../types";

export const StatCard = React.memo(
  ({ icon, label, value, className }: StatCardProps) => {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-1.5 sm:gap-2",
          "rounded-lg bg-linear-to-br from-purple-50/50 to-pink-50/50 border border-purple-100 p-3 sm:p-4",
          "text-center transition-all hover:shadow-md",
          className,
        )}
      >
        <div className="text-purple-600">{icon}</div>
        <span className="text-[10px] sm:text-xs text-muted-foreground font-medium">
          {label}
        </span>
        <div className="text-sm sm:text-base md:text-lg font-semibold text-gray-800">{value}</div>
      </div>
    );
  },
);

StatCard.displayName = "StatCard";
