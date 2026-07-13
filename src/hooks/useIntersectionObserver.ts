import { useState, useEffect, useRef, useCallback } from 'react';

interface IntersectionObserverOptions {
  threshold?: number | number[];
  rootMargin?: string;
  root?: Element | null;
  /** If true the observer disconnects once the element intersects (fire-once). */
  triggerOnce?: boolean;
}

type ObservedRef<T extends Element = Element> = React.RefObject<T>;

/**
 * Observes whether a DOM element is currently intersecting the viewport.
 *
 * @param threshold   - Fraction of the element visible before triggering (0–1). Default `0.1`.
 * @param rootMargin  - Margin around the root. Default `'0px'`.
 * @param root        - Alternate scroll container. Default `null` (viewport).
 * @param triggerOnce - Disconnect after first intersection. Useful for enter animations.
 *
 * @returns `[ref, isIntersecting]`
 *
 * @example
 * const [ref, visible] = useIntersectionObserver(0.2, '-50px');
 * return <div ref={ref} className={visible ? 'fade-in' : 'opacity-0'} />;
 */
export function useIntersectionObserver<T extends Element = Element>(
  threshold: number | number[] = 0.1,
  rootMargin = '0px',
  root: Element | null = null,
  triggerOnce = false
): [ObservedRef<T>, boolean] {
  const ref = useRef<T>(null);
  const [isIntersecting, setIsIntersecting] = useState<boolean>(false);

  const handleEntry = useCallback(
    (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      const [entry] = entries;
      const intersecting = entry.isIntersecting;
      setIsIntersecting(intersecting);

      if (intersecting && triggerOnce) {
        observer.disconnect();
      }
    },
    [triggerOnce]
  );

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(handleEntry, {
      threshold,
      rootMargin,
      root,
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, root, handleEntry]);

  return [ref, isIntersecting];
}
