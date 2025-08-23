"use client";

import { motion, Easing } from "framer-motion";
import { ReactNode } from "react";

interface MotionWrapperProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  direction?: "up" | "down" | "left" | "right";
  distance?: number;
  ease?: Easing;
  stagger?: number;
  once?: boolean;
  viewport?: {
    once?: boolean;
    margin?: string;
    amount?: number | "some" | "all";
  };
  scale?: {
    initial?: number;
    animate?: number;
  };
  rotate?: {
    initial?: number;
    animate?: number;
  };
  opacity?: {
    initial?: number;
    animate?: number;
  };
  blur?: {
    initial?: number;
    animate?: number;
  };
  onAnimationComplete?: () => void;
}

const MotionWrapper = ({
  children,
  className = "",
  delay = 0,
  duration = 0.8,
  direction = "up",
  distance = 50,
  ease = [0.4, 0, 0.2, 1],
  once = true,
  viewport = { once: true, margin: "-100px" },
  scale,
  rotate,
  opacity = { initial: 0, animate: 1 },
  blur = { initial: 8, animate: 0 },
  onAnimationComplete,
  ...rest
}: MotionWrapperProps) => {
  // Direction mapping for initial position
  const getDirectionOffset = () => {
    switch (direction) {
      case "up":
        return { y: distance, x: 0 };
      case "down":
        return { y: -distance, x: 0 };
      case "left":
        return { x: distance, y: 0 };
      case "right":
        return { x: -distance, y: 0 };
      default:
        return { y: distance, x: 0 };
    }
  };

  const offset = getDirectionOffset();

  const initial = {
    ...offset,
    opacity: opacity.initial,
    filter: `blur(${blur.initial}px)`,
    ...(scale && { scale: scale.initial }),
    ...(rotate && { rotate: rotate.initial }),
  };

  const animate = {
    x: 0,
    y: 0,
    opacity: opacity.animate,
    filter: `blur(${blur.animate}px)`,
    ...(scale && { scale: scale.animate }),
    ...(rotate && { rotate: rotate.animate }),
  };

  const transition = {
    duration,
    ease,
    delay,
  };

  return (
    <motion.div
      className={className}
      initial={initial}
      animate={animate}
      transition={transition}
      viewport={viewport}
      whileInView={once ? animate : undefined}
      onAnimationComplete={onAnimationComplete}
      {...rest}
    >
      {children}
    </motion.div>
  );
};

export default MotionWrapper;