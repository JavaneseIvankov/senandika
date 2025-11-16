import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";
import { Lightbulb, CheckCircle, ArrowRight } from "lucide-react";
import type { SerializedAnalytics } from "@/actions/analyticsActions";

interface InsightsCardProps {
  insights: SerializedAnalytics["summaryInsights"];
}

export function InsightsCard({ insights }: InsightsCardProps) {
  return (
    <Card className="border-blue-100 bg-linear-to-br from-blue-50/30 to-indigo-50/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-amber-400" />
          Insights & Encouragement
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main Insight */}
        <div className="p-4 bg-linear-to-r from-blue-100/50 to-indigo-100/50 rounded-lg border border-blue-200/50">
          <p className="text-lg font-medium text-blue-900">{insights.mainInsight}</p>
        </div>

        <Separator className="bg-blue-100" />

        {/* Key Points */}
        <div className="space-y-3 p-3 rounded-lg bg-green-50/50 border border-green-100">
          <h4 className="text-sm font-semibold flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-400" />
            <span className="text-green-800">Key Highlights</span>
          </h4>
          <ul className="space-y-2">
            {insights.bulletPoints.map((point) => (
              <li key={point} className="flex items-start gap-2 text-sm">
                <span className="text-green-400 mt-0.5 font-bold">•</span>
                <span className="text-green-900">{point}</span>
              </li>
            ))}
          </ul>
        </div>

        <Separator className="bg-blue-100" />

        {/* Encouragement */}
        <div className="p-4 bg-linear-to-r from-emerald-100/50 to-teal-100/50 rounded-lg border border-emerald-200/50">
          <p className="text-sm font-medium text-emerald-800">
            💚 {insights.encouragement}
          </p>
        </div>

        <Separator className="bg-blue-100" />

        {/* Next Steps */}
        <div className="space-y-3 p-3 rounded-lg bg-blue-50/50 border border-blue-100">
          <h4 className="text-sm font-semibold flex items-center gap-2">
            <ArrowRight className="h-4 w-4 text-blue-400" />
            <span className="text-blue-800">Next Steps</span>
          </h4>
          <ul className="space-y-2">
            {insights.nextSteps.map((step, index) => (
              <li key={`${step}-${index}`} className="flex items-start gap-2 text-sm">
                <span className="text-blue-500 mt-0.5 font-semibold min-w-4">{index + 1}.</span>
                <span className="text-blue-900">{step}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
