import React from "react";
import { cn } from "@/lib/utils";
import type { SessionEndOverlayProps } from "../../types";

export const SessionEndOverlay = React.memo(
  ({ open, onClose, children, className }: SessionEndOverlayProps) => {
    // Handle escape key
    React.useEffect(() => {
      if (!open) return;

      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };

      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }, [open, onClose]);

    if (!open) return null;

    return (
      <button
        type="button"
        className={cn(
          "fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6",
          "bg-black/40 backdrop-blur-md",
          "animate-in fade-in duration-300",
          "border-none cursor-default",
          className,
        )}
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            onClose();
          }
        }}
      >
        <div
          role="dialog"
          aria-modal="true"
          className="animate-in slide-in-from-bottom-4 duration-400 w-full max-w-[95vw] sm:max-w-md"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </button>
    );
  },
);

SessionEndOverlay.displayName = "SessionEndOverlay";
