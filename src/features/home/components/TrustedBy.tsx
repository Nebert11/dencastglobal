import React from 'react';
import { motion } from 'framer-motion';
import SectionLabel from '@/components/ui/SectionLabel';
import { getClientLogoUrl } from '@/utils/clientLogos';
import type { Client } from '@/types';

// ─── Static fallback clients ──────────────────────────────────────────────────

const FALLBACK_CLIENTS: Array<{ id: string; name: string }> = [
  { id: '1', name: 'Sasini PLC' },
  { id: '2', name: 'Afreximbank' },
  { id: '3', name: 'Africatalyst' },
  { id: '4', name: 'European Union' },
  { id: '5', name: 'White Beach Palace' },
  { id: '6', name: 'Knowledge Empowering Youth' },
  { id: '7', name: 'RHNK' },
  { id: '8', name: 'Michezo Africa' },
  { id: '9', name: 'ELF Africa' },
  { id: '10', name: 'Ibac' },
  { id: '11', name: 'Bible Society of Kenya' },
  { id: '12', name: 'Image Registrars' },
];

interface TrustedByProps {
  clients?: Client[] | null;
}

// ─── Logo pill placeholder ────────────────────────────────────────────────────

const LogoPill: React.FC<{ name: string; variant?: 'light' | 'default' }> = ({ name, variant = 'default' }) => {
  const logoUrl = getClientLogoUrl(name);

  return (
    <div
      className={`flex-shrink-0 flex items-center justify-center px-10 py-5 rounded-2xl shadow-sm border min-w-[260px] h-[132px] ${
        variant === 'light'
          ? 'bg-slate-100 border-slate-200'
          : 'bg-white border-slate-200'
      }`}
    >
      {logoUrl ? (
        <img
          src={logoUrl}
          alt={`${name} logo`}
          className="max-h-20 max-w-[220px] object-contain"
          loading="lazy"
        />
      ) : (
        <span className="font-bold text-sm tracking-wide whitespace-nowrap text-slate-600">
          {name}
        </span>
      )}
    </div>
  );
};

// ─── TrustedBy ────────────────────────────────────────────────────────────────

const TrustedBy: React.FC<TrustedByProps> = ({ clients }) => {
  const items =
    clients && clients.length > 0
      ? clients.map((c) => ({ id: c.id, name: c.name }))
      : FALLBACK_CLIENTS;

  // Duplicate for seamless loop
  const doubled = [...items, ...items];

  return (
    <section className="py-16 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 mb-10">
        <SectionLabel label="Our Clients" center />
      </div>

      {/* ── Scrolling strip ── */}
      <div className="relative">
        {/* Left fade */}
        <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-slate-50 to-transparent pointer-events-none" />
        {/* Right fade */}
        <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-slate-50 to-transparent pointer-events-none" />

        <motion.div
          className="flex gap-5 w-max"
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            x: {
              duration: 28,
              repeat: Infinity,
              ease: 'linear',
            },
          }}
        >
          {doubled.map((client, i) => (
            <LogoPill key={`${client.id}-${i}`} name={client.name} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TrustedBy;
