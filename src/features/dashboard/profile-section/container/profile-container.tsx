import ProfileSection from '../component/profile-section';
import StatisticCard from '../component/statistic-card';

export default function ProfileContainer() {
  return (
    <main className="flex flex-col gap-8">
      <ProfileSection />  
      <StatisticCard />
    </main>
  )
}