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
      <CardHeader>
        <CardTitle>Chat</CardTitle>
        <CardDescription className="flex items-center gap-2">
          {session ? (
            <>
              {session.endedAt ? (
                <span className="text-muted-foreground">● Session ended</span>
              ) : (
                <span className="text-green-500">● Active</span>
              )}
              <Separator orientation="vertical" className="h-4" />
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
