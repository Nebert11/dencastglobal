import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {  Film, Globe } from 'lucide-react';
import SectionLabel from '@/components/ui/SectionLabel';
import Button from '@/components/ui/Button';

// ─── Key highlights ───────────────────────────────────────────────────────────

const highlights = [
  // {
  //   icon: Award,
  //   title: 'Award-Winning Productions',
  //   description:
  //     'Our work has earned recognition at international film festivals and brand excellence awards across three continents.',
  // },
  {
    icon: Film,
    title: 'End-to-End Production Services',
    description:
      'From branding experiences and commercials to niche cinematography and corporate productions, we deliver refined media solutions.',
  },
  {
    icon: Globe,
    title: 'Digital Content and Campaigns',
    description:
      'We combine creativity, technology, and strategy to produce communication and marketing content that connects and performs.',
  },
];

// ─── AboutPreview ─────────────────────────────────────────────────────────────

const AboutPreview: React.FC = () => {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* ── Left: Image ── */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="relative"
          >
            {/* Main image */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-[#25408F]/20">
              <img
                src="/dencast_images/landona_1.jpg"
                alt="Dencast Global film production team at work"
                className="w-full aspect-[4/5] object-cover"
                loading="lazy"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#001a3a]/60 via-transparent to-transparent" />

              {/* Storytelling badge */}
              <div className="absolute bottom-6 left-6 bg-white rounded-xl px-5 py-3 shadow-lg">
                <p className="text-lg font-black text-[#25408F] leading-none">Since 2015</p>
                <p className="text-xs font-semibold text-slate-500 tracking-widest uppercase mt-0.5">
                  Creative Media Agency
                </p>
              </div>
            </div>

            {/* Decorative red square */}
            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-[#D3232E] rounded-2xl -z-10 hidden lg:block" />
            {/* Decorative blue square */}
            <div className="absolute -top-6 -right-6 w-16 h-16 bg-[#25408F]/20 rounded-2xl -z-10 hidden lg:block" />
          </motion.div>

          {/* ── Right: Content ── */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.15 }}
            className="flex flex-col gap-6"
          >
            <SectionLabel label="About Us" />

            <h2 className="text-4xl sm:text-5xl font-black text-[#25408F] leading-tight tracking-tight">
              Where Your Story{' '}
              <span className="relative">
                Becomes Our Mission
                <span className="absolute -bottom-1 left-0 right-0 h-1 bg-[#D3232E] rounded-full" />
              </span>{' '}
            </h2>

            <p className="text-slate-600 text-base leading-relaxed">
              Dencast Global Limited is a premier branding and creative media agency that develops
              meticulously crafted media products and end-to-end production services.
            </p>

            <p className="text-slate-500 text-sm leading-relaxed">
              At Dencast Global, every project is more than a deliverable. It is your story,
              vision, and brand brought vividly to life through strategy, creativity, and
              innovation.
            </p>

            {/* Highlights */}
            <div className="flex flex-col gap-4 mt-2">
              {highlights.map(({ icon: Icon, title, description }) => (
                <div key={title} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-[#25408F]/10 flex items-center justify-center text-[#25408F]">
                    <Icon size={20} />
                  </div>
                  <div>
                    <h4 className="text-slate-800 font-bold text-sm mb-0.5">{title}</h4>
                    <p className="text-slate-500 text-xs leading-relaxed">{description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-2">
              <Link to="/about">
                <Button variant="outline" size="lg">
                  Learn More About Us
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutPreview;
