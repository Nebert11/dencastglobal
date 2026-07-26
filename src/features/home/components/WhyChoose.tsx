import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Camera, Layers, Clock, Palette } from 'lucide-react';
import SectionLabel from '@/components/ui/SectionLabel';

// ─── Reasons data ─────────────────────────────────────────────────────────────

const reasons = [
  // {
  //   icon: Award,
  //   title: 'Award-Winning Team',
  //   description:
  //     'Our directors and creatives are recognised internationally — bringing festival-calibre craft to every project we take on.',
  // },
  {
    icon: Globe,
    title: 'Global Experience',
    description:
      "We've produced work across diverse markets, bringing strong cultural perspectives and logistical expertise to every production.",
  },
  {
    icon: Camera,
    title: 'State-of-the-Art Equipment',
    description:
      'We invest in cutting-edge cinema cameras, drones, lighting rigs, and post-production suites for uncompromising quality.',
  },
  {
    icon: Layers,
    title: 'End-to-End Production',
    description:
      'From first concept to final export, every phase is handled under one roof — ensuring creative consistency and seamless delivery.',
  },
  {
    icon: Clock,
    title: 'On-Time Delivery',
    description:
      'We respect deadlines as much as we respect creative vision. Our project management systems ensure nothing ever slips.',
  },
  {
    icon: Palette,
    title: 'Creative Direction',
    description:
      "Bold, intentional art direction sits at the heart of every project — we don't just produce, we conceptualise and craft.",
  },
];

// ─── Reason card ──────────────────────────────────────────────────────────────

const ReasonCard: React.FC<{
  icon: React.ElementType;
  title: string;
  description: string;
  index: number;
}> = ({ icon: Icon, title, description, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.5, delay: index * 0.08, ease: 'easeOut' }}
    className="group flex flex-col gap-4 p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
  >
    {/* Icon in red circle */}
    <div className="w-12 h-12 rounded-full bg-[#D3232E] flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#D3232E]/30 group-hover:scale-110 transition-transform duration-300">
      <Icon size={22} className="text-white" />
    </div>

    {/* Title */}
    <h3 className="text-white font-bold text-base leading-snug">{title}</h3>

    {/* Description */}
    <p className="text-white/60 text-sm leading-relaxed flex-1">{description}</p>
  </motion.div>
);

// ─── WhyChoose ────────────────────────────────────────────────────────────────

const WhyChoose: React.FC = () => {
  return (
    <section className="relative py-24 overflow-hidden bg-[#002d5c]">
      {/* ── Background gradient texture ── */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#001a3a] via-[#25408F] to-[#002d5c] opacity-90" />

      {/* ── Subtle grid pattern ── */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* ── Decorative circles ── */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#D3232E]/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-white/5 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-20">
        {/* ── Header ── */}
        <div className="mb-14 text-center max-w-2xl mx-auto">
          <SectionLabel label="Why Us" center light />
          <h2 className="mt-3 text-4xl sm:text-5xl font-black text-white leading-tight tracking-tight">
            Where Creativity{' '}
            <span className="text-[#D3232E]">Meets Excellence</span>
          </h2>
          <p className="mt-4 text-white/60 text-base leading-relaxed">
            The reasons why Africa's leading brands, global organisations, and visionary creators
            choose Dencast Global for their most important stories.
          </p>
        </div>

        {/* ── Reasons grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((reason, i) => (
            <ReasonCard
              key={reason.title}
              icon={reason.icon}
              title={reason.title}
              description={reason.description}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChoose;
