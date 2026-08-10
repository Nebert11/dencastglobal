import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation as SwiperNavigation, Autoplay } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

export interface PhotoCarouselItem {
  src: string;
  alt: string;
  caption?: string;
  description?: string;
  objectPosition?: string;
}

interface PhotoCarouselProps {
  items: PhotoCarouselItem[];
  title?: string;
  className?: string;
  slideClassName?: string;
  imageClassName?: string;
  aspectClassName?: string;
  showCardBorder?: boolean;
  variant?: 'default' | 'showcase';
  showMeta?: boolean;
  imageClickable?: boolean;
  viewerMode?: 'standard' | 'immersive';
}

const PhotoCarousel: React.FC<PhotoCarouselProps> = ({
  items,
  title,
  className = '',
  slideClassName = '',
  imageClassName = '',
  aspectClassName = 'aspect-[4/3]',
  showCardBorder = true,
  variant = 'default',
  showMeta = true,
  imageClickable = true,
  viewerMode = 'standard',
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);

  useEffect(() => {
    if (activeIndex === null) return;

    const { body, documentElement } = document;
    const previousBodyOverflow = body.style.overflow;
    const previousHtmlOverflow = documentElement.style.overflow;

    body.style.overflow = 'hidden';
    documentElement.style.overflow = 'hidden';

    return () => {
      body.style.overflow = previousBodyOverflow;
      documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [activeIndex]);

  if (!items.length) return null;

  const activeItem = activeIndex !== null ? items[activeIndex] : null;
  return (
    <>
      <div className={className}>
        <Swiper
          modules={variant === 'showcase' ? [Autoplay] : [SwiperNavigation]}
          navigation={variant === 'default'}
          effect="slide"
          centeredSlides={variant === 'showcase'}
          speed={variant === 'showcase' ? 720 : 450}
          autoplay={
            variant === 'showcase'
              ? {
                  delay: 5200,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }
              : undefined
          }
          allowTouchMove={!isTransitioning}
          onSwiper={setSwiperInstance}
          onSlideChangeTransitionStart={() => {
            if (variant === 'showcase') setIsTransitioning(true);
          }}
          onSlideChangeTransitionEnd={() => {
            if (variant === 'showcase') setIsTransitioning(false);
          }}
          loop={items.length > 1}
          spaceBetween={variant === 'showcase' ? 8 : 16}
          breakpoints={
            variant === 'showcase'
              ? {
                  0: { slidesPerView: 1.08 },
                  640: { slidesPerView: 1.8 },
                  900: { slidesPerView: 2.4 },
                  1200: { slidesPerView: 3 },
                }
              : {
                  0: { slidesPerView: 1.05 },
                  480: { slidesPerView: 1.25 },
                  640: { slidesPerView: 1.4 },
                  768: { slidesPerView: 2 },
                  1024: { slidesPerView: 2.4 },
                }
          }
          className={variant === 'showcase' ? 'showcase-carousel pb-10' : 'pb-4'}
        >
          {items.map((item, index) => (
            <SwiperSlide key={`${item.src}-${index}`} className={slideClassName}>
              <motion.button
                type="button"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.45, delay: index * 0.05 }}
                onClick={() => {
                  if (imageClickable) setActiveIndex(index);
                }}
                aria-disabled={!imageClickable}
                className={`group w-full text-left ${imageClickable ? 'cursor-pointer' : 'cursor-default'}`}
              >
                <div
                  className={`relative overflow-hidden ${variant === 'showcase' ? 'showcase-slide-card rounded-[2rem] shadow-2xl shadow-slate-300/30 ring-1 ring-slate-200/80' : 'rounded-2xl bg-slate-100 shadow-sm'} ${showCardBorder ? 'border border-slate-100' : ''} ${aspectClassName}`}
                >
                  <img
                    src={item.src}
                    alt={item.alt}
                    loading="lazy"
                    style={{ objectPosition: item.objectPosition ?? 'center' }}
                    className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${imageClassName}`}
                  />
                  <div className={`absolute inset-0 ${variant === 'showcase' ? 'bg-gradient-to-t from-black/35 via-black/5 to-transparent opacity-100' : 'bg-gradient-to-t from-black/40 via-black/0 to-black/0 opacity-0 group-hover:opacity-100'} transition-opacity duration-300`} />
                </div>

                {showMeta && (item.caption || item.description) && (
                  <div className="px-1 pt-3">
                    {item.caption && (
                      <p className="text-sm font-semibold text-slate-800 leading-snug">{item.caption}</p>
                    )}
                    {item.description && (
                      <p className="mt-1 text-sm text-slate-500 leading-relaxed">{item.description}</p>
                    )}
                  </div>
                )}
              </motion.button>
            </SwiperSlide>
          ))}
        </Swiper>

        {variant === 'showcase' && items.length > 1 && (
          <div className="mt-2 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => swiperInstance?.slidePrev()}
              disabled={isTransitioning}
              className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white border border-slate-200 text-slate-700 hover:text-[#25408F] hover:border-[#25408F]/40 shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Previous image"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => swiperInstance?.slideNext()}
              disabled={isTransitioning}
              className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#25408F] text-white hover:bg-[#1f3576] shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Next image"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}

      </div>

      {activeItem && activeIndex !== null && createPortal(
        <div
          className="fixed inset-0 z-[200] bg-black/55 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          onClick={() => setActiveIndex(null)}
          role="dialog"
          aria-modal="true"
          aria-label={title ?? activeItem.alt}
        >
          <div
            className={viewerMode === 'immersive'
              ? 'relative  w-full max-w-[1400px] h-[72vh] sm:w-[80vw] sm:h-[80vh] rounded-3xl overflow-hidden bg-black shadow-2xl shadow-black/60 border border-white/10'
              : 'relative w-full max-w-6xl'}
            onClick={(event) => event.stopPropagation()}
          >
            <div className={viewerMode === 'immersive'
              ? 'absolute top-0 left-0 right-0 z-10 flex items-center justify-between gap-4 p-4 sm:p-6 bg-gradient-to-b from-black/75 via-black/30 to-transparent text-white/80'
              : 'absolute -top-14 left-0 right-0 flex items-center justify-between gap-4 text-white/85'}>
              <div>
                {title && <p className="text-xs uppercase tracking-widest text-white/50 mb-1">{title}</p>}
                <p className="text-sm sm:text-base font-semibold">{activeItem.caption ?? activeItem.alt}</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveIndex(null)}
                className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                aria-label="Close image viewer"
              >
                <X size={18} />
              </button>
            </div>

            <div className={viewerMode === 'immersive'
              ? 'relative w-full h-full bg-black'
              : 'relative rounded-2xl overflow-hidden border border-white/10 bg-black shadow-2xl'}>
              <img
                src={activeItem.src}
                alt={activeItem.alt}
                className={viewerMode === 'immersive'
                  ? 'w-full h-full object-contain bg-black'
                  : 'w-full max-h-[82vh] object-contain bg-black'}
              />
            </div>

            {items.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => setActiveIndex((activeIndex - 1 + items.length) % items.length)}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveIndex((activeIndex + 1) % items.length)}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}
          </div>
        </div>,
        document.body,
      )}
    </>
  );
};

export default PhotoCarousel;
