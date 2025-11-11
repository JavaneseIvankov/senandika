export default function TeamSection() {
  return (
    <section id="team" className="flex flex-col justify-center items-center w-[80%] gap-20 mt-20">
        <div className="text-[56px]">
          <h1>Meet Our Team</h1>
        </div>
        <div className="flex w-full justify-evenly">
          <div className="flex flex-col justify-center items-center gap-8">
            <div className="w-[200px] h-[200px] bg-yellow-300 rounded-full"></div>
            <h1>Muhamad Fahry Pratama Putra</h1>
          </div>
          <div className="flex flex-col justify-center items-center gap-8">
            <div className="w-[200px] h-[200px] bg-yellow-300 rounded-full"></div>
            <h1>Aditya Akbar</h1>
          </div>
          <div className="flex flex-col justify-center items-center gap-8">
            <div className="w-[200px] h-[200px] bg-yellow-300 rounded-full"></div>
            <h1>Priyambodo Arundaya Satmika</h1>
          </div>
        </div>
    </section>
  )
};