"use client";

import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/shared/components/ui/sheet";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/lib/utils";

export type MoodOption = "senang" | "sedih" | "marah" | "normal" | "tenang";

interface MoodChoice {
  value: MoodOption;
  label: string;
  emoji: string;
  color: string;
}

const MOOD_CHOICES: MoodChoice[] = [
  {
    value: "senang",
    label: "Senang",
    emoji: "😊",
    color: "bg-yellow-100 hover:bg-yellow-200 border-yellow-300",
  },
  {
    value: "sedih",
    label: "Sedih",
    emoji: "😢",
    color: "bg-blue-100 hover:bg-blue-200 border-blue-300",
  },
  {
    value: "marah",
    label: "Marah",
    emoji: "😡",
    color: "bg-red-100 hover:bg-red-200 border-red-300",
  },
  {
    value: "normal",
    label: "Normal",
    emoji: "😐",
    color: "bg-gray-100 hover:bg-gray-200 border-gray-300",
  },
  {
    value: "tenang",
    label: "Tenang",
    emoji: "😌",
    color: "bg-green-100 hover:bg-green-200 border-green-300",
  },
];

interface MoodSelectionModalProps {
  open: boolean;
  onMoodSelect: (mood: MoodOption) => void;
  onClose?: () => void;
}

export const MoodSelectionModal = React.memo(
  ({ open, onMoodSelect, onClose }: MoodSelectionModalProps) => {
    const handleMoodClick = (mood: MoodOption) => {
      onMoodSelect(mood);
    };

    return (
      <Sheet
        open={open}
        onOpenChange={(isOpen: boolean) => !isOpen && onClose?.()}
      >
        <SheetContent side="bottom" className="sm:max-w-md mx-auto">
          <SheetHeader>
            <SheetTitle>Bagaimana perasaanmu sekarang?</SheetTitle>
            <SheetDescription>
              Pilih mood yang paling menggambarkan perasaanmu saat ini
            </SheetDescription>
          </SheetHeader>

          <div className="grid grid-cols-2 gap-3 py-4">
            {MOOD_CHOICES.map((choice) => (
              <Button
                key={choice.value}
                variant="outline"
                className={cn(
                  "h-24 flex flex-col gap-2 text-lg font-medium border-2",
                  choice.color,
                )}
                onClick={() => handleMoodClick(choice.value)}
              >
                <span className="text-4xl">{choice.emoji}</span>
                <span>{choice.label}</span>
              </Button>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    );
  },
);

MoodSelectionModal.displayName = "MoodSelectionModal";
