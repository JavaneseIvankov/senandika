import { Card, CardContent, CardDescription, CardTitle } from "@/shared/components/ui/card";
import { about } from "../data/about-data";

export default function AboutSection() {

  return (
    <section id="about-senandika" className="flex flex-col gap-6 sm:gap-8 md:gap-10 justify-center items-center w-[95%] sm:w-[90%] md:w-[80%] lg:w-[70%] mx-auto mt-8 sm:mt-10 px-4">
      <h1 className="text-[28px] sm:text-[36px] md:text-[48px] lg:text-[56px] text-center font-bold leading-tight">About Senandika</h1>
      <article className="flex flex-col md:flex-row gap-4 md:gap-6 lg:gap-8 w-full">
        {about.map((item) => (  
        <Card 
          key={item.id} 
          className="w-full md:w-[50%]"
        >
          <CardContent className="flex flex-col justify-center items-center text-center gap-4 md:gap-6 lg:gap-8 p-4 sm:p-5 md:p-6">
            <CardTitle className="font-bold text-base sm:text-lg md:text-xl">{item.title}</CardTitle>
            <CardDescription className="leading-relaxed text-xs sm:text-sm md:text-base">{item.desc}</CardDescription>
          </CardContent>
        </Card>
      ))}
      </article>
    </section>
  );
}
