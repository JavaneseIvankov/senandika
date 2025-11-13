import { Card, CardContent, CardDescription, CardTitle } from "@/shared/components/ui/card";
import { ChartLineLinear } from "./chart-card";

export default function StatisticCard() {
  return (
    <section>
      <Card>
        <CardContent>
          <CardTitle className="mb-10">
            <h1 className="text-[36px] ">Statistik</h1>
          </CardTitle>
          <CardDescription className="flex flex-col gap-4">
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Doloremque, autem voluptatibus! Quae laboriosam quod dolores cum assumenda corrupti adipisci cupiditate doloremque in? Nemo, necessitatibus ducimus!</p>
            <ChartLineLinear />
          </CardDescription>
        </CardContent>
      </Card>
    </section>
  );
}
