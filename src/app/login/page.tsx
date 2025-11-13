import AuthContainer from "@/features/auth/container/auth-container";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen overscroll-y-contain ">
      <AuthContainer />
    </main>
  );
}
