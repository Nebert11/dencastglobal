import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {  Film, Globe } from 'lucide-react';
import SectionLabel from '@/components/ui/SectionLabel';
import Button from '@/components/ui/Button';

import smallPreviewImage from '/dencast_images/camera.jpg';

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
    title: 'Full-Service Film Studio',
    description:
      'From pre-production planning to final colour grade and delivery, we handle every stage of your creative journey in-house.',
  },
  {
    icon: Globe,
    title: 'Global Reach, Local Heart',
    description:
      'Operating in 20+countries while deeply rooted in African storytelling, culture, and creative excellence.',
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
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-[#0056A6]/20">
              <img
                src="https://images.pexels.com/photos/3379934/pexels-photo-3379934.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="Dencast Global film production team at work"
                className="w-full aspect-[4/5] object-cover"
                loading="lazy"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#001a3a]/60 via-transparent to-transparent" />

              {/* Experience badge */}
              <div className="absolute bottom-6 left-6 bg-white rounded-xl px-5 py-3 shadow-lg">
                <p className="text-3xl font-black text-[#0056A6] leading-none">5+</p>
                <p className="text-xs font-semibold text-slate-500 tracking-widest uppercase mt-0.5">
                  Years of Excellence
                </p>
              </div>
            </div>

            {/* Accent image — small floating card */}
            <motion.div
              className="absolute -right-8 top-16 w-44 rounded-xl overflow-hidden shadow-xl border-4 border-white hidden lg:block"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <img
                src={smallPreviewImage}
                alt="Behind the scenes production"
                className="w-full aspect-square object-cover"
                loading="lazy"
              />
            </motion.div>

            {/* Decorative red square */}
            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-[#D72638] rounded-2xl -z-10 hidden lg:block" />
            {/* Decorative blue square */}
            <div className="absolute -top-6 -right-6 w-16 h-16 bg-[#0056A6]/20 rounded-2xl -z-10 hidden lg:block" />
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

            <h2 className="text-4xl sm:text-5xl font-black text-[#0056A6] leading-tight tracking-tight">
              5 years of{' '}
              <span className="relative">
                Premium
                <span className="absolute -bottom-1 left-0 right-0 h-1 bg-[#D72638] rounded-full" />
              </span>{' '}
              Storytelling
            </h2>

            <p className="text-slate-600 text-base leading-relaxed">
              Dencast Global is a premier creative media and film production company founded on the
              belief that powerful storytelling can change the world. Headquartered in Nairobi with
              a global footprint, we partner with brands, governments, NGOs, and visionaries to
              create cinematic content that resonates, inspires, and endures.
            </p>

            <p className="text-slate-500 text-sm leading-relaxed">
              From feature-length documentaries to high-impact commercial campaigns, our team of
              directors, cinematographers, editors, and strategists brings unmatched craft and
              passion to every frame.
            </p>

            {/* Highlights */}
            <div className="flex flex-col gap-4 mt-2">
              {highlights.map(({ icon: Icon, title, description }) => (
                <div key={title} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-[#0056A6]/10 flex items-center justify-center text-[#0056A6]">
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
