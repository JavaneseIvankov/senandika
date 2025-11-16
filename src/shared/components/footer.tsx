import Image from "next/image"

export default function footer() {
  return (
    <footer className="flex flex-col md:flex-row justify-center md:justify-between items-center w-full h-auto md:h-[200px] bg-[#dcc0ec] p-6 sm:p-10 md:p-20 gap-4 md:gap-0">
      <div className="flex justify-center items-center w-full md:w-[40%] h-20 md:h-[100px]">
        <Image
          src="/assets/logo/logo-with-text.png"
          alt="Senandika Logo"
          width={500}
          height={500}
          className="w-16 h-16 sm:w-20 sm:h-20 scale-200 sm:scale-250 object-contain"
        />
      </div>
      <div className="flex justify-center md:justify-start items-center w-full md:w-[40%] h-auto md:h-[100px]">
        <h1 className="text-xs sm:text-sm md:text-base text-center md:text-left">@Copyright | 2025 Senandika</h1>
      </div>
    </footer>
  )
}