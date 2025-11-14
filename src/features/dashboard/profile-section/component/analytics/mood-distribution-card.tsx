import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/shared/components/ui/chart";
import { Pie, PieChart, Cell, ResponsiveContainer } from "recharts";
import type { SerializedAnalytics } from "@/actions/analyticsActions";

interface MoodDistributionCardProps {
  distribution: SerializedAnalytics["moodTrends"]["moodDistribution"];
}

export function MoodDistributionCard({ distribution }: MoodDistributionCardProps) {
  const chartData = [
    { name: "Improved", value: distribution.improved, color: "hsl(var(--chart-1))" },
    { name: "Worsened", value: distribution.worsened, color: "hsl(var(--chart-2))" },
    { name: "Unchanged", value: distribution.unchanged, color: "hsl(var(--chart-3))" },
  ];

  const chartConfig = {
    improved: {
      label: "Improved",
      color: "hsl(var(--chart-1))",
    },
    worsened: {
      label: "Worsened",
      color: "hsl(var(--chart-2))",
    },
    unchanged: {
      label: "Unchanged",
      color: "hsl(var(--chart-3))",
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mood Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent />} />
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Legend */}
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          {chartData.map((item) => (
            <div key={item.name} className="space-y-1">
              <div className="flex items-center justify-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm font-medium">{item.name}</span>
              </div>
              <p className="text-2xl font-bold">{item.value}%</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
