import { useState, useEffect, useRef } from 'react';

type ScrollDirection = 'up' | 'down';

interface ScrollPosition {
  /** Raw vertical scroll offset in pixels */
  scrollY: number;
  /** Direction of the most recent scroll movement */
  scrollDirection: ScrollDirection;
  /** True when the page has scrolled more than 80 px from the top */
  isScrolled: boolean;
}

const SCROLL_THRESHOLD = 80;

/**
 * Tracks the window scroll position, scroll direction, and whether the user
 * has scrolled past the threshold (default 80 px).
 *
 * Attaches a passive scroll listener and cleans it up on unmount.
 * Uses a ref for the previous scrollY to avoid stale-closure issues.
 */
export function useScrollPosition(): ScrollPosition {
  const [scrollY, setScrollY] = useState<number>(
    typeof window !== 'undefined' ? window.scrollY : 0
  );
  const [scrollDirection, setScrollDirection] = useState<ScrollDirection>('down');
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  const prevScrollY = useRef<number>(
    typeof window !== 'undefined' ? window.scrollY : 0
  );

  useEffect(() => {
    function handleScroll(): void {
      const current = window.scrollY;
      const prev = prevScrollY.current;

      setScrollY(current);
      setIsScrolled(current > SCROLL_THRESHOLD);
      setScrollDirection(current > prev ? 'down' : 'up');

      prevScrollY.current = current;
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Sync state with current position on mount
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return { scrollY, scrollDirection, isScrolled };
}
