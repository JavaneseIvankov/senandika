import { Card, CardHeader, CardContent, CardDescription, CardTitle,  } from '@/shared/components/ui/card';
import Image from 'next/image';
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
          <CardDescription className="flex justify-between items gap-4">
            <div className="flex flex-col justify-center items-center w-[50%] gap-8">
              <Image
                src="/assets/profile/profile.png"
                alt="Profile"
                width={500}
                height={500}
                className="w-50 h-50 object-contain"
              />
              <div className='flex flex-col gap-4'>
                <p>Nama  <span>: {profile.Name}</span></p>
                <p>Email <span>: {profile.email}</span></p>
              </div>
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
