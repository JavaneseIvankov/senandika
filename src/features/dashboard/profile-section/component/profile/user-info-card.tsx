import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";

interface UserInfoCardProps {
  name?: string;
  email?: string;
  image?: string;
}

export function UserInfoCard({ name, email, image }: UserInfoCardProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start gap-8">
      {/* User Profile Info */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 gap-8">
        <div className="relative w-48 h-48 rounded-full overflow-hidden bg-gray-100">
          <Image
            src={image || "/assets/profile/profile.png"}
            alt={name || "Profile"}
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="flex flex-col gap-4 w-full">
          <p className="text-lg">
            <span className="font-semibold">Nama:</span>{" "}
            <span className="text-gray-700">{name || "N/A"}</span>
          </p>
          <p className="text-lg">
            <span className="font-semibold">Email:</span>{" "}
            <span className="text-gray-700">{email || "N/A"}</span>
          </p>
        </div>
      </div>

      {/* Badge Section */}
      <div className="w-full md:w-1/2">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Badge</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              Badge akan ditampilkan di sini setelah Anda mendapatkannya
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
