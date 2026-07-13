import React from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import SectionLabel from '@/components/ui/SectionLabel';
import TestimonialCard from '@/components/ui/TestimonialCard';
import type { Testimonial } from '@/types';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// ─── Static fallback testimonials ─────────────────────────────────────────────

const FALLBACK_TESTIMONIALS: Omit<Testimonial, 'id' | 'created_at' | 'updated_at'>[] = [
  {
    client_name: 'Amara Osei-Bonsu',
    client_title: 'Chief Marketing Officer',
    client_company: 'Stellar Communications Africa',
    client_avatar_url: null,
    content:
      'Dencast Global transformed our brand story into a cinematic masterpiece. Their ability to capture authentic emotion while maintaining the highest production standards is truly unmatched on the continent.',
    rating: 5,
    is_featured: true,
    sort_order: 1,
  },
  {
    client_name: 'Dr. Fatima Al-Rashid',
    client_title: 'Director of Communications',
    client_company: 'UN Habitat Regional Office',
    client_avatar_url: null,
    content:
      "The documentary they produced for our housing initiative reached over 2 million viewers and drove policy conversations at ministerial level. The team's dedication to storytelling with purpose is exceptional.",
    rating: 5,
    is_featured: true,
    sort_order: 2,
  },
  {
    client_name: 'James Mwangi-Kariuki',
    client_title: 'Head of Brand',
    client_company: 'Nairobi Metropolitan Bank',
    client_avatar_url: null,
    content:
      "We've worked with production companies across three continents, and Dencast Global stands out for their creative ambition, professionalism, and ability to deliver on every promise — on time and on budget.",
    rating: 5,
    is_featured: true,
    sort_order: 3,
  },
  {
    client_name: 'Sophie Nkemdirim',
    client_title: 'Creative Director',
    client_company: 'Lagos Fashion Council',
    client_avatar_url: null,
    content:
      'Our fashion week coverage reached an international audience we never thought possible. The visual language they crafted perfectly bridged African aesthetics with global appeal. Simply outstanding work.',
    rating: 5,
    is_featured: true,
    sort_order: 4,
  },
  {
    client_name: 'Peter van der Berg',
    client_title: 'Regional Director',
    client_company: 'Deutsche Gesellschaft für Internationale',
    client_avatar_url: null,
    content:
      'The impact documentary Dencast produced for our agricultural programme in East Africa exceeded every expectation. Their ground-level storytelling approach created genuine empathy and drove real donor engagement.',
    rating: 5,
    is_featured: false,
    sort_order: 5,
  },
  {
    client_name: 'Wanjiku Mwenda',
    client_title: 'Founder & CEO',
    client_company: 'Savanna Tech Hub',
    client_avatar_url: null,
    content:
      "From our product launch video to ongoing social content, Dencast consistently delivers premium quality that elevates our brand above the noise. They are true creative partners, not just a vendor.",
    rating: 5,
    is_featured: false,
    sort_order: 6,
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
          <h2 className="mt-3 text-4xl sm:text-5xl font-black text-[#0056A6] leading-tight tracking-tight">
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
            className="testimonials-prev absolute -left-4 sm:-left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white shadow-md border border-slate-100 flex items-center justify-center text-[#0056A6] hover:bg-[#0056A6] hover:text-white transition-all duration-200 disabled:opacity-40"
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            className="testimonials-next absolute -right-4 sm:-right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white shadow-md border border-slate-100 flex items-center justify-center text-[#0056A6] hover:bg-[#0056A6] hover:text-white transition-all duration-200 disabled:opacity-40"
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
                'swiper-pagination-bullet-active !bg-[#0056A6] !w-5 !rounded-full transition-all duration-300',
            }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            breakpoints={{
              768: { slidesPerView: 2, spaceBetween: 24 },
              1280: { slidesPerView: 2, spaceBetween: 32 },
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
