import React from "react";
import { cn } from "@/lib/utils";
import type { ChatLoadingProps } from "../types";

export const ChatLoading = React.memo(({ className }: ChatLoadingProps) => {
  return (
    <div className={cn("flex justify-start", className)}>
      <div className="rounded-lg bg-muted px-4 py-3">
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce" />
          <div
            className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          />
          <div
            className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce"
            style={{ animationDelay: "0.4s" }}
          />
        </div>
      </div>
    </div>
  );
});

ChatLoading.displayName = "ChatLoading";
