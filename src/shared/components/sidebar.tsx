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
import { Home, Settings } from "lucide-react"

export default function DashboardSidebar() {
  return (
      <Sidebar> 
        {/* Bagian sidebar-nya */}
        <SidebarHeader className="flex flex-row items-center">
          <Image
            src="/assets/logo/logo-without-text.png"
            alt="Senandika Logo"
            width={50}
            height={50}
            className="w-12 h-12 scale-200 rounded-full object-contain"
          />
          <h1 className="text-lg font-bold px-2">Senandika</h1>
        </SidebarHeader>

        <SidebarContent>
          {/* Kelompok menu */}
          <SidebarGroup>
            <SidebarGroupLabel>Menu</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/dashboard/profile" className="flex items-center">
                  <Home className="mr-2" /> Profile
                </Link>
              </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/dashboard/chat" className="flex items-center">
                  <Settings className="mr-2" /> Chat
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