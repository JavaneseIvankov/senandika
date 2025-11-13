import React from "react";
import { AlertCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/shared/components/ui/button";
import type { ChatErrorDisplayProps } from "../types";

export const ChatErrorDisplay = React.memo(
  ({ error, onDismiss, className }: ChatErrorDisplayProps) => {
    return (
      <div className={cn("px-4 pb-2", className)}>
        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-destructive font-medium">{error}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 flex-shrink-0"
              onClick={onDismiss}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  },
);

ChatErrorDisplay.displayName = "ChatErrorDisplay";
