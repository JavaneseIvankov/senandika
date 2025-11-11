import { Card, CardContent, CardDescription, CardTitle } from "@/shared/components/ui/card";
import { about } from "../data/about-data";

export default function AboutSection() {

  return (
    <section id="about-senandika" className="flex flex-col gap-10 justify-center items-center w-[70%] mx-auto mt-10">
      <h1 className="text-[56px] text-center">Tentang Senandika</h1>
      <article className="flex flex-row gap-8">
        {about.map((item) => (  
        <Card 
          key={item.id} 
        >
          <CardContent className="flex flex-col justify-center items-center text-center gap-8">
            <CardTitle>{item.title}</CardTitle>
            <CardDescription>{item.desc}</CardDescription>
          </CardContent>
        </Card>
      ))}
      </article>
    </section>
  );
}
