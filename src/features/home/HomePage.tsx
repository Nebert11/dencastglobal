import React, { useEffect, useRef, useState, lazy, Suspense } from 'react';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import Hero from './components/Hero';
import TrustedBy from './components/TrustedBy';
import AboutPreview from './components/AboutPreview';
import FeaturedServices from './components/FeaturedServices';
import { SITE_NAME, SITE_TAGLINE } from '@/utils/constants';
import { getHeroContent } from '@/services/supabase.service';
import type { HeroContent } from '@/types';

// ─── Lazy-loaded below-fold sections ─────────────────────────────────────────
const FeaturedPortfolio = lazy(() => import('./components/FeaturedPortfolio'));
const WhyChoose = lazy(() => import('./components/WhyChoose'));
const Statistics = lazy(() => import('./components/Statistics'));
const Testimonials = lazy(() => import('./components/Testimonials'));
const RecentBlog = lazy(() => import('./components/RecentBlog'));
const CallToAction = lazy(() => import('./components/CallToAction'));
const ContactPreview = lazy(() => import('./components/ContactPreview'));

// ─── Skeleton fallback ────────────────────────────────────────────────────────

const SectionSkeleton: React.FC<{ height?: string }> = ({ height = 'h-64' }) => (
  <div className={`w-full ${height} bg-slate-100 animate-pulse`} />
);

// ─── Lenis scroll init ────────────────────────────────────────────────────────

function useLenis() {
  useEffect(() => {
    let lenisInstance: {
      raf: (time: number) => void;
      destroy: () => void;
    } | null = null;

    let rafId: number;

    // Dynamically import Lenis to avoid SSR issues
    import('lenis')
      .then(({ default: Lenis }) => {
        lenisInstance = new Lenis({
          duration: 1.2,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true,
        } as ConstructorParameters<typeof Lenis>[0]);

        function raf(time: number) {
          lenisInstance?.raf(time);
          rafId = requestAnimationFrame(raf);
        }

        rafId = requestAnimationFrame(raf);
      })
      .catch(() => {
        // Lenis not installed — silently fall back to native scroll
      });

    return () => {
      cancelAnimationFrame(rafId);
      lenisInstance?.destroy();
    };
  }, []);
}

// ─── HomePage ────────────────────────────────────────────────────────────────

const HomePage: React.FC = () => {
  const [heroData, setHeroData] = useState<HeroContent | null>(null);
  const hasFetchedHeroRef = useRef(false);

  useLenis();

  useEffect(() => {
    if (hasFetchedHeroRef.current) return;
    hasFetchedHeroRef.current = true;

    getHeroContent().then((res) => {
      if (res.data) setHeroData(res.data);
    });
  }, []);

  return (
    <HelmetProvider>
      <Helmet>
        <title>{`${SITE_NAME} — ${SITE_TAGLINE}`}</title>
        <meta
          name="description"
          content="Dencast Global is a world-class creative media and film production company. We craft cinematic stories, documentaries, brand films, and premium visual content for leading brands across Africa and beyond."
        />
        <meta name="keywords" content="film production, documentary, brand film, videography, photography, creative media, Africa, Nairobi, Dencast Global" />
        {/* Open Graph */}
        <meta property="og:title" content={`${SITE_NAME} — ${SITE_TAGLINE}`} />
        <meta
          property="og:description"
          content="Premium creative media, film production, and brand storytelling from the heart of Africa to the world."
        />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://images.pexels.com/photos/3379934/pexels-photo-3379934.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" />
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${SITE_NAME} — ${SITE_TAGLINE}`} />
        <meta
          name="twitter:description"
          content="Premium creative media, film production, and brand storytelling from the heart of Africa to the world."
        />
        <link rel="canonical" href="https://www.dencastglobal.com/" />
      </Helmet>

      <main id="main-content">
        {/* ── 1. Hero (above fold — eager) ── */}
        <Hero data={heroData} />

        {/* ── 2. Trusted By ── */}
        <TrustedBy />

        {/* ── 3. About Preview ── */}
        <AboutPreview />

        {/* ── 4. Featured Services ── */}
        <FeaturedServices />

        {/* ── Below-fold sections: lazy loaded ── */}
        <Suspense fallback={<SectionSkeleton height="h-[600px]" />}>
          {/* ── 5. Portfolio Preview ── */}
          <FeaturedPortfolio />
        </Suspense>

        <Suspense fallback={<SectionSkeleton height="h-[480px]" />}>
          {/* ── 6. Why Choose ── */}
          <WhyChoose />
        </Suspense>

        <Suspense fallback={<SectionSkeleton height="h-72" />}>
          {/* ── 7. Statistics ── */}
          <Statistics />
        </Suspense>

        <Suspense fallback={<SectionSkeleton height="h-[500px]" />}>
          {/* ── 8. Testimonials ── */}
          <Testimonials />
        </Suspense>

        <Suspense fallback={<SectionSkeleton height="h-[480px]" />}>
          {/* ── 9. Recent Blog ── */}
          <RecentBlog />
        </Suspense>

        <Suspense fallback={<SectionSkeleton height="h-80" />}>
          {/* ── 10. Call To Action ── */}
          <CallToAction />
        </Suspense>

        <Suspense fallback={<SectionSkeleton height="h-36" />}>
          {/* ── 11. Contact Preview ── */}
          <ContactPreview />
        </Suspense>
      </main>
    </HelmetProvider>
  );
};

export default HomePage;
