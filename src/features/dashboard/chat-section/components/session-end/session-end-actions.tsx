import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/shared/components/ui/button";
import { Plus, History, X } from "lucide-react";
import type { SessionEndActionsProps } from "../../types";

export const SessionEndActions = React.memo(
  ({
    onStartNewSession,
    onViewHistory,
    onClose,
    className,
  }: SessionEndActionsProps) => {
    return (
      <div className={cn("space-y-2", className)}>
        {/* Primary Action */}
        <Button onClick={onStartNewSession} size="lg" className="w-full">
          <Plus className="mr-2 h-5 w-5" />
          Mulai Sesi Baru
        </Button>

        {/* Secondary Action */}
        {onViewHistory && (
          <Button
            onClick={onViewHistory}
            variant="outline"
            size="lg"
            className="w-full"
          >
            <History className="mr-2 h-5 w-5" />
            Lihat Riwayat
          </Button>
        )}

        {/* Tertiary Action */}
        {onClose && (
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="w-full text-muted-foreground"
          >
            <X className="mr-2 h-4 w-4" />
            Tutup
          </Button>
        )}
      </div>
    );
  },
);

SessionEndActions.displayName = "SessionEndActions";
