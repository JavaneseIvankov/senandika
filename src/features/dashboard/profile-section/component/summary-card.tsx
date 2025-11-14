"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/shared/components/ui/card";

export default function SummaryInsights({ insights }: { insights: any }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{insights.mainInsight}</CardTitle>
        <CardDescription>Summary & recommended next steps</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold">Highlights</h4>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              {insights.bulletPoints.map((b: string, i: number) => (
                <li key={i} className="text-sm">{b}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold">Encouragement</h4>
            <p className="text-sm text-muted-foreground">{insights.encouragement}</p>
          </div>

          <div>
            <h4 className="font-semibold">Next Steps</h4>
            <ol className="list-decimal pl-5 mt-2 space-y-1 text-sm">
              {insights.nextSteps.map((s: string, i: number) => (
                <li key={i}>{s}</li>
              ))}
            </ol>
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <div className="text-sm text-muted-foreground">Use these insights to guide future reflections and goals.</div>
      </CardFooter>
    </Card>
  );
}