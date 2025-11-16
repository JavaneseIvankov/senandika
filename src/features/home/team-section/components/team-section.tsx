import Image from "next/image";
import { team } from "../data/team-data";

export default function TeamSection() {
  const teamMembers = [
    { name: "Muhamad Fahry Pratama Putra", image: team[0] },
    { name: "Aditya Akbar", image: team[1] },
    { name: "Priyambodo Arundaya Satmika", image: team[2] },
  ];

  return (
    <section id="team" className="flex flex-col justify-center items-center w-[95%] sm:w-[90%] md:w-[85%] lg:w-[80%] gap-8 sm:gap-12 md:gap-16 lg:gap-20 mt-8 sm:mt-12 md:mt-16 lg:mt-20 px-4">
        <div className="text-[28px] sm:text-[36px] md:text-[48px] lg:text-[56px] font-bold">
          <h1 className="text-center leading-tight">Meet Our Team</h1>
        </div>
        <div className="flex flex-col md:flex-row w-full justify-center md:justify-evenly gap-8 sm:gap-10 md:gap-6 lg:gap-4">
          {teamMembers.map((member, index) => (
            <div key={member.name} className="flex flex-col justify-center items-center gap-3 sm:gap-4 md:gap-6 lg:gap-8">
              <div className="w-[120px] h-[120px] sm:w-[150px] sm:h-[150px] md:w-40 md:h-40 lg:w-[200px] lg:h-[200px] rounded-full overflow-hidden border-4 border-purple-200">
                <Image
                  src={member.image.src.replace(/^public\//, "/")}
                  alt={member.name}
                  width={400}
                  height={400}
                  className={`w-full h-full object-cover scale-110 ${
                    index === 1 ? 'object-[center_15%]' : ''
                  }`}
                  priority
                />
              </div>
              <h1 className="text-center text-xs sm:text-sm md:text-base max-w-[180px] leading-tight">{member.name}</h1>
            </div>
          ))}
        </div>
    </section>
  )
};