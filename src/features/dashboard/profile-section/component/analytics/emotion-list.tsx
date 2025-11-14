import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Smile } from "lucide-react";
import type { SerializedAnalytics } from "@/actions/analyticsActions";

interface EmotionListProps {
  emotions: SerializedAnalytics["moodTrends"]["topEmotions"];
}

// Warna lembut untuk setiap emotion
const emotionColors: Record<string, string> = {
  calm: "#86efac", // soft green
  happy: "#fde047", // soft yellow
  excited: "#fdba74", // soft orange
  anxious: "#fca5a5", // soft red
  sad: "#93c5fd", // soft blue
  angry: "#f87171", // soft red
  relaxed: "#a7f3d0", // soft teal
  stressed: "#fbbf24", // soft amber
  peaceful: "#c4b5fd", // soft purple
  worried: "#fb923c", // soft orange-red
  // Default colors for other emotions
  default: "#cbd5e1", // soft gray
};

const getEmotionColor = (emotion: string): string => {
  return emotionColors[emotion.toLowerCase()] || emotionColors.default;
};

export function EmotionList({ emotions }: EmotionListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smile className="h-5 w-5 text-yellow-500" />
          Top Emotions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {emotions.map((emotion) => (
            <div key={emotion.emotion} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: getEmotionColor(emotion.emotion) }}
                  />
                  <span className="text-sm font-medium capitalize">{emotion.emotion}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {emotion.count} ({emotion.percentage}%)
                </span>
              </div>
              <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-100">
                <div 
                  className="h-full transition-all duration-500 ease-out rounded-full"
                  style={{ 
                    width: `${emotion.percentage}%`,
                    backgroundColor: getEmotionColor(emotion.emotion)
                  }}
                />
              </div>
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
