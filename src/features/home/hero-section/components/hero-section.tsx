import HeadlineSection from "./headline-section";
import CarouselSection from "./carousel-section";

export default function HeroSection() {
  return (
    <section className="flex flex-col justify-center items-center w-full mx-auto">
      <div>
        <HeadlineSection />
      </div>
      <CarouselSection /> 
    </section>
  )
};