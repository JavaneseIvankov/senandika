import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
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
    <Card className="border-purple-100 bg-linear-to-br from-purple-50/50 to-pink-50/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-400" />
          Gamification Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Level Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Level {summary.currentLevel}</span>
            <Badge variant="secondary" className="bg-purple-100 text-purple-700 hover:bg-purple-200">
              <Zap className="h-3 w-3 mr-1" />
              {summary.totalXP} XP
            </Badge>
          </div>
          <div className="relative h-3 w-full overflow-hidden rounded-full bg-purple-100">
            <div 
              className="h-full transition-all duration-500 ease-out rounded-full bg-linear-to-r from-purple-400 to-pink-400"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {xpToNextLevel - currentLevelXP} XP to level {summary.currentLevel + 1}
          </p>
        </div>

        {/* Streaks */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1 p-3 rounded-lg bg-orange-50 border border-orange-100">
            <div className="flex items-center gap-2">
              <Flame className="h-4 w-4 text-orange-400" />
              <span className="text-sm font-medium text-orange-900">Current Streak</span>
            </div>
            <p className="text-2xl font-bold text-orange-600">{summary.currentStreak} days</p>
          </div>
          <div className="space-y-1 p-3 rounded-lg bg-yellow-50 border border-yellow-100">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-yellow-400" />
              <span className="text-sm font-medium text-yellow-900">Longest Streak</span>
            </div>
            <p className="text-2xl font-bold text-yellow-600">{summary.longestStreak} days</p>
          </div>
        </div>

        {/* Badges Count */}
        <div className="pt-4 border-t border-purple-100">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Total Badges</span>
            <Badge variant="outline" className="text-lg border-purple-200 text-purple-700">
              {summary.totalBadges}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
