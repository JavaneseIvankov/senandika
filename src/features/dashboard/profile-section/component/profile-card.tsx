import { Card, CardHeader, CardContent, CardDescription, CardTitle,  } from '@/shared/components/ui/card';
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
          <CardDescription className="flex justify-between gap-4">
            <div className="flex flex-col w-[50%] gap-4">
              <p>Nama  <span>: {profile.Name}</span></p>
              <p>Email <span>: {profile.email}</span></p>
            </div>
            <div className='w-[50%]'>
              <Card className='w-full'>
                <CardHeader>
                  <CardTitle>Badge</CardTitle>
                </CardHeader>
              </Card>
            </div>
            
          </CardDescription>
        </CardContent>
      </Card>
    </section>
  );
}
