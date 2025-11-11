"use client"

import { useRef, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/shared/components/ui/carousel";
import { slides } from "../data/hero-data";

export default function CarouselSection() {
  const nextRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      nextRef.current?.click();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="flex justify-center items-center w-[70%] mx-auto overflow-hidden">
      <Carousel className="w-full" opts={{ loop: true }}>
        <CarouselContent>
          {slides.map((slide) => (
            <CarouselItem
              key={slide.id}
              className="h-[500px] rounded-[40px]"
              style={{background: slide.color}}></CarouselItem>
          ))}
        </CarouselContent>
        <CarouselNext ref={nextRef} className="hidden" />
        <CarouselPrevious className="hidden"/>
      </Carousel>
    </section>
  );
}
