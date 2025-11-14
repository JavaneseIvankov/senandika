import React from "react";
import { Send, Loader2, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { CardFooter } from "@/shared/components/ui/card";
import { Textarea } from "@/shared/components/ui/textarea";
import { Button } from "@/shared/components/ui/button";
import type { ChatInputProps } from "../types";

export const ChatInput = React.memo(
  ({
    value,
    onChange,
    onSubmit,
    isLoading,
    disabled,
    placeholder = "Type a message...",
    className,
    showSummaryButton,
    onToggleSummary,
  }: ChatInputProps) => {
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!value.trim() || isLoading || disabled) return;
      await onSubmit(value);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(e as unknown as React.FormEvent);
      }
    };

    return (
      <CardFooter className={cn("p-4 border-t", className)}>
        <form
          onSubmit={handleSubmit}
          className="flex justify-center items-center gap-2 w-full"
        >
          {/* Show Summary Button (for ended sessions) */}
          {showSummaryButton && onToggleSummary && (
            <Button
              type="button"
              onClick={onToggleSummary}
              size="icon"
              variant="outline"
              className="shrink-0"
              title="Lihat Ringkasan Sesi"
            >
              <BarChart3 className="h-4 w-4" />
            </Button>
          )}

          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={isLoading || disabled}
            className="min-h-11 max-h-[120px] resize-none flex-1"
            rows={1}
          />
          <Button
            type="submit"
            disabled={isLoading || !value.trim() || disabled}
            size="icon"
            className="shrink-0"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </CardFooter>
    );
  },
);

ChatInput.displayName = "ChatInput";
