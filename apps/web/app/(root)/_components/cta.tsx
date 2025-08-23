"use client";

import React, { useState } from "react";
import { ChevronRight, Check } from "lucide-react";
import ClipText from "@/components/shared/cliptext";
const CTASection = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hasError, setHasError] = useState(false);

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const trimmedEmail = email.trim();

    if (trimmedEmail && isValidEmail(trimmedEmail)) {
      setIsSubmitted(true);
      setHasError(false);
      console.log("Email submitted:", trimmedEmail);

      setTimeout(() => {
        setIsSubmitted(false);
      }, 2000);
    } else {
      setHasError(true);
      setTimeout(() => {
        setHasError(false);
      }, 1000);
    }
  };

  const handleKeyPress = (e: any) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  return (
    <div className="w-full max-w-screen-2xl px-5 md:px-14 mx-auto flex items-center gap-10 py-20 justify-center">
      <div className="cta-bg w-full aspect-[3/1] rounded-lg border border-[#FFFFFF]/30 flex items-center justify-center flex-col gap-6">
        <h2 className="text-white font-thin font-clash">
          // &nbsp; Let’s Build Trust &nbsp;//
        </h2>
        <ClipText className="text-white text-center text-5xl font-semibold font-syne">
          Own Your Credentials, <br /> Verify Instantly{" "}
        </ClipText>
        <p className="text-white/90 font-clash text-center">
          Secure your achievements with Credora—verifiable,<br /> tamper-proof, and truly yours. One click away.
        </p>

        <div className="relative w-full max-w-md">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="your email address"
            className={`w-full bg-transparent border-2 rounded-full px-6 py-4 pr-16 text-base outline-none transition-all duration-300 placeholder-opacity-70 ${
              hasError
                ? "border-red-500 text-red-500 placeholder-red-300"
                : "border-white text-white placeholder-white focus:border-green-400 focus:shadow-lg focus:shadow-green-400/20"
            }`}
            required
          />
          <button
            onClick={handleSubmit}
            className="absolute right-1.5 top-1/2 transform -translate-y-1/2 rounded-full w-12 h-12 transition-all duration-300 flex items-center justify-center hover:scale-105 active:scale-95"
            style={{ backgroundColor: isSubmitted ? "#4ade80" : "#8EDA5E" }}
          >
            {isSubmitted ? (
              <Check className="w-5 h-5 text-green-900" />
            ) : (
              <ChevronRight className="w-5 h-5 text-green-900" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CTASection;
