import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Award } from "lucide-react";
import type { SerializedAnalytics } from "@/actions/analyticsActions";

interface BadgeGridProps {
  badges: SerializedAnalytics["gamificationSummary"]["recentBadges"];
}

export function BadgeGrid({ badges }: BadgeGridProps) {
  return (
    <Card className="border-yellow-100 bg-linear-to-br from-yellow-50/50 to-amber-50/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5 text-yellow-400" />
          Recent Badges
        </CardTitle>
      </CardHeader>
      <CardContent>
        {badges.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {badges.map((badge) => (
              <div
                key={badge.code}
                className="flex flex-col items-center gap-2 p-4 rounded-lg border border-yellow-100 bg-yellow-50/30 hover:bg-yellow-100/50 hover:border-yellow-200 transition-all duration-300 hover:shadow-md"
              >
                <div className="p-3 rounded-full bg-yellow-100">
                  <Award className="h-6 w-6 text-yellow-500" />
                </div>
                <div className="text-center space-y-1">
                  <p className="text-sm font-medium text-yellow-900">{badge.name}</p>
                  <Badge variant="secondary" className="text-xs bg-yellow-200 text-yellow-800 border-yellow-300">
                    {badge.code}
                  </Badge>
                  <p className="text-xs text-yellow-600">
                    {new Date(badge.earnedAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 mb-3">
              <Award className="h-8 w-8 text-yellow-400" />
            </div>
            <p className="text-sm text-muted-foreground">
              No badges earned yet. Keep going!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
