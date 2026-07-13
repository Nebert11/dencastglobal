import React from 'react';
import { motion } from 'framer-motion';
import SectionLabel from '@/components/ui/SectionLabel';
import type { Client } from '@/types';

// ─── Static fallback clients ──────────────────────────────────────────────────

const FALLBACK_CLIENTS: Array<{ id: string; name: string; bg: string; text: string }> = [
  { id: '1', name: 'Safaricom PLC', bg: '#00A651', text: '#ffffff' },
  { id: '2', name: 'Kenya Airways', bg: '#C8102E', text: '#ffffff' },
  { id: '3', name: 'Equity Bank', bg: '#D72638', text: '#ffffff' },
  { id: '4', name: 'Nation Media Group', bg: '#0056A6', text: '#ffffff' },
  { id: '5', name: 'KCB Group', bg: '#003580', text: '#ffffff' },
  { id: '6', name: 'Jubilee Insurance', bg: '#1A1A2E', text: '#ffffff' },
  { id: '7', name: 'EABL', bg: '#7B1113', text: '#ffffff' },
  { id: '8', name: 'Co-operative Bank', bg: '#005B99', text: '#ffffff' },
  { id: '9', name: 'Twiga Foods', bg: '#F4A200', text: '#1a1a1a' },
  { id: '10', name: 'Bamburi Cement', bg: '#F16522', text: '#ffffff' },
  { id: '11', name: 'NCBA Bank', bg: '#2D2D2D', text: '#ffffff' },
  { id: '12', name: 'Stanbic Bank', bg: '#1B5299', text: '#ffffff' },
];

interface TrustedByProps {
  clients?: Client[] | null;
}

// ─── Logo pill placeholder ────────────────────────────────────────────────────

const LogoPill: React.FC<{ name: string; bg: string; text: string }> = ({ name, bg, text }) => (
  <div
    className="flex-shrink-0 flex items-center justify-center px-7 py-3.5 rounded-xl shadow-sm border border-white"
    style={{ backgroundColor: bg, minWidth: 160 }}
  >
    <span className="font-bold text-sm tracking-wide whitespace-nowrap" style={{ color: text }}>
      {name}
    </span>
  </div>
);

// ─── TrustedBy ────────────────────────────────────────────────────────────────

const TrustedBy: React.FC<TrustedByProps> = ({ clients }) => {
  const items =
    clients && clients.length > 0
      ? clients.map((c) => ({ id: c.id, name: c.name, bg: '#0056A6', text: '#fff' }))
      : FALLBACK_CLIENTS;

  // Duplicate for seamless loop
  const doubled = [...items, ...items];

  return (
    <section className="py-16 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 mb-10">
        <SectionLabel label="Our Clients" subtitle="Trusted By Industry Leaders" center />
        <p className="mt-3 text-slate-500 text-center text-sm max-w-xl mx-auto">
          We've had the privilege of working with leading organisations across Africa and beyond.
        </p>
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
            <LogoPill key={`${client.id}-${i}`} name={client.name} bg={client.bg} text={client.text} />
          ))}
        </motion.div>
      </div>

      {/* Second row — reverse direction */}
      <div className="relative mt-4">
        <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-slate-50 to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-slate-50 to-transparent pointer-events-none" />

        <motion.div
          className="flex gap-5 w-max"
          animate={{ x: ['-50%', '0%'] }}
          transition={{
            x: {
              duration: 32,
              repeat: Infinity,
              ease: 'linear',
            },
          }}
        >
          {doubled.map((client, i) => (
            <LogoPill
              key={`${client.id}-rev-${i}`}
              name={client.name}
              bg="#f1f5f9"
              text="#0056A6"
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TrustedBy;
