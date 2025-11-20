"use client"

import {
  SidebarProvider,
  Sidebar,
  SidebarTrigger,
  SidebarInset,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "./ui/sidebar"
import Link from "next/link"
import Image from "next/image"
import { CircleUserRound, MessageCircleMore, LogOut } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { signOut } from "@/lib/auth-client"
import { Button } from "./ui/button"

export default function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };
  
  return (
      <Sidebar> 
        {/* Bagian sidebar-nya */}
        <SidebarHeader className="flex flex-row items-center">
          <Image
            src="/assets/logo/logo-without-text.png"
            alt="Senandika Logo"
            width={50}
            height={50}
            className="w-12 h-12 scale-100 rounded-full object-contain"
          />
          <h1 className="text-lg font-bold px-2">Senandika</h1>
        </SidebarHeader>

        <SidebarContent>
          {/* Kelompok menu */}
          <SidebarGroup>
            <SidebarGroupLabel>Menu</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
              <SidebarMenuButton 
                asChild 
                isActive={pathname === "/dashboard/profile"}
              >
                <Link href="/dashboard/profile" className="flex items-center">
                  <CircleUserRound className="mr-2" /> Profile
                </Link>
              </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
              <SidebarMenuButton 
                asChild 
                isActive={pathname === "/dashboard/chat"}
              >
                <Link href="/dashboard/chat" className="flex items-center">
                  <MessageCircleMore className="mr-2" /> Chat
                </Link>
              </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="space-y-2">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full justify-start border-purple-200 hover:bg-linear-to-r hover:from-purple-50 hover:to-pink-50 text-purple-700 hover:text-purple-900 transition-all cursor-pointer"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
          <p className="text-xs text-muted-foreground px-2">© 2025 Senandika</p>
        </SidebarFooter> 
      </Sidebar>
  )
}