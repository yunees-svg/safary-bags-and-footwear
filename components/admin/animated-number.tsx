"use client";

import { useEffect, useState } from "react";
import { formatCurrency } from "@/lib/utils";

interface AnimatedNumberProps {
  value: number;
  isCurrency?: boolean;
  durationMs?: number;
}

export function AnimatedNumber({
  value,
  isCurrency = true,
  durationMs = 650,
}: AnimatedNumberProps) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (value === 0) {
      setDisplay(0);
      return;
    }

    let rafId = 0;
    const start = performance.now();

    function frame(now: number) {
      const progress = Math.min(1, (now - start) / durationMs);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(value * eased);
      if (progress < 1) {
        rafId = requestAnimationFrame(frame);
      } else {
        setDisplay(value);
      }
    }

    rafId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafId);
  }, [value, durationMs]);

  if (isCurrency) {
    return <>{formatCurrency(Math.round(display))}</>;
  }
  return <>{Math.round(display)}</>;
}
