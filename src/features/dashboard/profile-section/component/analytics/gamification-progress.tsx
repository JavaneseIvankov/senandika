import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Progress } from "@/shared/components/ui/progress";
import { Badge } from "@/shared/components/ui/badge";
import { Trophy, Zap, Flame } from "lucide-react";
import type { SerializedAnalytics } from "@/actions/analyticsActions";

interface GamificationProgressProps {
  summary: SerializedAnalytics["gamificationSummary"];
}

export function GamificationProgress({ summary }: GamificationProgressProps) {
  const xpToNextLevel = (summary.currentLevel + 1) * 1000;
  const currentLevelXP = summary.totalXP % 1000;
  const progressPercentage = (currentLevelXP / xpToNextLevel) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Gamification Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Level Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Level {summary.currentLevel}</span>
            <Badge variant="secondary">
              <Zap className="h-3 w-3 mr-1" />
              {summary.totalXP} XP
            </Badge>
          </div>
          <Progress value={progressPercentage} className="h-3" />
          <p className="text-xs text-muted-foreground">
            {xpToNextLevel - currentLevelXP} XP to level {summary.currentLevel + 1}
          </p>
        </div>

        {/* Streaks */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Flame className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium">Current Streak</span>
            </div>
            <p className="text-2xl font-bold">{summary.currentStreak} days</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium">Longest Streak</span>
            </div>
            <p className="text-2xl font-bold">{summary.longestStreak} days</p>
          </div>
        </div>

        {/* Badges Count */}
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Total Badges</span>
            <Badge variant="outline" className="text-lg">
              {summary.totalBadges}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
