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
      <div className={cn("space-y-1.5 sm:space-y-2", className)}>
        {/* Primary Action */}
        <Button onClick={onStartNewSession} size="lg" className="w-full bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-sm sm:text-base h-10 sm:h-11 cursor-pointer">
          <Plus className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
          Mulai Sesi Baru
        </Button>

        {/* Secondary Action */}
        {onViewHistory && (
          <Button
            onClick={onViewHistory}
            variant="outline"
            size="lg"
            className="w-full border-purple-200 hover:bg-purple-50 text-purple-700 text-sm sm:text-base h-10 sm:h-11"
          >
            <History className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
            Lihat Riwayat
          </Button>
        )}

        {/* Tertiary Action */}
        {onClose && (
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="w-full text-muted-foreground hover:text-purple-700 hover:bg-purple-50 text-xs sm:text-sm h-8 sm:h-9 cursor-pointer"
          >
            <X className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            Tutup
          </Button>
        )}
      </div>
    );
  },
);

SessionEndActions.displayName = "SessionEndActions";
