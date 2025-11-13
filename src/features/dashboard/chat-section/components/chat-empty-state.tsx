import React from "react";
import { MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChatEmptyStateProps } from "../types";

export const ChatEmptyState = React.memo(
  ({ hasSession, className }: ChatEmptyStateProps) => {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center h-full text-center p-8",
          className,
        )}
      >
        <MessageSquare className="h-12 w-12 text-muted-foreground/50 mb-4" />
        <p className="text-muted-foreground text-sm">
          {hasSession
            ? "No messages yet. Start the conversation!"
            : "Start a session to begin chatting"}
        </p>
      </div>
    );
  },
);

ChatEmptyState.displayName = "ChatEmptyState";
