"use client";

import { animate, useInView, useMotionValue } from "framer-motion";
import { useEffect, useRef } from "react";

interface CounterProps {
  value: number;
  duration?: number;
}

export function AnimatedCounter({ value, duration = 2 }: CounterProps) {
  const count = useMotionValue(0);
  const spanRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(spanRef, { once: true });

  useEffect(() => {
    if (inView) {
      const controls = animate(count, value, { duration, ease: "easeOut" });
      return () => controls.stop();
    }
  }, [inView, value, count, duration]);

  useEffect(() => {
    return count.on("change", (latest) => {
      if (spanRef.current) {
        spanRef.current.textContent = Math.round(latest).toLocaleString();
      }
    });
  }, [count]);

  return <span ref={spanRef}>0</span>;
}
