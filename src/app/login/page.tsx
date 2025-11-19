import AuthContainer from "@/features/auth/container/auth-container";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getSession();
  if (session?.user) redirect("/dashboard/chat");

  return (
    <main className="flex flex-col min-h-screen overscroll-y-contain ">
      <AuthContainer />
    </main>
  );
}
