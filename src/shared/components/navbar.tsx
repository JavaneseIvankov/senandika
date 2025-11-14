import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "./ui/navigation-menu";
import Image from "next/image";

const NavLink = [
  { id:1, name: "About Senandika", href: "/#about-senandika"},
  { id:2, name: "Benefit", href: "/#benefit"},
  { id:3, name: "Team", href: "/#team"}
]

export default function Navbar() {
  return (
    <section className="flex w-[80%] h-[20vh] justify-center items-center mx-auto sticky top-0 z-5">
      <NavigationMenu className="flex justify-between items-center w-full max-w-6xl border-2 rounded-2xl p-3 px-6 backdrop-blur-2xl">
        <NavigationMenuList className="flex w-full justify-between">

            <NavigationMenuItem className="flex justify-center items-center w-full">
              <Image
                src="/assets/logo/logo-without-text.png"
                alt="Senandika Logo"
                width={200}
                height={200}
                className="w-12 h-12 scale-100 rounded-full object-contain"
              />
              <NavigationMenuLink className="text-[18px] cursor-pointer pointer-events-none">Senandika</NavigationMenuLink>
            </NavigationMenuItem>

        </NavigationMenuList>

        <NavigationMenuList className="flex w-full justify-between gap-8">
          {NavLink.map((link) => (
            <NavigationMenuItem
              key={link.id}
            >
              <NavigationMenuLink 
                href={link.href}
                className="hover:scale-110 transition-transform duration-300 hover:bg-none text-[18px]"
                  >{link.name}
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>


        <NavigationMenuList className="flex w-full justify-between">

            <NavigationMenuItem className="flex-1 w-full">
              <NavigationMenuLink 
                className="text-[18px] cursor-pointer bg-linear-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full hover:from-purple-600 hover:to-pink-600 hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 inline-block" 
                href="/login"
              >
                Login
              </NavigationMenuLink>
            </NavigationMenuItem>

        </NavigationMenuList>
        
      </NavigationMenu>
    </section>
  );
}