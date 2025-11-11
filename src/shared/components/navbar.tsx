import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "./ui/navigation-menu";

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
              <div className="w-8 h-8 bg-yellow-400 rounded-full"></div>
              <NavigationMenuLink className="text-[18px] cursor-pointer">Senandika</NavigationMenuLink>
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
              <NavigationMenuLink className="text-[18px] cursor-pointer" href="/login">Login</NavigationMenuLink>
            </NavigationMenuItem>

        </NavigationMenuList>
        
      </NavigationMenu>
    </section>
  );
}