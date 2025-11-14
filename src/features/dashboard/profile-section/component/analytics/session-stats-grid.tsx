import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { StatCard } from "./stat-card";
import { Clock, CheckCircle, Activity, Calendar } from "lucide-react";
import type { SerializedAnalytics } from "@/actions/analyticsActions";

interface SessionStatsGridProps {
  stats: SerializedAnalytics["sessionStats"];
}

export function SessionStatsGrid({ stats }: SessionStatsGridProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Session Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Total Sessions"
            value={stats.totalSessions}
            icon={Activity}
            description={`${stats.completedSessions} completed`}
          />
          <StatCard
            title="Avg Duration"
            value={`${stats.averageDuration} min`}
            icon={Clock}
            description="Per session"
          />
          <StatCard
            title="Total Reflection Time"
            value={`${stats.totalReflectionTime} min`}
            icon={CheckCircle}
          />
          <StatCard
            title="Most Active Day"
            value={stats.mostActiveDay}
            icon={Calendar}
          />
          <StatCard
            title="Most Active Time"
            value={stats.mostActiveTimeOfDay}
            icon={Clock}
          />
          <StatCard
            title="Completion Rate"
            value={`${Math.round((stats.completedSessions / stats.totalSessions) * 100)}%`}
            icon={CheckCircle}
            trend="up"
          />
        </div>
      </CardContent>
    </Card>
  );
}
