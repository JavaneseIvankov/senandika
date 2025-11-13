import { Card, CardContent, CardDescription, CardTitle } from "@/shared/components/ui/card";
import { dataProfile } from '../data/profile-data';

export default function ProfileCard() {
  const profile = dataProfile[0];

  return (
    <section>
      <Card>
        <CardContent>
          <CardTitle className="mb-10">
            <h1 className="text-[36px] ">Selamat Datang Kembali! <span className="text-purple-600">{profile.userName}</span></h1>
          </CardTitle>
          <CardDescription className="flex flex-col gap-4">
            <p>Nama: <span>{profile.Name}</span></p>
            <p>Email: <span>{profile.email}</span></p>
          </CardDescription>
        </CardContent>
      </Card>
    </section>
  );
}
