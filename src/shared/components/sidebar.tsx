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
import { Home, Settings } from "lucide-react"

export default function DashboardSidebar() {
  return (
      <Sidebar> 
        {/* Bagian sidebar-nya */}
        <SidebarHeader className="flex flex-row items-center">
          <div className="w-8 h-8 bg-yellow-400 rounded-full"></div>
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