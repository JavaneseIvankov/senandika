import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/shared/components/ui/button";
import type { ChatBubbleProps } from "../types";

export const ChatBubble = React.memo(
  ({ message, className, onEndSession }: ChatBubbleProps) => {
    const isUser = message.role === "user";
    const formattedTime = new Date(message.timestamp).toLocaleTimeString(
      "id-ID",
      {
        hour: "2-digit",
        minute: "2-digit",
      },
    );

    // Check if AI suggests ending conversation
    const suggestsEndConv =
      !isUser && message.metadata?.conversation_control?.confirm_endconv;

    return (
      <div
        className={cn(
          "flex flex-col gap-2",
          isUser ? "items-end" : "items-start",
          className,
        )}
      >
        <div
          className={cn(
            "max-w-[80%] rounded-lg px-4 py-2",
            isUser
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-foreground",
          )}
        >
          <p className="text-sm whitespace-pre-wrap wrap-break-word">
            {message.content}
          </p>
          <span
            className={cn(
              "text-xs mt-1 block",
              isUser ? "opacity-70" : "text-muted-foreground",
            )}
          >
            {formattedTime}
          </span>
        </div>

        {suggestsEndConv && onEndSession && (
          <Button
            onClick={onEndSession}
            variant="secondary"
            size="sm"
            className="text-xs cursor-pointer hover:scale-90"
          >
            Ya, akhiri percakapan
          </Button>
        )}
      </div>
    );
  },
);

ChatBubble.displayName = "ChatBubble";
