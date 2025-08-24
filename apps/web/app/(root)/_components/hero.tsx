"use client";

import ClipText from "@/components/shared/cliptext";
import { MaxWrapper } from "@/components/shared/max-wrapper";
import AIAutomationText from "./animation/hero/animated-text";
import MotionWrapper from "@/components/shared/motion-wrapper";
import AnimatedButton from "./animation/hero/animated-button";
import { cn } from "@workspace/ui/lib/utils";
import { Button } from "@workspace/ui/components/button";
import { useRouter } from "next/navigation";

const HeroSection = () => {
  const router = useRouter();
    const authPageUrl = `${process.env.NEXT_PUBLIC_CONSOLE_URL}/auth/login`;
  return (
    <MaxWrapper className="w-full">
      <div className="w-full relative  min-h-svh md:min-h-lvh hero-bg flex items-center justify-center overflow-hidden xl:max-w-screen-2xl mx-auto">
        <div className="flex flex-col items-center justify-center gap-6">
          {/* Badge Animation */}
          <MotionWrapper
            delay={0.2}
            duration={0.8}
            direction="up"
            distance={50}
            className={cn(
              "px-5 py-0.5 select-none text-light lowercase bg-[#42602F]/40 rounded-full font-clash tracking-wider"
            )}
            blur={{ initial: 4, animate: 0 }}
          >
            #1 Choice for Secure On-Chain Proof ✨
          </MotionWrapper>
          {/* Main Heading Animation */}
          <MotionWrapper delay={0.4} duration={1} direction="up" distance={80}>
            <ClipText>
              Own Your <AIAutomationText /> - Securely <br />
              Stored & Instantly Verified
            </ClipText>
          </MotionWrapper>

          {/* Description Animation */}
          <MotionWrapper
            delay={0.5}
            duration={0.7}
            direction="up"
            distance={60}
            className="text-light text-center text-xl lowercase font-clash tracking-widest select-none"
            blur={{ initial: 10, animate: 0 }}
          >
            Credora lets professionals own credentials and organizations verify
            them <br /> instantly. Blockchain-powered, secure, and fraud-proof.
          </MotionWrapper>

          {/* Button Animation */}
          <MotionWrapper
            delay={0.8}
            duration={0.8}
            direction="up"
            distance={40}
            className="flex items-center gap-4 mt-2"
          >
            <AnimatedButton
              onClick={() => {
                router.push(authPageUrl);
              }}
              className="font-clash font-semibold !tracking-wider w-52 lowercase"
            >
              Get Started
            </AnimatedButton>
            <Button className="rounded-full active:scale-95 lowercase !h-12 w-48 cursor-pointer text-lg font-clash border border-white text-light">
              Request a demo
            </Button>
          </MotionWrapper>
        </div>
      </div>
    </MaxWrapper>
  );
};

export default HeroSection;
