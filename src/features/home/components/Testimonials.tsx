import React from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import SectionLabel from '@/components/ui/SectionLabel';
import TestimonialCard from '@/components/ui/TestimonialCard';
import type { Testimonial } from '@/types';

// Import Swiper styles
// import 'swiper/css';
// import 'swiper/css/navigation';
// import 'swiper/css/pagination';

// ─── Static fallback testimonials ─────────────────────────────────────────────

const FALLBACK_TESTIMONIALS: Omit<Testimonial, 'id' | 'created_at' | 'updated_at'>[] = [
  {
    client_name: 'Caren Wakoli',
    client_title: 'Founder and Executive Director',
    client_company: 'Emerging Leaders Foundation',
    client_avatar_url: '/dencast_images/caren_wakoli.png',
    content:
      'Dencast Global is the home of quality. They have offered us quality yet affordable services with excellence and mastery. From when we were starting out to this time when we are established, they have continued to relentlessly believe in us and grow with us. Thank you Denis Machio and your team. Invest in Dencast Global and your organization will never be the same again.',
    rating: 5,
    is_featured: true,
    sort_order: 1,
  },
  {
    client_name: 'Judith Mueni',
    client_title: 'Communication Officer',
    client_company: 'ECD Network for Kenya',
    client_avatar_url: '/dencast_images/judith_mueni.jpg',
    content:
      'We had the pleasure of working with Dencast during the 6th National ECD Stakeholders Conference in Garissa and hybrid webinar, where they provided livestreaming, hybrid event management, photography, videography, and documentary production services. Their team demonstrated professionalism, technical expertise, and reliability throughout, and we would confidently recommend Dencast to organizations seeking dependable media and event production services.',
    rating: 5,
    is_featured: true,
    sort_order: 2,
  },
  {
    client_name: 'Patterson Siema',
    client_title: 'Senior Director, Communications & Policy Engagement',
    client_company: 'KUSI Communications',
    client_avatar_url: '/dencast_images/patterson_siema.jpg',
    content:
      'Working with Dencast Global has been a truly professional and rewarding experience. Their team consistently demonstrates excellence, creativity, reliability, and a strong commitment to delivering high-quality work. From planning and production to final delivery, every stage is handled with attention to detail and a clear understanding of the client vision. I highly recommend Dencast Global to any organization looking for a dependable creative media partner.',
    rating: 5,
    is_featured: true,
    sort_order: 3,
  },
  {
    client_name: 'Caroline Waangamati',
    client_title: 'Leadership and Strategy Expert',
    client_company: '',
    client_avatar_url: '/dencast_images/caroline_wangamati.jpg',
    content:
      'Dencast Global is truly a home of excellence. Perfection is their lowest standard because excellence is part of their daily work. I especially commend producer and lead director Dennis Machio, whose professionalism, creativity, and eye for detail are evident in every project. Whenever we have engaged Dencast Global, they have provided world-class branding, communication strategies, and production services.',
    rating: 5,
    is_featured: true,
    sort_order: 4,
  },
];

interface TestimonialsProps {
  testimonials?: Testimonial[] | null;
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

const Testimonials: React.FC<TestimonialsProps> = ({ testimonials }) => {
  const items =
    testimonials && testimonials.length > 0
      ? testimonials
      : (FALLBACK_TESTIMONIALS as Testimonial[]);

  return (
    <section className="py-24 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20">
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <SectionLabel label="Client Reviews" center />
          <h2 className="mt-3 text-4xl sm:text-5xl font-black text-[#25408F] leading-tight tracking-tight">
            What Our Clients Say
          </h2>
          <p className="mt-3 text-slate-500 text-base max-w-xl mx-auto">
            Don't just take our word for it — hear from the brands, organisations, and creators
            who've trusted us with their most important stories.
          </p>
        </motion.div>

        {/* ── Swiper ── */}
        <div className="relative">
          {/* Custom nav buttons */}
          <button
            className="testimonials-prev absolute -left-4 sm:-left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white shadow-md border border-slate-100 flex items-center justify-center text-[#25408F] hover:bg-[#25408F] hover:text-white transition-all duration-200 disabled:opacity-40"
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            className="testimonials-next absolute -right-4 sm:-right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white shadow-md border border-slate-100 flex items-center justify-center text-[#25408F] hover:bg-[#25408F] hover:text-white transition-all duration-200 disabled:opacity-40"
            aria-label="Next testimonial"
          >
            <ChevronRight size={18} />
          </button>

          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            navigation={{
              prevEl: '.testimonials-prev',
              nextEl: '.testimonials-next',
            }}
            pagination={{
              clickable: true,
              bulletClass:
                'swiper-pagination-bullet !w-2 !h-2 !bg-slate-300 !opacity-100',
              bulletActiveClass:
                'swiper-pagination-bullet-active !bg-[#25408F] !w-5 !rounded-full transition-all duration-300',
            }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            className="!pb-12"
          >
            {items.map((t, i) => (
              <SwiperSlide key={t.id ?? i} className="h-auto">
                <TestimonialCard
                  quote={t.content}
                  name={t.client_name}
                  title={t.client_title ?? ''}
                  company={t.client_company ?? ''}
                  rating={t.rating ?? 5}
                  avatar={t.client_avatar_url ?? undefined}
                  className="h-full"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
