import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/landing/HeroSection";
import { RolesSection } from "@/components/landing/RolesSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { StatsSection } from "@/components/landing/StatsSection";
import { PartnersSection } from "@/components/landing/PartnersSection";
import { CTASection } from "@/components/landing/CTASection";

const Landing = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <RolesSection />
        <FeaturesSection />
        <StatsSection />
        <PartnersSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Landing;