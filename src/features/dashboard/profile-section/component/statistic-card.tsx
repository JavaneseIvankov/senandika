import { Card, CardContent, CardDescription, CardTitle } from "@/shared/components/ui/card";
import { dataProfile } from '../data/profile-data';

export default function StatisticCard() {
  const profile = dataProfile[0];

  return (
    <section>
      <Card>
        <CardContent>
          <CardTitle className="mb-10">
            <h1 className="text-[36px] ">Statistik</h1>
          </CardTitle>
          <CardDescription className="flex flex-col gap-4">
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Doloremque, autem voluptatibus! Quae laboriosam quod dolores cum assumenda corrupti adipisci cupiditate doloremque in? Nemo, necessitatibus ducimus!</p>
          </CardDescription>
        </CardContent>
      </Card>
    </section>
  );
}
