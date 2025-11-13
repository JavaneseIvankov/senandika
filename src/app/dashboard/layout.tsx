import type { Metadata } from "next";
import Header from "@/shared/components/header";
import DashboardSidebar from "@/shared/components/sidebar";

export const metadata: Metadata = {
  title: "Senandika",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <div className="flex flex-col min-h-screen">
        <div className="w-[85%] max-w-[1720px] flex gap-10 justify-center mx-auto">
          <DashboardSidebar />
          <main className="relative min-w-[90%]">
            {children}
          </main>
        </div>
      </div>
  );
}
