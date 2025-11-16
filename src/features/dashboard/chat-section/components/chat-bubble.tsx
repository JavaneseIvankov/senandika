"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/shared/components/ui/button";
import type { ChatBubbleProps } from "../types";

export const ChatBubble = React.memo(
  ({ message, className, onEndSession }: ChatBubbleProps) => {
    const [hideButton, setHideButton] = useState(false);

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

    const handleClick = () => {
      setHideButton(true);
      onEndSession?.();
    }

    return (
      <div
        className={cn(
          "flex flex-col gap-1.5 sm:gap-2",
          isUser ? "items-end" : "items-start",
          className,
        )}
      >
        <div
          className={cn(
            "max-w-[85%] sm:max-w-[80%] md:max-w-[75%] rounded-lg px-3 py-2 sm:px-4 sm:py-2.5",
            isUser
              ? "bg-linear-to-br from-purple-500 to-pink-500 text-white"
              : "bg-linear-to-br from-purple-50 to-pink-50 text-foreground border border-purple-100",
          )}
        >
          <p className="text-xs sm:text-sm md:text-base whitespace-pre-wrap wrap-break-word leading-relaxed">
            {message.content}
          </p>
          <span
            className={cn(
              "text-[10px] sm:text-xs mt-1 block",
              isUser ? "opacity-80" : "text-muted-foreground",
            )}
          >
            {formattedTime}
          </span>
        </div>

        {!hideButton && suggestsEndConv && onEndSession && (
          <Button
            onClick={handleClick}
            size="sm"
            className="text-[10px] sm:text-xs cursor-pointer hover:scale-95 transition-transform bg-linear-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 px-3 sm:px-4 py-1.5 sm:py-2"
          >
            Ya, akhiri percakapan
          </Button>
        )}
      </div>
    );
  },
);

ChatBubble.displayName = "ChatBubble";
