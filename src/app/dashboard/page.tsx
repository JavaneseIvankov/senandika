import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await getSession();
  if (session?.user) {
    redirect("/dashboard/chat");
  }
  redirect("/login");
}
