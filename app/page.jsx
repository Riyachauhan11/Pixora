import Contact from "@/components/contact";
import FeaturesSection from "@/components/features";
import HeroSection from "@/components/hero";
import InteractiveStats from "@/components/interactive-stats";
import Pricing from "@/components/pricing";

export default function Home() {
  return (
    <div className="pt-36">
      {/* hero */}
      <HeroSection />
      {/* stats */}
      <InteractiveStats />
      {/* features */}
      <FeaturesSection />
      {/* pricing */}
      <Pricing />
      {/* contact */}
      <Contact />
    </div>
  );
}
