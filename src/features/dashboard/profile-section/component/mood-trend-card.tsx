"use client";

import React, { useMemo } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/shared/components/ui/card";
import { Progress } from "@/shared/components/ui/progress";
import { Badge } from "@/shared/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/shared/components/ui/chart";
import { LineChart, Line, XAxis, CartesianGrid } from "recharts";

interface Props {
  moodTrends: any;
  days: number;
}

export default function MoodTrends({ moodTrends, days }: Props) {
  const stressChartData = useMemo(() => {
    const d = Math.max(3, days || 7);
    const avg = moodTrends.averageStressScore ?? 50;
    return Array.from({ length: d }).map((_, i) => {
      const variance = Math.round(((i - d / 2) * (moodTrends.moodImprovementRate / Math.max(1, d))) * -0.5);
      return { day: `D${i + 1}`, stress: Math.max(0, Math.min(100, avg + variance)) };
    });
  }, [days, moodTrends.averageStressScore, moodTrends.moodImprovementRate]);

  const chartConfig = {
    stress: { label: "Stress", color: "var(--chart-1)" },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mood Trends</CardTitle>
        <CardDescription>Overview of stress and emotions</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex gap-4 flex-wrap">
              <Card className="flex-1 min-w-[160px]">
                <CardHeader>
                  <CardTitle>Mood Improvement</CardTitle>
                  <CardDescription>{moodTrends.moodImprovementRate}%</CardDescription>
                </CardHeader>
                <CardContent>
                  <Progress value={Math.max(0, Math.min(100, moodTrends.moodImprovementRate))} className="h-2" />
                </CardContent>
              </Card>

              <Card className="flex-1 min-w-[160px]">
                <CardHeader>
                  <CardTitle>Avg Stress</CardTitle>
                  <CardDescription>{moodTrends.averageStressScore}/100</CardDescription>
                </CardHeader>
                <CardContent>
                  <Progress value={Math.max(0, Math.min(100, moodTrends.averageStressScore))} className="h-2" />
                </CardContent>
              </Card>

              <Card className="flex-1 min-w-[160px]">
                <CardHeader>
                  <CardTitle>Trend</CardTitle>
                  <CardDescription className="capitalize">{moodTrends.stressScoreTrend}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge variant={moodTrends.stressScoreTrend === "improving" ? "secondary" : moodTrends.stressScoreTrend === "worsening" ? "destructive" : "default"}>
                    {moodTrends.stressScoreTrend}
                  </Badge>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Stress Trend</CardTitle>
                <CardDescription>Simple line over selected days</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig}>
                  <LineChart data={stressChartData} margin={{ left: 8, right: 8 }}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="day" tickLine={false} axisLine={false} />
                    <ChartTooltip content={<ChartTooltipContent />} cursor={false} />
                    <Line dataKey="stress" stroke="var(--color-desktop)" strokeWidth={2} dot={false} />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Top Emotions</CardTitle>
                <CardDescription>Most frequent emotions</CardDescription>
              </CardHeader>
              <CardContent>
                <table className="w-full text-sm">
                  <thead className="text-left text-muted-foreground">
                    <tr>
                      <th className="pb-2">Emotion</th>
                      <th className="pb-2">Count</th>
                      <th className="pb-2">%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {moodTrends.topEmotions.map((e: any) => (
                      <tr key={e.emotion}>
                        <td className="py-2 font-medium">{e.emotion}</td>
                        <td className="py-2">{e.count}</td>
                        <td className="py-2">{Math.round(e.percentage)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mood Distribution</CardTitle>
                <CardDescription>Improved / Worsened / Unchanged</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-muted-foreground">Improved</div>
                    <Progress value={moodTrends.moodDistribution.improved} className="h-2" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Worsened</div>
                    <Progress value={moodTrends.moodDistribution.worsened} className="h-2" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Unchanged</div>
                    <Progress value={moodTrends.moodDistribution.unchanged} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}