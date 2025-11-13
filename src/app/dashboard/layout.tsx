"use client"

import DashboardSidebar from "@/shared/components/sidebar"
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/shared/components/ui/sidebar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset>
        <main className="p-6">
          <SidebarTrigger className="cursor-pointer"/>
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}