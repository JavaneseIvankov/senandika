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
import { CircleUserRound, MessageCircleMore } from "lucide-react"
import { usePathname } from "next/navigation"

export default function DashboardSidebar() {
  const pathname = usePathname()
  
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

        <SidebarFooter>
          <p className="text-xs text-muted-foreground px-2">© 2025 Senandika</p>
        </SidebarFooter> 
      </Sidebar>
  )
}