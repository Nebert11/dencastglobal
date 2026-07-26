import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, useInView } from 'framer-motion';
import {
  Film, Radio, Camera, Video, Target, Palette, Music,
  Navigation, Briefcase, TrendingUp, LayoutDashboard,
  ArrowRight, ChevronRight, Sparkles,
} from 'lucide-react';
import SectionLabel from '@/components/ui/SectionLabel';
import Button from '@/components/ui/Button';
import ServiceCard from '@/components/ui/ServiceCard';
import { SERVICES, SITE_NAME } from '@/utils/constants';

// ─── Icon map ─────────────────────────────────────────────────────────────────

const ICON_MAP: Record<string, React.ElementType> = {
  Film, Radio, Camera, Video, Target, Palette, Music,
  Navigation, Briefcase, TrendingUp, LayoutDashboard,
};

// ─── Service categories ───────────────────────────────────────────────────────

const CATEGORIES = [
  {
    id: 'production',
    label: 'Production',
    color: '#25408F',
    slugs: ['documentary-production', 'livestreaming-events', 'videography', 'commercial-productions', 'events-management'],
  },
  {
    id: 'photography',
    label: 'Photography & Visual',
    color: '#D3232E',
    slugs: ['photography', 'drone-services'],
  },
  {
    id: 'brand',
    label: 'Branding & Strategy',
    color: '#25408F',
    slugs: ['brand-strategy', 'creative-media', 'corporate-communications'],
  },
  {
    id: 'digital',
    label: 'Digital',
    color: '#D3232E',
    slugs: ['digital-content-creation', 'audio-management-soundtrack-development'],
  },
];

// ─── Animation helpers ────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, ease: 'easeOut', delay: i * 0.1 },
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

// ─── Hero Banner ──────────────────────────────────────────────────────────────

const HeroBanner: React.FC = () => (
  <section className="relative min-h-[60vh] flex items-center justify-center bg-[#001f3f] overflow-hidden">
    {/* Background image */}
    <div
      className="absolute inset-0 bg-cover bg-center opacity-30"
      style={{ backgroundImage: 'url(/dencast_images/CREW.jpg)' }}
    />
    <div className="absolute inset-0 bg-gradient-to-b from-[#001f3f]/80 via-[#001f3f]/60 to-[#001f3f]" />

    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-32">
      <motion.nav
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="flex items-center justify-center gap-2 text-white/50 text-sm mb-6"
      >
        <Link to="/" className="hover:text-white transition-colors">Home</Link>
        <ChevronRight size={14} />
        <span className="text-white font-medium">Services</span>
      </motion.nav>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.1 }}
        className="inline-flex items-center gap-2 bg-[#D3232E]/20 border border-[#D3232E]/30 text-[#D3232E] text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6"
      >
        <Sparkles size={12} />
        World-Class Services
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
        className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-none tracking-tight mb-6"
      >
        Our <span className="text-[#D3232E]">Services</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.35 }}
        className="text-white/70 text-xl max-w-2xl mx-auto leading-relaxed"
      >
        With years of experience and a distinguished client roster, we deliver expert production, marketing, and digital solutions that help brands and organizations stand out and shine.
      </motion.p>
    </div>
  </section>
);

// ─── Intro section ────────────────────────────────────────────────────────────

const IntroSection: React.FC = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            variants={stagger} initial="hidden" animate={inView ? 'visible' : 'hidden'}
          >
            <motion.div variants={fadeUp}><SectionLabel label="What We Do" /></motion.div>
            <motion.h2 variants={fadeUp} className="mt-4 text-4xl font-black text-slate-900 leading-tight">
              Our Service Scope for <span className="text-[#25408F]">Brands, Events, and Campaigns</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-5 text-slate-600 leading-relaxed">
              We offer expert, high-quality services tailored to both corporate and social events. From documentaries and digital content to event management, audio production, script writing, podcasts, and graphics, our team delivers practical solutions with creative precision.
            </motion.p>
            <motion.div variants={fadeUp} className="mt-8 grid grid-cols-2 gap-4">
              {['Documentaries', 'Digital Content', 'Virtual and Hybrid Events', 'Event Audio Management']
                .map((label) => (
                  <div key={label} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <p className="text-sm font-bold text-[#25408F] uppercase tracking-wide">{label}</p>
                  </div>
                ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 60 }} animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="rounded-2xl overflow-hidden aspect-[4/3] shadow-2xl"
          >
            <img
              src="/dencast_images/Dencast-Crew-11.jpg"
              alt="Dencast Global production team"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// ─── Services grid by category ────────────────────────────────────────────────

const ServicesGridSection: React.FC = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {CATEGORIES.map((cat, ci) => {
          const catServices = SERVICES.filter(s => cat.slugs.includes(s.slug));
          if (!catServices.length) return null;

          return (
            <div key={cat.id} className={ci > 0 ? 'mt-20' : ''}>
              <motion.div
                variants={stagger} initial="hidden" animate={inView ? 'visible' : 'hidden'}
                className="flex items-center gap-4 mb-10"
              >
                <motion.div variants={fadeUp}>
                  <SectionLabel label={cat.label} />
                </motion.div>
                <motion.div variants={fadeUp} className="flex-1 h-px bg-slate-200" />
              </motion.div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {catServices.map((service, i) => {
                  const Icon = ICON_MAP[service.icon] ?? Film;
                  return (
                    <motion.div
                      key={service.id}
                      custom={i} variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}
                    >
                      <ServiceCard
                        name={service.name}
                        description={service.description}
                        slug={service.slug}
                        icon={<Icon size={20} />}
                      />
                    </motion.div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

// ─── CTA Section ──────────────────────────────────────────────────────────────

const CTASection: React.FC = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="py-24 bg-[#25408F]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-10 lg:p-16 border border-white/20">
          <motion.div
            variants={stagger} initial="hidden" animate={inView ? 'visible' : 'hidden'}
            className="text-center"
          >
            <motion.div variants={fadeUp}><SectionLabel label="Custom Packages" light center /></motion.div>
            <motion.h2 variants={fadeUp} className="mt-4 text-4xl sm:text-5xl font-black text-white leading-tight">
              Explore Our Work
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-5 text-white/80 text-lg max-w-2xl mx-auto">
              See how our documentary, livestreaming, photography, events, and brand productions come to life across real projects.
            </motion.p>
            <motion.div variants={fadeUp} className="mt-10 flex items-center justify-center gap-4 flex-wrap">
              <Link to="/portfolio">
                <Button variant="primary" size="lg" rightIcon={<ArrowRight size={16} />}>
                  Explore Our Work
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────

const ServicesPage: React.FC = () => (
  <>
    <Helmet>
      <title>Our Services | {SITE_NAME}</title>
      <meta name="description" content="Explore Dencast Global's full suite of creative media services: documentary production, livestreaming, photography, branding, and digital content creation." />
      <meta property="og:title" content={`Our Services | ${SITE_NAME}`} />
    </Helmet>

    <HeroBanner />
    <IntroSection />
    <ServicesGridSection />
    <CTASection />
  </>
);

export default ServicesPage;
