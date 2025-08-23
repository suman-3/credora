
import { Metadata } from "next";
import HeroSection from "./_components/hero";
import { siteConfig } from "@workspace/config/web/metadata";

export const metadata: Metadata = {
  title: {
    default: siteConfig.home.title,
    template: `%s - ${siteConfig.home.title}`,
  },
  description: siteConfig.home.description,
};

export default function Home() {
  return (
    <main className="w-full flex flex-col gap-4 min-h-[400vh]">
      <HeroSection />
    </main>
  );
}
