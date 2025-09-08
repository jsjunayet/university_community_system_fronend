import FeaturesSection from "@/components/page/Homepage/FeaturesSection";
import HeroSection from "@/components/page/Homepage/HeroSection";
import StatsSection from "@/components/page/Homepage/StartsSection";
import Footer from "@/components/share/Footer";
import Header from "@/components/share/Header";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <StatsSection />
      </main>
      <Footer />
    </div>
  );
}
