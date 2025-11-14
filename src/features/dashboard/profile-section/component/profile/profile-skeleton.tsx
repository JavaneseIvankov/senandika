import { Skeleton } from "@/shared/components/ui/skeleton";
import { Card, CardContent } from "@/shared/components/ui/card";

export function ProfileSkeleton() {
  return (
    <Card>
      <CardContent className="pt-6">
        {/* Title skeleton */}
        <div className="mb-10">
          <Skeleton className="h-10 w-3/4" />
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          {/* Profile info skeleton */}
          <div className="flex flex-col justify-center items-center w-full md:w-1/2 gap-8">
            <Skeleton className="w-48 h-48 rounded-full" />
            <div className="flex flex-col gap-4 w-full">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
            </div>
          </div>

          {/* Badge section skeleton */}
          <div className="w-full md:w-1/2">
            <Card className="w-full">
              <CardContent className="pt-6">
                <Skeleton className="h-6 w-24 mb-4" />
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
