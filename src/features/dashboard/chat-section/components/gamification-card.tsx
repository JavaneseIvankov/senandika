"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { ChevronDown, ChevronUp, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import GamificationStatsCompact from "./gamification-stats-compact";
import GamificationStatsExpanded from "./gamification-stats-expanded";
import { useGamificationStats } from "@/hooks/useGamificationStats";

interface GamificationStatsCardProps {
  className?: string;
}

export default function GamificationStatsCard({
  className,
}: GamificationStatsCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { stats, isLoading, error, refetch } = useGamificationStats();

  // Loading state
  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-semibold">Your Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className={className}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-semibold">Your Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 gap-2">
            <p className="text-sm text-muted-foreground">
              Failed to load statistics
            </p>
            <Button variant="outline" size="sm" onClick={refetch}>
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // No stats available
  if (!stats) {
    return (
      <Card className={className}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-semibold">Your Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <p className="text-sm text-muted-foreground">No data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn(className, "border-purple-200 bg-linear-to-br from-white to-purple-50/20")}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 sm:pb-3">
        <CardTitle className="text-base sm:text-lg md:text-xl font-semibold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Your Progress</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="h-8 w-8 p-0 cursor-pointer"
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
          <GamificationStatsExpanded stats={stats} />
        ) : (
          <GamificationStatsCompact stats={stats} />
        )}
      </CardContent>
    </Card>
  );
}
