import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { StatCard } from "./stat-card";
import { Clock, CheckCircle, Activity, Calendar } from "lucide-react";
import type { SerializedAnalytics } from "@/actions/analyticsActions";

interface SessionStatsGridProps {
  stats: SerializedAnalytics["sessionStats"];
}

export function SessionStatsGrid({ stats }: SessionStatsGridProps) {
  const completionRate = stats.totalSessions > 0 
    ? Math.round((stats.completedSessions / stats.totalSessions) * 100)
    : 0;

  return (
    <Card className="border-cyan-100 bg-linear-to-br from-cyan-50/30 to-blue-50/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-cyan-500" />
          <span className="text-cyan-900">Session Statistics</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Total Sessions"
            value={stats.totalSessions}
            icon={Activity}
            description={`${stats.completedSessions} completed`}
            className="border-blue-100 bg-linear-to-br from-blue-50/50 to-cyan-50/50 hover:shadow-md transition-shadow"
          />
          <StatCard
            title="Avg Duration"
            value={`${stats.averageDuration} min`}
            icon={Clock}
            description="Per session"
            className="border-purple-100 bg-linear-to-br from-purple-50/50 to-pink-50/50 hover:shadow-md transition-shadow"
          />
          <StatCard
            title="Total Reflection Time"
            value={`${stats.totalReflectionTime} min`}
            icon={CheckCircle}
            className="border-green-100 bg-linear-to-br from-green-50/50 to-emerald-50/50 hover:shadow-md transition-shadow"
          />
          <StatCard
            title="Most Active Day"
            value={stats.mostActiveDay}
            icon={Calendar}
            className="border-orange-100 bg-linear-to-br from-orange-50/50 to-amber-50/50 hover:shadow-md transition-shadow"
          />
          <StatCard
            title="Most Active Time"
            value={stats.mostActiveTimeOfDay}
            icon={Clock}
            className="border-indigo-100 bg-linear-to-br from-indigo-50/50 to-blue-50/50 hover:shadow-md transition-shadow"
          />
          <StatCard
            title="Completion Rate"
            value={`${completionRate}%`}
            icon={CheckCircle}
            trend={completionRate >= 70 ? "up" : completionRate >= 40 ? "neutral" : "down"}
            description={completionRate >= 70 ? "Great progress!" : "Keep it up!"}
            className="border-teal-100 bg-linear-to-br from-teal-50/50 to-cyan-50/50 hover:shadow-md transition-shadow"
          />
        </div>
      </CardContent>
    </Card>
  );
}
