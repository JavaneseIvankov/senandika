import React from "react";
import { Sparkles } from "lucide-react";

export const SessionEndHeader = React.memo(() => {
  return (
    <div className="text-center space-y-1.5 sm:space-y-2">
      <div className="flex items-center justify-center gap-1.5 sm:gap-2">
        <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-purple-500 animate-pulse" />
        <h3 className="text-lg sm:text-xl md:text-2xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Sesi Selesai!</h3>
        <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-pink-500 animate-pulse" />
      </div>
      <p className="text-xs sm:text-sm text-muted-foreground px-2">
        Terima kasih sudah berbagi hari ini
      </p>
    </div>
  );
});

SessionEndHeader.displayName = "SessionEndHeader";
