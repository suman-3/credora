
import { Metadata } from "next";
import HeroSection from "./_components/hero";
import { siteConfig } from "@workspace/config/web/metadata";
import LogoCloud from "./_components/logo-cloude";
import Works from "./_components/works";
import CTASection from "./_components/cta";
import { Testimonials } from "./_components/testimonials";
import FooterSection from "./_components/footer";
import Credora from "./_components/credora";

export const metadata: Metadata = {
  title: {
    default: siteConfig.home.title,
    template: `%s - ${siteConfig.home.title}`,
  },
  description: siteConfig.home.description,
};

export default function Home() {
  return (
    <main className="w-full flex flex-col">
      <HeroSection />
      <LogoCloud/>
      <Works/>
      <Testimonials />
      <CTASection />
      <FooterSection />
      <Credora/>
    </main>
  );
}
