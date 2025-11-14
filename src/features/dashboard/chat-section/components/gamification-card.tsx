"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import  GamificationStatsCompact  from "./gamification-stats-compact";
import  GamificationStatsExpanded  from "./gamification-stats-expanded";

interface GamificationStatsCardProps {
  userId?: string;
  className?: string;
}

export default function GamificationStatsCard({
  userId,
  className,
}: GamificationStatsCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">Your Progress</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="h-8 w-8 p-0  cursor-pointer"
        >
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </CardHeader>
      <CardContent>
        {isExpanded ? (
          <GamificationStatsExpanded userId={userId} />
        ) : (
          <GamificationStatsCompact userId={userId} />
        )}
      </CardContent>
    </Card>
  );
}
