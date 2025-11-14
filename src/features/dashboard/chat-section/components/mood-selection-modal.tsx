"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/lib/utils";

export type MoodOption = "senang" | "sedih" | "marah" | "normal";

interface MoodChoice {
  value: MoodOption;
  label: string;
  emoji: string;
  color: string;
}

const MOOD_CHOICES: MoodChoice[] = [
  { value: "senang", label: "Senang", emoji: "😊", color: "bg-yellow-100 hover:bg-yellow-200 border-yellow-300" },
  { value: "sedih", label: "Sedih", emoji: "😢", color: "bg-blue-100 hover:bg-blue-200 border-blue-300" },
  { value: "marah", label: "Marah", emoji: "😡", color: "bg-red-100 hover:bg-red-200 border-red-300" },
  { value: "normal", label: "Normal", emoji: "😐", color: "bg-gray-100 hover:bg-gray-200 border-gray-300" },
];

interface MoodSelectionDialogProps {
  open: boolean;
  onMoodSelect: (mood: MoodOption) => void;
  onClose?: () => void;
}

export const MoodSelectionModal = React.memo(
  ({ open, onMoodSelect, onClose }: MoodSelectionDialogProps) => {
    const handleMoodClick = (mood: MoodOption) => {
      onMoodSelect(mood);
      onClose?.();
    };

    return (
      <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose?.()}>
        <DialogContent className="w-full">
          <DialogHeader>
            <DialogTitle>Bagaimana perasaanmu sekarang?</DialogTitle>
            <DialogDescription>
              Pilih mood yang paling menggambarkan perasaanmu saat ini
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 w-full">
            {MOOD_CHOICES.map((choice) => (
              <Button
                key={choice.value}
                variant="outline"
                className={cn(
                  "h-24 flex flex-col justify-center items-center w-full gap-2 text-lg font-medium border-2 cursor-pointer",
                  choice.color,
                )}
                onClick={() => handleMoodClick(choice.value)}
              >
                <span className="text-4xl">{choice.emoji}</span>
                <span>{choice.label}</span>
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    );
  }
);

MoodSelectionModal.displayName = "MoodSelectionModal";