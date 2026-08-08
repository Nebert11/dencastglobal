import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ScrollStackCarouselItem {
  src: string;
  alt: string;
  caption?: string;
  description?: string;
  objectPosition?: string;
}

interface ScrollStackCarouselProps {
  items: ScrollStackCarouselItem[];
  title?: string;
  eyebrow?: string;
  className?: string;
}

const ScrollStackImage: React.FC<{
  item: ScrollStackCarouselItem;
  index: number;
  total: number;
  progress: ReturnType<typeof useScroll>['scrollYProgress'];
}> = ({ item, index, total, progress }) => {
  const segmentCount = Math.max(total - 1, 1);
  const segmentStart = index === 0 ? 0 : (index - 1) / segmentCount;
  const segmentEnd = index === 0 ? 0 : index / segmentCount;

  const translateY = useTransform(
    progress,
    index === 0 ? [0, 1] : [segmentStart, segmentEnd],
    index === 0 ? ['0%', '0%'] : ['100%', '0%'],
  );

  const overlayOpacity = useTransform(
    progress,
    index === 0 ? [0, 1] : [segmentStart, segmentEnd],
    index === 0 ? [0.28, 0.28] : [0.4, 0.22],
  );

  return (
    <motion.div
      className="absolute inset-0"
      style={{ y: translateY, zIndex: index + 1 }}
    >
      <div className="relative h-full w-full overflow-hidden bg-slate-950">
        <img
          src={item.src}
          alt={item.alt}
          className="h-full w-full object-cover"
          style={{ objectPosition: item.objectPosition ?? 'center' }}
          loading="lazy"
        />
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-slate-950/35"
          style={{ opacity: overlayOpacity }}
        />
        {(item.caption || item.description) && (
          <div className="absolute inset-x-0 bottom-0 z-10">
            <div className="mx-auto w-full max-w-7xl px-5 pb-8 pt-24 sm:px-6 sm:pb-10 lg:px-8">
              <div className="max-w-xl rounded-3xl border border-white/10 bg-black/20 px-5 py-4 backdrop-blur-md sm:px-6 sm:py-5">
                {item.caption && (
                  <p className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                    {item.caption}
                  </p>
                )}
                {item.description && (
                  <p className="mt-2 text-sm leading-relaxed text-white/72 sm:text-base">
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const ScrollStackCarousel: React.FC<ScrollStackCarouselProps> = ({
  items,
  title,
  eyebrow,
  className = '',
}) => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  if (!items.length) return null;

  return (
    <section
      ref={sectionRef}
      className={className}
      style={{ height: `${Math.max(items.length, 2) * 100}vh` }}
    >
      <div className="sticky top-0 h-screen overflow-hidden bg-slate-950">
        {(eyebrow || title) && (
          <div className="pointer-events-none absolute inset-x-0 top-0 z-20">
            <div className="mx-auto flex w-full max-w-7xl items-start justify-between px-5 pb-10 pt-6 sm:px-6 sm:pt-8 lg:px-8">
              <div className="max-w-lg">
                {eyebrow && (
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/45">
                    {eyebrow}
                  </p>
                )}
                {title && (
                  <h3 className="mt-2 text-lg font-semibold text-white sm:text-xl">
                    {title}
                  </h3>
                )}
              </div>
              <div className="hidden rounded-full border border-white/10 bg-black/20 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.24em] text-white/45 backdrop-blur-md sm:block">
                Scroll
              </div>
            </div>
          </div>
        )}

        <div className="relative h-full w-full">
          {items.map((item, index) => (
            <ScrollStackImage
              key={`${item.src}-${index}`}
              item={item}
              index={index}
              total={items.length}
              progress={scrollYProgress}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ScrollStackCarousel;