import { dataBenefit } from "../data/benefit-data"
import Image from "next/image"

export default function BenefitSection() {
  return (
    <section id='benefit' className='flex flex-col items-center w-[95%] sm:w-[90%] md:w-[85%] lg:w-[80%] gap-8 sm:gap-12 md:gap-16 lg:gap-20 px-4'>
      <h1 className="text-[28px] sm:text-[36px] md:text-[48px] lg:text-[56px] font-bold text-center leading-tight">Benefits</h1>
      <div className="flex flex-col md:flex-row w-full justify-between gap-6 sm:gap-8">
        <div className="flex flex-col w-full md:w-[50%] px-6 md:px-0 md:pl-6 lg:pl-10 xl:pl-20 gap-2 sm:gap-3 md:gap-4 max-w-md md:max-w-none mx-auto md:mx-0">
          {dataBenefit.map((item) => (
            <li 
              key={item.id}
              className="text-xs sm:text-sm md:text-base leading-relaxed  md:list-disc"  
            >{item.desc}</li>
          )
        )}
        </div>
        <div className="w-full md:w-[45%] lg:w-[40%]">
          <Image
            width={600}
            height={600}
            src="/assets/benefit/Benefit.jpg"
            alt="Benefit"
            className="object-cover rounded-[15px] sm:rounded-[20px] md:rounded-[30px] lg:rounded-[40px] w-full"
          />
        </div>
      </div>
    </section>
  )
}