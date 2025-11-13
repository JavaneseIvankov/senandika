import ProfileCard from "./profile-card";
import GamificationCard from './gamification-card';
import StatisticCard from "./statistic-card";

export default function ProfileSection() {
  return (
    <main  className="flex flex-col gap-8">
      <ProfileCard />
      <GamificationCard />
      <StatisticCard />
    </main>
    
  )
}