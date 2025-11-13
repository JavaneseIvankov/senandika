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

import { Home, Settings } from "lucide-react"

export default function DashboardSidebar() {
  return (
    <SidebarProvider>
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
                <SidebarMenuButton>
                  <Home className="mr-2" /> Dashboard
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Settings className="mr-2" /> Settings
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <p className="text-xs text-muted-foreground px-2">© 2025 Senandika</p>
        </SidebarFooter>
      </Sidebar>
      <div className="pt-20">
        <SidebarTrigger/>
      </div>   
    </SidebarProvider>
  )
}


