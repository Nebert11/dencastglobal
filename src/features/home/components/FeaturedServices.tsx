import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Film,
  Radio,
  Camera,
  Video,
  Target,
  Palette,
  Navigation,
  Briefcase,
  Music,
  TrendingUp,
  LayoutDashboard,
  ArrowRight,
} from 'lucide-react';
import SectionLabel from '@/components/ui/SectionLabel';
import ServiceCard from '@/components/ui/ServiceCard';
import Button from '@/components/ui/Button';
import { SERVICES } from '@/utils/constants';

// ─── Icon map ─────────────────────────────────────────────────────────────────

const ICON_MAP: Record<string, React.ReactNode> = {
  Film: <Film size={22} />,
  Radio: <Radio size={22} />,
  Camera: <Camera size={22} />,
  Video: <Video size={22} />,
  Target: <Target size={22} />,
  Palette: <Palette size={22} />,
  Navigation: <Navigation size={22} />,
  Briefcase: <Briefcase size={22} />,
  Music: <Music size={22} />,
  TrendingUp: <TrendingUp size={22} />,
  LayoutDashboard: <LayoutDashboard size={22} />,
};

// ─── FeaturedServices ─────────────────────────────────────────────────────────

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const FeaturedServices: React.FC = () => {
  // Keep homepage service panels intentional and stable even if service order changes.
  const featuredSlugs = [
    'documentary-production',
    'livestreaming-events',
    'photography',
    'events-management',
    'audio-management-soundtrack-development',
    'videography',
  ];
  const featured = featuredSlugs
    .map((slug) => SERVICES.find((service) => service.slug === slug))
    .filter((service): service is (typeof SERVICES)[number] => Boolean(service));

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20">
        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-14">
          <div className="max-w-xl">
            <SectionLabel label="What We Do" />
            <h2 className="mt-3 text-4xl sm:text-5xl font-black text-[#0056A6] leading-tight tracking-tight">
              Premium{' '}
              <span className="text-[#D72638]">Services</span>
            </h2>
            <p className="mt-4 text-slate-500 text-base leading-relaxed">
              From concept to delivery, we offer a comprehensive suite of creative media services
              tailored to amplify your brand and tell your story.
            </p>
          </div>
          <Link to="/services" className="flex-shrink-0">
            <Button variant="outline" size="md" rightIcon={<ArrowRight size={16} />}>
              View All Services
            </Button>
          </Link>
        </div>

        {/* ── Grid ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {featured.map((service) => (
            <motion.div key={service.id} variants={itemVariants}>
              <ServiceCard
                name={service.name}
                description={service.description}
                slug={service.slug}
                icon={ICON_MAP[service.icon] ?? <Film size={22} />}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* ── Bottom CTA strip ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-4 p-8 rounded-2xl bg-[#0056A6]/5 border border-[#0056A6]/10"
        >
          <p className="text-slate-600 text-sm text-center sm:text-left">
            Explore how we craft compelling stories and premium productions across industries.
          </p>
          <Link to="/portfolio" className="flex-shrink-0">
            <Button variant="primary" size="md">
              Explore Our Work
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedServices;
