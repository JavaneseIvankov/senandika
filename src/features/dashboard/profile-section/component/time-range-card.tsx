"use client";

import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/shared/components/ui/card";
import { format } from "date-fns";

function fmt(iso?: string) {
  try {
    return iso ? format(new Date(iso), "MMM d, yyyy") : "-";
  } catch {
    return iso ?? "-";
  }
}

export default function TimeRangeCard({ start, end, days }: { start: string; end: string; days: number }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Analytics Time Range</CardTitle>
        <CardDescription>
          {fmt(start)} — {fmt(end)} ({days} days)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <p className="text-sm text-muted-foreground">Start</p>
            <div className="text-lg font-medium">{fmt(start)}</div>
          </div>
          <div className="flex-1 min-w-[200px]">
            <p className="text-sm text-muted-foreground">End</p>
            <div className="text-lg font-medium">{fmt(end)}</div>
          </div>
          <div className="flex-1 min-w-[120px]">
            <p className="text-sm text-muted-foreground">Days</p>
            <div className="text-lg font-medium">{days}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}