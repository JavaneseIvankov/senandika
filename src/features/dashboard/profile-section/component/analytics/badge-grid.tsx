import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Award } from "lucide-react";
import type { SerializedAnalytics } from "@/actions/analyticsActions";

interface BadgeGridProps {
  badges: SerializedAnalytics["gamificationSummary"]["recentBadges"];
}

export function BadgeGrid({ badges }: BadgeGridProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5" />
          Recent Badges
        </CardTitle>
      </CardHeader>
      <CardContent>
        {badges.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {badges.map((badge) => (
              <div
                key={badge.code}
                className="flex flex-col items-center gap-2 p-4 rounded-lg border bg-card hover:bg-accent transition-colors"
              >
                <Award className="h-8 w-8 text-yellow-500" />
                <div className="text-center space-y-1">
                  <p className="text-sm font-medium">{badge.name}</p>
                  <Badge variant="secondary" className="text-xs">
                    {badge.code}
                  </Badge>
                  <p className="text-xs text-muted-foreground">
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
          <p className="text-sm text-muted-foreground text-center py-8">
            No badges earned yet. Keep going!
          </p>
        )}
      </CardContent>
    </Card>
  );
}
