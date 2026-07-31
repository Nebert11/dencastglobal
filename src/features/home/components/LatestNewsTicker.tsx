import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getBlogPosts } from '@/services/data.service';

const AUTOPLAY_DELAY_MS = 4000;
const TRANSITION_MS = 600;

function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setPrefersReducedMotion(media.matches);

    onChange();
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  return prefersReducedMotion;
}

const LatestNewsTicker: React.FC = () => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const { data } = useQuery({
    queryKey: ['homeLatestNewsTicker'],
    queryFn: () => getBlogPosts({ page: 1, limit: 8 }),
  });

  const items = useMemo(() => {
    return (data?.data ?? []).map((post) => ({
      id: post.id,
      title: post.title,
      url: `/blog/${post.slug}`,
    }));
  }, [data?.data]);

  const count = items.length;
  const canAutoplay = count > 1 && !prefersReducedMotion && !isPaused;

  useEffect(() => {
    if (!canAutoplay) return;

    const timerId = window.setInterval(() => {
      setIsAnimating(true);
    }, AUTOPLAY_DELAY_MS);

    return () => window.clearInterval(timerId);
  }, [canAutoplay]);

  useEffect(() => {
    if (!isAnimating || count < 2) return;

    const timerId = window.setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % count);
      setIsAnimating(false);
    }, TRANSITION_MS);

    return () => window.clearTimeout(timerId);
  }, [isAnimating, count]);

  useEffect(() => {
    if (count === 0 || activeIndex < count) return;
    setActiveIndex(0);
  }, [count, activeIndex]);

  if (count === 0) return null;

  const current = items[activeIndex];
  const next = items[(activeIndex + 1) % count];
  const shouldAnimate = count > 1 && !prefersReducedMotion;

  return (
    <section className="bg-white border-b border-slate-100" aria-label="Latest news">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 py-5 sm:py-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <h2 className="inline-flex h-12 sm:h-14 items-center px-4 sm:px-5 rounded-xl border border-[#25408F]/20 bg-[#25408F]/10 text-sm sm:text-base font-black tracking-wide uppercase text-[#25408F] shrink-0">
            Latest News
          </h2>

          {count === 1 || !shouldAnimate ? (
            <Link
              to={current.url}
              className="block flex-1 h-12 sm:h-14 rounded-xl border border-slate-200 bg-slate-50 px-4 sm:px-5 py-3 text-slate-800 font-semibold text-sm sm:text-base leading-tight truncate hover:bg-[#25408F]/5 hover:border-[#25408F]/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25408F]/35"
            >
              {current.title}
            </Link>
          ) : (
            <div
              className="flex-1 h-12 sm:h-14 overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <div
                className="will-change-transform"
                style={{
                  transform: isAnimating ? 'translate3d(0, -100%, 0)' : 'translate3d(0, 0, 0)',
                  transition: isAnimating
                    ? `transform ${TRANSITION_MS}ms cubic-bezier(0.42, 0, 0.58, 1)`
                    : 'none',
                }}
              >
                <Link
                  to={current.url}
                  className="flex h-12 sm:h-14 items-center px-4 sm:px-5 text-slate-800 font-semibold text-sm sm:text-base leading-tight truncate hover:bg-[#25408F]/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25408F]/35"
                >
                  {current.title}
                </Link>
                <Link
                  to={next.url}
                  className="flex h-12 sm:h-14 items-center px-4 sm:px-5 text-slate-800 font-semibold text-sm sm:text-base leading-tight truncate hover:bg-[#25408F]/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25408F]/35"
                >
                  {next.title}
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default LatestNewsTicker;