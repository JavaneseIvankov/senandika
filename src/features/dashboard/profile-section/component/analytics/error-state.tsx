import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { AlertCircle } from "lucide-react";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <Card className="border-red-200 bg-red-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-700">
          <AlertCircle className="h-5 w-5" />
          Error Loading Analytics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-red-600 mb-4">
          {message || "Failed to load analytics data. Please try again."}
        </p>
        {onRetry && (
          <Button
            onClick={onRetry}
            variant="destructive"
            size="sm"
          >
            Retry
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
