import React from "react";
import { cn } from "@/lib/utils";
import type { StatCardProps } from "../../types";

export const StatCard = React.memo(
  ({ icon, label, value, className }: StatCardProps) => {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-2",
          "rounded-lg bg-muted/50 p-4",
          "text-center",
          className,
        )}
      >
        <div className="text-primary">{icon}</div>
        <span className="text-xs text-muted-foreground font-medium">
          {label}
        </span>
        <div className="text-lg font-semibold">{value}</div>
      </div>
    );
  },
);

StatCard.displayName = "StatCard";
