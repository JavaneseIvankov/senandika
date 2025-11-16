"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "@/lib/auth-client"
import DashboardSidebar from "@/shared/components/sidebar"
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/shared/components/ui/sidebar';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  // Show loading or nothing while checking session
  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  // Don't render dashboard if no session
  if (!session) {
    return null;
  }

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