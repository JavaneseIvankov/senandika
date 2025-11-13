import ProfileContainer from "@/features/dashboard/profile-section/container/profile-container";

export default function Home() {
  return (
    <main className="flex flex-col justify-center items-center min-h-screen overscroll-y-contain ">
      <ProfileContainer />
    </main>
  );
}
