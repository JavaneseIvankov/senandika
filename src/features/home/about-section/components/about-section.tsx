import { Card, CardContent, CardDescription, CardTitle } from "@/shared/components/ui/card";
import { about } from "../data/about-data";

export default function AboutSection() {

  return (
    <section id="about-senandika" className="flex flex-col gap-10 justify-center items-center w-[70%] mx-auto mt-10">
      <h1 className="text-[56px] text-center font-bold">About Senandika</h1>
      <article className="flex flex-row gap-8">
        {about.map((item) => (  
        <Card 
          key={item.id} 
          className="w-[50%]"
        >
          <CardContent className="flex flex-col justify-center items-center text-center gap-8">
            <CardTitle className="font-bold">{item.title}</CardTitle>
            <CardDescription className="leading-normal">{item.desc}</CardDescription>
          </CardContent>
        </Card>
      ))}
      </article>
    </section>
  );
}
