import { useState, useEffect } from 'react';

/**
 * Lightweight, hardware-friendly count-up animation hook for numeric values.
 * Uses requestAnimationFrame with easeOutCubic easing for 60fps performance without lag.
 */
export function useAnimatedCounter(
  endValue: number,
  duration: number = 750,
  decimals: number = 0
): string {
  const [currentValue, setCurrentValue] = useState<number>(endValue);

  useEffect(() => {
    let startTime: number | null = null;
    let animationFrameId: number;
    const startValue = 0;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // easeOutCubic formula: 1 - (1 - t)^3
      const ease = 1 - Math.pow(1 - progress, 3);
      const val = startValue + (endValue - startValue) * ease;

      setCurrentValue(val);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setCurrentValue(endValue);
      }
    };

    animationFrameId = requestAnimationFrame(step);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [endValue, duration]);

  return currentValue.toFixed(decimals);
}
