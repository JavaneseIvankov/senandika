import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Progress } from "@/shared/components/ui/progress";
import type { SerializedAnalytics } from "@/actions/analyticsActions";

interface EmotionListProps {
  emotions: SerializedAnalytics["moodTrends"]["topEmotions"];
}

export function EmotionList({ emotions }: EmotionListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Emotions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {emotions.map((emotion) => (
            <div key={emotion.emotion} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium capitalize">{emotion.emotion}</span>
                <span className="text-sm text-muted-foreground">
                  {emotion.count} ({emotion.percentage}%)
                </span>
              </div>
              <Progress value={emotion.percentage} className="h-2" />
            </div>
          ))}
          {emotions.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No emotion data available
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
