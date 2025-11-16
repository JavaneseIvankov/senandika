import React from "react";
import {
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";
import type { ChatHeaderProps } from "../types";

export const ChatHeader = React.memo(
  ({ session, messageCount }: ChatHeaderProps) => {
    return (
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="text-lg sm:text-xl md:text-2xl">Chat</CardTitle>
        <CardDescription className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
          {session ? (
            <>
              {session.endedAt ? (
                <span className="text-muted-foreground">● Session ended</span>
              ) : (
                <span className="text-green-500">● Active</span>
              )}
              <Separator orientation="vertical" className="h-3 sm:h-4" />
              <span>{messageCount} messages</span>
            </>
          ) : (
            "No active session"
          )}
        </CardDescription>
      </CardHeader>
    );
  },
);

ChatHeader.displayName = "ChatHeader";
