import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";
import { Lightbulb, CheckCircle, ArrowRight } from "lucide-react";
import type { SerializedAnalytics } from "@/actions/analyticsActions";

interface InsightsCardProps {
  insights: SerializedAnalytics["summaryInsights"];
}

export function InsightsCard({ insights }: InsightsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          Insights & Encouragement
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main Insight */}
        <div className="p-4 bg-primary/5 rounded-lg">
          <p className="text-lg font-medium text-primary">{insights.mainInsight}</p>
        </div>

        <Separator />

        {/* Key Points */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            Key Highlights
          </h4>
          <ul className="space-y-2">
            {insights.bulletPoints.map((point) => (
              <li key={point} className="flex items-start gap-2 text-sm">
                <span className="text-muted-foreground mt-0.5">•</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        <Separator />

        {/* Encouragement */}
        <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
          <p className="text-sm font-medium text-green-700 dark:text-green-400">
            💚 {insights.encouragement}
          </p>
        </div>

        <Separator />

        {/* Next Steps */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold flex items-center gap-2">
            <ArrowRight className="h-4 w-4 text-blue-600" />
            Next Steps
          </h4>
          <ul className="space-y-2">
            {insights.nextSteps.map((step, index) => (
              <li key={`${step}-${index}`} className="flex items-start gap-2 text-sm">
                <span className="text-blue-600 mt-0.5">{index + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
