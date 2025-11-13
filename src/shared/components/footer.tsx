import Image from "next/image"

export default function footer() {
  return (
    <footer className="flex justify-between items-center w-full h-full md:h-[200px] bg-[#dcc0ec] p-20">
      <div className="flex justify-center items-center w-[40%] h-[100px]">
        <Image
          src="/assets/logo/logo-with-text.png"
          alt="Senandika Logo"
          width={50}
          height={50}
          className="w-20 h-20 scale-250 object-contain"
        />
      </div>
      <div className="flex justify-start items-center w-[40%] h-[100px]">
        <h1>@ 2025 Senandika</h1>
      </div>
    </footer>
  )
}