import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/shared/components/ui/chart";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import type { SerializedAnalytics } from "@/actions/analyticsActions";

interface MoodChartProps {
  moodTrends: SerializedAnalytics["moodTrends"];
  days: number;
}

export function MoodChart({ moodTrends, days }: MoodChartProps) {
  // Generate mock data for visualization (replace with actual data if available)
  const chartData = Array.from({ length: Math.min(days, 7) }, (_, i) => ({
    day: `Day ${i + 1}`,
    stress: Math.max(0, moodTrends.averageStressScore + (Math.random() - 0.5) * 20),
  }));

  const chartConfig = {
    stress: {
      label: "Stress Score",
      color: "#a78bfa", // soft purple
    },
  };

  const getTrendIcon = () => {
    switch (moodTrends.stressScoreTrend) {
      case "improving":
        return <TrendingDown className="h-4 w-4 text-green-600" />;
      case "worsening":
        return <TrendingUp className="h-4 w-4 text-red-600" />;
      default:
        return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTrendColor = () => {
    switch (moodTrends.stressScoreTrend) {
      case "improving":
        return "text-green-600";
      case "worsening":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Mood Trends</span>
          <div className={`flex items-center gap-2 text-sm ${getTrendColor()}`}>
            {getTrendIcon()}
            <span className="capitalize">{moodTrends.stressScoreTrend}</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stats Summary */}
        <div className="grid grid-cols-2 gap-4 pb-4">
          <div>
            <p className="text-sm text-muted-foreground">Avg Stress Score</p>
            <p className="text-2xl font-bold">{moodTrends.averageStressScore}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Mood Improvement</p>
            <p className="text-2xl font-bold text-green-600">
              {moodTrends.moodImprovementRate > 0 ? "+" : ""}
              {moodTrends.moodImprovementRate}%
            </p>
          </div>
        </div>

        {/* Chart */}
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <defs>
                <linearGradient id="stressGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#a78bfa" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                stroke="#94a3b8"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                domain={[0, 100]}
                stroke="#94a3b8"
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="stress"
                stroke="#a78bfa"
                strokeWidth={3}
                dot={{ fill: "#a78bfa", strokeWidth: 2, r: 4, stroke: "#ffffff" }}
                activeDot={{ r: 6, fill: "#8b5cf6" }}
                fill="url(#stressGradient)"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
