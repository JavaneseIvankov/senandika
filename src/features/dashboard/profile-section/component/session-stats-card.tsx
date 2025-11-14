"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/shared/components/ui/card";

export default function SessionStats({ stats }: { stats: any }) {
  const { totalSessions, completedSessions, averageDuration, totalReflectionTime, mostActiveDay, mostActiveTimeOfDay } = stats;
  const completionRate = totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0;

  return (
    <div className="flex flex-wrap gap-4">
      <Card className="flex-1 min-w-[220px]">
        <CardHeader>
          <CardTitle>Total Sessions</CardTitle>
          <CardDescription>{totalSessions}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Completed: {completedSessions}</p>
        </CardContent>
      </Card>

      <Card className="flex-1 min-w-[220px]">
        <CardHeader>
          <CardTitle>Average Duration</CardTitle>
          <CardDescription>{averageDuration} min</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Reflection: {totalReflectionTime} min</p>
        </CardContent>
      </Card>

      <Card className="flex-1 min-w-[220px]">
        <CardHeader>
          <CardTitle>Most Active Day</CardTitle>
          <CardDescription>{mostActiveDay}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Peak time: {mostActiveTimeOfDay}</p>
        </CardContent>
      </Card>

      <Card className="flex-1 min-w-[220px]">
        <CardHeader>
          <CardTitle>Completion Rate</CardTitle>
          <CardDescription>{totalSessions > 0 ? `${completionRate}%` : "—"}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Completed vs total</p>
        </CardContent>
      </Card>
    </div>
  );
}