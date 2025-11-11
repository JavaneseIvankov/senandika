import HeroContainer from "@/features/home/hero-section/container/hero-section";
import AboutContainer from "@/features/home/about-section/container/about-container";
import TeamContainer from "@/features/home/team-section/container/team-container";
import BenefitContainer from "@/features/home/benefit-section/container/benefit-container";
import { ProtectedRoute } from "@/shared/components/ProtectedRoute";

export default function Home() {
  return (
    
      <main className="flex flex-col min-h-screen overscroll-y-contain mb-10">
        <HeroContainer />
        <AboutContainer />
        <BenefitContainer />
        <TeamContainer />
      </main>
   
  );
}
