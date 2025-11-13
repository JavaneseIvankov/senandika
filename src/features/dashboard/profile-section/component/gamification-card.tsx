import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
} from '@/shared/components/ui/card';
import { dataGamificationLevel, dataGamificationXP, dataGamificationStreak, dataGamificationBadges, dataGamificationReward } from '../data/gamification-data';

export default function GamificationCard() {
  const level = dataGamificationLevel[0];
  const xp = dataGamificationXP[0];
  const streak = dataGamificationStreak[0];
  const badge = dataGamificationBadges[0];
  const reward = dataGamificationReward[0];
 
  return (
    <Card>
      <CardHeader className='gap-0'>
        <CardTitle className='text-[26px]'>🎮 Gamification Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='flex flex-col justify-center items-center gap-4'>
          <div className='flex w-full justify-between gap-10'>
            <Card className='w-[25%] gap-2'>
              <CardHeader className='gap-0'>
                <CardTitle className='text-gray-600'>{level.title}</CardTitle>
              </CardHeader>
              
              <CardContent>
                <p className='text-[26px] text-purple-600'>{level.level}</p>
                <p className='text-[12px] text-gray-600'>{level.xp}</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${level.progress}%`,
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className='w-[25%] gap-0'>
              <CardHeader>
                <CardTitle className='text-gray-600'>{xp.title}</CardTitle>
              </CardHeader>
              
              <CardContent>
                <p className='text-[26px] text-blue-600'>{xp.XP}</p>
                <p className='text-gray-600'>{xp.nextLevel}</p>
              </CardContent>
            </Card>

            <Card className='w-[25%] gap-0'>
              <CardHeader>
                <CardTitle className='text-gray-600'>{streak.title}</CardTitle>
              </CardHeader>

              <CardContent>
                <p className='text-[26px] text-orange-600'>🔥 {streak.streak}</p>
                <p className='text-gray-600'>{streak.row}</p>
              </CardContent>
            </Card>

            <Card className='w-[25%] gap-0'>
              <CardHeader>
                <CardTitle className='text-gray-600'>{badge.title}</CardTitle>
              </CardHeader>
              
              <CardContent>
                <p className='text-[26px] text-yellow-800'>🏆 {badge.badge}</p>
                <p className='text-gray-600'>{badge.desc}</p>
              </CardContent>
            </Card>
          </div>

          <div className='w-full gap-0'>
            <Card className=''>
              <CardHeader>
                <CardTitle className='text-green-700'>✨ {reward.title}</CardTitle>
              </CardHeader>
              <CardContent className='flex justify-between w-[80%] text-gray-600'>
                <p>Xp Gained: <span className='text-green-800'>{reward.XPGained}</span></p>
                <p>Level: <span>{reward.level}</span></p>
                <p>Streak: <span>{reward.streak}</span></p>
                <p>New Badges: <span className='text-yellow-800'>{reward.newBadges}</span></p>
              </CardContent>
            </Card>
          </div>

        </div>
      </CardContent>
    </Card>
  )
}