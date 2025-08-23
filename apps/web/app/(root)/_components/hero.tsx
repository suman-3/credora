"use client";

import ClipText from "@/components/shared/cliptext";
import { MaxWrapper } from "@/components/shared/max-wrapper";
import AIAutomationText from "./animation/hero/animated-text";
import MotionWrapper from "@/components/shared/motion-wrapper";
import AnimatedButton from "./animation/hero/animated-button";
import { cn } from "@workspace/ui/lib/utils";
import { Button } from "@workspace/ui/components/button";

const HeroSection = () => {
  return (
    <MaxWrapper className="w-full">
      <div className="w-full relative md:min-h-lvh hero-bg flex items-center justify-center overflow-hidden xl:max-w-screen-2xl mx-auto">
        <div className="flex flex-col items-center justify-center gap-6">
          {/* Badge Animation */}
          <MotionWrapper
            delay={0.2}
            duration={0.8}
            direction="up"
            distance={50}
            className={cn(
              "px-5 py-0.5 select-none text-font lowercase bg-[#42602F]/40 rounded-full font-clash tracking-wider"
            )}
            blur={{ initial: 4, animate: 0 }}
          >
            #1 AI automation provider ✨
          </MotionWrapper>

          {/* Main Heading Animation */}
          <MotionWrapper delay={0.4} duration={1} direction="up" distance={80}>
            <ClipText>
              The Best <AIAutomationText /> — Trusted <br /> by leaders, Loved
              by millions
            </ClipText>
          </MotionWrapper>

          {/* Description Animation */}
          <MotionWrapper
            delay={0.5}
            duration={0.7}
            direction="up"
            distance={60}
            className="text-font text-center text-xl font-clash tracking-widest lowercase select-none"
            blur={{ initial: 10, animate: 0 }}
          >
            Automating complex workflows, enhancing efficiency, and streamlining
            support <br /> so your business scales faster with precision
          </MotionWrapper>

          {/* Button Animation */}
          <MotionWrapper
            delay={0.8}
            duration={0.8}
            direction="up"
            distance={40}
            className="flex items-center gap-4 mt-2"
          >
            <AnimatedButton className="font-clash font-semibold !tracking-wider w-52 lowercase">
              Request Demo
            </AnimatedButton>
            <Button
              className="rounded-full active:scale-95 !h-12 w-48 cursor-pointer text-lg font-clash border border-white text-font"
            >
              Explore Services
            </Button>
          </MotionWrapper>
        </div>
      </div>
    </MaxWrapper>
  );
};

export default HeroSection;
