export default function footer() {
  return (
    <footer className="flex justify-between items-center w-full h-full md:h-[200px] bg-[#dcc0ec] p-20">
      <div className="flex justify-center items-center w-[40%] h-[100px]">
        <div className="w-[100px] h-[100px] rounded-full bg-yellow-300"></div>
      </div>
      <div className="flex justify-start items-center w-[40%] h-[100px]">
        <h1>@Copyright</h1>
      </div>
    </footer>
  )
}