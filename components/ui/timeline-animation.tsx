"use client";

import type { Variants } from "framer-motion";
import { type HTMLMotionProps, motion, useInView } from "framer-motion";
import type React from "react";

export type TimelineContentProps<T extends keyof HTMLElementTagNameMap> = {
  children?: React.ReactNode;
  animationNum: number;
  className?: string;
  timelineRef: React.RefObject<any>;
  as?: T;
  customVariants?: Variants;
  once?: boolean;
} & Omit<HTMLMotionProps<T>, "as" | "children" | "className">;

export const TimelineAnimation = <T extends keyof HTMLElementTagNameMap = "div">({
  children,
  animationNum,
  timelineRef,
  className,
  as,
  customVariants,
  once = true,
  ...props
}: TimelineContentProps<T>) => {
  const defaultSequenceVariants: Variants = {
    visible: (i: number) => ({
      filter: "blur(0px)",
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.4,
        duration: 0.5,
      },
    }),
    hidden: {
      filter: "blur(10px)",
      y: -20,
      opacity: 0,
    },
  };

  const sequenceVariants = customVariants || defaultSequenceVariants;

  const isInView = useInView(timelineRef, {
    once,
    amount: 0.1,
  });

  const MotionComponent = (motion as any)[as || "div"] || motion.div;

  return (
    <MotionComponent
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      custom={animationNum}
      variants={sequenceVariants}
      className={className}
      {...(props as any)}
    >
      {children}
    </MotionComponent>
  );
};

export const TimelineContent = TimelineAnimation;
export default TimelineAnimation;
