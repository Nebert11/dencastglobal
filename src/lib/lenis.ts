import Lenis from 'lenis';
import gsap from 'gsap';

// ─── Types ───────────────────────────────────────────────────────────────────

type LenisInstance = InstanceType<typeof Lenis>;

// ─── Singleton State ─────────────────────────────────────────────────────────

let lenisInstance: LenisInstance | null = null;
let gsapTickerCallback: ((time: number) => void) | null = null;

// ─── initLenis ───────────────────────────────────────────────────────────────

/**
 * Creates (or returns an existing) Lenis smooth-scroll singleton.
 * Connects the scroll loop to the GSAP ticker so animations stay in sync.
 *
 * @returns The Lenis instance for optional manual control.
 */
export function initLenis(): LenisInstance {
  if (lenisInstance) {
    return lenisInstance;
  }

  lenisInstance = new Lenis({
    duration: 1.2,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    lerp: 0.1,
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 2,
    infinite: false,
  });

  // Drive Lenis via GSAP ticker for frame-perfect synchronisation.
  gsapTickerCallback = (time: number) => {
    lenisInstance?.raf(time * 1000);
  };

  gsap.ticker.add(gsapTickerCallback);

  // Prevent GSAP from sleeping — keeps the ticker running continuously.
  gsap.ticker.lagSmoothing(0);

  return lenisInstance;
}

// ─── destroyLenis ────────────────────────────────────────────────────────────

/**
 * Destroys the Lenis instance and removes the GSAP ticker callback.
 * Call this in cleanup effects (e.g. React `useEffect` return).
 */
export function destroyLenis(): void {
  if (gsapTickerCallback) {
    gsap.ticker.remove(gsapTickerCallback);
    gsapTickerCallback = null;
  }

  if (lenisInstance) {
    lenisInstance.destroy();
    lenisInstance = null;
  }
}

// ─── getLenis ────────────────────────────────────────────────────────────────

/**
 * Returns the current Lenis instance without creating a new one.
 * Returns `null` if `initLenis()` has not been called yet.
 */
export function getLenis(): LenisInstance | null {
  return lenisInstance;
}

export default { initLenis, destroyLenis, getLenis };
