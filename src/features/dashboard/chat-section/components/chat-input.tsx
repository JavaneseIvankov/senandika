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
      <CardFooter className={cn("p-3 sm:p-4 border-t", className)}>
        <form
          onSubmit={handleSubmit}
          className="flex justify-center items-center gap-1.5 sm:gap-2 w-full"
        >
          {/* Show Summary Button (for ended sessions) */}
          {showSummaryButton && onToggleSummary && (
            <Button
              type="button"
              onClick={onToggleSummary}
              size="icon"
              variant="outline"
              className="shrink-0 h-9 w-9 sm:h-10 sm:w-10 border-purple-200 hover:bg-purple-50"
              title="Lihat Ringkasan Sesi"
            >
              <BarChart3 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-purple-600" />
            </Button>
          )}

          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={isLoading || disabled}
            className="min-h-9 sm:min-h-11 max-h-[100px] sm:max-h-[120px] resize-none flex-1 text-xs sm:text-sm border-purple-200 focus-visible:ring-purple-400"
            rows={1}
          />
          <Button
            type="submit"
            disabled={isLoading || !value.trim() || disabled}
            size="icon"
            className="shrink-0 h-9 w-9 sm:h-10 sm:w-10 bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            {isLoading ? (
              <Loader2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" />
            ) : (
              <Send className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            )}
          </Button>
        </form>
      </CardFooter>
    );
  },
);

ChatInput.displayName = "ChatInput";
