import Image from "next/image";
import { Button } from "@/components/ui/button";
import HeroSection from "@/components/home/HeroSection";
import DemoSection from "@/components/home/DemoSection";
import HowItWorks from "@/components/home/HowItWorks";
import PricingSection from "@/components/home/PricingSection";
import CTASection from "@/components/home/CTASection";

import BgGradient from "@/components/common/bg-gradient";

export default function Home() {
  return (
    <div className="relative w-full">
      <BgGradient />
      <div className="flex flex-col">
        <HeroSection />
        <DemoSection />
        <HowItWorks />
        <PricingSection />
        <CTASection />
      </div>
    </div>
  );
}
