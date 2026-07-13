import { useState, useEffect, useRef } from 'react';
import { useIntersectionObserver } from './useIntersectionObserver';

interface AnimatedCounterOptions {
  /** The final number the counter animates to. */
  target: number;
  /** Animation duration in milliseconds. Default: `2000`. */
  duration?: number;
  /** String appended after the number (e.g. `'+'`, `'%'`). Default: `''`. */
  suffix?: string;
  /** String prepended before the number (e.g. `'$'`). Default: `''`. */
  prefix?: string;
  /** Intersection threshold before the animation starts. Default: `0.3`. */
  threshold?: number;
}

interface AnimatedCounterResult {
  /** Formatted display value, e.g. `'$1,250+'` */
  displayValue: string;
  /** Raw numeric value at the current animation frame */
  currentValue: number;
  /** Ref to attach to the element you want observed */
  ref: React.RefObject<HTMLElement>;
}

/**
 * Animates a number from `0` to `target` using `requestAnimationFrame` once
 * the attached element enters the viewport.
 *
 * Uses an ease-out curve for a natural deceleration effect.
 *
 * @example
 * const { displayValue, ref } = useAnimatedCounter({ target: 500, suffix: '+' });
 * return <span ref={ref}>{displayValue}</span>;
 */
export function useAnimatedCounter({
  target,
  duration = 2000,
  suffix = '',
  prefix = '',
  threshold = 0.3,
}: AnimatedCounterOptions): AnimatedCounterResult {
  const [currentValue, setCurrentValue] = useState<number>(0);

  // Re-use the intersection observer hook — cast ref to HTMLElement for flexibility
  const [ref, isIntersecting] = useIntersectionObserver<HTMLElement>(threshold, '0px', null, true);

  const rafId = useRef<number | null>(null);
  const startTime = useRef<number | null>(null);
  const hasAnimated = useRef<boolean>(false);

  useEffect(() => {
    if (!isIntersecting || hasAnimated.current) return;

    hasAnimated.current = true;
    startTime.current = null;

    function step(timestamp: number): void {
      if (startTime.current === null) {
        startTime.current = timestamp;
      }

      const elapsed = timestamp - startTime.current;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out cubic: decelerates as it approaches the target
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(eased * target);

      setCurrentValue(value);

      if (progress < 1) {
        rafId.current = requestAnimationFrame(step);
      } else {
        setCurrentValue(target);
      }
    }

    rafId.current = requestAnimationFrame(step);

    return () => {
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [isIntersecting, target, duration]);

  const displayValue = `${prefix}${currentValue.toLocaleString()}${suffix}`;

  return { displayValue, currentValue, ref };
}
