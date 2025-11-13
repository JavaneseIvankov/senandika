import { dataBenefit } from "../data/benefit-data"
import Image from "next/image"

export default function BenefitSection() {
  return (
    <section id='benefit' className='flex flex-col items-center w-[80%] gap-20'>
      <h1 className="text-[56px] font-bold">Benefits</h1>
      <div className="flex w-full justify-between">
        <div className="flex flex-col w-[50%] pl-20 gap-4">
          {dataBenefit.map((item) => (
            <li 
              key={item.id}  
            >{item.desc}</li>
          )
        )}
        </div>
        <div className="w-[40%]">
          <Image
            width={400}
            height={400}
            src="/assets/benefit/Benefit.jpg"
            alt="Benefit"
            className="object-cover rounded-[40px]"
          />
        </div>
      </div>
    </section>
  )
}