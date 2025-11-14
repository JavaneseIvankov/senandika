"use client";

import { Card, CardContent } from '@/shared/components/ui/card';
import { ProfileHeader } from './profile/profile-header';
import { UserInfoCard } from './profile/user-info-card';
import { ProfileSkeleton } from './profile/profile-skeleton';
import { useUserProfile } from '@/hooks/use-user-profile';

export default function ProfileCard() {
  const { user, isLoading } = useUserProfile();

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  return (
    <section>
      <Card>
        <CardContent className="pt-6">
          <ProfileHeader userName={user?.name} />
          <UserInfoCard 
            name={user?.name} 
            email={user?.email} 
            image={user?.image} 
          />
        </CardContent>
      </Card>
    </section>
  );
}