
import { cn } from "@workspace/ui/lib/utils";
import React from "react";

interface ClipTextProps {
  className?: string;
  text?: string;
  children?: React.ReactNode;
}

const ClipText = ({ className, text, children }: ClipTextProps) => {
  return (
    <h1
      className={cn(
        "text-7xl font-semibold text-font font-syne text-center leading-[5rem] lowercase select-none",
        className
      )}
      style={{
        background:
          "linear-gradient(179deg, #FFFCE1 0.50%, rgba(255, 255, 255, 0.00) 190.4%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        letterSpacing: "-2.5px",
      }}
    >
      {children || text}
    </h1>
  );
};

export default ClipText;
