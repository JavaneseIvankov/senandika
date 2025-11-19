import React from "react";
import { cn } from "@/lib/utils";
import { CardContent } from "@/shared/components/ui/card";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { ChatBubble } from "./chat-bubble";
import { ChatLoading } from "./chat-loading";
import { ChatEmptyState } from "./chat-empty-state";
import type { ChatMessagesProps } from "../types";

export const ChatMessages = React.memo(
  ({
    messages,
    isLoading,
    hasSession,
    scrollRef,
    maxHeight = "500px",
    className,
    onEndSession,
  }: ChatMessagesProps) => {
    return (
      <CardContent className={cn("flex-1 p-0 overflow-hidden", className)}>
        <ScrollArea
          className="w-full h-full"
          style={{ maxHeight, height: maxHeight }}
        >
          <div className="p-4 space-y-4">
            {messages.length === 0 ? (
              <ChatEmptyState hasSession={hasSession} />
            ) : (
              <>
                {messages.map((message) => (
                  <ChatBubble
                    key={message.id}
                    message={message}
                    onEndSession={onEndSession}
                  />
                ))}
                {isLoading && <ChatLoading />}
              </>
            )}
            <div ref={scrollRef} />
          </div>
        </ScrollArea>
      </CardContent>
    );
  },
);

ChatMessages.displayName = "ChatMessages";
