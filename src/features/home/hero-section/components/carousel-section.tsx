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
import Image from "next/image";

export default function CarouselSection() {
  const nextRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      nextRef.current?.click();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="flex justify-center items-center w-[95%] sm:w-[90%] md:w-[80%] lg:w-[70%] mx-auto overflow-hidden px-2 sm:px-4">
      <Carousel className="w-full" opts={{ loop: true }}>
        <CarouselContent>
          {slides.map((slide) => (
            <CarouselItem
              key={slide.id}
              className="h-[250px] sm:h-[350px] md:h-[500px] lg:h-[700px] rounded-[15px] sm:rounded-[20px] md:rounded-[30px] lg:rounded-[40px] flex justify-center items-center overflow-hidden bg-gray-100"
            >
              {slide.src ? (
                <Image
                  width={400}
                  height={400}
                  src={slide.src.replace(/^public\//, "/")}
                  alt={`Slide ${slide.id}`}
                  className="w-full h-full object-contain sm:object-cover rounded-[15px] sm:rounded-[20px] md:rounded-[30px] lg:rounded-[40px]"
                  priority
                />
              ) : (
                <div
                  className="w-full h-full rounded-[15px] sm:rounded-[20px] md:rounded-[30px] lg:rounded-[40px]"
                  style={{ backgroundColor: slide.color }}
                />
              )}
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselNext ref={nextRef} className="hidden" />
        <CarouselPrevious className="hidden"/>
      </Carousel>
    </section>
  );
}
