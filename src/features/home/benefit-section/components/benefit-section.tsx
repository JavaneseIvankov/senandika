import { dataBenefit } from "../data/benefit-data"

export default function BenefitSection() {
  return (
    <section id='benefit' className='flex flex-col items-center w-[80%] gap-20'>
      <h1 className="text-[56px]">Benefits</h1>
      <div className="flex w-full justify-around">
        <div className="flex flex-col w-[50%] pl-20 gap-4">
          {dataBenefit.map((item) => (
            <li 
              key={item.id}  
            >{item.desc}</li>
          )
        )}
        </div>
        <div className="w-[50%] bg-yellow-300">
          
        </div>
      </div>
    </section>
  )
}