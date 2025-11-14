import React from "react";
import { Sparkles } from "lucide-react";

export const SessionEndHeader = React.memo(() => {
  return (
    <div className="text-center space-y-2">
      <div className="flex items-center justify-center gap-2">
        <Sparkles className="h-6 w-6 text-primary animate-pulse" />
        <h3 className="text-2xl font-bold">Sesi Selesai!</h3>
        <Sparkles className="h-6 w-6 text-primary animate-pulse" />
      </div>
      <p className="text-sm text-muted-foreground">
        Terima kasih sudah berbagi hari ini
      </p>
    </div>
  );
});

SessionEndHeader.displayName = "SessionEndHeader";
