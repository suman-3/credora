"use client";
import { cn } from "@workspace/ui/lib/utils";
import { motion } from "framer-motion";

interface MaxWrapperProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  toggleMaxWrap?: boolean;
}

export const MaxWrapper = ({
  children,
  className,
  toggleMaxWrap,
  style,
  ...rest
}: MaxWrapperProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={cn(
        "w-full h-full !scroll-smooth overflow-x-hidden",
        className,
        toggleMaxWrap && "max-w-screen-2xl px-4 md:px-12"
      )}
      style={{ ...style, scrollBehavior: "smooth" }}
      {...rest}
    >
      {children}
    </motion.div>
  );
};
