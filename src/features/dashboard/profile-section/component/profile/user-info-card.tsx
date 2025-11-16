import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Award } from "lucide-react";
import type { SerializedAnalytics } from "@/actions/analyticsActions";

interface UserInfoCardProps {
  name?: string;
  email?: string;
  image?: string;
  badges?: SerializedAnalytics["gamificationSummary"]["recentBadges"];
}

export function UserInfoCard({ name, email, image, badges }: UserInfoCardProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start gap-6 sm:gap-8">
      {/* User Profile Info */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 gap-4 sm:gap-6 md:gap-8">
        <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full overflow-hidden bg-linear-to-br from-purple-100 to-pink-100 ring-4 ring-purple-100/50">
          <Image
            src={image || "/assets/profile/profile.png"}
            alt={name || "Profile"}
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="flex flex-col gap-3 sm:gap-4 w-full p-3 sm:p-4 rounded-lg bg-linear-to-br from-slate-50 to-gray-50 border border-gray-100">
          <p className="text-sm sm:text-base md:text-lg">
            <span className="font-semibold text-gray-600">Nama:</span>{" "}
            <span className="text-gray-800">{name || "N/A"}</span>
          </p>
          <p className="text-sm sm:text-base md:text-lg">
            <span className="font-semibold text-gray-600">Email:</span>{" "}
            <span className="text-gray-800 break-all">{email || "N/A"}</span>
          </p>
        </div>
      </div>

      {/* Badge Section */}
      <div className="w-full md:w-1/2">
        <Card className="w-full border-amber-100 bg-linear-to-br from-amber-50/50 to-yellow-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Award className="h-4 w-4 sm:h-5 sm:w-5 text-amber-400" />
              <span className="text-amber-900">Badges</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {badges && badges.length > 0 ? (
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {badges.slice(0, 4).map((badge) => (
                  <div
                    key={badge.code}
                    className="flex flex-col items-center gap-1.5 sm:gap-2 p-2 sm:p-3 rounded-lg border border-amber-100 bg-amber-50/30 hover:bg-amber-100/50 hover:border-amber-200 transition-all duration-300 hover:shadow-md"
                  >
                    <div className="p-1.5 sm:p-2 rounded-full bg-amber-100">
                      <Award className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500" />
                    </div>
                    <div className="text-center space-y-1">
                      <p className="text-[10px] sm:text-xs font-medium line-clamp-1 text-amber-900">{badge.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 sm:py-6">
                <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-amber-100 mb-2">
                  <Award className="h-5 w-5 sm:h-6 sm:w-6 text-amber-400" />
                </div>
                <p className="text-xs sm:text-sm text-amber-700 px-2">
                  Badge akan ditampilkan di sini setelah Anda mendapatkannya
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
