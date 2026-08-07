import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Button from '@/components/ui/Button';
// ─── SoundtracksSection ───────────────────────────────────────────────────────

const SoundtracksSection: React.FC = () => {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-black">
      {/* Background photo */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'url(/dencast_images/DIGITAL.png)',
          backgroundSize: 'contain',
          backgroundPosition: 'right center',
          backgroundRepeat: 'no-repeat',
        }}
        aria-hidden="true"
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30" aria-hidden="true" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 py-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="max-w-2xl"
        >
          <p className="text-[#D3232E] text-xs font-bold tracking-[0.3em] uppercase mb-4">
            Sound & Audio Production
          </p>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight">
            Original Soundtracks That Bring{' '}
            <span className="text-[#D3232E]">Stories to Life</span>
          </h2>

          <p className="mt-6 text-white/75 text-lg leading-relaxed">
            Original soundtracks, sound design, voice-over recording and audio production created
            for films, documentaries, brands and live experiences.
          </p>

          <div className="mt-8">
            <Link to="/services/audio-management-soundtrack-development">
              <Button
                variant="primary"
                size="lg"
                rightIcon={<ArrowRight size={16} />}
              >
                Explore
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SoundtracksSection;
